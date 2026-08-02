import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET: fetch client's conversations with coaches
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();

    if (!profile || profile.role !== 'client') {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    const clientId = profile.id;

    // Get bound coaches via coach_client_bindings
    let { data: bindings } = await adminSupabase
      .from('coach_client_bindings')
      .select('coach_id')
      .eq('client_id', clientId)
      .eq('status', 'active');

    let coachIds: string[] = bindings?.map((b: any) => b.coach_id) || [];

    // Fallback to coachee_programs for legacy relationships
    if (coachIds.length === 0) {
      const { data: assignments } = await adminSupabase
        .from('coachee_programs')
        .select('coach_id')
        .eq('coachee_id', clientId);
      coachIds = [...new Set((assignments || []).map((a: any) => a.coach_id))];
    }

    if (coachIds.length === 0) {
      return NextResponse.json({
        conversations: [],
        unreadCount: 0,
        hint: 'You are not bound to any coach yet.',
      });
    }

    // Get all messages between this client and their coaches
    const { data: msgs, error } = await adminSupabase
      .from('messages')
      .select('*')
      .eq('coachee_id', clientId)
      .in('coach_id', coachIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by coach
    const convMap = new Map();
    let unreadCount = 0;

    (msgs || []).forEach((m: any) => {
      if (!convMap.has(m.coach_id)) {
        convMap.set(m.coach_id, { coachId: m.coach_id, lastMessage: m, unread: 0, messages: [] });
      }
      const conv = convMap.get(m.coach_id);
      conv.messages.unshift(m);
      // Unread = messages from coach that client hasn't read
      if (m.sender === 'coach' && !m.is_read) {
        conv.unread++;
        unreadCount++;
      }
    });

    // Get coach profiles
    const coachIdsList = Array.from(convMap.keys());
    const { data: coaches } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', coachIdsList);

    const coachMap = new Map();
    (coaches || []).forEach((c: any) => coachMap.set(c.id, c));

    const conversations = Array.from(convMap.values()).map((conv: any) => {
      const coach = coachMap.get(conv.coachId);
      return {
        coachId: conv.coachId,
        name: coach?.full_name || coach?.email || 'Coach',
        email: coach?.email || '',
        avatarUrl: coach?.avatar_url,
        avatar: (coach?.full_name || 'C')[0],
        lastMsg: conv.lastMessage?.content || '',
        time: conv.lastMessage?.created_at,
        unread: conv.unread,
        messages: conv.messages,
      };
    }).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ conversations, unreadCount });
  } catch (error: any) {
    console.error('Client messages GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: client sends a message to coach
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { content, coachId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();

    if (!profile || profile.role !== 'client') {
      return NextResponse.json({ error: 'Client profile not found' }, { status: 404 });
    }

    const clientId = profile.id;

    // Resolve target coach: explicit coachId, or first bound coach
    let targetCoachId = coachId;
    if (!targetCoachId) {
      const { data: binding } = await adminSupabase
        .from('coach_client_bindings')
        .select('coach_id')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (binding?.coach_id) {
        targetCoachId = binding.coach_id;
      } else {
        // Fallback to coachee_programs
        const { data: program } = await adminSupabase
          .from('coachee_programs')
          .select('coach_id')
          .eq('coachee_id', clientId)
          .limit(1)
          .single();
        if (program?.coach_id) targetCoachId = program.coach_id;
      }
    }

    if (!targetCoachId) {
      return NextResponse.json({ error: 'No active coach found. Please contact support.' }, { status: 403 });
    }

    // Verify the client is bound to this coach
    const { data: binding } = await adminSupabase
      .from('coach_client_bindings')
      .select('id')
      .eq('coach_id', targetCoachId)
      .eq('client_id', clientId)
      .eq('status', 'active')
      .single();

    if (!binding) {
      const { data: program } = await adminSupabase
        .from('coachee_programs')
        .select('id')
        .eq('coach_id', targetCoachId)
        .eq('coachee_id', clientId)
        .single();
      if (!program) {
        return NextResponse.json({ error: 'Not bound to this coach' }, { status: 403 });
      }
    }

    const { data: msg, error } = await adminSupabase
      .from('messages')
      .insert({
        coach_id: targetCoachId,
        coachee_id: clientId,
        content: content.trim(),
        sender: 'client',
        is_read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: msg });
  } catch (error: any) {
    console.error('Client message POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

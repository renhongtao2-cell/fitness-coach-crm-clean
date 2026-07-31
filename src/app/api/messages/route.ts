import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    // Get coach profile
    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();
    
    if (!coachProfile || coachProfile.role !== 'coach') {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Method 1: Query via coach_client_bindings (new binding system)
    const { data: bindings } = await adminSupabase
      .from('coach_client_bindings')
      .select('client_id')
      .eq('coach_id', coachProfile.id)
      .eq('status', 'active');

    let partnerIds: string[] = bindings?.map((b: any) => b.client_id) || [];

    // Method 2: Fallback to coachee_programs for existing clients not yet migrated
    if (partnerIds.length === 0) {
      const { data: assignments } = await adminSupabase
        .from('coachee_programs')
        .select('coachee_id')
        .eq('coach_id', coachProfile.id);
      partnerIds = assignments?.map((a: any) => a.coachee_id) || [];

      // Auto-migrate: create bindings for any existing coachee_programs relationships
      if (partnerIds.length > 0) {
        for (const cid of partnerIds) {
          const { data: existing } = await adminSupabase
            .from('coach_client_bindings')
            .select('id')
            .eq('coach_id', coachProfile.id)
            .eq('client_id', cid)
            .single();
          if (!existing) {
            await adminSupabase.from('coach_client_bindings').insert({
              coach_id: coachProfile.id,
              client_id: cid,
            });
          }
        }
        // Re-query after migration
        const { data: newBindings } = await adminSupabase
          .from('coach_client_bindings')
          .select('client_id')
          .eq('coach_id', coachProfile.id)
          .eq('status', 'active');
        partnerIds = newBindings?.map((b: any) => b.client_id) || [];
      }
    }

    if (partnerIds.length === 0) {
      return NextResponse.json({ 
        conversations: [], 
        unreadCount: 0,
        hint: 'You are not bound to any clients yet. Add clients from the Clients page first.'
      });
    }

    // Get ALL messages between this coach and their partners
    const { data: msgs, error } = await adminSupabase
      .from('messages')
      .select('*')
      .or(`coach_id.eq.${coachProfile.id},coachee_id.in.(${partnerIds.join(',')})`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by conversation partner
    const convMap = new Map();
    let unreadCount = 0;

    (msgs || []).forEach((m: any) => {
      const isFromCoach = m.coach_id === coachProfile.id;
      const partnerId = isFromCoach ? m.coachee_id : m.coach_id;

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { partnerId, lastMessage: m, unread: 0, messages: [] });
      }
      const conv = convMap.get(partnerId);
      conv.messages.unshift(m);
      // Count unread messages FROM partners that coach hasn't read
      if (!isFromCoach && !m.is_read) {
        conv.unread++;
        unreadCount++;
      }
      if (!conv.lastMessage || new Date(m.created_at) > new Date(conv.lastMessage.created_at)) {
        conv.lastMessage = m;
      }
    });

    // Get partner profile names
    const partnerIdsList = Array.from(convMap.keys());
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', partnerIdsList);

    const profileMap = new Map();
    (profiles || []).forEach((p: any) => profileMap.set(p.id, p));

    const conversations = Array.from(convMap.values()).map((conv: any) => {
      const profile = profileMap.get(conv.partnerId);
      return {
        partnerId: conv.partnerId,
        name: profile?.full_name || profile?.email || 'Unknown',
        email: profile?.email || '',
        avatarUrl: profile?.avatar_url,
        avatar: (profile?.full_name || '?')[0],
        lastMsg: conv.lastMessage?.content || '',
        time: conv.lastMessage?.created_at,
        unread: conv.unread,
        messages: conv.messages,
      };
    }).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ conversations, unreadCount });
  } catch (error: any) {
    console.error('Messages GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { coacheeId, content } = body;

    if (!coacheeId || !content) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!coachProfile) return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });

    // Verify binding exists (allow both bindings and coachee_programs for backward compat)
    const { data: binding } = await adminSupabase
      .from('coach_client_bindings')
      .select('id')
      .eq('coach_id', coachProfile.id)
      .eq('client_id', coacheeId)
      .eq('status', 'active')
      .single();

    if (!binding) {
      // Fallback: check coachee_programs
      const { data: program } = await adminSupabase
        .from('coachee_programs')
        .select('id')
        .eq('coach_id', coachProfile.id)
        .eq('coachee_id', coacheeId)
        .single();
      
      if (!program) {
        return NextResponse.json({ error: 'Not bound to this client' }, { status: 403 });
      }
    }

    const { data: msg, error } = await adminSupabase
      .from('messages')
      .insert({
        coach_id: coachProfile.id,
        coachee_id: coacheeId,
        content,
        is_read: false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: msg });
  } catch (error: any) {
    console.error('Messages POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { messageIds } = await request.json();
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'messageIds required' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();
    const { error } = await adminSupabase
      .from('messages')
      .update({ is_read: true })
      .in('id', messageIds);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Messages PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
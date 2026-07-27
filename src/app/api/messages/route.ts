import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    // Check if user is a coach or client
    const { data: userProfile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();
    
    if (!userProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Get bindings based on role
    let partnerIds: string[] = [];

    if (userProfile.role === 'coach') {
      // Coach: get all clients bound to this coach
      const { data: bindings } = await adminSupabase
        .from('coach_client_bindings')
        .select('client_id')
        .eq('coach_id', userProfile.id)
        .eq('status', 'active');
      partnerIds = bindings?.map((b: any) => b.client_id) || [];
    } else {
      // Client: get their coach(es)
      const { data: bindings } = await adminSupabase
        .from('coach_client_bindings')
        .select('coach_id')
        .eq('client_id', userProfile.id)
        .eq('status', 'active');
      partnerIds = bindings?.map((b: any) => b.coach_id) || [];
    }

    if (partnerIds.length === 0) {
      return NextResponse.json({ conversations: [], unreadCount: 0, role: userProfile.role });
    }

    // Get messages between user and their partners
    const { data: msgs } = await adminSupabase
      .from('messages')
      .select('*')
      .or(userProfile.role === 'coach' 
        ? `coach_id.eq.${userProfile.id},coachee_id.in.(${partnerIds.join(',')})`
        : `coachee_id.eq.${userProfile.id},coach_id.in.(${partnerIds.join(',')})`
      )
      .order('created_at', { ascending: true });

    if (!msgs) {
      return NextResponse.json({ conversations: [], unreadCount: 0, role: userProfile.role });
    }

    // Group by conversation partner
    const convMap = new Map<string, { messages: any[]; lastMessage?: any }>();
    let unreadCount = 0;

    msgs.forEach((m: any) => {
      const isFromMe = userProfile.role === 'coach' ? m.coach_id === userProfile.id : m.coachee_id === userProfile.id;
      const partnerId = isFromMe ? (userProfile.role === 'coach' ? m.coachee_id : m.coach_id) : (userProfile.role === 'coach' ? m.coach_id : m.coachee_id);

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { messages: [] });
      }
      const conv = convMap.get(partnerId)!;
      conv.messages.push(m);
      if (m.created_at > (conv.lastMessage?.created_at || '')) {
        conv.lastMessage = m;
      }
      // Count unread messages from partner
      if (!isFromMe && !m.is_read) {
        unreadCount++;
      }
    });

    // Get partner profile names
    const allPartnerIds = Array.from(convMap.keys());
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .in('id', allPartnerIds);

    const profileMap = new Map();
    (profiles || []).forEach((p: any) => profileMap.set(p.id, p));

    const conversations = Array.from(convMap.values())
      .filter(conv => conv.lastMessage)
      .map(conv => {
        const lastMsgId = conv.messages[conv.messages.length - 1]?.id;
        const lastMsg = conv.messages.find((m: any) => m.id === lastMsgId);
        // Find partner id for this conversation
        const partnerId = conv.messages.some((m: any) => {
          const fromMe = userProfile.role === 'coach' ? m.coach_id === userProfile.id : m.coachee_id === userProfile.id;
          return !fromMe;
        }) ? '' : '';
        
        return conv;
      });

    // Rebuild with partner info properly
    const finalConversations = Array.from(convMap.entries()).map(([partnerId, conv]) => {
      const profile = profileMap.get(partnerId);
      return {
        partnerId,
        name: profile?.full_name || profile?.email || 'Unknown',
        email: profile?.email || '',
        avatarUrl: profile?.avatar_url,
        avatar: (profile?.full_name || '?')[0],
        lastMsg: conv.lastMessage?.content || '',
        time: conv.lastMessage?.created_at,
        unread: conv.messages.filter((m: any) => {
          const fromMe = userProfile.role === 'coach' ? m.coach_id === userProfile.id : m.coachee_id === userProfile.id;
          return !fromMe && !m.is_read;
        }).length,
        messages: conv.messages,
      };
    }).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ conversations: finalConversations, unreadCount, role: userProfile.role });
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

    const { data: userProfile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();
    if (!userProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Verify binding exists
    if (userProfile.role === 'coach') {
      const { data: binding } = await adminSupabase
        .from('coach_client_bindings')
        .select('id')
        .eq('coach_id', userProfile.id)
        .eq('client_id', coacheeId)
        .eq('status', 'active')
        .single();
      if (!binding) return NextResponse.json({ error: 'Not bound to this client' }, { status: 403 });
    } else {
      const { data: binding } = await adminSupabase
        .from('coach_client_bindings')
        .select('id')
        .eq('client_id', userProfile.id)
        .eq('coach_id', coacheeId)
        .eq('status', 'active')
        .single();
      if (!binding) return NextResponse.json({ error: 'Not bound to this coach' }, { status: 403 });
    }

    const { data: msg, error } = await adminSupabase
      .from('messages')
      .insert({
        coach_id: userProfile.role === 'coach' ? userProfile.id : coacheeId,
        coachee_id: userProfile.role === 'client' ? userProfile.id : coacheeId,
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
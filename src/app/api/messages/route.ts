import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!coachProfile) return NextResponse.json({ error: '未找到教练档案' }, { status: 404 });

    // Get all coachee IDs linked to this coach
    const { data: assignments } = await adminSupabase
      .from('coachee_programs')
      .select('coachee_id')
      .eq('coach_id', coachProfile.id);
    const coacheeIds = assignments?.map((a: any) => a.coachee_id) || [];

    if (coacheeIds.length === 0) {
      return NextResponse.json({ conversations: [], unreadCount: 0 });
    }

    // Get ALL messages involving this coach (coach sent OR coach received)
    const { data: msgs, error } = await adminSupabase
      .from('messages')
      .select('*')
      .or('coach_id.eq.' + coachProfile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by conversation partner
    const convMap = new Map();
    let unreadCount = 0;

    (msgs || []).forEach((m: any) => {
      // Determine the other person in the conversation
      const isFromCoach = m.coach_id === coachProfile.id;
      const partnerId = isFromCoach ? m.coachee_id : m.coach_id;

      if (!convMap.has(partnerId)) {
        convMap.set(partnerId, { partnerId, lastMessage: m, unread: 0, messages: [] });
      }
      const conv = convMap.get(partnerId);
      conv.messages.unshift(m);
      // Count unread messages FROM coachees that coach hasn't read
      if (isFromCoach && !m.is_read) {
        conv.unread++;
        unreadCount++;
      }
      if (!conv.lastMessage || new Date(m.created_at) > new Date(conv.lastMessage.created_at)) {
        conv.lastMessage = m;
      }
    });

    // Get partner profile names
    const partnerIds = Array.from(convMap.keys());
    const { data: profiles } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', partnerIds);

    const profileMap = new Map();
    (profiles || []).forEach((p: any) => profileMap.set(p.id, p));

    const conversations = Array.from(convMap.values()).map((conv: any) => {
      const profile = profileMap.get(conv.partnerId);
      return {
        partnerId: conv.partnerId,
        name: profile?.full_name || profile?.email || '未知',
        email: profile?.email || '',
        avatar: (profile?.full_name || '?')[0],
        lastMsg: conv.lastMessage?.content || '',
        time: conv.lastMessage?.created_at,
        unread: conv.unread,
        messages: conv.messages,
      };
    }).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({ conversations, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const body = await request.json();
    const { coacheeId, content } = body;

    if (!coacheeId || !content) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!coachProfile) return NextResponse.json({ error: '未找到教练档案' }, { status: 404 });

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
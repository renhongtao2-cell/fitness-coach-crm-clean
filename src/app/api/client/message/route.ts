import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Client sends a message to their coach
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    // Get client profile
    const { data: clientProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!clientProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Find the client's coach from bindings
    const { data: binding } = await adminSupabase
      .from('coach_client_bindings')
      .select('coach_id')
      .eq('client_id', clientProfile.id)
      .eq('status', 'active')
      .single();

    if (!binding) {
      return NextResponse.json({ error: 'No active coaching relationship found. Please contact your gym or register again.' }, { status: 403 });
    }

    // Insert message (coachee_id = client, coach_id = assigned coach)
    const { error } = await adminSupabase.from('messages').insert({
      coachee_id: clientProfile.id,
      coach_id: binding.coach_id,
      content: content.trim(),
      is_read: false,
    });

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Message sent' });
  } catch (error: any) {
    console.error('Client message error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Client fetches their conversation with coach
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Find coach via bindings
    const { data: binding } = await adminSupabase
      .from('coach_client_bindings')
      .select('coach_id, profiles!coach_client_bindings_coach_id_fkey(full_name)')
      .eq('client_id', profile.id)
      .eq('status', 'active')
      .single();

    if (!binding) {
      return NextResponse.json({ messages: [], coachName: '' });
    }

    const coachId = binding.coach_id;
    const coachName = (binding.profiles as any)?.full_name || 'Coach';

    // Fetch messages between student and coach
    const { data: messages, error } = await adminSupabase
      .from('messages')
      .select('*')
      .or(`and(coach_id.eq.${coachId},coachee_id.eq.${profile.id}),and(coach_id.eq.${profile.id},coachee_id.eq.${profile.id})`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Auto-mark received messages as read
    const unreadIds = (messages || [])
      .filter((m: any) => !m.is_read && m.coach_id !== profile.id)
      .map((m: any) => m.id);
    if (unreadIds.length > 0) {
      await adminSupabase.from('messages').update({ is_read: true }).in('id', unreadIds);
    }

    return NextResponse.json({ messages: messages || [], coachName, clientId: profile.id });
  } catch (error: any) {
    console.error('Client messages GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
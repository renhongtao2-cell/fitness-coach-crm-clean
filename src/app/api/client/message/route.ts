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
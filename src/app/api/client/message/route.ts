import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { content } = body;
    if (!content) return NextResponse.json({ error: 'Message content cannot be empty' }, { status: 400 });

    const adminSupabase = await createAdminClient();

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('email', user.email)
      .single();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Find the coach through coachee_programs
    const { data: cp } = await adminSupabase
      .from('coachee_programs')
      .select('coach_id')
      .eq('coachee_id', profile.id)
      .limit(1)
      .single();

    if (!cp) {
      return NextResponse.json({ error: 'You have not been added by any coach yet, please contact your coach' }, { status: 404 });
    }

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('id', cp.coach_id)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    const { data: msg, error } = await adminSupabase
      .from('messages')
      .insert({
        coach_id: coachProfile.id,
        coachee_id: profile.id,
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
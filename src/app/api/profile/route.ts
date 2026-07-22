import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    const { data: profile, error } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, bio, phone, certifications, role, created_at')
      .eq('email', user.email)
      .single();

    if (error) throw error;
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const body = await request.json();
    const { full_name, bio, phone, certifications } = body;

    const adminSupabase = await createAdminClient();
    const { data: profile, error } = await adminSupabase
      .from('profiles')
      .update({ full_name, bio, phone, certifications })
      .eq('email', user.email)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
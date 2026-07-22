import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: '未找到用户档案' }, { status: 404 });
    }

    const url = new URL(request.url);
    const programId = url.pathname.split('/').pop() || '';

    if (!programId || programId === 'route') {
      return NextResponse.json({ error: '缺少计划ID' }, { status: 400 });
    }

    const { data: program, error } = await adminSupabase
      .from('programs')
      .select('*')
      .eq('id', programId)
      .eq('coach_id', profile.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ program: program || {} });
  } catch (error: any) {
    console.error('Get program detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: '未授权' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();
    if (!profile) return NextResponse.json({ error: '未找到用户档案' }, { status: 404 });

    const url = new URL(request.url);
    const programId = url.pathname.split('/').pop();

    if (!programId || programId === 'route') {
      return NextResponse.json({ error: '缺少计划ID' }, { status: 400 });
    }

    const { error } = await adminSupabase
      .from('programs')
      .delete()
      .eq('id', programId)
      .eq('coach_id', profile.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete program error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

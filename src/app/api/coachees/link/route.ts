import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const adminSupabase = await createAdminClient();
    const { coacheeEmail } = await request.json();
    
    if (!coacheeEmail) {
      return NextResponse.json({ error: '请提供学员邮箱' }, { status: 400 });
    }

    const { data: coachProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: "未找到教练档案" }, { status: 404 });
    }

    const { data: coacheeProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("email", coacheeEmail)
      .single();

    if (!coacheeProfile) {
      return NextResponse.json({ error: "未找到该学员" }, { status: 404 });
    }

    // Get first program id
    const { data: firstProgram } = await adminSupabase
      .from('programs')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const programId = firstProgram?.id || null;

    // Upsert to avoid duplicate
    const { data: rel, error: relError } = await adminSupabase
      .from('coachee_programs')
      .upsert({
        coach_id: coachProfile.id,
        coachee_id: coacheeProfile.id,
        program_id: programId,
        status: 'active',
      }, { onConflict: 'coach_id,coachee_id' })
      .select();

    if (relError) {
      console.error('Create relationship error:', relError);
      return NextResponse.json({ error: '创建关联失败: ' + relError.message }, { status: 500 });
    }

    return NextResponse.json({ message: '关联成功', coacheeId: coacheeProfile.id, relationship: rel });
  } catch (error: any) {
    console.error('Link coachee error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
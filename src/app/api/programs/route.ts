import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = await createAdminClient();
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const { data: programs, error } = await adminSupabase
      .from('programs')
      .select('*')
      .eq('coach_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ programs: programs || [] });
  } catch (error: any) {
    console.error('Get programs error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, weeks, level, equipment, phases, ai_generated, is_template } = body;
    console.log("[PROGRAMS POST] phases received:", phases ? phases.length : 0, phases?.[0]?.phase);

    if (!name) {
      return NextResponse.json({ error: 'Plan name cannot be empty' }, { status: 400 });
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

    const { data, error } = await adminSupabase
      .from('programs')
      .insert({
        coach_id: profile.id,
        name,
        description: description || '',
        duration_weeks: weeks || 8,
        level: level || 'intermediate',
        equipment: equipment || ['bodyweight'],
        weekly_structure: phases || [],
        is_template: is_template !== undefined ? is_template : false,
        ai_generated: ai_generated !== undefined ? ai_generated : false,
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ program: data && data.length > 0 ? data[0] : null });
  } catch (error: any) {
    console.error('Create program error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

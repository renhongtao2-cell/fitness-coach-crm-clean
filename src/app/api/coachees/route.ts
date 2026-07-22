import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = await createAdminClient();
    
    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Method 1: 通过 coachee_programs 关联查询
    const { data: assignments, error: assignError } = await adminSupabase
      .from('coachee_programs')
      .select('coachee_id')
      .eq('coach_id', coachProfile.id);

    if (assignError) throw assignError;

    let coachees: any[] = [];

    if (assignments && assignments.length > 0) {
      const coacheeIds = assignments.map((a: any) => a.coachee_id);
      const { data: profiles, error: profileError } = await adminSupabase
        .from('profiles')
        .select('id, full_name, email, fitness_level, goals')
        .in('id', coacheeIds);

      if (profileError) throw profileError;
      coachees = (profiles || []).map((p: any) => ({
        id: p.id || "",
        full_name: p.full_name || "",
        email: p.email || "",
        fitness_level: p.fitness_level || "",
        goals: p.goals || [],
      }));
      // Ensure each coachee has an id field
      coachees = (profiles || []).map((p: any) => ({
        id: p.id || p.user_id || "",
        full_name: p.full_name || p.fullName || "",
        email: p.email || "",
        fitness_level: p.fitness_level || p.fitnessLevel || "",
        goals: p.goals || [],
      }));
    } else {
      // Method 2: If not linked yet, query all profiles with role=client directly
      const { data: allClients, error: clientError } = await adminSupabase
        .from('profiles')
        .select('id, full_name, email, fitness_level, goals')
        .eq('role', 'client');

      if (clientError) throw clientError;
      // Ensure each coachee has an id field
      coachees = (allClients || []).map((p: any) => ({
        id: p.id || p.user_id || "",
        full_name: p.full_name || p.fullName || "",
        email: p.email || "",
        fitness_level: p.fitness_level || p.fitnessLevel || "",
        goals: p.goals || [],
      }));
    }

    if (search) {
      coachees = coachees.filter((c: any) => 
        c.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        c.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Debug: log first coachee to check field names
    if (coachees.length > 0) {
    }
    return NextResponse.json({ coachees });
  } catch (error: any) {
    console.error('GET coachees error:', error.message);
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

    const adminSupabase = await createAdminClient();
    const { fullName, email, fitnessLevel, goals } = await request.json();
    
    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: '未找到教练档案' }, { status: 404 });
    }

    const { data: existing } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    let coacheeId;
    if (existing) {
      coacheeId = existing.id;
    } else {
      const { data: newProfile, error: profileError } = await adminSupabase
        .from('profiles')
        .insert({
          email,
          full_name: fullName,
          role: 'client',
          fitness_level: fitnessLevel || 'beginner',
          goals: goals || [],
        })
        .select()
        .single();
      if (profileError) throw profileError;
      coacheeId = newProfile.id;
    }

    const { data: firstProgram } = await adminSupabase
      .from('programs')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const programId = firstProgram?.id || null;

    const { data: existingRel } = await adminSupabase
      .from('coachee_programs')
      .select('id')
      .eq('coach_id', coachProfile.id)
      .eq('coachee_id', coacheeId)
      .single();

    if (!existingRel) {
      const { error: relError } = await adminSupabase
        .from('coachee_programs')
        .insert({
          coach_id: coachProfile.id,
          coachee_id: coacheeId,
          program_id: programId,
          status: 'active',
        });
      if (relError) {
        console.error('Create relationship error:', relError);
      }
    }

    return NextResponse.json({ message: 'Client added successfully', coacheeId });
  } catch (error: any) {
    console.error('Add coachee error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

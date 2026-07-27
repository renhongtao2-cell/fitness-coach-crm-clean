import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    
    // Get coach profile
    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });
    }

    // Method 1: Query via coach_client_bindings (new binding system)
    let coachees: any[] = [];
    
    const { data: bindings } = await adminSupabase
      .from('coach_client_bindings')
      .select('client_id, status')
      .eq('coach_id', coachProfile.id)
      .eq('status', 'active');

    if (bindings && bindings.length > 0) {
      const clientIds = bindings.map((b: any) => b.client_id);
      const { data: profiles } = await adminSupabase
        .from('profiles')
        .select('id, full_name, email, fitness_level, goals, avatar_url')
        .in('id', clientIds);
      
      coachees = (profiles || []).map((p: any) => ({
        id: p.id || "",
        full_name: p.full_name || p.fullName || "",
        email: p.email || "",
        fitness_level: p.fitness_level || p.fitnessLevel || "",
        goals: p.goals || [],
        avatar_url: p.avatar_url,
      }));
    } else {
      // Fallback: show all clients (Method 2 - old behavior)
      const { data: allClients } = await adminSupabase
        .from('profiles')
        .select('id, full_name, email, fitness_level, goals, avatar_url')
        .eq('role', 'client');
      
      coachees = (allClients || []).map((p: any) => ({
        id: p.id || p.user_id || "",
        full_name: p.full_name || p.fullName || "",
        email: p.email || "",
        fitness_level: p.fitness_level || p.fitnessLevel || "",
        goals: p.goals || [],
        avatar_url: p.avatar_url,
      }));
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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();
    const { fullName, email } = await request.json();
    
    if (!email || !fullName) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    const { data: coachProfile } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!coachProfile) return NextResponse.json({ error: 'Coach profile not found' }, { status: 404 });

    // Create or get client profile
    const { data: existing } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    let clientId: string;
    if (existing) {
      clientId = existing.id;
    } else {
      const { data: newProfile } = await adminSupabase
        .from('profiles')
        .insert({
          email,
          full_name: fullName,
          role: 'client',
        })
        .select()
        .single();
      clientId = newProfile?.id;
      if (!clientId) throw new Error("Failed to create profile");
    }

    // Check if already bound
    const { data: existingBinding } = await adminSupabase
      .from('coach_client_bindings')
      .select('id')
      .eq('coach_id', coachProfile.id)
      .eq('client_id', clientId)
      .single();

    if (!existingBinding) {
      // Add binding
      await adminSupabase.from('coach_client_bindings').insert({
        coach_id: coachProfile.id,
        client_id: clientId,
      });
    }

    return NextResponse.json({ message: 'Client added successfully', clientId });
  } catch (error: any) {
    console.error('Add coachee error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
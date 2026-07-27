import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// GET /api/bindings - Get all coach-client bindings for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminSupabase = await createAdminClient();

    const { data: userProfile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();
    if (!userProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Get bindings based on role
    let bindings: any[] = [];
    
    if (userProfile.role === 'coach') {
      const { data: b } = await adminSupabase
        .from('coach_client_bindings')
        .select(`client_id, status, notes, created_at, profiles!inner(id, full_name, email, avatar_url)`)
        .eq('coach_id', userProfile.id);
      bindings = b || [];
    } else {
      const { data: b } = await adminSupabase
        .from('coach_client_bindings')
        .select(`coach_id, status, notes, created_at, profiles!inner(id, full_name, email)`)
        .eq('client_id', userProfile.id);
      bindings = b || [];
    }

    return NextResponse.json({ bindings, role: userProfile.role });
  } catch (error: any) {
    console.error('Bindings GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/bindings - Create or remove a binding
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { coachId, clientId, action, notes } = body;

    if (!action || !['bind', 'unbind'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: userProfile } = await adminSupabase
      .from('profiles')
      .select('id, role')
      .eq('email', user.email)
      .single();
    if (!userProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    if (userProfile.role !== 'coach') {
      return NextResponse.json({ error: 'Only coaches can manage bindings' }, { status: 403 });
    }

    if (action === 'bind') {
      // Check if already bound
      const { data: existing } = await adminSupabase
        .from('coach_client_bindings')
        .select('id')
        .eq('coach_id', userProfile.id)
        .eq('client_id', clientId || coachId)
        .single();
      
      if (existing) {
        return NextResponse.json({ message: 'Already bound to this client' }, { status: 200 });
      }

      // Create binding
      const { error } = await adminSupabase.from('coach_client_bindings').insert({
        coach_id: userProfile.id,
        client_id: clientId || coachId,
        notes: notes || '',
      });
      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Bound successfully' });
    } else {
      // Unbind
      const { error } = await adminSupabase
        .from('coach_client_bindings')
        .delete()
        .eq('coach_id', userProfile.id)
        .eq('client_id', clientId || coachId);
      if (error) throw error;

      return NextResponse.json({ success: true, message: 'Unbound successfully' });
    }
  } catch (error: any) {
    console.error('Bindings POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
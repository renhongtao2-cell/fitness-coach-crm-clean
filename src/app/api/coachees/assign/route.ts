import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = await createAdminClient();
    const { coacheeEmail, programId } = await request.json();
    
    if (!coacheeEmail || !programId) {
      return NextResponse.json({ error: 'Please provide client email and plan ID' }, { status: 400 });
    }

    const { data: coachProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach profile not found" }, { status: 404 });
    }

    const { data: coacheeProfile } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("email", coacheeEmail)
      .single();

    if (!coacheeProfile) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if already assigned
    const { data: existing } = await adminSupabase
      .from("coachee_programs")
      .select("id")
      .eq("coach_id", coachProfile.id)
      .eq("coachee_id", coacheeProfile.id)
      .eq("program_id", programId)
      .single();

    if (existing) {
      return NextResponse.json({ message: 'This plan is already assigned to this client', programId });
    }

    // Find existing relationship
    const { data: rel } = await adminSupabase
      .from("coachee_programs")
      .select("id")
      .eq("coach_id", coachProfile.id)
      .eq("coachee_id", coacheeProfile.id)
      .single();

    if (rel) {
      const { error: updateError } = await adminSupabase
        .from("coachee_programs")
        .update({ program_id: programId, status: 'active' })
        .eq("id", rel.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await adminSupabase
        .from("coachee_programs")
        .insert({
          coach_id: coachProfile.id,
          coachee_id: coacheeProfile.id,
          program_id: programId,
          status: 'active',
        });
      if (insertError) throw insertError;
    }

    return NextResponse.json({ message: 'Plan assigned successfully', programId, coacheeId: coacheeProfile.id });
  } catch (error: any) {
    console.error('Assign program error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
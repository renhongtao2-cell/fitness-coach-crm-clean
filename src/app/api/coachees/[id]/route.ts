import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const coacheeId = pathSegments[pathSegments.length - 1] || searchParams.get("coacheeId");

    if (!coacheeId) {
      return NextResponse.json({ error: "Missing client ID" }, { status: 400 });
    }

    const adminSupabase = await createAdminClient();

    const { data: coachee, error: coacheeErr } = await adminSupabase
      .from("profiles")
      .select("id, full_name, email, role, fitness_level, goals, bio, created_at")
      .eq("id", coacheeId)
      .single();

    if (coacheeErr) throw coacheeErr;
    if (!coachee) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const { data: assignments, error: assignErr } = await adminSupabase
      .from("coachee_programs")
      .select("*, programs:program_id(name, level, duration_weeks, ai_generated, coach_id)")
      .eq("coachee_id", coacheeId)
      .order("created_at", { ascending: false });

    if (assignErr) throw assignErr;

    // Enrich programs with coach name
    const programs = (assignments || []).map((a: any) => {
      return {
        ...a,
        coach_name: a.programs?.coach_id ? "(Coach ID: " + a.programs.coach_id.substring(0, 8) + ")" : "Unknown coach",
      };
    });

    const { data: measurements, error: measErr } = await adminSupabase
      .from("body_measurements")
      .select("*")
      .eq("coachee_id", coacheeId)
      .order("date", { ascending: false })
      .limit(20);

    if (measErr) throw measErr;

    const { data: logs, error: logsErr } = await adminSupabase
      .from("workout_logs")
      .select("*, workout_sets(*), coachee_programs!inner(program_id, coachee_id)")
      .eq("coachee_programs.coachee_id", coacheeId)
      .order("date", { ascending: false })
      .limit(20);

    if (logsErr) throw logsErr;

    return NextResponse.json({
      coachee,
      programs: programs || [],
      measurements: measurements || [],
      logs: logs || [],
    });
  } catch (error: any) {
    console.error("Get coachee detail error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

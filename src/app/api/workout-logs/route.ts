import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const adminSupabase = await createAdminClient();
    const { coacheeId, weekNumber, dayOfWeek, totalDuration, totalVolume, caloriesBurned } = await request.json();

    if (!coacheeId) {
      return NextResponse.json({ error: '缺少学员ID' }, { status: 400 });
    }

    // 先找到该学员的第一个 active 的 coachee_program 关联
    const { data: cp, error: cpErr } = await adminSupabase
      .from('coachee_programs')
      .select('id')
      .eq('coachee_id', coacheeId)
      .eq('status', 'active')
      .limit(1)
      .single();

    if (cpErr && cpErr.code !== 'PGRST116') throw cpErr;

    const { data, error } = await adminSupabase
      .from('workout_logs')
      .insert({
        coachee_program_id: cp?.id,
        week_number: weekNumber || 1,
        day_of_week: dayOfWeek || 1,
        total_duration: totalDuration ? parseInt(totalDuration) : null,
        total_volume: totalVolume ? parseFloat(totalVolume) : null,
        calories_burned: caloriesBurned ? parseFloat(caloriesBurned) : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ log: data });
  } catch (error: any) {
    console.error('Add log error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const adminSupabase = await createAdminClient();
    const body = await request.json();
  const { coacheeId, weight, bodyFatPercent, chestCircumference, waistCircumference, hipCircumference, date } = body;

    if (!coacheeId) {
      return NextResponse.json({ error: '缺少学员ID' }, { status: 400 });
    }

    const { data, error } = await adminSupabase
      .from('body_measurements')
      .insert({
        coachee_id: coacheeId,
        weight: weight ? parseFloat(weight) : null,
        body_fat_percent: bodyFatPercent ? parseFloat(bodyFatPercent) : null,
        chest_circumference: chestCircumference ? parseFloat(chestCircumference) : null,
        waist_circumference: waistCircumference ? parseFloat(waistCircumference) : null,
        hip_circumference: hipCircumference ? parseFloat(hipCircumference) : null,
        date: date || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ measurement: data });
  } catch (error: any) {
    console.error('Add measurement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
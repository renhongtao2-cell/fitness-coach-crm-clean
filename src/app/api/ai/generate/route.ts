import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goals, level, equipment, durationWeeks, experience, preferences } = body;

    if (!goals || !level) {
      return NextResponse.json(
        { error: "Goals and fitness level are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
    const baseUrl = process.env.ANTHROPIC_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.anthropic.com/v1";

    if (!apiKey) {
      return generateLocalPlan(body);
    }

    return await generateWithAI(body, apiKey, baseUrl);
  } catch (error) {
    console.error("AI Generate error:", error);
    return NextResponse.json(
      { error: "Generation failed, please retry" },
      { status: 500 }
    );
  }
}

async function generateWithAI(body: any, apiKey: string, baseUrl: string) {
  const { goals, level, equipment, durationWeeks, experience, preferences } = body;

  const equipmentStr = equipment && equipment.length > 0 ? equipment.join(", ") : "bodyweight only";
  const weeks = durationWeeks || 8;
  const exp = experience || "none";
  const prefs = preferences || "none";

  const systemPrompt = `You are a professional fitness coach and exercise science expert. Generate a structured, executable training plan.

OUTPUT FORMAT: Pure JSON only. NO markdown, NO code blocks, NO explanatory text. Just a valid JSON object.

REQUIRED JSON structure:
{
  "program": {
    "name": "Plan Name",
    "description": "Brief plan description",
    "weeks": 8,
    "phases": [
      {
        "phase": "Phase Name",
        "weeks": [1, 4],
        "focus": "What this phase trains",
        "weeklySchedule": [
          {
            "day": "Monday",
            "workoutType": "Upper Body Push",
            "exercises": [
              {
                "name": "Exercise Name",
                "muscleGroup": "Target muscle",
                "sets": 3,
                "reps": "10-12",
                "restSeconds": 60,
                "notes": "Form tip"
              }
            ]
          }
        ]
      }
    ],
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  }
}

CRITICAL RULES:
1. EVERY exercise MUST have: name, muscleGroup, sets (number), reps (string), restSeconds (number), notes
2. Include warm-up and cool-down exercises in every workout day
3. Each phase must have 3-5 weeklySchedule entries (one per training day)
4. Use English for ALL field values
5. Make sure the JSON is complete and valid - do not truncate
6. Total plan must have at least 2 phases`;

  const userPrompt = `Generate a training plan with these specifications:
- Goal: ${goals}
- Level: ${level} (beginner/intermediate/advanced)
- Equipment available: ${equipmentStr}
- Duration: ${weeks} weeks
- Experience: ${exp}
- Preferences: ${prefs}

Create a comprehensive plan with at least 2 phases. Every exercise must include name, muscleGroup, sets, reps, restSeconds, and notes.`;

  console.log("[AI] Calling API with model: agnes-2.0-flash");

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "agnes-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error status:", response.status, errorText);
    return NextResponse.json(
      { error: "AI service call failed, please retry" },
      { status: 502 }
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";

  console.log("[AI] Raw response length:", content.length);

  let parsedPlan;
  try {
    let jsonStr = content.trim();
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    const openBrace = jsonStr.indexOf("{");
    const closeBrace = jsonStr.lastIndexOf("}");
    if (openBrace === -1 || closeBrace === -1 || closeBrace <= openBrace) {
      throw new Error("No valid JSON object found in response");
    }
    jsonStr = jsonStr.substring(openBrace, closeBrace + 1);

    parsedPlan = JSON.parse(jsonStr);

    if (!parsedPlan.program) {
      if (parsedPlan.phases) {
        parsedPlan = { program: parsedPlan };
      } else if (parsedPlan.name && parsedPlan.weeks) {
        parsedPlan = { program: parsedPlan };
      }
    }

    if (parsedPlan.program && parsedPlan.program.phases) {
      parsedPlan.program.phases.forEach((phase: any) => {
        if (!phase.weeklySchedule) {
          console.warn("[AI] Phase missing weeklySchedule:", phase.phase);
        } else {
          phase.weeklySchedule.forEach((day: any) => {
            if (!day.exercises || day.exercises.length === 0) {
              console.warn("[AI] Day missing exercises:", day.day);
            } else {
              day.exercises.forEach((ex: any) => {
                if (!ex.sets || !ex.reps) {
                  console.warn("[AI] Exercise missing sets/reps:", ex.name);
                }
              });
            }
          });
        }
      });

      console.log("[AI] Parsed plan:", parsedPlan.program.name,
        "-", parsedPlan.program.phases.length, "phases",
        "-", parsedPlan.program.phases[0]?.weeklySchedule?.length, "days in first phase",
        "-", parsedPlan.program.phases[0]?.weeklySchedule?.[0]?.exercises?.length, "exercises in first day");
    }
  } catch (e: any) {
    console.error("[AI] Parse error:", e.message);
    console.error("[AI] Raw content preview:", content.substring(0, 500));
    return generateLocalPlan(body);
  }

  return NextResponse.json({ plan: parsedPlan });
}


function generateLocalPlan(body: any) {
  const { goals, level, equipment, durationWeeks, experience, preferences } = body;
  const levelMap: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  const equipmentList = equipment && equipment.length > 0 ? equipment.join(', ') : 'Bodyweight';
  const weeks = durationWeeks || 8;

  const phaseTemplates: Record<string, any[]> = {
    default: [
      {
        phase: 'Adaptation',
        weeks: [1, Math.ceil(weeks / 3)],
        focus: 'Learn movement patterns, establish mind-muscle connection',
        weeklySchedule: [
          {
            day: 'Monday', workoutType: 'Upper Body Push',
            exercises: [
              { name: 'Warm-up - Arm Circles', muscleGroup: 'Shoulders', sets: 1, reps: '2 minutes', restSeconds: 0, notes: 'Light rotation' },
              { name: 'Dumbbell Bench Press', muscleGroup: 'Chest', sets: 3, reps: '12', restSeconds: 60, notes: 'Control the descent' },
              { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', sets: 3, reps: '12', restSeconds: 60, notes: 'Keep core tight' },
              { name: 'Cable Fly', muscleGroup: 'Chest', sets: 3, reps: '15', restSeconds: 45, notes: 'Feel the stretch' },
              { name: 'Cool-down - Chest Stretch', muscleGroup: 'Chest', sets: 2, reps: '30 seconds', restSeconds: 0, notes: 'Each side' },
            ],
          },
          {
            day: 'Wednesday', workoutType: 'Lower Body',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Bodyweight Squat', muscleGroup: 'Quadriceps', sets: 3, reps: '15', restSeconds: 60, notes: '' },
              { name: 'Romanian Deadlift', muscleGroup: 'Hamstrings', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Walking Lunge', muscleGroup: 'Glutes', sets: 3, reps: '10 each side', restSeconds: 60, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
          {
            day: 'Friday', workoutType: 'Full Body',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Dumbbell Row', muscleGroup: 'Lats', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Push-up', muscleGroup: 'Chest', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Plank', muscleGroup: 'Core', sets: 3, reps: '30 seconds', restSeconds: 45, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
        ],
      },
      {
        phase: 'Progression',
        weeks: [Math.ceil(weeks / 3) + 1, Math.ceil(weeks * 2 / 3)],
        focus: 'Increase volume and intensity',
        weeklySchedule: [
          {
            day: 'Monday', workoutType: 'Upper Body Push',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: '10', restSeconds: 90, notes: 'Progressive overload' },
              { name: 'Incline Dumbbell Press', muscleGroup: 'Upper Chest', sets: 3, reps: '10', restSeconds: 75, notes: '' },
              { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', sets: 4, reps: '10', restSeconds: 75, notes: '' },
              { name: 'Tricep Pushdown', muscleGroup: 'Triceps', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
          {
            day: 'Wednesday', workoutType: 'Lower Body',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Barbell Squat', muscleGroup: 'Quadriceps', sets: 4, reps: '10', restSeconds: 90, notes: '' },
              { name: 'Leg Press', muscleGroup: 'Quadriceps', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Leg Curl', muscleGroup: 'Hamstrings', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Calf Raise', muscleGroup: 'Calves', sets: 4, reps: '15', restSeconds: 45, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
          {
            day: 'Friday', workoutType: 'Full Body',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Barbell Row', muscleGroup: 'Back', sets: 4, reps: '10', restSeconds: 90, notes: '' },
              { name: 'Pull-up', muscleGroup: 'Back', sets: 3, reps: '8', restSeconds: 90, notes: 'Assisted if needed' },
              { name: 'Dumbbell Lunge', muscleGroup: 'Glutes', sets: 3, reps: '10 each', restSeconds: 60, notes: '' },
              { name: 'Russian Twist', muscleGroup: 'Core', sets: 3, reps: '20', restSeconds: 45, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
        ],
      },
      {
        phase: 'Peak',
        weeks: [Math.ceil(weeks * 2 / 3) + 1, weeks],
        focus: 'Maximize hypertrophy with advanced techniques',
        weeklySchedule: [
          {
            day: 'Monday', workoutType: 'Chest and Triceps',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Barbell Bench Press', muscleGroup: 'Chest', sets: 4, reps: '8', restSeconds: 120, notes: 'Heavy' },
              { name: 'Dumbbell Fly', muscleGroup: 'Chest', sets: 3, reps: '12', restSeconds: 60, notes: 'Drop set on last set' },
              { name: 'Close-Grip Bench', muscleGroup: 'Triceps', sets: 4, reps: '10', restSeconds: 90, notes: '' },
              { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', sets: 3, reps: '12', restSeconds: 60, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
          {
            day: 'Tuesday', workoutType: 'Back and Biceps',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Deadlift', muscleGroup: 'Back', sets: 4, reps: '6', restSeconds: 120, notes: 'Heavy' },
              { name: 'Lat Pulldown', muscleGroup: 'Back', sets: 3, reps: '10', restSeconds: 75, notes: '' },
              { name: 'Barbell Curl', muscleGroup: 'Biceps', sets: 4, reps: '10', restSeconds: 60, notes: '' },
              { name: 'Hammer Curl', muscleGroup: 'Biceps', sets: 3, reps: '12', restSeconds: 45, notes: '' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
          {
            day: 'Thursday', workoutType: 'Shoulders and Legs',
            exercises: [
              { name: 'Warm-up', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
              { name: 'Barbell Squat', muscleGroup: 'Quadriceps', sets: 4, reps: '8', restSeconds: 120, notes: '' },
              { name: 'Bulgarian Split Squat', muscleGroup: 'Glutes', sets: 3, reps: '10 each', restSeconds: 90, notes: '' },
              { name: 'Military Press', muscleGroup: 'Shoulders', sets: 4, reps: '8', restSeconds: 90, notes: '' },
              { name: 'Lateral Raise', muscleGroup: 'Side Delt', sets: 4, reps: '15', restSeconds: 45, notes: 'Drop set' },
              { name: 'Cool-down', muscleGroup: 'Full Body', sets: 1, reps: '5 minutes', restSeconds: 0, notes: '' },
            ],
          },
        ],
      },
    ],
  };

  const phases = phaseTemplates.default;

  const plan = {
    program: {
      name: goals + ' - ' + (levelMap[level] || level) + ' Plan',
      description: 'A ' + (levelMap[level] || level) + '-level ' + goals + ' program using ' + equipmentList + ', ' + weeks + ' weeks',
      weeks: weeks,
      phases: phases,
      tips: [
        'Always warm up 5-10 minutes before training',
        'Stretch after training to aid recovery',
        'Sleep 7-8 hours daily',
        'Diet: caloric surplus for muscle, deficit for fat loss',
        'Track weight and measurements weekly',
        'Stop immediately if you feel pain',
      ],
    },
  };

  return NextResponse.json({ plan });
}

export async function GET() {
  return NextResponse.json({
    message: 'POST request to generate training plan',
    required_fields: ['goals', 'level'],
    optional_fields: ['equipment', 'durationWeeks', 'experience', 'preferences'],
  });
}

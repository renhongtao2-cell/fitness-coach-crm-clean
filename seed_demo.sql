-- =====================================================
-- FITNESS COACH CRM - DEMO DATA (ENGLISH)
-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create coachees table
CREATE TABLE IF NOT EXISTS coachees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  gender TEXT,
  age INTEGER,
  goal TEXT DEFAULT 'muscle_gain',
  experience_level TEXT DEFAULT 'intermediate',
  coach_id UUID,
  linked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE coachees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_all ON coachees;
CREATE POLICY allow_all ON coachees FOR ALL USING (true);

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'free',
  plan_type TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_current_period_end TIMESTAMPTZ,
  amount_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_all_sub ON subscriptions;
CREATE POLICY allow_all_sub ON subscriptions FOR ALL USING (true);

-- 3. Get coach UUID and insert coachees
DO 
DECLARE
  coach_uuid UUID;
  alex_id UUID;
  sarah_id UUID;
  mike_id UUID;
  emily_id UUID;
  james_id UUID;
  lisa_id UUID;
  david_id UUID;
  anna_id UUID;
  tom_id UUID;
  rachel_id UUID;
BEGIN
  -- Get coach ID
  SELECT id INTO coach_uuid FROM auth.users WHERE email = 'renhongtao2@gmail.com' LIMIT 1;
  
  IF coach_uuid IS NULL THEN
    RAISE EXCEPTION 'Coach not found. Please run: SELECT id FROM auth.users WHERE email LIKE ''%@gmail.com'' LIMIT 1;';
  END IF;
  
  -- Insert 10 coachees
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Alex Johnson', 'alex.j@email.com', '+1-555-0101', 'male', 28, 'muscle_gain', 'intermediate', coach_uuid, NOW() - INTERVAL '15 days')
  RETURNING id INTO alex_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Sarah Chen', 'sarah.c@email.com', '+1-555-0102', 'female', 25, 'weight_loss', 'beginner', coach_uuid, NOW() - INTERVAL '20 days')
  RETURNING id INTO sarah_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Mike Williams', 'mike.w@email.com', '+1-555-0103', 'male', 32, 'strength', 'advanced', coach_uuid, NOW() - INTERVAL '10 days')
  RETURNING id INTO mike_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Emily Davis', 'emily.d@email.com', '+1-555-0104', 'female', 27, 'muscle_gain', 'beginner', coach_uuid, NOW() - INTERVAL '25 days')
  RETURNING id INTO emily_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('James Brown', 'james.b@email.com', '+1-555-0105', 'male', 35, 'weight_loss', 'intermediate', coach_uuid, NOW() - INTERVAL '12 days')
  RETURNING id INTO james_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Lisa Wang', 'lisa.w@email.com', '+1-555-0106', 'female', 23, 'toning', 'beginner', coach_uuid, NOW() - INTERVAL '18 days')
  RETURNING id INTO lisa_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('David Kim', 'david.k@email.com', '+1-555-0107', 'male', 30, 'strength', 'advanced', coach_uuid, NOW() - INTERVAL '8 days')
  RETURNING id INTO david_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Anna Martinez', 'anna.m@email.com', '+1-555-0108', 'female', 26, 'flexibility', 'intermediate', coach_uuid, NOW() - INTERVAL '22 days')
  RETURNING id INTO anna_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Tom Anderson', 'tom.a@email.com', '+1-555-0109', 'male', 29, 'muscle_gain', 'intermediate', coach_uuid, NOW() - INTERVAL '14 days')
  RETURNING id INTO tom_id;
  
  INSERT INTO coachees (full_name, email, phone, gender, age, goal, experience_level, coach_id, linked_at)
  VALUES
  ('Rachel Lee', 'rachel.l@email.com', '+1-555-0110', 'female', 24, 'weight_loss', 'beginner', coach_uuid, NOW() - INTERVAL '30 days')
  RETURNING id INTO rachel_id;
  
  -- Insert body measurements (5 readings per coachee over 28 days)
  -- Alex - muscle_gain: 75kg -> 78kg, BF 18% -> 19%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (alex_id, DATE(NOW() - INTERVAL '28 days'), 75.0, 18.0, 98.0, 85.0, 93.5),
  (alex_id, DATE(NOW() - INTERVAL '21 days'), 75.5, 18.2, 98.5, 85.2, 93.8),
  (alex_id, DATE(NOW() - INTERVAL '14 days'), 76.5, 18.5, 99.5, 85.5, 94.2),
  (alex_id, DATE(NOW() - INTERVAL '7 days'), 77.5, 18.8, 100.5, 85.8, 94.5),
  (alex_id, DATE(NOW() - INTERVAL '0 days'), 78.0, 19.0, 101.0, 86.0, 95.0);
  
  -- Sarah - weight_loss: 85kg -> 81kg, BF 28% -> 25%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (sarah_id, DATE(NOW() - INTERVAL '28 days'), 85.0, 28.0, 100.0, 92.0, 101.2),
  (sarah_id, DATE(NOW() - INTERVAL '21 days'), 84.0, 27.5, 99.5, 90.5, 99.5),
  (sarah_id, DATE(NOW() - INTERVAL '14 days'), 83.0, 27.0, 99.0, 89.0, 97.9),
  (sarah_id, DATE(NOW() - INTERVAL '7 days'), 82.0, 26.0, 98.5, 87.5, 96.3),
  (sarah_id, DATE(NOW() - INTERVAL '0 days'), 81.0, 25.0, 98.0, 86.0, 94.6);
  
  -- Mike - strength: 80kg -> 82kg, BF 15% -> 14%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (mike_id, DATE(NOW() - INTERVAL '28 days'), 80.0, 15.0, 105.0, 82.0, 90.2),
  (mike_id, DATE(NOW() - INTERVAL '21 days'), 80.5, 14.8, 105.5, 81.8, 90.0),
  (mike_id, DATE(NOW() - INTERVAL '14 days'), 81.0, 14.5, 106.0, 81.5, 89.7),
  (mike_id, DATE(NOW() - INTERVAL '7 days'), 81.5, 14.2, 106.5, 81.2, 89.3),
  (mike_id, DATE(NOW() - INTERVAL '0 days'), 82.0, 14.0, 107.0, 81.0, 89.1);
  
  -- Emily - muscle_gain: 60kg -> 62kg, BF 25% -> 26%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (emily_id, DATE(NOW() - INTERVAL '28 days'), 60.0, 25.0, 88.0, 75.0, 82.5),
  (emily_id, DATE(NOW() - INTERVAL '21 days'), 60.3, 25.2, 88.5, 75.2, 82.7),
  (emily_id, DATE(NOW() - INTERVAL '14 days'), 61.0, 25.5, 89.5, 75.5, 83.1),
  (emily_id, DATE(NOW() - INTERVAL '7 days'), 61.5, 25.8, 90.0, 75.8, 83.4),
  (emily_id, DATE(NOW() - INTERVAL '0 days'), 62.0, 26.0, 90.5, 76.0, 83.6);
  
  -- James - weight_loss: 85kg -> 81kg, BF 28% -> 24%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (james_id, DATE(NOW() - INTERVAL '28 days'), 85.0, 28.0, 100.0, 92.0, 101.2),
  (james_id, DATE(NOW() - INTERVAL '21 days'), 84.0, 27.0, 99.5, 90.0, 99.0),
  (james_id, DATE(NOW() - INTERVAL '14 days'), 83.0, 26.0, 99.0, 88.0, 96.8),
  (james_id, DATE(NOW() - INTERVAL '7 days'), 82.0, 25.0, 98.5, 86.0, 94.6),
  (james_id, DATE(NOW() - INTERVAL '0 days'), 81.0, 24.0, 98.0, 84.0, 92.4);
  
  -- Lisa - toning: 60kg -> 59kg, BF 25% -> 22%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (lisa_id, DATE(NOW() - INTERVAL '28 days'), 60.0, 25.0, 88.0, 75.0, 82.5),
  (lisa_id, DATE(NOW() - INTERVAL '21 days'), 59.8, 24.5, 88.2, 74.5, 82.0),
  (lisa_id, DATE(NOW() - INTERVAL '14 days'), 59.5, 24.0, 88.5, 74.0, 81.4),
  (lisa_id, DATE(NOW() - INTERVAL '7 days'), 59.3, 23.0, 88.8, 73.5, 80.9),
  (lisa_id, DATE(NOW() - INTERVAL '0 days'), 59.0, 22.0, 89.0, 73.0, 80.3);
  
  -- David - strength: 80kg -> 83kg, BF 15% -> 13%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (david_id, DATE(NOW() - INTERVAL '28 days'), 80.0, 15.0, 105.0, 82.0, 90.2),
  (david_id, DATE(NOW() - INTERVAL '21 days'), 80.8, 14.5, 105.8, 81.5, 89.7),
  (david_id, DATE(NOW() - INTERVAL '14 days'), 81.5, 14.0, 106.5, 81.0, 89.1),
  (david_id, DATE(NOW() - INTERVAL '7 days'), 82.2, 13.5, 107.0, 80.5, 88.5),
  (david_id, DATE(NOW() - INTERVAL '0 days'), 83.0, 13.0, 107.5, 80.0, 88.0);
  
  -- Anna - flexibility: 58kg -> 57.5kg, BF 22% -> 20%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (anna_id, DATE(NOW() - INTERVAL '28 days'), 58.0, 22.0, 86.0, 72.0, 79.2),
  (anna_id, DATE(NOW() - INTERVAL '21 days'), 57.8, 21.5, 86.2, 71.8, 79.0),
  (anna_id, DATE(NOW() - INTERVAL '14 days'), 57.6, 21.0, 86.5, 71.5, 78.7),
  (anna_id, DATE(NOW() - INTERVAL '7 days'), 57.5, 20.5, 86.8, 71.2, 78.3),
  (anna_id, DATE(NOW() - INTERVAL '0 days'), 57.5, 20.0, 87.0, 71.0, 78.1);
  
  -- Tom - muscle_gain: 75kg -> 78kg, BF 18% -> 19%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (tom_id, DATE(NOW() - INTERVAL '28 days'), 75.0, 18.0, 98.0, 85.0, 93.5),
  (tom_id, DATE(NOW() - INTERVAL '21 days'), 75.5, 18.2, 98.5, 85.2, 93.8),
  (tom_id, DATE(NOW() - INTERVAL '14 days'), 76.5, 18.5, 99.5, 85.5, 94.2),
  (tom_id, DATE(NOW() - INTERVAL '7 days'), 77.5, 18.8, 100.5, 85.8, 94.5),
  (tom_id, DATE(NOW() - INTERVAL '0 days'), 78.0, 19.0, 101.0, 86.0, 95.0);
  
  -- Rachel - weight_loss: 85kg -> 80kg, BF 28% -> 23%
  INSERT INTO body_measurements (coachee_id, date, weight, body_fat_percent, chest_circumference, waist_circumference, hip_circumference) VALUES
  (rachel_id, DATE(NOW() - INTERVAL '28 days'), 85.0, 28.0, 100.0, 92.0, 101.2),
  (rachel_id, DATE(NOW() - INTERVAL '21 days'), 83.5, 27.0, 99.5, 90.0, 99.0),
  (rachel_id, DATE(NOW() - INTERVAL '14 days'), 82.0, 26.0, 99.0, 88.0, 96.8),
  (rachel_id, DATE(NOW() - INTERVAL '7 days'), 81.0, 24.5, 98.5, 86.0, 94.6),
  (rachel_id, DATE(NOW() - INTERVAL '0 days'), 80.0, 23.0, 98.0, 84.0, 92.4);
  
  -- Insert workout logs (3-7 per coachee)
  INSERT INTO workout_logs (coachee_id, date, day_of_week, week_number, workout_sets, total_volume, total_duration, completed, notes) VALUES
  -- Alex logs
  (alex_id, DATE(NOW() - INTERVAL '3 days'), 1, 3, '[{"exercise_name":"Bench Press","sets":4,"reps":8,"weight":80,"unit":"kg"},{"exercise_name":"Squat","sets":4,"reps":6,"weight":100,"unit":"kg"},{"exercise_name":"Pull-ups","sets":4,"reps":10,"weight":0,"unit":"bodyweight"}]', 2240, 45, true, 'Great session!'),
  (alex_id, DATE(NOW() - INTERVAL '7 days'), 3, 2, '[{"exercise_name":"Deadlift","sets":3,"reps":5,"weight":120,"unit":"kg"},{"exercise_name":"Dumbbell Row","sets":3,"reps":12,"weight":30,"unit":"kg"}]', 1560, 40, true, 'Feeling strong'),
  (alex_id, DATE(NOW() - INTERVAL '14 days'), 5, 1, '[{"exercise_name":"Shoulder Press","sets":3,"reps":10,"weight":25,"unit":"kg"},{"exercise_name":"Lunges","sets":3,"reps":12,"weight":20,"unit":"kg"},{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":60}]', 1020, 50, true, 'Progressing well'),
  -- Sarah logs
  (sarah_id, DATE(NOW() - INTERVAL '2 days'), 2, 3, '[{"exercise_name":"Running","sets":1,"reps":1,"weight":0,"unit":"min","distance_km":5},{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30}]', 0, 35, true, 'Great session!'),
  (sarah_id, DATE(NOW() - INTERVAL '6 days'), 4, 2, '[{"exercise_name":"Bench Press","sets":3,"reps":12,"weight":40,"unit":"kg"},{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":45}]', 1440, 40, true, 'Feeling strong'),
  (sarah_id, DATE(NOW() - INTERVAL '13 days'), 6, 1, '[{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30},{"exercise_name":"Lunges","sets":3,"reps":12,"weight":15,"unit":"kg"}]', 540, 30, true, ''),
  -- Mike logs
  (mike_id, DATE(NOW() - INTERVAL '1 day'), 1, 3, '[{"exercise_name":"Deadlift","sets":5,"reps":5,"weight":140,"unit":"kg"},{"exercise_name":"Bench Press","sets":4,"reps":6,"weight":100,"unit":"kg"},{"exercise_name":"Squat","sets":4,"reps":6,"weight":120,"unit":"kg"}]', 5440, 60, true, 'Personal record on deadlift!'),
  (mike_id, DATE(NOW() - INTERVAL '5 days'), 3, 2, '[{"exercise_name":"Pull-ups","sets":5,"reps":8,"weight":10,"unit":"kg"},{"exercise_name":"Dumbbell Row","sets":4,"reps":10,"weight":35,"unit":"kg"}]', 1620, 45, true, 'Great session!'),
  (mike_id, DATE(NOW() - INTERVAL '12 days'), 5, 1, '[{"exercise_name":"Shoulder Press","sets":4,"reps":8,"weight":30,"unit":"kg"},{"exercise_name":"Lunges","sets":3,"reps":10,"weight":25,"unit":"kg"}]', 1250, 50, true, ''),
  -- Emily logs
  (emily_id, DATE(NOW() - INTERVAL '4 days'), 2, 3, '[{"exercise_name":"Bench Press","sets":3,"reps":10,"weight":30,"unit":"kg"},{"exercise_name":"Squat","sets":3,"reps":10,"weight":50,"unit":"kg"}]', 2400, 40, true, 'First time hitting these weights!'),
  (emily_id, DATE(NOW() - INTERVAL '11 days'), 4, 2, '[{"exercise_name":"Dumbbell Row","sets":3,"reps":12,"weight":20,"unit":"kg"},{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":30}]', 720, 35, true, ''),
  -- James logs
  (james_id, DATE(NOW() - INTERVAL '3 days'), 1, 3, '[{"exercise_name":"Running","sets":1,"reps":1,"weight":0,"unit":"min","distance_km":5},{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30}]', 0, 40, true, 'Lost 2kg this month!'),
  (james_id, DATE(NOW() - INTERVAL '10 days'), 3, 2, '[{"exercise_name":"Bench Press","sets":3,"reps":12,"weight":60,"unit":"kg"},{"exercise_name":"Lunges","sets":3,"reps":10,"weight":30,"unit":"kg"}]', 2100, 45, true, ''),
  -- Lisa logs
  (lisa_id, DATE(NOW() - INTERVAL '5 days'), 2, 3, '[{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":60},{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30}]', 0, 35, true, 'Core getting stronger!'),
  (lisa_id, DATE(NOW() - INTERVAL '12 days'), 4, 2, '[{"exercise_name":"Lunges","sets":3,"reps":12,"weight":10,"unit":"kg"},{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":45}]', 360, 40, true, ''),
  -- David logs
  (david_id, DATE(NOW() - INTERVAL '2 days'), 1, 3, '[{"exercise_name":"Deadlift","sets":5,"reps":5,"weight":150,"unit":"kg"},{"exercise_name":"Bench Press","sets":4,"reps":6,"weight":110,"unit":"kg"}]', 5740, 55, true, 'New PR!'),
  (david_id, DATE(NOW() - INTERVAL '9 days'), 3, 2, '[{"exercise_name":"Squat","sets":5,"reps":5,"weight":130,"unit":"kg"},{"exercise_name":"Pull-ups","sets":4,"reps":10,"weight":0,"unit":"bodyweight"}]', 2600, 50, true, ''),
  -- Anna logs
  (anna_id, DATE(NOW() - INTERVAL '6 days'), 2, 3, '[{"exercise_name":"Plank","sets":3,"reps":1,"weight":0,"unit":"sec","duration":90},{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30}]', 0, 40, true, 'Flexibility improving!'),
  (anna_id, DATE(NOW() - INTERVAL '15 days'), 4, 1, '[{"exercise_name":"Lunges","sets":3,"reps":12,"weight":15,"unit":"kg"}]', 540, 30, true, ''),
  -- Tom logs
  (tom_id, DATE(NOW() - INTERVAL '4 days'), 1, 3, '[{"exercise_name":"Bench Press","sets":4,"reps":8,"weight":85,"unit":"kg"},{"exercise_name":"Squat","sets":4,"reps":6,"weight":105,"unit":"kg"}]', 2660, 50, true, 'Gaining strength!'),
  (tom_id, DATE(NOW() - INTERVAL '11 days'), 3, 2, '[{"exercise_name":"Deadlift","sets":3,"reps":5,"weight":125,"unit":"kg"},{"exercise_name":"Dumbbell Row","sets":3,"reps":12,"weight":35,"unit":"kg"}]', 1710, 45, true, ''),
  -- Rachel logs
  (rachel_id, DATE(NOW() - INTERVAL '7 days'), 2, 3, '[{"exercise_name":"Running","sets":1,"reps":1,"weight":0,"unit":"min","distance_km":6},{"exercise_name":"Jump Rope","sets":5,"reps":1,"weight":0,"unit":"min","rest_seconds":30}]', 0, 45, true, 'Running further now!'),
  (rachel_id, DATE(NOW() - INTERVAL '16 days'), 4, 2, '[{"exercise_name":"Bench Press","sets":3,"reps":12,"weight":45,"unit":"kg"},{"exercise_name":"Lunges","sets":3,"reps":10,"weight":20,"unit":"kg"}]', 1650, 40, true, '');
  
  -- Insert messages
  INSERT INTO messages (coachee_id, sender_id, content, created_at) VALUES
  (alex_id, coach_uuid, 'Great job on bench press today! Next week lets aim for 85kg.', NOW() - INTERVAL '2 hours'),
  (alex_id, alex_id, 'Thanks coach! I felt really strong today.', NOW() - INTERVAL '1 hour'),
  (sarah_id, sarah_id, 'Hi coach, I completed the HIIT session. Feeling tired but good!', NOW() - INTERVAL '1 day'),
  (sarah_id, coach_uuid, 'Awesome progress Sarah! Your form has improved a lot.', NOW() - INTERVAL '1 day'),
  (mike_id, coach_uuid, 'Mike, your deadlift numbers are impressive. Lets work on mobility next week.', NOW() - INTERVAL '2 days'),
  (emily_id, emily_id, 'Coach, I have a shoulder pain after overhead press. Should I skip it?', NOW() - INTERVAL '3 days'),
  (emily_id, coach_uuid, 'Yes Emily, skip overhead press this week. Do lateral raises instead. Rest and ice the shoulder.', NOW() - INTERVAL '3 days'),
  (james_id, coach_uuid, 'James, your body fat dropped 2% this month! Excellent work on the diet plan.', NOW() - INTERVAL '4 days'),
  (lisa_id, lisa_id, 'Lisa, completed my first full week of Core and Flexibility program!', NOW() - INTERVAL '5 days'),
  (david_id, coach_uuid, 'David, your athletic performance numbers are trending up. Keep it up!', NOW() - INTERVAL '6 days');
  
  -- Update subscription
  INSERT INTO subscriptions (user_id, status, plan_type, amount_cents, currency)
  VALUES (coach_uuid, 'active', 'basic', 2900, 'usd')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Demo data seeded successfully!';
  RAISE NOTICE 'Coach: %', coach_uuid;
  RAISE NOTICE 'Coachees: 10';
  RAISE NOTICE 'Measurements: 50';
  RAISE NOTICE 'Workout Logs: ~30';
  RAISE NOTICE 'Messages: 10';
END ;

-- Migration: 001_initial_schema
-- Description: Complete database schema for Fitness Coach CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('coach', 'client')),
    
    -- Coach-specific fields
    certifications JSONB,
    specialties TEXT[],
    experience_years INTEGER,
    hourly_rate DECIMAL(10,2),
    
    -- Client-specific fields
    fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
    goals TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL DEFAULT 8,
    level TEXT NOT NULL DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    equipment TEXT[] DEFAULT ARRAY['bodyweight'],
    weekly_structure JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_template BOOLEAN DEFAULT false,
    ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Exercises library
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    muscle_group TEXT NOT NULL CHECK (muscle_group IN ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio', 'full_body')),
    equipment TEXT DEFAULT 'bodyweight' CHECK (equipment IN ('bodyweight', 'barbell', 'dumbbell', 'machine', 'cable', 'band', 'other')),
    difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    instructions TEXT,
    video_url TEXT,
    image_url TEXT,
    calories_per_minute DECIMAL(5,2),
    category TEXT DEFAULT 'strength' CHECK (category IN ('strength', 'cardio', 'flexibility', 'rehab')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Coachee Programs (assignment)
CREATE TABLE IF NOT EXISTS coachee_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    coachee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(coachee_id, program_id)
);

-- Workout Logs
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coachee_program_id UUID NOT NULL REFERENCES coachee_programs(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    total_duration INTEGER,
    total_volume DECIMAL(10,2),
    calories_burned DECIMAL(10,2),
    rpe INTEGER,
    mood TEXT CHECK (mood IN ('excellent', 'good', 'neutral', 'bad', 'terrible')),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    sleep_hours DECIMAL(3,1),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Workout Sets
CREATE TABLE IF NOT EXISTS workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_log_id UUID NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id),
    exercise_name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(10,2),
    unit TEXT DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs', 'bodyweight')),
    rpe INTEGER,
    rest_seconds INTEGER,
    completed BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Body Measurements
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coachee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    weight DECIMAL(5,2),
    body_fat_percent DECIMAL(4,2),
    chest_circumference DECIMAL(5,2),
    waist_circumference DECIMAL(5,2),
    hip_circumference DECIMAL(5,2),
    bicep_circumference DECIMAL(5,2),
    thigh_circumference DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    invoice_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    coachee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'file')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general' CHECK (type IN ('program_update', 'workout_reminder', 'message', 'payment', 'milestone', 'general')),
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_programs_coach_id ON programs(coach_id);
CREATE INDEX idx_programs_is_template ON programs(is_template);
CREATE INDEX idx_coachee_programs_coach_id ON coachee_programs(coach_id);
CREATE INDEX idx_coachee_programs_coachee_id ON coachee_programs(coachee_id);
CREATE INDEX idx_coachee_programs_status ON coachee_programs(status);
CREATE INDEX idx_workout_logs_coachee_program_id ON workout_logs(coachee_program_id);
CREATE INDEX idx_workout_logs_date ON workout_logs(date);
CREATE INDEX idx_workout_sets_workout_log_id ON workout_sets(workout_log_id);
CREATE INDEX idx_body_measurements_coachee_id ON body_measurements(coachee_id);
CREATE INDEX idx_body_measurements_date ON body_measurements(date);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_messages_conversation ON messages(coach_id, coachee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE coachee_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY \"Users can view own profile\" ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY \"Users can update own profile\" ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY \"Coaches can view public profiles\" ON profiles FOR SELECT
    USING (role = 'coach');

-- RLS Policies for programs
CREATE POLICY \"Coaches can manage own programs\" ON programs FOR ALL
    USING (auth.uid() = coach_id);

CREATE POLICY \"Active coachees can view assigned programs\" ON programs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM coachee_programs cp
            JOIN profiles p ON p.id = cp.coachee_id
            WHERE cp.program_id = programs.id
            AND cp.status = 'active'
            AND p.id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM programs pt WHERE pt.is_template = true
        )
    );

-- RLS Policies for coachee_programs
CREATE POLICY \"Coaches can manage coachee programs\" ON coachee_programs FOR ALL
    USING (auth.uid() = coach_id);

CREATE POLICY \"Coachees can view their programs\" ON coachee_programs FOR SELECT
    USING (auth.uid() = coachee_id);

-- RLS Policies for workout_logs
CREATE POLICY \"Coaches and coachees can manage logs\" ON workout_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM coachee_programs cp
            WHERE cp.id = workout_logs.coachee_program_id
            AND (cp.coach_id = auth.uid() OR cp.coachee_id = auth.uid())
        )
    );

-- RLS Policies for workout_sets
CREATE POLICY \"Workout sets follow workout logs policies\" ON workout_sets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workout_logs wl
            JOIN coachee_programs cp ON cp.id = wl.coachee_program_id
            WHERE wl.id = workout_sets.workout_log_id
            AND (cp.coach_id = auth.uid() OR cp.coachee_id = auth.uid())
        )
    );

-- RLS Policies for body_measurements
CREATE POLICY \"Coaches and coachees can manage measurements\" ON body_measurements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM coachee_programs cp
            WHERE cp.coachee_id = body_measurements.coachee_id
            AND (cp.coach_id = auth.uid() OR cp.coachee_id = auth.uid())
        )
    );

-- RLS Policies for messages
CREATE POLICY \"Participants can view messages\" ON messages FOR SELECT
    USING (
        auth.uid() = coach_id OR auth.uid() = coachee_id
    );

CREATE POLICY \"Coach can send messages\" ON messages FOR INSERT
    WITH CHECK (auth.uid() = coach_id);

CREATE POLICY \"Coachee can send messages\" ON messages FOR INSERT
    WITH CHECK (auth.uid() = coachee_id);

-- RLS Policies for notifications
CREATE POLICY \"Users can view own notifications\" ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS 
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
 LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coachee_programs_updated_at BEFORE UPDATE ON coachee_programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed some default exercises
INSERT INTO exercises (name, muscle_group, equipment, difficulty, category, instructions) VALUES
('Push-Up', 'chest', 'bodyweight', 'beginner', 'strength', 'Start in plank position, lower chest to ground, push back up'),
('Squat', 'legs', 'bodyweight', 'beginner', 'strength', 'Stand with feet shoulder-width apart, lower hips back and down, stand back up'),
('Plank', 'core', 'bodyweight', 'beginner', 'strength', 'Hold a push-up position on forearms, keep body straight'),
('Deadlift', 'back', 'barbell', 'intermediate', 'strength', 'Hinge at hips with barbell, lift by extending hips and knees'),
('Bench Press', 'chest', 'barbell', 'intermediate', 'strength', 'Lie on bench, lower bar to chest, press up'),
('Pull-Up', 'back', 'bodyweight', 'intermediate', 'strength', 'Hang from bar, pull body up until chin clears bar'),
('Overhead Press', 'shoulders', 'barbell', 'intermediate', 'strength', 'Press barbell overhead from shoulder height'),
('Bicep Curl', 'biceps', 'dumbbell', 'beginner', 'strength', 'Curl dumbbell from extended arm to shoulder'),
('Tricep Dips', 'triceps', 'bodyweight', 'beginner', 'strength', 'Lower body by bending elbows, push back up'),
('Lunges', 'legs', 'bodyweight', 'beginner', 'strength', 'Step forward, lower back knee toward ground, alternate legs'),
('Romanian Deadlift', 'back', 'dumbbell', 'intermediate', 'strength', 'Hinge at hips with dumbbells, keep slight knee bend'),
('Leg Press', 'legs', 'machine', 'beginner', 'strength', 'Push platform away with feet, return slowly'),
('Lat Pulldown', 'back', 'cable', 'beginner', 'strength', 'Pull bar down to chest, squeeze shoulder blades'),
('Cable Fly', 'chest', 'cable', 'intermediate', 'strength', 'Bring cable handles together in front of chest'),
('Face Pull', 'shoulders', 'cable', 'intermediate', 'strength', 'Pull rope towards face, elbows high and wide'),
('Calf Raise', 'legs', 'bodyweight', 'beginner', 'strength', 'Raise heels off ground, pause, lower slowly'),
('Glute Bridge', 'glutes', 'bodyweight', 'beginner', 'strength', 'Lie on back, lift hips by squeezing glutes'),
('Mountain Climber', 'cardio', 'bodyweight', 'beginner', 'cardio', 'Alternate bringing knees to chest in plank position'),
('Burpee', 'full_body', 'bodyweight', 'intermediate', 'cardio', 'Squat, jump back to plank, push-up, jump feet forward, jump up'),
('Jump Rope', 'cardio', 'other', 'beginner', 'cardio', 'Continuous jumping while rotating rope under feet')
ON CONFLICT DO NOTHING;

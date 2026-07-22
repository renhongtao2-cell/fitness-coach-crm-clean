-- Fix: Make renhongtao2 a coach and link demo coachees
UPDATE profiles SET role = 'coach', full_name = 'Zhang San' WHERE email = 'renhongtao2@gmail.com';

-- Link all demo clients to this coach
INSERT INTO coachee_programs (coach_id, coachee_id, program_id, status, start_date, created_at, updated_at)
SELECT
  'f30cf2cb-d6b7-4394-b88c-00df94ab3a55',
  p.id,
  (SELECT id FROM programs LIMIT 1),
  'active',
  CASE p.email
    WHEN '4545464@qq.com' THEN NOW() - INTERVAL '15 days'
    WHEN '25813@qq.com' THEN NOW() - INTERVAL '20 days'
    WHEN '46566@qq.com' THEN NOW() - INTERVAL '10 days'
    WHEN '123456789@QQ.com' THEN NOW() - INTERVAL '25 days'
    WHEN '55882@qq.com' THEN NOW() - INTERVAL '12 days'
    WHEN '652255@qq.com' THEN NOW() - INTERVAL '18 days'
    WHEN '258369147@qq.com' THEN NOW() - INTERVAL '8 days'
    WHEN '1234562@qq.com' THEN NOW() - INTERVAL '22 days'
    WHEN '369147@qq.com' THEN NOW() - INTERVAL '14 days'
    WHEN '145456@qq.com' THEN NOW() - INTERVAL '30 days'
  END,
  CASE p.email
    WHEN '4545464@qq.com' THEN NOW() - INTERVAL '15 days'
    WHEN '25813@qq.com' THEN NOW() - INTERVAL '20 days'
    WHEN '46566@qq.com' THEN NOW() - INTERVAL '10 days'
    WHEN '123456789@QQ.com' THEN NOW() - INTERVAL '25 days'
    WHEN '55882@qq.com' THEN NOW() - INTERVAL '12 days'
    WHEN '652255@qq.com' THEN NOW() - INTERVAL '18 days'
    WHEN '258369147@qq.com' THEN NOW() - INTERVAL '8 days'
    WHEN '1234562@qq.com' THEN NOW() - INTERVAL '22 days'
    WHEN '369147@qq.com' THEN NOW() - INTERVAL '14 days'
    WHEN '145456@qq.com' THEN NOW() - INTERVAL '30 days'
  END,
  CASE p.email
    WHEN '4545464@qq.com' THEN NOW() - INTERVAL '15 days'
    WHEN '25813@qq.com' THEN NOW() - INTERVAL '20 days'
    WHEN '46566@qq.com' THEN NOW() - INTERVAL '10 days'
    WHEN '123456789@QQ.com' THEN NOW() - INTERVAL '25 days'
    WHEN '55882@qq.com' THEN NOW() - INTERVAL '12 days'
    WHEN '652255@qq.com' THEN NOW() - INTERVAL '18 days'
    WHEN '258369147@qq.com' THEN NOW() - INTERVAL '8 days'
    WHEN '1234562@qq.com' THEN NOW() - INTERVAL '22 days'
    WHEN '369147@qq.com' THEN NOW() - INTERVAL '14 days'
    WHEN '145456@qq.com' THEN NOW() - INTERVAL '30 days'
  END
FROM profiles p
WHERE p.email IN (
  '4545464@qq.com', '25813@qq.com', '46566@qq.com',
  '123456789@QQ.com', '55882@qq.com', '652255@qq.com',
  '258369147@qq.com', '1234562@qq.com', '369147@qq.com',
  '145456@qq.com'
)
AND NOT EXISTS (
  SELECT 1 FROM coachee_programs cp
  WHERE cp.coach_id = 'f30cf2cb-d6b7-4394-b88c-00df94ab3a55'
  AND cp.coachee_id = p.id
);

-- Also update messages to use this coach
UPDATE messages SET coach_id = 'f30cf2cb-d6b7-4394-b88c-00df94ab3a55'
WHERE coach_id = 'b7b84c00-7f2e-4df1-b122-892e9bae06e1';

-- Summary
SELECT 'FIX COMPLETE' as status;
SELECT count(*) as coachee_programs FROM coachee_programs WHERE coach_id = 'f30cf2cb-d6b7-4394-b88c-00df94ab3a55';
SELECT count(*) as messages FROM messages;

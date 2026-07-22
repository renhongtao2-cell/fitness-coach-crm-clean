-- Migration: 002_make_program_id_nullable
-- Allow adding coachees without immediately assigning a program

ALTER TABLE coachee_programs ALTER COLUMN program_id DROP NOT NULL;
ALTER TABLE coachee_programs DROP CONSTRAINT coachee_programs_coachee_id_program_id_key;

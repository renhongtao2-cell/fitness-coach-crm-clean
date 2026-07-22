'use client';

import { pgTable, text, integer, boolean, timestamp, jsonb, uuid, decimal, serial, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name"),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: text("role").notNull().default("client"),
  certifications: jsonb("certifications"),
  specialties: text("specialties").array(),
  experienceYears: integer("experience_years"),
  hourlyRate: decimal("hourly_rate"),
  fitnessLevel: text("fitness_level"),
  goals: text("goals").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").references(() => profiles.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  durationWeeks: integer("duration_weeks").notNull().default(8),
  level: text("level").notNull().default("intermediate"),
  equipment: text("equipment").array().default(["bodyweight"]),
  weeklyStructure: jsonb("weekly_structure").notNull().default([]),
  isActive: boolean("is_active").default(true),
  isTemplate: boolean("is_template").default(false),
  aiGenerated: boolean("ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  muscleGroup: text("muscle_group").notNull(),
  equipment: text("equipment").default("bodyweight"),
  difficulty: text("difficulty").default("beginner"),
  instructions: text("instructions"),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  caloriesPerMinute: decimal("calories_per_minute"),
  category: text("category").default("strength"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coacheePrograms = pgTable("coachee_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").references(() => profiles.id).notNull(),
  coacheeId: uuid("coachee_id").references(() => profiles.id).notNull(),
  programId: uuid("program_id").references(() => programs.id).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: text("status").default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  coacheeProgramId: uuid("coachee_program_id").references(() => coacheePrograms.id).notNull(),
  weekNumber: integer("week_number").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  totalDuration: integer("total_duration"),
  totalVolume: decimal("total_volume"),
  caloriesBurned: decimal("calories_burned"),
  rpe: integer("rpe"),
  mood: text("mood"),
  energyLevel: integer("energy_level"),
  sleepHours: decimal("sleep_hours"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workoutSets = pgTable("workout_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutLogId: uuid("workout_log_id").references(() => workoutLogs.id).notNull(),
  exerciseId: uuid("exercise_id").references(() => exercises.id).notNull(),
  exerciseName: text("exercise_name").notNull(),
  sets: integer("sets").notNull(),
  reps: integer("reps").notNull(),
  weight: decimal("weight"),
  unit: text("unit").default("kg"),
  rpe: integer("rpe"),
  restSeconds: integer("rest_seconds"),
  completed: boolean("completed").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bodyMeasurements = pgTable("body_measurements", {
  id: uuid("id").primaryKey().defaultRandom(),
  coacheeId: uuid("coachee_id").references(() => profiles.id).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  weight: decimal("weight"),
  bodyFatPercent: decimal("body_fat_percent"),
  chestCircumference: decimal("chest_circumference"),
  waistCircumference: decimal("waist_circumference"),
  hipCircumference: decimal("hip_circumference"),
  bicepCircumference: decimal("bicep_circumference"),
  thighCircumference: decimal("thigh_circumference"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  amount: decimal("amount").notNull(),
  currency: text("currency").default("usd"),
  status: text("status").notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  invoiceUrl: text("invoice_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  coachId: uuid("coach_id").references(() => profiles.id).notNull(),
  coacheeId: uuid("coachee_id").references(() => profiles.id).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").default("text"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("general"),
  isRead: boolean("is_read").default(false),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export types
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type CoacheeProgram = typeof coacheePrograms.$inferSelect;
export type NewCoacheeProgram = typeof coacheePrograms.$inferInsert;
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type NewWorkoutLog = typeof workoutLogs.$inferInsert;
export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;
export type BodyMeasurement = typeof bodyMeasurements.$inferSelect;
export type NewBodyMeasurement = typeof bodyMeasurements.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

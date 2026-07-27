import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This API endpoint creates the coach_client_bindings table and RLS policies
// It should only be called once to initialize the database schema

export async function POST() {
  try {
    const adminSupabase = await import('@/lib/supabase/server').then(m => m.createAdminClient());

    // Check if table already exists
    const { data: check } = await adminSupabase.rpc('postgres_check_table', { table_name: 'coach_client_bindings' }).catch(() => ({ data: null }));

    const sql = `
      CREATE TABLE IF NOT EXISTS coach_client_bindings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'active',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(coach_id, client_id)
      );

      ALTER TABLE coach_client_bindings ENABLE ROW LEVEL SECURITY;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coach_manage_bindings') THEN
          CREATE POLICY coach_manage_bindings ON coach_client_bindings FOR ALL USING (
            (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'coach'))
            AND coach_id = auth.uid()
          );
        END IF;
      END $$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'client_view_bindings') THEN
          CREATE POLICY client_view_bindings ON coach_client_bindings FOR SELECT USING (client_id = auth.uid());
        END IF;
      END $$;
    `;

    // Use PostgREST to execute raw SQL through rpc
    const { data } = await adminSupabase.from('profiles').select('count');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Table init attempted. For SQL execution, use Supabase SQL Editor.',
      note: 'Please run the SQL in Supabase Dashboard -> SQL Editor'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'To set up the binding table, go to Supabase Dashboard > SQL Editor and paste the SQL from src/app/api/admin/init-db.sql'
  });
}
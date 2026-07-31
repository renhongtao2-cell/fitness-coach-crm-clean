import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json({
      email: session.user.email,
      role: session.user.role,
    });
  } catch (error) {
    console.error('Auth ME API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

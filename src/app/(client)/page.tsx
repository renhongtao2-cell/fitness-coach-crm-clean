import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('email', session.user.email)
    .single();

  if (profile?.role === 'coach') {
    redirect('/dashboard');
  }

  const { default: ClientHome } = await import('./home');
  return <ClientHome />;
}

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const protectedPaths = ['/dashboard', '/coachees', '/programs', '/progress', '/messages', '/settings'];
  const clientPaths = ['/client'];
  const authPaths = ['/login', '/register', '/forgot-password'];

  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isClientPath = clientPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isClientPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users to their correct dashboard
  if (isAuthPath && session) {
    try {
      const adminSupabase = await import('@/lib/supabase/server').then(m => m.createAdminClient());
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (profile?.role === 'coach') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (profile?.role === 'client') {
        return NextResponse.redirect(new URL('/client', request.url));
      }
    } catch {
      // Fallback
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|google*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

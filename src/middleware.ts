import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://arxmmamibjisvknacoun.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_siuJ9sVKtPGnSiSh8A8XlQ_jqRKTuBj";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-no-cache", "true");

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Force no cache on ALL responses
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "-1");

  const cookieStore = await cookies();

  try {
    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
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
      const redirect = NextResponse.redirect(new URL('/login', request.url));
      redirect.headers.set("Cache-Control", "no-store, max-age=0");
      return redirect;
    }

    if (isClientPath && !session) {
      const redirect = NextResponse.redirect(new URL('/login', request.url));
      redirect.headers.set("Cache-Control", "no-store, max-age=0");
      return redirect;
    }

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
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|google*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

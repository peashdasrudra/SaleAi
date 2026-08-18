import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isPublicApiRoute = pathname.startsWith('/api/');
  const isStaticRoute = pathname.startsWith('/_next') || pathname === '/favicon.ico';
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname === '/';

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicApiRoute && !isStaticRoute && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

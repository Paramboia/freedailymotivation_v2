import { NextResponse, NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    'default-src &apos;self&apos;; script-src &apos;self&apos; &apos;unsafe-inline&apos; &apos;unsafe-eval&apos; https://cdn.clerk.io; style-src &apos;self&apos; &apos;unsafe-inline&apos; https://fonts.googleapis.com; font-src &apos;self&apos; https://fonts.gstatic.com; img-src &apos;self&apos; data: https:; connect-src &apos;self&apos; https://api.clerk.dev https://clerk.freedailymotivation.com;'
  );

  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

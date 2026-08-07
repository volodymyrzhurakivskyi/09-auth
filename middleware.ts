import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateKey = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicKey = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isPrivateKey && !isPublicKey) {
    return NextResponse.next();
  }

  let isAuthenticated = false;
  try {
    const session = await checkSession();
    isAuthenticated = !!session;
  } catch {
    isAuthenticated = false;
  }

  // Якщо неавторизований і йде на приватний маршрут -> на /sign-in
  if (isPrivateKey && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо авторизований і йде на публічний (sign-in/sign-up) -> на /profile
  if (isPublicKey && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
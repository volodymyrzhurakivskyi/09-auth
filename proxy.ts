import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isPrivateRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  // Якщо немає accessToken, але є refreshToken — пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      isAuthenticated = response.status === 200;

      if (isAuthenticated) {
        const setCookie = response.headers['set-cookie'];

        const nextResponse = isPrivateRoute
          ? NextResponse.next()
          : NextResponse.redirect(new URL('/', request.url));

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
          for (const cookieStr of cookieArray) {
            const parsed = parseSetCookie(cookieStr);
            if (parsed.value) {
              nextResponse.cookies.set(parsed.name, parsed.value, parsed);
            }
          }
        }

        return nextResponse;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Якщо неавторизований і йде на приватний маршрут -> на /sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо авторизований і йде на публічний (sign-in/sign-up) -> на головну
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
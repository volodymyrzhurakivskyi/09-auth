import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const response = await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

    const res = NextResponse.json(response.data);
    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      res.headers.set('set-cookie', setCookie.join(', '));
    }

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Logout failed' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
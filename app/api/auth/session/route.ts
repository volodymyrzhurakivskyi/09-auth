import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Session check failed' },
        { status: error.response?.status || 401 }
      );
    }
    return NextResponse.json(
      { message: 'Session check failed' },
      { status: 401 }
    );
  }
}
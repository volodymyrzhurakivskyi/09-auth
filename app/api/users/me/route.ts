import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to fetch user profile' },
        { status: error.response?.status || 401 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to fetch user profile' },
      { status: 401 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();
    const response = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to update user profile' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
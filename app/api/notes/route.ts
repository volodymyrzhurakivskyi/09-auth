import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);

    const response = await api.get(`/notes?${searchParams.toString()}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to fetch notes' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const response = await api.post('/notes', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to create note' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to create note' },
      { status: 500 }
    );
  }
}
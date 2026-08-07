import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await api.post('/auth/register', body);

    const res = NextResponse.json(response.data);
    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      res.headers.set('set-cookie', setCookie.join(', '));
    }

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Registration failed' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}
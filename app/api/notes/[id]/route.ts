import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();

    const response = await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: 'Failed to delete note' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: 'Failed to delete note' },
      { status: 500 }
    );
  }
}
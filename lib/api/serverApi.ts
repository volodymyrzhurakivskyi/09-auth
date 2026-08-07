import { cookies } from 'next/headers';
import { api } from './api';
import type { User } from '@/types/user';
import type { Note, FetchNotesResponse } from '@/types/note';
import type { AxiosResponse } from 'axios';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
}

export async function fetchNotes(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const headers = await getAuthHeaders();
  const response = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, {
    headers,
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const headers = await getAuthHeaders();
  const response = await api.get<User>('/users/me', {
    headers,
  });
  return response.data;
}

export async function checkSession(): Promise<AxiosResponse> {
  const headers = await getAuthHeaders();
  const response = await api.get('/auth/session', {
    headers,
  });
  return response;
}
import { api } from './api';
import type { User } from '@/types/user';
import type { Note, NewNote, FetchNotesResponse } from '@/types/note';

export interface AuthCredentials {
  email: string;
  password: string;
}

// Аутентифікація та Користувач
export async function register(data: AuthCredentials): Promise<User> {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
}

export async function login(data: AuthCredentials): Promise<User> {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<User | null> {
  const response = await api.get<User | null>('/auth/session');
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/users/me');
  return response.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
}

// Нотатки
export async function fetchNotes(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(data: NewNote): Promise<Note> {
  const response = await api.post<Note>('/notes', data);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}
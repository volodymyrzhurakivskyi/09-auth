import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const currentTag = slug && slug.length > 0 ? slug[0] : 'all';
  const formattedTag = currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const title = `${formattedTag} Notes | NoteHub`;
  const description = `Browse all notes filtered by tag: ${formattedTag}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${formattedTag} notes`,
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Отримуємо tag: якщо є перший елемент масиву slug — беремо його, інакше 'all'
  const currentTag = slug && slug.length > 0 ? slug[0] : 'all';

  const queryClient = new QueryClient();

  // Виконуємо prefetch нотаток з урахуванням tag (за замовчуванням page 1, perPage 10 чи за ТЗ)
  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, perPage: 10, search: '', tag: currentTag }],
    queryFn: () => fetchNotes({ page: 1, perPage: 10, search: '', tag: currentTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}
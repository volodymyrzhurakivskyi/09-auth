'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NoteDetails.client.module.css';

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // Явно додано за вимогою ментора
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.modalContent}>
        {isLoading && <div>Loading note...</div>}
        
        {isError && (
          <div className={css.error}>
            <p>Failed to load note details.</p>
            <button type="button" onClick={handleClose}>Close</button>
          </div>
        )}

        {note && (
          <article className={css.noteDetails}>
            <h2>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            
            <div className={css.meta}>
              <span className={css.tag}>{note.tag}</span>
              {/* Рендеримо createdAt */}
              <time className={css.date}>
                {new Date(note.createdAt).toLocaleDateString()}
              </time>
            </div>

            {/* Явна кнопка закриття */}
            <button 
              type="button" 
              className={css.closeBtn} 
              onClick={handleClose}
            >
              Close
            </button>
          </article>
        )}
      </div>
    </Modal>
  ); 
}
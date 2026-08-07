'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const handleClose = () => {
    // При закритті модалки повертаємось на попередній маршрут списку
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, // 1️⃣ Додано за вимогою ментора
  });

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        {/* 2️⃣ Додано обробку стану помилки */}
        {isError && (
          <div className={css.error}>
            <p>Error: Failed to load note details.</p>
            <button type="button" onClick={handleClose} className={css.button}>
              Close
            </button>
          </div>
        )}

        {isLoading && <div>Loading note details...</div>}

        {note && (
          <div className={css.content}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <div>
              <span>Tag: {note.tag}</span>
            </div>

            {/* 3️⃣ Додано відображення createdAt */}
            {note.createdAt && (
              <div className={css.date}>
                Created at: {new Date(note.createdAt).toLocaleDateString()}
              </div>
            )}

            {/* 4️⃣ Додано видиму кнопку закриття в контенті */}
            <div className={css.actions}>
              <button
                type="button"
                onClick={handleClose}
                className={css.button}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
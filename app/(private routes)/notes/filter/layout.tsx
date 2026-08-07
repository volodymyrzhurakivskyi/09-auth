// app/notes/filter/layout.tsx
import React from 'react';

interface NotesFilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
      <aside style={{ width: '200px', flexShrink: 0 }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
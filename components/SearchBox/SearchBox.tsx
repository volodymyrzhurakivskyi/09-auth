import type { ChangeEvent } from 'react';
import css from './SearchBox.module.css';

// Типізація пропсів для компонента пошуку
interface SearchBoxProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchBox;
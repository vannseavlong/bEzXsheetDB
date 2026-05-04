import type { CategoryItem } from '@/types/api';

export function NoteAlert({ home }: { home: CategoryItem }) {
  if (!home) return null;
  return (
    <div className="bg-red-100 p-4">
      <p className="text-sm">{home.noteEn}</p>
    </div>
  );
}
export default NoteAlert;

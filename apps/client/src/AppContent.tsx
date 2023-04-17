import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { Wrapper } from './components/Wrapper';

export function AppContent() {
  return (
    <Wrapper>
      <h1 className="text-5xl font-bold text-center py-5">Notes</h1>
      <NoteForm />
      <NotesList />
    </Wrapper>
  );
}
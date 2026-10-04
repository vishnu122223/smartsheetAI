import React, { useRef, useState, useEffect } from 'react';
import flashcardService from '../../services/flashcards.service';
import Spinner from '../../components/common/Spinner';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import PageHeader from '../../components/common/PageHeader';
import toast from 'react-hot-toast';
import { Layers } from 'lucide-react';

function FlashcardListPage() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchFlashcardsSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcards();
        setFlashcardSets(response.data);
      } catch {
        toast.error('Failed to fetch flashcard sets.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardsSets();
  }, []);

  if (loading) return <Spinner label="Loading flashcards" />;

  return (
    <div>
      <PageHeader
        title="Flashcards"
        subtitle="Review and manage your flashcard sets"
      >
        <span className="chip">
          {flashcardSets.length} {flashcardSets.length === 1 ? 'set' : 'sets'}
        </span>
      </PageHeader>

      {flashcardSets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {flashcardSets.map((set) => (
            <FlashcardSetCard key={set._id} flashcardSet={set} />
          ))}
        </div>
      ) : (
        <div className="surface flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="icon-tile !w-16 !h-16 !rounded-2xl mb-6">
            <Layers size={26} />
          </div>
          <h2 className="text-xl font-bold mb-2">No flashcards yet</h2>
          <p className="text-sm text-muted text-center max-w-sm">
            Generate flashcards from your documents to start learning and reinforce
            your knowledge.
          </p>
        </div>
      )}
    </div>
  );
}

export default FlashcardListPage;

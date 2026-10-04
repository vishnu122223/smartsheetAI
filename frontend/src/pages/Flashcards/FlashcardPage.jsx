import React, { useEffect, useRef, useState } from 'react';
import flashcardService from '../../services/flashcards.service';
import Spinner from '../../components/common/Spinner';
import { useParams, Link } from 'react-router-dom';
import FlashcardViewer from '../../components/flashcards/FlashcardViewer';
import toast from 'react-hot-toast';
import { ArrowLeft, Layers } from 'lucide-react';

function FlashcardPage() {
  const { id } = useParams();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchFlashcardSet = async () => {
      try {
        const response = await flashcardService.getFlashcardById(id);
        setFlashcardSet(response.data);
      } catch {
        toast.error('Failed to fetch flashcards set.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [id]);

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.starFlashcard(cardId);

      const updatedCards = flashcardSet.cards.map((card) =>
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      );

      setFlashcardSet((prev) => ({
        ...prev,
        cards: updatedCards,
      }));

      toast.success('Card updated');
    } catch {
      toast.error('Failed to update card');
    }
  };

  if (loading) return <Spinner label="Loading flashcards" />;

  if (!flashcardSet) {
    return (
      <div className="surface p-12 text-center text-muted">Flashcards not found</div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Back */}
      <div className="mb-5">
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-2 text-sm link-accent hover:no-underline"
        >
          <ArrowLeft size={16} />
          Back to Flashcards
        </Link>
      </div>

      {/* Title Section */}
      <div className="mb-7">
        <p className="eyebrow mb-2">Study set</p>
        <h1 className="page-title flex items-center gap-3">
          <span className="icon-tile">
            <Layers size={20} />
          </span>
          {flashcardSet.title || 'Flashcard Set'}
        </h1>
        <p className="page-subtitle">
          {flashcardSet.cards?.length || 0}{' '}
          {flashcardSet.cards?.length === 1 ? 'card' : 'cards'} · click a card to flip it
        </p>
      </div>

      {/* Viewer Card */}
      <div className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10">
          <FlashcardViewer
            selectedSet={flashcardSet}
            handleToggleStar={handleToggleStar}
            currentCardIndex={currentCardIndex}
            setCurrentCardIndex={setCurrentCardIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default FlashcardPage;

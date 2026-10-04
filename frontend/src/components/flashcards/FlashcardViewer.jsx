import React from 'react';
import Flashcard from './Flashcard.jsx';
import flashcardServices from '../../services/flashcards.service.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const FlashcardViewer = ({
  selectedSet,
  currentCardIndex,
  setCurrentCardIndex,
  handleToggleStar,
}) => {
  const handleNextCard = () => {
    if (selectedSet) {
      handleReview();
      setCurrentCardIndex((prev) => (prev + 1) % selectedSet.cards.length);
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview();
      setCurrentCardIndex(
        (prev) => (prev - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async () => {
    const currCard = selectedSet?.cards[currentCardIndex];
    if (!currCard) return;

    try {
      await flashcardServices.reviewFlashcard(currCard._id);
    } catch {
      toast.error('Failed to review flashcard');
    }
  };

  const currentCard = selectedSet.cards[currentCardIndex];

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Flashcard */}
      <div className="w-full max-w-2xl">
        <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={handlePrevCard}
          disabled={selectedSet.cards.length <= 1}
          className="btn btn-ghost"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="chip px-5 py-2.5 !text-sm !tracking-normal !normal-case">
          {currentCardIndex + 1} / {selectedSet.cards.length}
        </span>

        <button
          onClick={handleNextCard}
          disabled={selectedSet.cards.length <= 1}
          className="btn btn-primary"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;

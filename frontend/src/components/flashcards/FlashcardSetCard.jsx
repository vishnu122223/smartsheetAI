import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import moment from 'moment';

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/flashcards/${flashcardSet._id}`);
  };

  const reviewedCount = flashcardSet.cards.filter((card) => card.lastReviewed).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div
      onClick={handleStudyNow}
      className="surface surface-hover p-6 flex flex-col justify-between cursor-pointer"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="icon-tile shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground line-clamp-2 leading-snug">
              {flashcardSet?.documentId?.title || 'Flashcard'}
            </h3>

            <p className="text-xs text-subtle mt-1">
              Created {moment(flashcardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2.5 flex-wrap">
          <span className="chip">
            {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
          </span>

          {reviewedCount > 0 && (
            <span className="chip chip-gold">
              <TrendingUp size={12} />
              {progressPercentage}%
            </span>
          )}
        </div>

        {/* Progress */}
        {totalCards > 0 && (
          <div>
            <div className="flex justify-between text-[0.7rem] text-subtle mb-1.5">
              <span>Progress</span>
              <span>
                {reviewedCount}/{totalCards}
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-primary via-accent to-gold rounded-full
                transition-all duration-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStudyNow();
        }}
        className="btn btn-primary w-full mt-6"
      >
        <Sparkles size={16} />
        Study now
      </button>
    </div>
  );
};

export default FlashcardSetCard;

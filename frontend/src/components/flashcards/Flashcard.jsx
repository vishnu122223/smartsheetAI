import React, { useState } from 'react';
import { Star, RotateCcw } from 'lucide-react';

const StarButton = ({ flashcard, onToggleStar }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggleStar(flashcard._id);
    }}
    aria-label={flashcard.isStarred ? 'Unstar card' : 'Star card'}
    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 border
      ${
        flashcard.isStarred
          ? 'bg-warning/20 border-warning/50 text-warning shadow-[0_10px_22px_-12px_rgba(251,191,36,0.9)]'
          : 'bg-fill border-hairline text-subtle hover:text-warning hover:border-warning/40'
      }`}
  >
    <Star
      strokeWidth={2}
      className="w-5 h-5"
      fill={flashcard.isStarred ? 'currentColor' : 'none'}
    />
  </button>
);

const difficultyStyles = {
  easy: { background: 'rgba(52, 211, 153, 0.12)', borderColor: 'rgba(52, 211, 153, 0.35)', color: '#34D399' },
  medium: { background: 'rgba(251, 191, 36, 0.12)', borderColor: 'rgba(251, 191, 36, 0.35)', color: '#FBBF24' },
  hard: { background: 'rgba(248, 113, 113, 0.12)', borderColor: 'rgba(248, 113, 113, 0.35)', color: '#F87171' },
};

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const difficulty = String(flashcard?.difficulty || '').toLowerCase();
  const diffStyle = difficultyStyles[difficulty] || {
    background: 'rgba(139, 92, 246, 0.14)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    color: '#C4B5FD',
  };

  return (
    <div style={{ perspective: '1200px' }} className="relative w-full h-80">
      <div
        className="relative w-full h-full transition-transform duration-600 cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transitionDuration: '600ms',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between
          bg-gradient-to-br from-primary/25 via-elevated to-accent/20
          border border-white/12 shadow-[0_36px_70px_-30px_rgba(0,0,0,0.9)]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="pointer-events-none absolute -top-16 -right-12 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-start justify-between">
            <span className="chip uppercase" style={diffStyle}>
              {flashcard?.difficulty || 'Card'}
            </span>
            <StarButton flashcard={flashcard} onToggleStar={onToggleStar} />
          </div>

          {/* Question */}
          <div className="relative flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-xl font-semibold text-center leading-relaxed text-foreground">
              {flashcard.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="relative flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-muted">
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Click to reveal answer
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between
          bg-gradient-to-br from-accent/30 via-elevated to-primary/25
          border border-white/12 shadow-[0_36px_70px_-30px_rgba(0,0,0,0.9)]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-primary/30 blur-3xl" />

          {/* Header */}
          <div className="relative flex items-start justify-between">
            <span className="eyebrow">Answer</span>
            <StarButton flashcard={flashcard} onToggleStar={onToggleStar} />
          </div>

          {/* Answer Content */}
          <div className="relative flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-base font-medium text-center leading-relaxed text-foreground/95">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="relative flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-muted">
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Click to see question
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

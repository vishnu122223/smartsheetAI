import React from 'react';
import Button from './Button';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({
  onClickAction,
  title,
  description,
  buttonText,
  loading,
  loadingText,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl
      border border-dashed border-white/12 bg-fill text-center"
    >
      <div className="icon-tile !w-16 !h-16 !rounded-2xl mb-6">
        <FileText strokeWidth={1.7} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-2">{title}</h3>
      <p className="text-sm mb-8 text-muted max-w-sm leading-relaxed">{description}</p>
      {onClickAction && (
        <Button onClick={onClickAction} disabled={loading} size="md">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              <Plus strokeWidth={2.2} className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

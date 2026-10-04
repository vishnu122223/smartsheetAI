import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Overlay */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        ></div>

        {/* Modal */}
        <div
          className="relative w-full max-w-2xl p-6 z-10 rounded-3xl border border-hairline
          bg-elevated/95 backdrop-blur-xl shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
          style={{ animation: 'fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both' }}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full bg-accent/25 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl
            text-muted hover:text-foreground hover:bg-fill-strong transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-5 pr-10">
            <p className="eyebrow mb-1.5">Smart Sheet AI</p>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h3>
          </div>

          <div className="divider mb-5" />

          {/* Content */}
          <div className="text-foreground/90 max-h-[70vh] overflow-y-auto pr-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

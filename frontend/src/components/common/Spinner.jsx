import React from 'react';

const Spinner = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-primary animate-spin"
        />
        <div
          className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-gold animate-spin"
          style={{ animationDuration: '0.75s' }}
        />
      </div>
      {label && (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-subtle">
          {label}
        </p>
      )}
    </div>
  );
};

export default Spinner;

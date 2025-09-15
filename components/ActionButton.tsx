
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: string;
  text: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon, text, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${className}`}
  >
    <i className={`fas ${icon}`} aria-hidden="true"></i>
    <span>{text}</span>
  </button>
);

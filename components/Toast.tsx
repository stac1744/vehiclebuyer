import React from 'react';
import type { ToastState } from '../types';

export const Toast: React.FC<ToastState> = ({ message, type, show }) => {
  const baseClasses = 'fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full shadow-2xl text-white font-semibold transition-all duration-500 z-50 flex items-center gap-3 text-sm';
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const visibilityClasses = show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20 pointer-events-none';

  const iconClasses = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  }

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`} role="alert">
       <i className={`fas ${iconClasses[type]}`}></i>
      <span>{message}</span>
    </div>
  );
};
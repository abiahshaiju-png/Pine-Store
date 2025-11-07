import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const ICONS = {
    success: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    error: (
         <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    info: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
};

const BACKGROUND_COLORS = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
};

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [toast, onDismiss]);

    return (
        <div className={`flex items-center ${BACKGROUND_COLORS[toast.type]} text-white p-4 rounded-lg shadow-lg animate-fade-in-right`}>
            <div className="flex-shrink-0">{ICONS[toast.type]}</div>
            <div className="ml-3 text-sm font-medium">{toast.message}</div>
            <button onClick={() => onDismiss(toast.id)} className="ml-4 -mr-1 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] w-full max-w-xs space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Add keyframes to index.html or a global CSS file if you have one.
// For this project, a style tag in the component or index.html is fine.
const styles = `
@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-fade-in-right {
  animation: fade-in-right 0.5s ease-out forwards;
}
`;

// Inject styles into the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

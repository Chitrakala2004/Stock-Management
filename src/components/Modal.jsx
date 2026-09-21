import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, width = 'max-w-lg' }) => {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-[96vw] sm:${width} max-h-[92vh] flex flex-col transform transition-all duration-200 animate-modal overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 shrink-0 bg-white">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate pr-2">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body - Scrollable on mobile if content exceeds screen */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto max-h-[calc(92vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

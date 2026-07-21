import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: '#00000080' }}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className={cn('w-full max-w-lg rounded-xl p-6 relative', className)} style={{ backgroundColor: '#1B1734', border: '1px solid #8B2C6F55' }}>
        <div className="flex items-start justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-bold" style={{ color: '#F8F4EC' }}>
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="ml-4 p-1 rounded transition-opacity hover:opacity-70" style={{ color: '#D8A7B1' }}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

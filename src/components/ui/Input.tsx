import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium" style={{ color: '#F8F4EC' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn('px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2', className)}
        style={{ backgroundColor: '#2A2150', border: error ? '1px solid #F87171' : '1px solid #8B2C6F55', color: '#F8F4EC' }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs" style={{ color: '#D8A7B188' }}>
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

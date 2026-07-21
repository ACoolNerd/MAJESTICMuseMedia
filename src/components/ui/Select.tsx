import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className, id, ...props }, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium" style={{ color: '#F8F4EC' }}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn('px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2', className)}
        style={{ backgroundColor: '#2A2150', border: error ? '1px solid #F87171' : '1px solid #8B2C6F55', color: '#F8F4EC' }}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="text-xs" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

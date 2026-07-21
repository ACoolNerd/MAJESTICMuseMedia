import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const styles: Record<NonNullable<CardProps['variant']>, CSSProperties> = {
    default: { backgroundColor: '#13102A', border: '1px solid #8B2C6F22' },
    elevated: { backgroundColor: '#1B1850', border: '1px solid #8B2C6F33', boxShadow: '0 8px 32px #00000044' },
    outlined: { backgroundColor: 'transparent', border: '1px solid #8B2C6F55' },
  };

  return (
    <div className={cn('rounded-xl p-6', className)} style={styles[variant]} {...props}>
      {children}
    </div>
  );
}

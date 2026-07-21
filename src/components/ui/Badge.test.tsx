import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Confirmed</Badge>);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    render(<Badge variant="gold">Gold</Badge>);
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('uses neutral variant by default', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });
});

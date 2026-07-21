import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('MAJESTIC Muse Media app', () => {
  it('renders the public promise', () => {
    render(<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>);
    expect(screen.getByText(/Where faith, purpose, and identity/i)).toBeInTheDocument();
  });

  it('keeps platform integrations visibly disconnected by default', () => {
    render(<MemoryRouter initialEntries={['/app']}><App/></MemoryRouter>);
    expect(screen.getAllByText('Connection Required').length).toBeGreaterThan(0);
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('MAJESTIC Muse Media app', () => {
  it('renders the public promise', () => {
    render(<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>);
    expect(screen.getByText(/Where faith, purpose, and identity/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated private traffic to sign in', async () => {
    render(<MemoryRouter initialEntries={['/app']}><App/></MemoryRouter>);
    expect(await screen.findByText('Control Center sign in')).toBeInTheDocument();
    expect(screen.getByText(/Firebase Authentication is not configured/i)).toBeInTheDocument();
  });

  it('does not expose local demo roles unless explicitly enabled', async () => {
    render(<MemoryRouter initialEntries={['/login']}><App/></MemoryRouter>);
    expect(await screen.findByText('Control Center sign in')).toBeInTheDocument();
    expect(screen.queryByText('Local development demo')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { seedPublicArticles, seedPublicClips, seedPublicEpisodes, seedPublicLive } from './seed';

describe('approved public content', () => {
  it('does not seed unverified published media', () => {
    expect(seedPublicEpisodes.every(item => item.status !== 'Published')).toBe(true);
    expect(seedPublicClips).toEqual([]);
    expect(seedPublicArticles).toEqual([]);
    expect(seedPublicLive.status).toBe('No Event');
  });

  it('shows the upcoming episode without claiming public media exists', async () => {
    render(<MemoryRouter initialEntries={['/episodes']}><App/></MemoryRouter>);
    expect(await screen.findByText('IDENTITY')).toBeInTheDocument();
    expect(screen.getByText(/No episode has been verified as published yet/i)).toBeInTheDocument();
  });

  it('shows the episode truth notice when media is pending approval', async () => {
    render(<MemoryRouter initialEntries={['/episodes/identity']}><App/></MemoryRouter>);
    expect(await screen.findByText(/Public media pending approval/i)).toBeInTheDocument();
    expect(screen.getByText(/No unverified sponsor, performance, release, transcript, rights, or platform claim/i)).toBeInTheDocument();
  });

  it('does not display an unverified livestream link', async () => {
    render(<MemoryRouter initialEntries={['/live']}><App/></MemoryRouter>);
    expect(await screen.findByText(/No platform URL is displayed until/i)).toBeInTheDocument();
  });
});

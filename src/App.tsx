import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import LoginPage from './features/auth/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ApprovalsPage from './pages/app/ApprovalsPage';
import AIPage from './pages/app/AIPage';
import AnalyticsPage from './pages/app/AnalyticsPage';
import CalendarPage from './pages/app/CalendarPage';
import CapCutPage from './pages/app/CapCutPage';
import CommunityAppPage from './pages/app/CommunityAppPage';
import DashboardPage from './pages/app/DashboardPage';
import DistributionPage from './pages/app/DistributionPage';
import EpisodesAppPage from './pages/app/EpisodesAppPage';
import ExecutivePage from './pages/app/ExecutivePage';
import GuestsAppPage from './pages/app/GuestsAppPage';
import LeadsPage from './pages/app/LeadsPage';
import LiveAppPage from './pages/app/LivePage';
import MediaPage from './pages/app/MediaPage';
import ReviewPage from './pages/app/ReviewPage';
import RightsPage from './pages/app/RightsPage';
import SettingsPage from './pages/app/SettingsPage';
import TasksPage from './pages/app/TasksPage';
import YouTubePage from './pages/app/YouTubePage';
import AboutPage from './pages/public/AboutPage';
import AccessibilityPage from './pages/public/AccessibilityPage';
import ArticlesPage from './pages/public/ArticlesPage';
import BeAGuestPage from './pages/public/BeAGuestPage';
import ClipsPage from './pages/public/ClipsPage';
import CommunityGuidelinesPage from './pages/public/CommunityGuidelinesPage';
import CommunityPage from './pages/public/CommunityPage';
import EpisodePage from './pages/public/EpisodePage';
import EpisodesPage from './pages/public/EpisodesPage';
import GuestPage from './pages/public/GuestPage';
import GuestsPage from './pages/public/GuestsPage';
import HomePage from './pages/public/HomePage';
import LivePage from './pages/public/LivePage';
import NewsletterPage from './pages/public/NewsletterPage';
import PartnersPage from './pages/public/PartnersPage';
import PrivacyPage from './pages/public/PrivacyPage';
import SubmitYourStoryPage from './pages/public/SubmitYourStoryPage';
import SuggestAGuestPage from './pages/public/SuggestAGuestPage';
import TermsPage from './pages/public/TermsPage';
import WorkWithUsPage from './pages/public/WorkWithUsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/live" element={<LivePage />} />
        <Route path="/episodes" element={<EpisodesPage />} />
        <Route path="/episodes/:slug" element={<EpisodePage />} />
        <Route path="/clips" element={<ClipsPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/guests/:slug" element={<GuestPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/submit-your-story" element={<SubmitYourStoryPage />} />
        <Route path="/be-a-guest" element={<BeAGuestPage />} />
        <Route path="/suggest-a-guest" element={<SuggestAGuestPage />} />
        <Route path="/work-with-us" element={<WorkWithUsPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/app/executive" element={<ExecutivePage />} />
          <Route path="/app/episodes" element={<EpisodesAppPage />} />
          <Route path="/app/calendar" element={<CalendarPage />} />
          <Route path="/app/guests" element={<GuestsAppPage />} />
          <Route path="/app/live" element={<LiveAppPage />} />
          <Route path="/app/media" element={<MediaPage />} />
          <Route path="/app/review" element={<ReviewPage />} />
          <Route path="/app/capcut" element={<CapCutPage />} />
          <Route path="/app/distribution" element={<DistributionPage />} />
          <Route path="/app/youtube" element={<YouTubePage />} />
          <Route path="/app/community" element={<CommunityAppPage />} />
          <Route path="/app/leads" element={<LeadsPage />} />
          <Route path="/app/analytics" element={<AnalyticsPage />} />
          <Route path="/app/rights" element={<RightsPage />} />
          <Route path="/app/tasks" element={<TasksPage />} />
          <Route path="/app/approvals" element={<ApprovalsPage />} />
          <Route path="/app/ai" element={<AIPage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

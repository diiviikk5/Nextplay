import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Target, Star, Menu, X, Trophy, Crown, Calendar as CalendarIcon, Tag, Monitor, Scale, Swords, Code, BookOpen, Flame } from 'lucide-react';
import Home from './pages/Home';
import GameDetails from './pages/GameDetails';
import Watchlist from './pages/Watchlist';
import CategoryPage from './pages/CategoryPage';
import MyTop5 from './pages/MyTop5';
import TierList from './pages/TierList';
import Calendar from './pages/Calendar';
import GenrePage from './pages/GenrePage';
import PlatformPage from './pages/PlatformPage';
import CompareGames from './pages/CompareGames';
import GameBracket from './pages/GameBracket';
import EmbedWidget from './pages/EmbedWidget';
// Policy & Legal Pages (Required for AdSense)
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
// Blog System
import { BlogLanding, BlogArticle } from './pages/Blog';
// News Section
import { NewsLanding, NewsArticle } from './pages/News';
// New Programmatic & Viral Engines
import GamesLikePage from './pages/GamesLikePage';
import SystemRequirementsPage from './pages/SystemRequirementsPage';
import PlatformGenreMatrixPage from './pages/PlatformGenreMatrixPage';
import CompanyPage from './pages/CompanyPage';
import CanIRunIt from './pages/CanIRunIt';
import GameFinder from './pages/GameFinder';
import HypeBattles from './pages/HypeBattles';
import TrendsHub from './pages/TrendsHub';
import TrendTopicPage from './pages/TrendTopicPage';
import TrendingTicker from './components/TrendingTicker';
import gamesData from './data/games.json';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(10, 14, 23, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 'env(safe-area-inset-top, 0px)'
          }}
          className="sticky-header"
        >
          <div className="container" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* UNIQUE LOGO - NextPlay */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                }}
              >
                <Target color="#0a0e17" size={26} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>
                  NEXT<span style={{ color: '#06b6d4' }}>PLAY</span>
                </span>
                <div style={{ fontSize: '0.6rem', color: '#f97316', fontWeight: 600, letterSpacing: '0.2em' }}>2026 TRACKER</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="hidden md:flex">
              <Link to="/" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Games
              </Link>
              <Link to="/trends" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f59e0b', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Flame size={13} /> Trends
              </Link>
              <Link to="/news" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f97316', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                News
              </Link>
              <Link to="/tier-list" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Crown size={13} /> Tier List
              </Link>
              <Link to="/calendar" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CalendarIcon size={13} /> Calendar
              </Link>
              <Link to="/genre" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Genres
              </Link>
              <Link to="/compare" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Scale size={13} /> Compare
              </Link>
              <Link to="/battles" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Swords size={13} /> Battles
              </Link>
              <Link to="/can-i-run-it" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#06b6d4', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Monitor size={13} /> Can I Run It
              </Link>
              <Link
                to="/watchlist"
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
              >
                <Star size={14} fill="currentColor" />
                Watchlist
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              style={{
                padding: '0.75rem',
                color: '#cbd5e1',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                minWidth: '48px',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden"
              style={{
                padding: '1rem 1.5rem',
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'rgba(10, 14, 23, 0.98)'
              }}
            >
              <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                All Games
              </Link>
              <Link to="/trends" onClick={() => setIsMenuOpen(false)} style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', minHeight: '48px' }}>
                🔥 Trending Topics (1,000+ Hub)
              </Link>
              <Link to="/news" onClick={() => setIsMenuOpen(false)} style={{ color: '#f97316', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', minHeight: '48px' }}>
                News
              </Link>
              <Link to="/can-i-run-it" onClick={() => setIsMenuOpen(false)} style={{ color: '#06b6d4', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', minHeight: '48px' }}>
                Can I Run It? (PC Specs)
              </Link>
              <Link to="/battles" onClick={() => setIsMenuOpen(false)} style={{ color: '#ef4444', textDecoration: 'none', fontSize: '1rem', fontWeight: 600, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', minHeight: '48px' }}>
                Hype Battles
              </Link>
              <Link to="/game-finder" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                Game Finder Quiz
              </Link>
              <Link to="/tier-list" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                Tier List
              </Link>
              <Link to="/calendar" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                Calendar
              </Link>
              <Link to="/compare" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                Compare Games
              </Link>
              <Link to="/my-top-5" onClick={() => setIsMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '1rem', fontWeight: 500, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', minHeight: '48px' }}>
                My Top 5
              </Link>
              <Link to="/watchlist" onClick={() => setIsMenuOpen(false)} style={{ color: '#06b6d4', textDecoration: 'none', fontSize: '1rem', fontWeight: 700, padding: '0.875rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', minHeight: '48px' }}>
                Watchlist
              </Link>
            </div>
          )}
        </header>

        {/* Global Trending Velocity Ticker */}
        <TrendingTicker />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trends" element={<TrendsHub />} />
            <Route path="/trends/:slug" element={<TrendTopicPage />} />
            <Route path="/game/:slug" element={<GameDetails />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/my-top-5" element={<MyTop5 />} />
            <Route path="/tier-list" element={<TierList />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/calendar/:month" element={<Calendar />} />
            <Route path="/genre" element={<GenrePage />} />
            <Route path="/genre/:slug" element={<GenrePage />} />
            <Route path="/platform" element={<PlatformPage />} />
            <Route path="/platform/:slug" element={<PlatformPage />} />
            <Route path="/compare" element={<CompareGames />} />
            <Route path="/compare/:comparison" element={<CompareGames />} />
            <Route path="/games-like" element={<GamesLikePage />} />
            <Route path="/games-like/:slug" element={<GamesLikePage />} />
            <Route path="/system-requirements" element={<SystemRequirementsPage />} />
            <Route path="/system-requirements/:slug" element={<SystemRequirementsPage />} />
            <Route path="/games/:platform/:genre" element={<PlatformGenreMatrixPage />} />
            <Route path="/developer" element={<CompanyPage type="developer" />} />
            <Route path="/developer/:slug" element={<CompanyPage type="developer" />} />
            <Route path="/publisher" element={<CompanyPage type="publisher" />} />
            <Route path="/publisher/:slug" element={<CompanyPage type="publisher" />} />
            <Route path="/can-i-run-it" element={<CanIRunIt />} />
            <Route path="/game-finder" element={<GameFinder />} />
            <Route path="/battles" element={<HypeBattles />} />
            <Route path="/bracket" element={<GameBracket />} />
            <Route path="/embed" element={<EmbedWidget />} />
            <Route path="/upcoming-:category-games-2026" element={<CategoryPage />} />
            {/* Policy & Legal Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            {/* Blog */}
            <Route path="/blog" element={<BlogLanding />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            {/* News */}
            <Route path="/news" element={<NewsLanding />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer
          style={{
            marginTop: '4rem',
            padding: '3rem 0 2rem',
            paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))',
            background: 'rgba(10, 14, 23, 0.95)',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', marginBottom: '2rem' }}>
              <div style={{ flex: '1 1 280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Target size={24} color="#06b6d4" />
                  <span className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.08em' }}>NEXTPLAY</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  Track every major 2026 game release. Create tier lists, compare games, and build your watchlist.
                </p>
              </div>
              <div>
                <h4 className="font-heading" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em' }}>FEATURES</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/trends" style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>🔥 Gaming Trends (1,000+)</Link>
                  <Link to="/tier-list" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Tier List Creator</Link>
                  <Link to="/calendar" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Release Calendar</Link>
                  <Link to="/compare" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Compare Games</Link>
                  <Link to="/can-i-run-it" style={{ color: '#06b6d4', fontSize: '0.875rem', textDecoration: 'none' }}>Can I Run It (Specs)</Link>
                  <Link to="/battles" style={{ color: '#ef4444', fontSize: '0.875rem', textDecoration: 'none' }}>Hype Battles</Link>
                  <Link to="/game-finder" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Game Matchmaker</Link>
                  <Link to="/games-like" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Similar Games</Link>
                  <Link to="/my-top-5" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>My Top 5</Link>
                </div>
              </div>
              <div>
                <h4 className="font-heading" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em' }}>BROWSE</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>All Games</Link>
                  <Link to="/trends" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Search Trends & Topics</Link>
                  <Link to="/genre" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>By Genre</Link>
                  <Link to="/platform" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>By Platform</Link>
                  <Link to="/developer" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Game Studios</Link>
                  <Link to="/system-requirements" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>PC Requirements</Link>
                  <Link to="/watchlist" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Watchlist</Link>
                </div>
              </div>
              <div>
                <h4 className="font-heading" style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', letterSpacing: '0.1em' }}>COMPANY</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link to="/about" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>About Us</Link>
                  <Link to="/news" style={{ color: '#f97316', fontSize: '0.875rem', textDecoration: 'none' }}>News</Link>
                  <Link to="/blog" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Blog</Link>
                  <Link to="/contact" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Contact</Link>
                </div>
              </div>
            </div>
            {/* Legal Links Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Link to="/privacy" style={{ color: '#64748b', fontSize: '0.75rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#64748b', fontSize: '0.75rem', textDecoration: 'none' }}>Terms of Service</Link>
              <Link to="/disclaimer" style={{ color: '#64748b', fontSize: '0.75rem', textDecoration: 'none' }}>Disclaimer</Link>
              <Link to="/contact" style={{ color: '#64748b', fontSize: '0.75rem', textDecoration: 'none' }}>Contact</Link>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', textAlign: 'center', color: '#475569', fontSize: '0.75rem' }}>
              © {new Date().getFullYear()} NextPlay. Powered by IGDB. All game artwork belongs to their respective owners.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';
import {
  WelcomeSlide,
  WatchTimeSlide,
  TopGenresSlide,
  TopStudiosSlide,
  TopAnimeSlide,
  ActivitySlide,
  SummarySlide,
} from './components/WrappedSlides';
import {
  CompletionRateSlide,
  ScoreDistributionSlide,
  FormatsSlide,
  VoiceActorsSlide,
  StatsOverviewSlide,
  TopMangaSlide,
  GrandFinaleSlide,
} from './components/NewSlides';
import { initiateLogin, exchangeCodeForToken, getStoredToken, clearToken } from './services/auth';
import { fetchUserData, UserStats } from './services/anilist';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSharedView, setIsSharedView] = useState(false);
  const isExchangingRef = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      // Check if we're loading shared stats from URL hash
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        try {
          const encodedData = hash.substring(7);
          const decodedData = atob(encodedData);
          const sharedStats = JSON.parse(decodedData);
          setStats(sharedStats);
          setIsSharedView(true);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Failed to load shared stats:', err);
          setError('Invalid share link');
          setLoading(false);
          return;
        }
      }

      // Check if we're returning from OAuth
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      console.log('Current URL:', window.location.href);
      console.log('Auth code:', code);
      console.log('Auth error:', error);

      if (error) {
        setError(`OAuth error: ${error} - ${params.get('error_description')}`);
        setLoading(false);
        return;
      }

      if (code) {
        // Prevent duplicate exchanges (React StrictMode runs effects twice)
        if (isExchangingRef.current) {
          console.log('Already exchanging code, skipping...');
          return;
        }

        isExchangingRef.current = true;

        try {
          console.log('Exchanging code for token...');
          const accessToken = await exchangeCodeForToken(code);
          console.log('Token received successfully');
          setToken(accessToken);
          // Clean up URL
          window.history.replaceState({}, document.title, '/');
        } catch (err: any) {
          console.error('Auth error:', err);
          setError(err.message || 'Failed to authenticate');
          setLoading(false);
          isExchangingRef.current = false;
        }
      } else {
        // Check for stored token
        const storedToken = getStoredToken();
        if (storedToken) {
          setToken(storedToken);
        } else {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (token && !stats) {
      const loadData = async () => {
        try {
          setLoading(true);
          const userData = await fetchUserData(token);
          setStats(userData);
        } catch (err) {
          setError('Failed to load data. Please try logging in again.');
          clearToken();
          setToken(null);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [token, stats]);

  const slides = [
    WelcomeSlide,
    WatchTimeSlide,
    CompletionRateSlide,
    TopGenresSlide,
    TopStudiosSlide,
    FormatsSlide,
    TopAnimeSlide,
    TopMangaSlide,
    ScoreDistributionSlide,
    VoiceActorsSlide,
    StatsOverviewSlide,
    ActivitySlide,
    SummarySlide,
    GrandFinaleSlide,
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => prev < slides.length - 1 ? prev + 1 : prev);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!stats) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stats, nextSlide, prevSlide]);

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setStats(null);
    setCurrentSlide(0);
    setIsSharedView(false);
    window.location.hash = '';
  };

  const handleShare = () => {
    if (!stats) return;

    try {
      // Encode stats to base64
      const jsonString = JSON.stringify(stats);
      const encoded = btoa(jsonString);
      const shareUrl = `${window.location.origin}/#share=${encoded}`;

      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard! 🎉');
      }).catch(() => {
        // Fallback: show URL in prompt
        prompt('Copy this share link:', shareUrl);
      });
    } catch (err) {
      console.error('Share failed:', err);
      alert('Failed to generate share link');
    }
  };

  if (loading) {
    return (
      <div className="App loading-screen">
        <div className="spinner"></div>
        <p>Loading your 2025 wrapped...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App error-screen">
        <h1>Oops!</h1>
        <p>{error}</p>
        <button onClick={initiateLogin} className="login-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="App login-screen">
        <div className="login-content">
          <h1>AniList Wrapped 2025</h1>
          <p>See your year in anime</p>
          <button onClick={initiateLogin} className="login-button">
            Login with AniList
          </button>
        </div>
      </div>
    );
  }

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="App">
      <CurrentSlideComponent stats={stats} />

      <div className="navigation">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="nav-button"
        >
          ← Previous
        </button>

        <div className="slide-indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="nav-button"
        >
          Next →
        </button>
      </div>

      <div className="top-buttons">
        {!isSharedView && (
          <button onClick={handleShare} className="share-button">
            📤 Share
          </button>
        )}
        {!isSharedView ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <button onClick={() => window.location.href = '/'} className="logout-button">
            Create Your Own
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

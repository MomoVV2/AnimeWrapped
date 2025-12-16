import React from 'react';
import { UserStats } from '../services/anilist';
import './WrappedSlides.css';

interface SlideProps {
  stats: UserStats;
}

export const WelcomeSlide: React.FC<SlideProps> = ({ stats }) => (
  <div className="slide welcome-slide">
    <img src={stats.avatar} alt={stats.userName} className="user-avatar" />
    <h1>Hey {stats.userName}!</h1>
    <h2>Your 2025 AniList Wrapped is ready</h2>
    <p className="subtitle">Let's see what you watched this year</p>
  </div>
);

export const WatchTimeSlide: React.FC<SlideProps> = ({ stats }) => {
  const hours = Math.floor(stats.totalMinutes / 60);
  const days = Math.floor(hours / 24);

  return (
    <div className="slide watch-time-slide">
      <h1>You watched</h1>
      <div className="big-number">{stats.totalEpisodes}</div>
      <h2>episodes in 2025</h2>
      <div className="sub-stats">
        <div className="stat-item">
          <div className="stat-value">{hours.toLocaleString()}</div>
          <div className="stat-label">hours</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{days}</div>
          <div className="stat-label">days</div>
        </div>
      </div>
      <p className="fun-fact">
        That's {stats.totalAnime} different anime!
      </p>
    </div>
  );
};

export const TopGenresSlide: React.FC<SlideProps> = ({ stats }) => (
  <div className="slide genres-slide">
    <h1>Your Top Genres</h1>
    <div className="genre-list">
      {stats.topGenres.slice(0, 5).map((genre, index) => (
        <div key={genre.genre} className="genre-item">
          <span className="genre-rank">#{index + 1}</span>
          <span className="genre-name">{genre.genre}</span>
          <span className="genre-count">{genre.count} anime</span>
        </div>
      ))}
    </div>
  </div>
);

export const TopStudiosSlide: React.FC<SlideProps> = ({ stats }) => (
  <div className="slide studios-slide">
    <h1>Favorite Studios</h1>
    <div className="studio-list">
      {stats.topStudios.slice(0, 5).map((studio, index) => (
        <div key={studio.studio} className="studio-item">
          <span className="studio-rank">#{index + 1}</span>
          <span className="studio-name">{studio.studio}</span>
          <span className="studio-count">{studio.count} anime</span>
        </div>
      ))}
    </div>
  </div>
);

export const TopAnimeSlide: React.FC<SlideProps> = ({ stats }) => {
  const [showAll, setShowAll] = React.useState(false);
  const displayCount = showAll ? stats.topAnime.length : 3;

  return (
    <div className="slide top-anime-slide">
      <h1>Your Top Rated Anime</h1>
      <p className="subtitle">Your highest scored anime in 2025</p>
      {stats.topAnime.length > 0 ? (
        <>
          <div className="top-anime-grid">
            {stats.topAnime.slice(0, displayCount).map((anime, index) => (
              <div key={anime.title} className="anime-card">
                <div className="anime-rank">#{index + 1}</div>
                <img src={anime.coverImage} alt={anime.title} />
                <div className="anime-info">
                  <h3>{anime.title}</h3>
                  <div className="anime-score">⭐ {anime.score}/10</div>
                </div>
              </div>
            ))}
          </div>
          {stats.topAnime.length > 3 && (
            <button className="see-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : `See All ${stats.topAnime.length} →`}
            </button>
          )}
        </>
      ) : (
        <p>No rated anime yet!</p>
      )}
    </div>
  );
};

export const ActivitySlide: React.FC<SlideProps> = ({ stats }) => {
  const maxCount = Math.max(...stats.activityByMonth.map(m => m.count), 1);
  const busiestMonth = stats.activityByMonth.reduce((max, month) =>
    month.count > max.count ? month : max
  );

  return (
    <div className="slide activity-slide">
      <h1>Your Activity</h1>
      <p className="activity-subtitle">Anime completed each month</p>
      <div className="activity-chart">
        {stats.activityByMonth.map((month) => (
          <div key={month.month} className="month-bar">
            <div
              className="bar"
              style={{ height: `${(month.count / maxCount) * 200}px` }}
            >
              <span className="bar-value">{month.count}</span>
            </div>
            <div className="month-label">{month.month}</div>
          </div>
        ))}
      </div>
      <p className="fun-fact">
        Your busiest month was <strong>{busiestMonth.month}</strong> with {busiestMonth.count} anime!
      </p>
    </div>
  );
};

export const SummarySlide: React.FC<SlideProps> = ({ stats }) => {
  const hours = Math.floor(stats.totalMinutes / 60);

  return (
    <div className="slide summary-slide">
      <h1>2025 Wrapped Summary</h1>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-value">{stats.totalAnime}</div>
          <div className="summary-label">Anime Watched</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{stats.totalEpisodes}</div>
          <div className="summary-label">Episodes</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{hours.toLocaleString()}</div>
          <div className="summary-label">Hours</div>
        </div>
        <div className="summary-item">
          <div className="summary-value">{stats.meanScore.toFixed(1)}</div>
          <div className="summary-label">Avg Score</div>
        </div>
      </div>
      <p className="thank-you">Thanks for using AniList in 2025! 🎉</p>
    </div>
  );
};

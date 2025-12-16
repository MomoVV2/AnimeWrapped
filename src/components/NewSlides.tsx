import React from 'react';
import { UserStats } from '../services/anilist';
import './WrappedSlides.css';

interface SlideProps {
  stats: UserStats;
}

export const CompletionRateSlide: React.FC<SlideProps> = ({ stats }) => (
  <div className="slide completion-slide">
    <h1>Your Commitment</h1>
    <div className="big-number">{stats.completionRate}%</div>
    <h2>completion rate</h2>
    <div className="completion-stats">
      <div className="completion-stat">
        <span className="stat-icon">✅</span>
        <span className="stat-value">{stats.animeCompleted}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="completion-stat">
        <span className="stat-icon">▶️</span>
        <span className="stat-value">{stats.animeStarted}</span>
        <span className="stat-label">Started</span>
      </div>
      <div className="completion-stat">
        <span className="stat-icon">❌</span>
        <span className="stat-value">{stats.animeDropped}</span>
        <span className="stat-label">Dropped</span>
      </div>
    </div>
  </div>
);

export const ScoreDistributionSlide: React.FC<SlideProps> = ({ stats }) => {
  const maxCount = Math.max(...stats.scoreDistribution.map(s => s.count), 1);

  return (
    <div className="slide score-dist-slide">
      <h1>Your Rating Pattern</h1>
      <p className="subtitle">Average Score: {stats.meanScore}/10</p>
      <div className="score-chart">
        {stats.scoreDistribution.map((item) => (
          <div key={item.score} className="score-bar-container">
            <div className="score-label">{item.score}</div>
            <div
              className="score-bar"
              style={{ height: `${(item.count / maxCount) * 150}px` }}
            >
              <span className="score-count">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="fun-fact">
        You rated {stats.scoreDistribution.reduce((sum, s) => sum + s.count, 0)} anime in 2025
      </p>
    </div>
  );
};

export const FormatsSlide: React.FC<SlideProps> = ({ stats }) => (
  <div className="slide formats-slide">
    <h1>Your Favorite Format</h1>
    <div className="format-spotlight">{stats.favouriteFormat}</div>
    <div className="format-list">
      {stats.formatDistribution.slice(0, 5).map((format) => (
        <div key={format.format} className="format-item">
          <span className="format-name">{format.format}</span>
          <span className="format-count">{format.count}</span>
        </div>
      ))}
    </div>
  </div>
);

export const VoiceActorsSlide: React.FC<SlideProps> = ({ stats }) => {
  const [showAll, setShowAll] = React.useState(false);
  const displayCount = showAll ? stats.topVoiceActors.length : 5;

  return (
    <div className="slide va-slide">
      <h1>Voice Actors You Heard Most</h1>
      <p className="subtitle">Japanese voice actors from your 2025 anime</p>
      {stats.topVoiceActors.length > 0 ? (
        <>
          <div className="va-list">
            {stats.topVoiceActors.slice(0, displayCount).map((va, index) => (
              <div key={va.name} className="va-item">
                <span className="va-rank">#{index + 1}</span>
                <span className="va-name">{va.name}</span>
                <span className="va-count">{va.count} characters</span>
              </div>
            ))}
          </div>
          {stats.topVoiceActors.length > 5 && (
            <button className="see-more-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : `See All ${stats.topVoiceActors.length} →`}
            </button>
          )}
        </>
      ) : (
        <p>Voice actor data not available for your 2024 anime</p>
      )}
    </div>
  );
};

export const StatsOverviewSlide: React.FC<SlideProps> = ({ stats }) => {
  const hours = Math.floor(stats.totalMinutes / 60);

  return (
    <div className="slide stats-overview-slide">
      <h1>More Numbers</h1>
      <div className="stats-grid-4">
        <div className="stat-card">
          <div className="stat-emoji">📊</div>
          <div className="stat-number">{stats.averageEpisodesPerDay}</div>
          <div className="stat-text">episodes/day</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">🏆</div>
          <div className="stat-number">{stats.completionRate}%</div>
          <div className="stat-text">completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">⏰</div>
          <div className="stat-number">{hours.toLocaleString()}</div>
          <div className="stat-text">hours watched</div>
        </div>
        <div className="stat-card">
          <div className="stat-emoji">📅</div>
          <div className="stat-number">{stats.totalDays}</div>
          <div className="stat-text">days worth</div>
        </div>
      </div>
      <p className="fun-fact">
        Your most productive month was <strong>{stats.mostProductiveMonth}</strong>
      </p>
    </div>
  );
};

export const GrandFinaleSlide: React.FC<SlideProps> = ({ stats }) => {
  const hours = Math.floor(stats.totalMinutes / 60);

  return (
    <div className="slide grand-finale-slide">
      <h1>{stats.userName}'s 2025 Anime Year</h1>
      <img src={stats.avatar} alt={stats.userName} className="finale-avatar" />

      <div className="finale-grid">
        <div className="finale-section">
          <h2>📺 Watch Stats</h2>
          <div className="finale-stat">{stats.totalAnime} anime</div>
          <div className="finale-stat">{stats.totalEpisodes} episodes</div>
          <div className="finale-stat">{hours.toLocaleString()} hours</div>
          <div className="finale-stat">{stats.totalDays} days worth</div>
        </div>

        <div className="finale-section">
          <h2>⭐ Your Ratings</h2>
          <div className="finale-stat">Avg: {stats.meanScore}/10</div>
          <div className="finale-stat">{stats.completionRate}% completion</div>
          <div className="finale-stat">{stats.animeCompleted} completed</div>
        </div>

        <div className="finale-section">
          <h2>🎨 Top Genres</h2>
          {stats.topGenres.slice(0, 3).map(g => (
            <div key={g.genre} className="finale-stat-small">{g.genre}</div>
          ))}
        </div>

        <div className="finale-section">
          <h2>🏢 Top Studios</h2>
          {stats.topStudios.slice(0, 3).map(s => (
            <div key={s.studio} className="finale-stat-small">{s.studio}</div>
          ))}
        </div>

        <div className="finale-section">
          <h2>📊 Format</h2>
          <div className="finale-stat">{stats.favouriteFormat}</div>
        </div>

        <div className="finale-section">
          <h2>📅 Most Active</h2>
          <div className="finale-stat">{stats.mostProductiveMonth}</div>
        </div>
      </div>

      <div className="finale-message">
        <p>You watched <strong>{stats.totalEpisodes} episodes</strong> across <strong>{stats.totalAnime} anime</strong></p>
        <p>That's <strong>{stats.averageEpisodesPerDay} episodes per day</strong> on average!</p>
        <p className="finale-thanks">Thanks for another amazing year of anime! 🎉</p>
      </div>

      <div className="share-prompt">Share your 2025 wrapped! #AniListWrapped2025</div>
    </div>
  );
};

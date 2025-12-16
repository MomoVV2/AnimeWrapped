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
  const displayCount = showAll ? stats.topVoiceActors.length : 10;
  const maxCount = stats.topVoiceActors.length > 0 ? stats.topVoiceActors[0].count : 1;

  return (
    <div className="slide va-slide">
      <h1>🎤 Voice Actors You Heard Most</h1>
      <p className="subtitle">Japanese voice actors from your 2025 anime</p>
      {stats.topVoiceActors.length > 0 ? (
        <>
          <div className="va-list-animated">
            {stats.topVoiceActors.slice(0, displayCount).map((va, index) => (
              <div
                key={va.name}
                className="va-item-animated"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="va-left">
                  <span className="va-rank-medal">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                  <span className="va-name-styled">{va.name}</span>
                </div>
                <div className="va-right">
                  <div className="va-bar-container">
                    <div
                      className="va-bar"
                      style={{
                        width: `${(va.count / maxCount) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  </div>
                  <span className="va-count-badge">{va.count}</span>
                </div>
              </div>
            ))}
          </div>
          {stats.topVoiceActors.length > 10 && (
            <button className="see-more-btn-modern" onClick={() => setShowAll(!showAll)}>
              {showAll ? '← Show Less' : `See All ${stats.topVoiceActors.length} →`}
            </button>
          )}
        </>
      ) : (
        <div className="no-data-message">
          <p>🎭 Voice actor data not available</p>
          <p className="no-data-subtitle">Try adding more anime to your 2025 list!</p>
        </div>
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
    <div className="slide grand-finale-slide-new">
      <div className="finale-header-new">
        <img src={stats.avatar} alt={stats.userName} className="finale-avatar-new" />
        <h1 className="finale-title-new">{stats.userName}'s 2025</h1>
        <p className="finale-subtitle-new">Anime Year in Review</p>
      </div>

      <div className="finale-stats-mega-grid">
        {/* Main Big Stats */}
        <div className="finale-card-hero">
          <div className="hero-stat-row">
            <div className="hero-stat">
              <div className="hero-number">{stats.totalEpisodes}</div>
              <div className="hero-label">Episodes Watched</div>
            </div>
            <div className="hero-stat">
              <div className="hero-number">{stats.totalAnime}</div>
              <div className="hero-label">Anime Watched</div>
            </div>
          </div>
          <div className="hero-stat-row">
            <div className="hero-stat">
              <div className="hero-number">{hours.toLocaleString()}</div>
              <div className="hero-label">Hours Invested</div>
            </div>
            <div className="hero-stat">
              <div className="hero-number">{stats.averageEpisodesPerDay}</div>
              <div className="hero-label">Episodes/Day</div>
            </div>
          </div>
        </div>

        {/* Completion Stats */}
        <div className="finale-card-compact">
          <h3 className="card-title">📊 Completion Stats</h3>
          <div className="finale-mini-stats">
            <div className="mini-stat"><span className="mini-label">Completion Rate:</span> <span className="mini-value">{stats.completionRate}%</span></div>
            <div className="mini-stat"><span className="mini-label">Completed:</span> <span className="mini-value">{stats.animeCompleted}</span></div>
            <div className="mini-stat"><span className="mini-label">Started:</span> <span className="mini-value">{stats.animeStarted}</span></div>
            <div className="mini-stat"><span className="mini-label">Dropped:</span> <span className="mini-value">{stats.animeDropped}</span></div>
          </div>
        </div>

        {/* Rating Stats */}
        <div className="finale-card-compact">
          <h3 className="card-title">⭐ Your Ratings</h3>
          <div className="finale-mini-stats">
            <div className="mini-stat"><span className="mini-label">Average Score:</span> <span className="mini-value">{stats.meanScore}/10</span></div>
            <div className="mini-stat"><span className="mini-label">Rated Anime:</span> <span className="mini-value">{stats.scoreDistribution.reduce((sum, s) => sum + s.count, 0)}</span></div>
          </div>
        </div>

        {/* Top Genres */}
        <div className="finale-card-list">
          <h3 className="card-title">🎨 Top Genres</h3>
          <div className="finale-list-items">
            {stats.topGenres.slice(0, 5).map((g, i) => (
              <div key={g.genre} className="finale-list-item">
                <span className="list-rank">#{i + 1}</span>
                <span className="list-name">{g.genre}</span>
                <span className="list-count">{g.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Studios */}
        <div className="finale-card-list">
          <h3 className="card-title">🏢 Top Studios</h3>
          <div className="finale-list-items">
            {stats.topStudios.slice(0, 5).map((s, i) => (
              <div key={s.studio} className="finale-list-item">
                <span className="list-rank">#{i + 1}</span>
                <span className="list-name">{s.studio}</span>
                <span className="list-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Format & Activity */}
        <div className="finale-card-compact">
          <h3 className="card-title">📅 Activity</h3>
          <div className="finale-mini-stats">
            <div className="mini-stat"><span className="mini-label">Favorite Format:</span> <span className="mini-value">{stats.favouriteFormat}</span></div>
            <div className="mini-stat"><span className="mini-label">Most Active Month:</span> <span className="mini-value">{stats.mostProductiveMonth}</span></div>
          </div>
        </div>
      </div>

      <div className="finale-message-new">
        <p className="finale-highlight">🎉 That's {stats.totalDays} days worth of anime!</p>
        <p className="finale-tagline">Thanks for another amazing year! See you in 2026! ✨</p>
      </div>

      <div className="finale-footer">
        <div className="share-prompt-new">#AniListWrapped2025 🎬</div>
        <a
          href="https://x.com/knownasmomo"
          target="_blank"
          rel="noopener noreferrer"
          className="creator-credit"
        >
          Made by KnownAsMomo 💜
        </a>
      </div>
    </div>
  );
};

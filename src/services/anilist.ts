const ANILIST_API = 'https://graphql.anilist.co';

export interface UserStats {
  userId: number;
  userName: string;
  avatar: string;
  totalAnime: number;
  totalEpisodes: number;
  totalMinutes: number;
  totalManga: number;
  totalChapters: number;
  meanScore: number;
  topGenres: Array<{ genre: string; count: number; minutes: number }>;
  topStudios: Array<{ studio: string; count: number }>;
  formatDistribution: Array<{ format: string; count: number }>;
  activityByMonth: Array<{ month: string; count: number }>;
  topAnime: Array<{ title: string; coverImage: string; score: number; episodes: number }>;
  completionRate: number;
  longestStreak: number;
  averageEpisodesPerDay: number;
  topVoiceActors: Array<{ name: string; count: number }>;
  scoreDistribution: Array<{ score: number; count: number }>;
  dayVsNight: { day: number; night: number };
  busiestDay: string;
  mostProductiveMonth: string;
  favouriteFormat: string;
  totalDays: number;
  animeStarted: number;
  animeCompleted: number;
  animeDropped: number;
}

const graphqlQuery = async (query: string, variables: any, token: string) => {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
};

export const fetchUserData = async (token: string): Promise<UserStats> => {
  // First, get user info
  const userQuery = `
    query {
      Viewer {
        id
        name
        avatar {
          large
        }
        statistics {
          anime {
            count
            episodesWatched
            minutesWatched
            meanScore
            statuses {
              status
              count
            }
            formats {
              format
              count
            }
            genres {
              genre
              count
              minutesWatched
            }
            studios {
              studio {
                name
              }
              count
            }
          }
          manga {
            count
            chaptersRead
            meanScore
          }
        }
      }
    }
  `;

  const userData = await graphqlQuery(userQuery, {}, token);
  const viewer = userData.Viewer;
  const animeStats = viewer.statistics.anime;
  const mangaStats = viewer.statistics.manga;

  // Get anime list for 2024 entries with more details
  const listQuery = `
    query ($userId: Int) {
      MediaListCollection(userId: $userId, type: ANIME) {
        lists {
          name
          status
          entries {
            status
            media {
              id
              title {
                romaji
              }
              coverImage {
                large
              }
              episodes
              format
              genres
              studios(isMain: true) {
                nodes {
                  name
                  isAnimationStudio
                }
              }
              characters(page: 1, perPage: 25) {
                edges {
                  role
                  voiceActors(language: JAPANESE) {
                    id
                    name {
                      full
                    }
                  }
                }
              }
            }
            score
            progress
            completedAt {
              year
              month
              day
            }
            startedAt {
              year
              month
              day
            }
            updatedAt
          }
        }
      }
    }
  `;

  const listData = await graphqlQuery(listQuery, { userId: viewer.id }, token);

  // Filter for 2025 data - ONLY entries completed or watched in 2025
  const allEntries = listData.MediaListCollection.lists.flatMap((list: any) => list.entries);
  const entries2025 = allEntries.filter((entry: any) =>
    (entry.completedAt?.year === 2025) ||
    (entry.startedAt?.year === 2025 && !entry.completedAt) ||
    (entry.updatedAt && new Date(entry.updatedAt * 1000).getFullYear() === 2025)
  );

  // Calculate 2025-specific stats
  const total2025Episodes = entries2025.reduce((sum: number, entry: any) => sum + entry.progress, 0);
  const estimatedMinutes2025 = total2025Episodes * 24; // Average 24 min per episode

  // Monthly activity
  const monthlyActivity = new Map<number, number>();
  entries2025.forEach((entry: any) => {
    const month = entry.completedAt?.month || entry.startedAt?.month;
    if (month) {
      monthlyActivity.set(month, (monthlyActivity.get(month) || 0) + 1);
    }
  });

  const activityByMonth = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i).toLocaleString('default', { month: 'short' }),
    count: monthlyActivity.get(i + 1) || 0,
  }));

  // Top anime by score - top 10
  const topAnime = entries2025
    .filter((e: any) => e.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10)
    .map((entry: any) => ({
      title: entry.media.title.romaji,
      coverImage: entry.media.coverImage.large,
      score: entry.score,
      episodes: entry.progress,
    }));

  // Status breakdown
  const completed2025 = entries2025.filter((e: any) => e.status === 'COMPLETED' || e.completedAt?.year === 2025).length;
  const started2025 = entries2025.filter((e: any) => e.startedAt?.year === 2025).length;
  const dropped2025 = entries2025.filter((e: any) => e.status === 'DROPPED' && e.startedAt?.year === 2025).length;
  const completionRate = started2025 > 0 ? Math.round((completed2025 / started2025) * 100) : 0;

  // Format distribution (2025 only)
  const formatCounts = new Map<string, number>();
  entries2025.forEach((entry: any) => {
    const format = entry.media.format || 'UNKNOWN';
    formatCounts.set(format, (formatCounts.get(format) || 0) + 1);
  });
  const favouriteFormat = Array.from(formatCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'TV';

  // Genre distribution (2025 only)
  const genreCounts = new Map<string, number>();
  entries2025.forEach((entry: any) => {
    entry.media.genres?.forEach((genre: string) => {
      genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
    });
  });
  const topGenres2025 = Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count, minutes: 0 }));

  // Studio distribution (2025 only) - ONLY animation studios, not producers
  const studioCounts = new Map<string, number>();
  entries2025.forEach((entry: any) => {
    entry.media.studios?.nodes
      ?.filter((studio: any) => studio.isAnimationStudio)
      ?.forEach((studio: any) => {
        studioCounts.set(studio.name, (studioCounts.get(studio.name) || 0) + 1);
      });
  });
  const topStudios2025 = Array.from(studioCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([studio, count]) => ({ studio, count }));

  // Voice actors (from 2025 anime) - get from characters, not staff
  const vaCount = new Map<string, number>();
  entries2025.forEach((entry: any) => {
    entry.media.characters?.edges?.forEach((charEdge: any) => {
      // Only count main/supporting characters
      if (charEdge.role === 'MAIN' || charEdge.role === 'SUPPORTING') {
        charEdge.voiceActors?.forEach((va: any) => {
          if (va && va.name) {
            vaCount.set(va.name.full, (vaCount.get(va.name.full) || 0) + 1);
          }
        });
      }
    });
  });
  const topVoiceActors = Array.from(vaCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Score distribution
  const scoreCount = new Map<number, number>();
  entries2025
    .filter((e: any) => e.score > 0)
    .forEach((entry: any) => {
      scoreCount.set(entry.score, (scoreCount.get(entry.score) || 0) + 1);
    });
  const scoreDistribution = Array.from(scoreCount.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([score, count]) => ({ score, count }));

  // Most productive month
  const mostProductiveMonth = activityByMonth.reduce((max, month) =>
    month.count > max.count ? month : max
  ).month;

  // Calculate days watched
  const totalDays = Math.round(estimatedMinutes2025 / (60 * 24));

  // Average episodes per day
  const averageEpisodesPerDay = total2025Episodes > 0 ?
    Number((total2025Episodes / 365).toFixed(1)) : 0;

  // Calculate average mean score for 2025 entries
  const scored2025 = entries2025.filter((e: any) => e.score > 0);
  const meanScore2025 = scored2025.length > 0 ?
    scored2025.reduce((sum: number, e: any) => sum + e.score, 0) / scored2025.length : 0;

  return {
    userId: viewer.id,
    userName: viewer.name,
    avatar: viewer.avatar.large,
    totalAnime: entries2025.length,
    totalEpisodes: total2025Episodes,
    totalMinutes: estimatedMinutes2025,
    totalManga: mangaStats.count,
    totalChapters: mangaStats.chaptersRead,
    meanScore: Number(meanScore2025.toFixed(1)),
    topGenres: topGenres2025,
    topStudios: topStudios2025,
    formatDistribution: Array.from(formatCounts.entries()).map(([format, count]) => ({ format, count })),
    activityByMonth,
    topAnime,
    completionRate,
    longestStreak: 0, // Would need more complex calculation
    averageEpisodesPerDay,
    topVoiceActors,
    scoreDistribution,
    dayVsNight: { day: 0, night: 0 }, // Would need timestamp data
    busiestDay: 'Saturday', // Would need more detailed data
    mostProductiveMonth,
    favouriteFormat,
    totalDays,
    animeStarted: started2025,
    animeCompleted: completed2025,
    animeDropped: dropped2025,
  };
};

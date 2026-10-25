export type GameCategory =
  | 'all'
  | 'snake'
  | 'battle-royale'
  | 'shooter'
  | 'territory'
  | 'survival'
  | 'strategy'
  | 'party'
  | 'builtin';

export interface GameControl {
  key: string;
  action: string;
}

export interface IOGame {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: GameCategory;
  tags: string[];
  rating: number; // e.g. 4.8
  votesCount: number;
  playersOnline: number;
  releaseYear: number;
  developer: string;
  embedUrl: string;
  officialUrl: string;
  isBuiltIn?: boolean;
  builtInType?: 'slither' | 'tank';
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  controls: GameControl[];
  accentColor: string;
  logoBg: string;
  logoIcon: string;
  accentGradient: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  gameId: string;
  country: string;
  avatar: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  gameId: string;
  goal: number;
  progress: number;
  rewardXp: number;
  completed: boolean;
}

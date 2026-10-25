import React, { useState, useMemo, useEffect } from 'react';
import { IO_GAMES } from './data/gamesData';
import { IOGame, GameCategory } from './types/game';
import { Header } from './components/Header';
import { HeroFeatured } from './components/HeroFeatured';
import { FilterBar, SortOption } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameModal } from './components/GameModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ArcadeLounge } from './components/ArcadeLounge';
import { Footer } from './components/Footer';
import { soundManager } from './utils/audio';
import {
  Zap,
  Flame,
  Gamepad2,
  Users,
  Shield,
  Sparkles,
  Search,
  RotateCcw,
  Trophy,
} from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popular');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeModalGame, setActiveModalGame] = useState<IOGame | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Favorites state persisted in localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('stabikid_favorites');
      return saved ? JSON.parse(saved) : ['slither-io', 'agar-io', 'diep-io', 'krunker-io'];
    } catch {
      return ['slither-io', 'agar-io', 'diep-io'];
    }
  });

  const toggleFavorite = (e?: React.MouseEvent, gameId?: string) => {
    if (e) e.stopPropagation();
    if (!gameId) return;

    setFavoriteIds((prev) => {
      const exists = prev.includes(gameId);
      const next = exists ? prev.filter((id) => id !== gameId) : [...prev, gameId];
      localStorage.setItem('stabikid_favorites', JSON.stringify(next));
      return next;
    });
  };

  const removeFavorite = (gameId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.filter((id) => id !== gameId);
      localStorage.setItem('stabikid_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Extract all unique popular tags across games
  const popularTags = useMemo(() => {
    const set = new Set<string>();
    IO_GAMES.forEach((g) => g.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, []);

  // Filter & Sort games
  const filteredGames = useMemo(() => {
    return IO_GAMES.filter((game) => {
      // Category filter
      if (selectedCategory === 'builtin' && !game.isBuiltIn) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'builtin' && game.category !== selectedCategory) {
        return false;
      }

      // Tag filter
      if (selectedTag && !game.tags.includes(selectedTag)) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesTagline = game.tagline.toLowerCase().includes(q);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = game.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTagline && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'popular':
          return b.playersOnline - a.playersOnline;
        case 'rating':
          return b.rating - a.rating;
        case 'trending':
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'newest':
          return b.releaseYear - a.releaseYear;
        default:
          return 0;
      }
    });
  }, [selectedCategory, selectedTag, searchQuery, selectedSort]);

  // Featured games for the top carousel
  const featuredGames = useMemo(() => {
    return IO_GAMES.filter((g) => g.isFeatured);
  }, []);

  // Favorite game objects
  const favoriteGames = useMemo(() => {
    return IO_GAMES.filter((g) => favoriteIds.includes(g.id));
  }, [favoriteIds]);

  // Random game picker
  const handleRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * IO_GAMES.length);
    const chosen = IO_GAMES[randomIndex];
    setActiveModalGame(chosen);
  };

  // URL query parameter support for direct sharing (e.g. ?game=slither-io)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameSlug = params.get('game');
    if (gameSlug) {
      const match = IO_GAMES.find((g) => g.slug === gameSlug || g.id === gameSlug);
      if (match) {
        setActiveModalGame(match);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectGame={(g) => setActiveModalGame(g)}
        allGames={IO_GAMES}
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onRandomGame={handleRandomGame}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Ticker / Quick Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-8 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>
              <strong className="text-white font-mono">32+</strong> Top .IO Games Playable Free
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Instant Built-in Arenas
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Unblocked & Secure
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" /> 350,000+ Daily Players
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory('builtin');
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Try Built-in Games</span>
          </button>
        </div>

        {/* Hero Featured Game Spotlight Carousel (shows when not actively searching) */}
        {!searchQuery && selectedCategory === 'all' && !selectedTag && (
          <HeroFeatured
            featuredGames={featuredGames}
            onPlayGame={(g) => setActiveModalGame(g)}
          />
        )}

        {/* Interactive Filter Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSelectedTag(null);
          }}
          selectedSort={selectedSort}
          onSelectSort={setSelectedSort}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          popularTags={popularTags}
          totalMatches={filteredGames.length}
        />

        {/* Built-in Instant Arenas Showcase Banner (if user clicks Built-in) */}
        {selectedCategory === 'builtin' && (
          <div className="p-6 mb-8 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                <Zap className="w-3.5 h-3.5 fill-current" /> Zero Lag • 60 FPS Canvas
              </div>
              <h2 className="text-2xl font-black text-white">Stabikidgames Native Arenas</h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Experience full real-time canvas games directly inside Stabikidgames.com without third-party iframe blocks or lag. Play right away!
              </p>
            </div>
          </div>
        )}

        {/* Game Cards Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favoriteIds.includes(game.id)}
                onToggleFavorite={(e) => toggleFavorite(e, game.id)}
                onPlayGame={(g) => setActiveModalGame(g)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No .IO games matched your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Try adjusting your search terms or clearing the selected category and tags.
            </p>
            <button
              onClick={() => {
                soundManager.playClick();
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTag(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset All Filters
            </button>
          </div>
        )}

        {/* Arcade Lounge: Daily Missions & Community Hall of Fame */}
        <ArcadeLounge />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

      {/* Game Play Theater Modal */}
      <GameModal
        game={activeModalGame}
        onClose={() => setActiveModalGame(null)}
        isFavorite={activeModalGame ? favoriteIds.includes(activeModalGame.id) : false}
        onToggleFavorite={(id) => toggleFavorite(undefined, id)}
      />

      {/* Favorites Locker Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteGames}
        onPlayGame={(g) => setActiveModalGame(g)}
        onRemoveFavorite={removeFavorite}
      />
    </div>
  );
}

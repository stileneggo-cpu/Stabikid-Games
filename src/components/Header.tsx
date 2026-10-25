import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Volume2, VolumeX, Dices, Heart, Flame, Sparkles, X } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { IOGame } from '../types/game';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectGame: (game: IOGame) => void;
  allGames: IOGame[];
  favoritesCount: number;
  onOpenFavorites: () => void;
  onRandomGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSelectGame,
  allGames,
  favoritesCount,
  onOpenFavorites,
  onRandomGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('main-game-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? allGames
        .filter(
          (g) =>
            g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            g.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Name */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSearchChange('');
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-['Outfit']">
                  Stabikid<span className="text-emerald-400">games</span>
                  <span className="text-cyan-400">.com</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                  .IO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 tracking-wide font-medium hidden sm:inline">
                Play All Popular .IO Games Online Free
              </span>
            </div>
          </a>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="relative flex-1 max-w-xl mx-2 sm:mx-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="main-game-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search Slither, Agar, Diep, Krunker, Paper..."
                className="w-full pl-11 pr-20 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white placeholder-slate-400 text-sm outline-none transition-all duration-200"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-slate-400 hover:text-white rounded-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
                  /
                </kbd>
              </div>
            </div>

            {/* Instant Search Suggestions */}
            {showSearchDropdown && searchResults.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSearchDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Results ({searchResults.length})
                  </div>
                  {searchResults.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => {
                        onSelectGame(game);
                        setShowSearchDropdown(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${game.logoBg} flex items-center justify-center text-white text-xs font-bold`}>
                          {game.title.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {game.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-xs">
                            {game.tagline}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        ⭐ {game.rating}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons: Sound, Favorites, Random Game */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all hover:scale-105 cursor-pointer"
              title={isMuted ? 'Unmute Game Audio' : 'Mute Game Audio'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
            </button>

            {/* Random Game / Lucky Roll */}
            <button
              onClick={() => {
                soundManager.playSelect();
                onRandomGame();
              }}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:border-amber-400/50 hover:text-amber-300 cursor-pointer"
              title="Surprise me with a random .IO game"
            >
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Random</span>
            </button>

            {/* Favorites Locker */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenFavorites();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/30" />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

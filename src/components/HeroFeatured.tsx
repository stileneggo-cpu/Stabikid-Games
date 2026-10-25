import React, { useState, useEffect } from 'react';
import { IOGame } from '../types/game';
import { Play, Sparkles, Users, Star, Flame, ChevronRight, Zap } from 'lucide-react';
import { GameLogo } from './GameLogo';
import { soundManager } from '../utils/audio';

interface HeroFeaturedProps {
  featuredGames: IOGame[];
  onPlayGame: (game: IOGame) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ featuredGames, onPlayGame }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  if (featuredGames.length === 0) return null;

  const current = featuredGames[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-10">
      {/* Background Ambient Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${current.accentGradient} opacity-20 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Information */}
        <div className="max-w-xl text-left space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-current text-amber-400" />
              Featured .IO Game of the Day
            </span>
            {current.isBuiltIn && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                <Zap className="w-3 h-3 fill-current" /> Instant Play
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <GameLogo gameId={current.id} size="lg" className="shrink-0" />
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {current.title}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base line-clamp-2 mt-1">
                {current.tagline}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {current.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 text-xs font-medium border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Stats */}
          <div className="flex items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>
                <strong className="text-white font-mono">{current.playersOnline.toLocaleString()}</strong> playing now
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>
                <strong className="text-white font-mono">{current.rating}</strong> ({current.votesCount.toLocaleString()} votes)
              </span>
            </div>
          </div>

          {/* Play Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => {
                soundManager.playLaunch();
                onPlayGame(current);
              }}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Play {current.title} Now
            </button>

            <button
              onClick={() => {
                soundManager.playSelect();
                onPlayGame(current);
              }}
              className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Controls & Info
            </button>
          </div>
        </div>

        {/* Right Carousel Preview Switcher */}
        <div className="flex flex-col items-center sm:items-end gap-3 w-full lg:w-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Top IO Hits
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 w-full">
            {featuredGames.map((game, idx) => (
              <button
                key={game.id}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIndex(idx);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-slate-800 border-emerald-500/80 shadow-md shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <GameLogo gameId={game.id} size="sm" className="shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{game.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {game.playersOnline.toLocaleString()} online
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Pagination Dots */}
          <div className="flex items-center gap-1.5 mt-2">
            {featuredGames.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentIndex ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                }`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

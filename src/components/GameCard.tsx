import React from 'react';
import { IOGame } from '../types/game';
import { GameLogo } from './GameLogo';
import { Star, Users, Heart, Play, Zap, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameCardProps {
  game: IOGame;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, gameId: string) => void;
  onPlayGame: (game: IOGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlayGame,
}) => {
  return (
    <div
      onClick={() => {
        soundManager.playSelect();
        onPlayGame(game);
      }}
      className="group relative bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Top Background Ambient Glow on Hover */}
      <div
        className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${game.accentGradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300 pointer-events-none`}
      />

      {/* Top Banner Row: Logo, Badges & Favorite Button */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="relative">
            <GameLogo gameId={game.id} size="md" className="group-hover:scale-105 transition-transform duration-300" />
            {game.isTrending && (
              <span className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Flame className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {game.isBuiltIn && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-wide uppercase">
                <Zap className="w-2.5 h-2.5 fill-current" /> Built-In
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onToggleFavorite(e, game.id);
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1">
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {game.tagline}
        </p>
      </div>

      {/* Bottom Metadata & Play Pill */}
      <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-mono font-bold text-slate-200">{game.rating}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="font-mono">{(game.playersOnline / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Quick Play Action */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-white text-xs font-bold transition-all duration-200">
          <Play className="w-3 h-3 fill-current" />
          <span>Play</span>
        </div>
      </div>
    </div>
  );
};

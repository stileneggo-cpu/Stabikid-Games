import React from 'react';
import { IOGame } from '../types/game';
import { GameLogo } from './GameLogo';
import { X, Heart, Play, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: IOGame[];
  onPlayGame: (game: IOGame) => void;
  onRemoveFavorite: (gameId: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onPlayGame,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h3 className="text-lg font-black text-white">My Favorite Games</h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-mono font-bold">
                {favorites.length}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="py-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Heart className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-300">No favorite games yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click the heart icon on any game card to bookmark it for fast access!
                </p>
              </div>
            ) : (
              favorites.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <GameLogo gameId={game.id} size="sm" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{game.title}</h4>
                      <span className="text-xs text-slate-400 font-mono">⭐ {game.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playLaunch();
                        onPlayGame(game);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Play
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(game.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-850 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Saved locally to your browser on Stabikidgames.com
        </div>
      </div>
    </div>
  );
};

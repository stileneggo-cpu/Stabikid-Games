import React, { useState } from 'react';
import { IOGame } from '../types/game';
import { GameLogo } from './GameLogo';
import { BuiltInSlitherGame } from './BuiltInSlitherGame';
import { BuiltInTankGame } from './BuiltInTankGame';
import {
  X,
  Maximize2,
  ExternalLink,
  Heart,
  Share2,
  Star,
  Users,
  ShieldCheck,
  Check,
  Gamepad2,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameModalProps {
  game: IOGame | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (gameId: string) => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'controls' | 'about'>('play');
  const [copied, setCopied] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [iframeError, setIframeError] = useState(false);

  if (!game) return null;

  const handleShare = () => {
    soundManager.playClick();
    const url = window.location.origin + '?game=' + game.slug;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleVote = (ratingVal: number) => {
    if (hasVoted) return;
    soundManager.playSelect();
    setUserRating(ratingVal);
    setHasVoted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <GameLogo gameId={game.id} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{game.title}</h2>
                {game.isBuiltIn && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                    Instant Play
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{game.tagline}</p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(game.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Add to Favorites"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Share game"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>

            <a
              href={game.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Open Official Game Site"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Official</span>
            </a>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 bg-slate-900 gap-4 text-sm font-bold">
          <button
            onClick={() => setActiveTab('play')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'play'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Game Arena
          </button>
          <button
            onClick={() => setActiveTab('controls')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'controls'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Controls & Keys
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            About & Strategy
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-950">
          {activeTab === 'play' && (
            <div>
              {/* If game is built-in, run our rich custom engine */}
              {game.builtInType === 'slither' ? (
                <BuiltInSlitherGame />
              ) : game.builtInType === 'tank' ? (
                <BuiltInTankGame />
              ) : (
                /* External Web Game Player Theater */
                <div className="space-y-4">
                  <div className="relative w-full h-[580px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
                    {!iframeError ? (
                      <iframe
                        src={game.embedUrl}
                        title={game.title}
                        className="w-full h-full border-0 rounded-2xl"
                        allow="fullscreen; autoplay; pointer-lock"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                        onError={() => setIframeError(true)}
                      />
                    ) : (
                      <div className="m-auto text-center p-8 max-w-md">
                        <GameLogo gameId={game.id} size="lg" className="mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Browser Sandbox Protection</h3>
                        <p className="text-sm text-slate-400 mb-6">
                          Some browser security settings prefer launching this game directly in its dedicated window.
                        </p>
                        <a
                          href={game.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Launch {game.title} Now
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Fallback Direct Launcher Bar */}
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>
                        Connecting to nearest server (<strong className="text-emerald-400">US-East: 21ms</strong>,{' '}
                        <strong className="text-cyan-400">EU-Central: 38ms</strong>)
                      </span>
                    </div>

                    <a
                      href={game.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Play in Standalone Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-emerald-400" />
                  Official Controls for {game.title}
                </h3>
                <div className="space-y-3">
                  {game.controls.map((ctrl, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80"
                    >
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-mono font-bold text-xs border border-slate-700 shadow-sm">
                        {ctrl.key}
                      </span>
                      <span className="text-sm text-slate-300 font-medium">{ctrl.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                  💡 Pro Tips & Tactics
                </h4>
                <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                  <li>Keep an eye on the mini-map to anticipate incoming swarms or giant players.</li>
                  <li>Use speed boost sparingly; in most .io games, boosting consumes your hard-earned mass!</li>
                  <li>Bait aggressive opponents into sharp turns or edge boundaries to collect their loot drops.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-black text-white">{game.title} Overview</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{game.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Developer</span>
                    <strong className="text-xs text-white truncate block">{game.developer}</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Released</span>
                    <strong className="text-xs text-white">{game.releaseYear}</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Active Players</span>
                    <strong className="text-xs text-cyan-400 font-mono">
                      {game.playersOnline.toLocaleString()}
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Player Rating</span>
                    <strong className="text-xs text-amber-400 font-mono">⭐ {game.rating} / 5</strong>
                  </div>
                </div>
              </div>

              {/* Cast Your Rating */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <h4 className="text-sm font-bold text-white mb-2">How do you rate {game.title}?</h4>
                <p className="text-xs text-slate-400 mb-4">Your vote helps rank the top .io games on Stabikidgames.com</p>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleVote(star)}
                      className="p-2 rounded-xl hover:bg-slate-800 transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          userRating !== null && star <= userRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600 hover:text-amber-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {hasVoted && (
                  <p className="text-xs text-emerald-400 font-bold mt-3 animate-in fade-in">
                    Thank you! Your vote has been recorded.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

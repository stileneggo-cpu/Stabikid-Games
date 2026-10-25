import React from 'react';
import { Gamepad2, ShieldCheck, Heart, Zap, Globe, Sparkles } from 'lucide-react';
import { GameCategory } from '../types/game';

interface FooterProps {
  onSelectCategory: (category: GameCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/90 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white">
                Stabikid<span className="text-emerald-400">games</span>
                <span className="text-cyan-400">.com</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stabikidgames.com is your premier portal for the greatest multiplayer .IO games in the universe. Enjoy instant, unblocked, lag-free online multiplayer gaming straight from your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All servers operational</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Game Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onSelectCategory('snake')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🐍 Snake & Grow IO Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('battle-royale')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🛡️ Battle Royale IO Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('shooter')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🎯 Action & Shooter IO Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('territory')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🗺️ Territory & Paper IO Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('survival')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  🔥 Survival & Craft IO Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('builtin')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  ⚡ Built-in Instant Arenas
                </button>
              </li>
            </ul>
          </div>

          {/* About IO Games */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              What are .IO Games?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              .IO games are accessible, multiplayer browser games celebrated for simple mechanics, rapid matchmaking, and thrilling competitive growth. Starting with Agar.io in 2015 and Slither.io in 2016, players control avatars that grow in mass or power by consuming items and defeating rivals.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              At Stabikidgames.com, every game is curated for smooth performance, zero installation requirements, and instant full-screen playability on PC, Mac, tablets, and Chromebooks.
            </p>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Stabikidgames.com. All games, logos, and trademarks belong to their respective creators and studios.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for IO Gamers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

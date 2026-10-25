import React from 'react';
import { GameCategory } from '../types/game';
import { CATEGORIES_CONFIG } from '../data/gamesData';
import {
  Gamepad2,
  Zap,
  Flame,
  ShieldAlert,
  Crosshair,
  LayoutGrid,
  Crown,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export type SortOption = 'popular' | 'rating' | 'trending' | 'name' | 'newest';

interface FilterBarProps {
  selectedCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  popularTags: string[];
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  selectedTag,
  onSelectTag,
  popularTags,
  totalMatches,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'builtin':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'snake':
        return <Flame className="w-3.5 h-3.5 text-emerald-400" />;
      case 'battle-royale':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      case 'shooter':
        return <Crosshair className="w-3.5 h-3.5 text-amber-400" />;
      case 'territory':
        return <LayoutGrid className="w-3.5 h-3.5 text-pink-400" />;
      case 'survival':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'strategy':
        return <Crown className="w-3.5 h-3.5 text-yellow-400" />;
      case 'party':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Gamepad2 className="w-3.5 h-3.5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                onSelectCategory(cat.id as GameCategory);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sorting & Tag Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Popular Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Tags:
          </span>
          {popularTags.slice(0, 8).map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  soundManager.playClick();
                  onSelectTag(isTagActive ? null : tag);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  isTagActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => onSelectTag(null)}
              className="text-xs text-rose-400 hover:underline px-1 cursor-pointer shrink-0"
            >
              Clear tag
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Match Counter */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <span className="text-xs text-slate-400 font-mono">
            <strong>{totalMatches}</strong> games
          </span>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSort}
              onChange={(e) => {
                soundManager.playSelect();
                onSelectSort(e.target.value as SortOption);
              }}
              className="bg-transparent text-white font-medium outline-none cursor-pointer"
            >
              <option value="popular" className="bg-slate-900">Most Popular</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
              <option value="trending" className="bg-slate-900">Trending Now</option>
              <option value="name" className="bg-slate-900">A - Z</option>
              <option value="newest" className="bg-slate-900">Newest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

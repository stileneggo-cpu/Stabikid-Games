import React, { useState } from 'react';
import { DailyQuest, LeaderboardEntry } from '../types/game';
import { DAILY_QUESTS, SAMPLE_LEADERBOARD } from '../data/gamesData';
import { Trophy, Award, Flame, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

export const ArcadeLounge: React.FC = () => {
  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    const saved = localStorage.getItem('stabikid_daily_quests');
    return saved ? JSON.parse(saved) : DAILY_QUESTS;
  });

  const [playerXp, setPlayerXp] = useState(() => {
    return parseInt(localStorage.getItem('stabikid_player_xp') || '450', 10);
  });

  const claimQuest = (questId: string, xpReward: number) => {
    soundManager.playSelect();
    const updated = quests.map((q) => (q.id === questId ? { ...q, completed: true } : q));
    setQuests(updated);
    localStorage.setItem('stabikid_daily_quests', JSON.stringify(updated));

    const newXp = playerXp + xpReward;
    setPlayerXp(newXp);
    localStorage.setItem('stabikid_player_xp', String(newXp));

    confetti({ particleCount: 50, spread: 60 });
  };

  const currentLevel = Math.floor(playerXp / 500) + 1;
  const currentLevelXp = playerXp % 500;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-12">
      {/* Daily Quests Box */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Flame className="w-4 h-4 fill-current" />
              </span>
              <h3 className="text-xl font-black text-white">Daily Arcade Missions</h3>
            </div>
            <p className="text-xs text-slate-400">
              Complete daily quests across .IO games to level up your Stabikid gamer badge!
            </p>
          </div>

          {/* Player Level Badge */}
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-amber-500/20">
              Lv.{currentLevel}
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase">Gamer XP</div>
              <div className="text-sm font-black text-white font-mono">
                {currentLevelXp} / 500 XP
              </div>
            </div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {quests.map((q) => {
            const isReadyToClaim = q.progress >= q.goal && !q.completed;
            const progressPercent = Math.min(100, Math.floor((q.progress / q.goal) * 100));

            return (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{q.title}</span>
                    <span className="text-[11px] text-amber-400 font-mono font-semibold">
                      +{q.rewardXp} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{q.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        q.completed
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${q.completed ? 100 : progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {q.completed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : isReadyToClaim ? (
                    <button
                      onClick={() => claimQuest(q.id, q.rewardXp)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform cursor-pointer"
                    >
                      Claim {q.rewardXp} XP
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      {q.progress} / {q.goal}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Hall of Fame Leaderboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <Trophy className="w-4 h-4 fill-current" />
              </span>
              <h3 className="text-lg font-black text-white">Top Players Today</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Arena
            </span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_LEADERBOARD.slice(0, 6).map((player) => (
              <div
                key={player.rank}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 text-center font-black font-mono ${
                      player.rank === 1
                        ? 'text-amber-400'
                        : player.rank === 2
                        ? 'text-slate-300'
                        : player.rank === 3
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  >
                    #{player.rank}
                  </span>
                  <span className="text-base">{player.avatar}</span>
                  <span className="font-bold text-white truncate max-w-[100px]">
                    {player.username}
                  </span>
                </div>

                <div className="font-mono font-bold text-cyan-400">
                  {player.score.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Scores update live after every official game match on Stabikidgames.com
          </p>
        </div>
      </div>
    </div>
  );
};

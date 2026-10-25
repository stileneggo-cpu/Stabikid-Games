import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Zap, Shield, Plus, Maximize2, Minimize2 } from 'lucide-react';

interface TankBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  lifetime: number;
  isPlayer: boolean;
  color: string;
}

interface Shape {
  id: number;
  type: 'square' | 'triangle' | 'pentagon';
  x: number;
  y: number;
  rotation: number;
  rotSpeed: number;
  health: number;
  maxHealth: number;
  points: number;
  color: string;
  radius: number;
}

interface EnemyTank {
  x: number;
  y: number;
  angle: number;
  health: number;
  maxHealth: number;
  speed: number;
  reloadTime: number;
  lastShot: number;
  color: string;
  score: number;
}

export const BuiltInTankGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [upgradePoints, setUpgradePoints] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('stabikid_tank_high') || '0', 10);
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Upgrade stats
  const [stats, setStats] = useState({
    maxHealth: 1,
    bulletSpeed: 1,
    bulletDamage: 1,
    reloadSpeed: 1,
    moveSpeed: 1,
  });

  const stateRef = useRef<{
    width: number;
    height: number;
    player: {
      x: number;
      y: number;
      angle: number;
      health: number;
      maxHealth: number;
      lastShot: number;
      speed: number;
    };
    keys: { [key: string]: boolean };
    mousePos: { x: number; y: number };
    bullets: TankBullet[];
    shapes: Shape[];
    enemies: EnemyTank[];
    lastUpdate: number;
    nextShapeId: number;
  }>({
    width: 2600,
    height: 2600,
    player: {
      x: 1300,
      y: 1300,
      angle: 0,
      health: 100,
      maxHealth: 100,
      lastShot: 0,
      speed: 4,
    },
    keys: {},
    mousePos: { x: 0, y: 0 },
    bullets: [],
    shapes: [],
    enemies: [],
    lastUpdate: 0,
    nextShapeId: 1,
  });

  const startGame = () => {
    const W = stateRef.current.width;
    const H = stateRef.current.height;

    // Reset player
    stateRef.current.player = {
      x: W / 2,
      y: H / 2,
      angle: 0,
      health: 100,
      maxHealth: 100,
      lastShot: 0,
      speed: 4,
    };
    stateRef.current.bullets = [];

    // Spawn shapes
    const shapes: Shape[] = [];
    for (let i = 0; i < 90; i++) {
      const rand = Math.random();
      if (rand < 0.6) {
        shapes.push({
          id: i,
          type: 'square',
          x: Math.random() * (W - 100) + 50,
          y: Math.random() * (H - 100) + 50,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          health: 15,
          maxHealth: 15,
          points: 10,
          color: '#facc15',
          radius: 12,
        });
      } else if (rand < 0.88) {
        shapes.push({
          id: i,
          type: 'triangle',
          x: Math.random() * (W - 100) + 50,
          y: Math.random() * (H - 100) + 50,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          health: 30,
          maxHealth: 30,
          points: 25,
          color: '#f87171',
          radius: 15,
        });
      } else {
        shapes.push({
          id: i,
          type: 'pentagon',
          x: Math.random() * (W - 100) + 50,
          y: Math.random() * (H - 100) + 50,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.015,
          health: 100,
          maxHealth: 100,
          points: 120,
          color: '#60a5fa',
          radius: 24,
        });
      }
    }
    stateRef.current.shapes = shapes;

    // Spawn Enemy tanks
    const enemies: EnemyTank[] = [];
    for (let e = 0; e < 5; e++) {
      enemies.push({
        x: Math.random() * (W - 300) + 150,
        y: Math.random() * (H - 300) + 150,
        angle: Math.random() * Math.PI * 2,
        health: 80,
        maxHealth: 80,
        speed: 2.8,
        reloadTime: 600,
        lastShot: 0,
        color: '#f43f5e',
        score: 300,
      });
    }
    stateRef.current.enemies = enemies;

    setScore(0);
    setLevel(1);
    setUpgradePoints(0);
    setStats({
      maxHealth: 1,
      bulletSpeed: 1,
      bulletDamage: 1,
      reloadSpeed: 1,
      moveSpeed: 1,
    });
    setIsPlaying(true);
    setIsGameOver(false);
    soundManager.playLaunch();
  };

  const upgradeStat = (key: keyof typeof stats) => {
    if (upgradePoints <= 0 || stats[key] >= 8) return;
    setStats((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setUpgradePoints((prev) => prev - 1);
    soundManager.playSelect();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const onKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const map: (keyof typeof stats)[] = ['maxHealth', 'bulletSpeed', 'bulletDamage', 'reloadSpeed', 'moveSpeed'];
        const statKey = map[parseInt(e.key, 10) - 1];
        if (statKey) upgradeStat(statKey);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Game loop
    const loop = () => {
      const state = stateRef.current;
      const player = state.player;
      const cw = canvas.width;
      const ch = canvas.height;

      // 1. Move Player
      let vx = 0;
      let vy = 0;
      if (state.keys['w'] || state.keys['arrowup']) vy -= 1;
      if (state.keys['s'] || state.keys['arrowdown']) vy += 1;
      if (state.keys['a'] || state.keys['arrowleft']) vx -= 1;
      if (state.keys['d'] || state.keys['arrowright']) vx += 1;

      if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
      }

      const pSpeed = 3.6 + stats.moveSpeed * 0.45;
      player.x = Math.max(30, Math.min(state.width - 30, player.x + vx * pSpeed));
      player.y = Math.max(30, Math.min(state.height - 30, player.y + vy * pSpeed));

      // Aim angle
      const screenMidX = cw / 2;
      const screenMidY = ch / 2;
      player.angle = Math.atan2(state.mousePos.y - screenMidY, state.mousePos.x - screenMidX);

      // Auto / Click Fire
      const now = Date.now();
      const fireInterval = Math.max(160, 400 - stats.reloadSpeed * 30);
      if (state.keys['space'] || state.keys['mousedown']) {
        if (now - player.lastShot > fireInterval) {
          player.lastShot = now;
          const barrelLen = 30;
          const bulletSpeed = 7 + stats.bulletSpeed * 0.9;
          const bulletDmg = 12 + stats.bulletDamage * 4.5;
          state.bullets.push({
            x: player.x + Math.cos(player.angle) * barrelLen,
            y: player.y + Math.sin(player.angle) * barrelLen,
            vx: Math.cos(player.angle) * bulletSpeed,
            vy: Math.sin(player.angle) * bulletSpeed,
            radius: 7,
            damage: bulletDmg,
            lifetime: 90,
            isPlayer: true,
            color: '#06b6d4',
          });
          soundManager.playClick();
        }
      }

      // Update Bullets
      for (let b = state.bullets.length - 1; b >= 0; b--) {
        const bullet = state.bullets[b];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        bullet.lifetime -= 1;

        if (bullet.lifetime <= 0) {
          state.bullets.splice(b, 1);
          continue;
        }

        // Bullet hitting shapes
        if (bullet.isPlayer) {
          for (let s = state.shapes.length - 1; s >= 0; s--) {
            const sh = state.shapes[s];
            const dist = Math.hypot(bullet.x - sh.x, bullet.y - sh.y);
            if (dist < bullet.radius + sh.radius) {
              sh.health -= bullet.damage;
              bullet.lifetime = 0; // consume bullet
              soundManager.playEat();

              if (sh.health <= 0) {
                // Destroyed shape!
                const awarded = sh.points;
                setScore((prev) => {
                  const newScore = prev + awarded;
                  const newLvl = Math.floor(newScore / 150) + 1;
                  if (newLvl > level) {
                    setLevel(newLvl);
                    setUpgradePoints((p) => p + 1);
                  }
                  return newScore;
                });
                state.shapes.splice(s, 1);
              }
              break;
            }
          }
        }
      }

      // Respawn shapes
      if (state.shapes.length < 80) {
        state.shapes.push({
          id: state.nextShapeId++,
          type: 'square',
          x: Math.random() * (state.width - 100) + 50,
          y: Math.random() * (state.height - 100) + 50,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          health: 15,
          maxHealth: 15,
          points: 10,
          color: '#facc15',
          radius: 12,
        });
      }

      // Enemies AI & shooting
      state.enemies.forEach((en) => {
        const distToPlayer = Math.hypot(player.x - en.x, player.y - en.y);
        en.angle = Math.atan2(player.y - en.y, player.x - en.x);

        // Move towards or wander
        if (distToPlayer > 350) {
          en.x += Math.cos(en.angle) * en.speed;
          en.y += Math.sin(en.angle) * en.speed;
        }

        // Shoot at player if in range
        if (distToPlayer < 450 && now - en.lastShot > en.reloadTime) {
          en.lastShot = now;
          state.bullets.push({
            x: en.x + Math.cos(en.angle) * 26,
            y: en.y + Math.sin(en.angle) * 26,
            vx: Math.cos(en.angle) * 6,
            vy: Math.sin(en.angle) * 6,
            radius: 6,
            damage: 10,
            lifetime: 80,
            isPlayer: false,
            color: '#f43f5e',
          });
        }
      });

      // Bullets hitting player
      state.bullets.forEach((b) => {
        if (!b.isPlayer) {
          const dist = Math.hypot(b.x - player.x, b.y - player.y);
          if (dist < b.radius + 18) {
            player.health -= b.damage;
            b.lifetime = 0;
            if (player.health <= 0) {
              setIsGameOver(true);
              soundManager.playGameOver();
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('stabikid_tank_high', String(score));
                confetti({ particleCount: 90, spread: 70 });
              }
            }
          }
        } else {
          // Player bullet hitting enemy
          state.enemies.forEach((en, eIdx) => {
            const dist = Math.hypot(b.x - en.x, b.y - en.y);
            if (dist < b.radius + 18) {
              en.health -= b.damage;
              b.lifetime = 0;
              if (en.health <= 0) {
                setScore((prev) => prev + en.score);
                state.enemies.splice(eIdx, 1);
                // Respawn enemy elsewhere
                setTimeout(() => {
                  state.enemies.push({
                    x: Math.random() * (state.width - 300) + 150,
                    y: Math.random() * (state.height - 300) + 150,
                    angle: Math.random() * Math.PI * 2,
                    health: 80,
                    maxHealth: 80,
                    speed: 2.8,
                    reloadTime: 600,
                    lastShot: 0,
                    color: '#f43f5e',
                    score: 300,
                  });
                }, 3000);
              }
            }
          });
        }
      });

      // Passive health regeneration
      if (player.health < 100) {
        player.health = Math.min(100, player.health + 0.04);
      }

      // RENDER
      ctx.clearRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(cw / 2 - player.x, ch / 2 - player.y);

      // Arena grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < state.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, state.height);
        ctx.stroke();
      }
      for (let y = 0; y < state.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(state.width, y);
        ctx.stroke();
      }

      // Arena boundary
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, state.width, state.height);

      // Draw Shapes
      state.shapes.forEach((sh) => {
        sh.rotation += sh.rotSpeed;
        ctx.save();
        ctx.translate(sh.x, sh.y);
        ctx.rotate(sh.rotation);

        ctx.fillStyle = sh.color;
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2.5;

        if (sh.type === 'square') {
          ctx.beginPath();
          ctx.rect(-sh.radius, -sh.radius, sh.radius * 2, sh.radius * 2);
          ctx.fill();
          ctx.stroke();
        } else if (sh.type === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -sh.radius * 1.2);
          ctx.lineTo(sh.radius, sh.radius * 0.8);
          ctx.lineTo(-sh.radius, sh.radius * 0.8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (sh.type === 'pentagon') {
          ctx.beginPath();
          for (let p = 0; p < 5; p++) {
            const angle = (p * Math.PI * 2) / 5 - Math.PI / 2;
            const px = Math.cos(angle) * sh.radius;
            const py = Math.sin(angle) * sh.radius;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();

        // Health bar if damaged
        if (sh.health < sh.maxHealth) {
          const barW = sh.radius * 2;
          ctx.fillStyle = '#334155';
          ctx.fillRect(sh.x - barW / 2, sh.y + sh.radius + 4, barW, 4);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(sh.x - barW / 2, sh.y + sh.radius + 4, barW * (sh.health / sh.maxHealth), 4);
        }
      });

      // Draw Bullets
      state.bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw Enemy Tanks
      state.enemies.forEach((en) => {
        ctx.save();
        ctx.translate(en.x, en.y);
        ctx.rotate(en.angle);

        // Barrel
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.fillRect(0, -6, 26, 12);
        ctx.strokeRect(0, -6, 26, 12);

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fillStyle = en.color;
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Health bar
        ctx.fillStyle = '#334155';
        ctx.fillRect(en.x - 20, en.y - 28, 40, 5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(en.x - 20, en.y - 28, 40 * (en.health / en.maxHealth), 5);
      });

      // Draw Player Tank
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Barrel
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.fillRect(0, -7, 30, 14);
      ctx.strokeRect(0, -7, 30, 14);

      // Body Circle
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Player Health bar overhead
      ctx.fillStyle = '#334155';
      ctx.fillRect(player.x - 22, player.y - 32, 44, 6);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(player.x - 22, player.y - 32, 44 * (player.health / 100), 6);

      ctx.restore();

      if (player.health > 0) {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPlaying, stats, upgradePoints, level, score]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : ''
      }`}
    >
      {/* HUD Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Score:</span>
          <span className="text-xl font-black text-cyan-400 font-mono">{score.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
          <span className="text-xs text-slate-400">Level:</span>
          <span className="text-sm font-bold text-amber-400 font-mono">{level}</span>
        </div>
      </div>

      {/* Upgrades Menu (Left side) */}
      {isPlaying && !isGameOver && (
        <div className="absolute left-4 top-20 z-20 space-y-1.5 w-48 pointer-events-auto">
          {upgradePoints > 0 && (
            <div className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold animate-pulse text-center">
              + {upgradePoints} Upgrade Point{upgradePoints > 1 ? 's' : ''}!
            </div>
          )}
          {(
            [
              { key: 'maxHealth', label: 'Max Health', num: 1 },
              { key: 'bulletSpeed', label: 'Bullet Speed', num: 2 },
              { key: 'bulletDamage', label: 'Bullet Damage', num: 3 },
              { key: 'reloadSpeed', label: 'Reload Speed', num: 4 },
              { key: 'moveSpeed', label: 'Move Speed', num: 5 },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => upgradeStat(item.key)}
              disabled={upgradePoints <= 0 || stats[item.key] >= 8}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                upgradePoints > 0 && stats[item.key] < 8
                  ? 'bg-slate-900/90 hover:bg-cyan-950/80 border-cyan-500/50 text-white cursor-pointer'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400'
              }`}
            >
              <span>
                [{item.num}] {item.label}
              </span>
              <span className="font-mono font-bold text-cyan-400">{stats[item.key]}/8</span>
            </button>
          ))}
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.mousePos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
        }}
        onMouseDown={() => (stateRef.current.keys['mousedown'] = true)}
        onMouseUp={() => (stateRef.current.keys['mousedown'] = false)}
        className="w-full h-full cursor-crosshair block flex-1"
      />

      {/* Lobby Overlay */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900/95 border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
              <span className="text-3xl">🛡️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Stabikid Tank Blaster Arena</h2>
            <p className="text-sm text-slate-400 mb-6">
              Diep.io style arcade tank showdown! Destroy yellow squares, triangles, and pentagons to unlock stats and blast red enemy tanks.
            </p>
            <button
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              Deploy Tank (Instant)
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💥</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Tank Destroyed!</h3>
            <p className="text-sm text-slate-400 mb-4">Your tank was eliminated in the arena.</p>

            <div className="bg-slate-800/80 rounded-2xl p-4 mb-6 border border-slate-700 flex justify-around">
              <div>
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-xl font-black text-cyan-400 font-mono">{score.toLocaleString()}</div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <div className="text-xs text-slate-400">High Score</div>
                <div className="text-xl font-black text-amber-400 font-mono">{highScore.toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              Respawn Tank
            </button>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none text-xs text-slate-400 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-800">
        Controls: <span className="text-slate-200 font-semibold">WASD</span> to drive •{' '}
        <span className="text-slate-200 font-semibold">Mouse & Click</span> to aim & shoot •{' '}
        <span className="text-slate-200 font-semibold">1-5</span> to upgrade
      </div>
    </div>
  );
};

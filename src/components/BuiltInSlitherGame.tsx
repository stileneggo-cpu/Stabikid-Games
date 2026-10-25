import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Zap, Maximize2, Minimize2, Eye, Shield } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Pellet {
  x: number;
  y: number;
  radius: number;
  color: string;
  glow: string;
  points: number;
}

interface Snake {
  id: string;
  name: string;
  body: Point[];
  angle: number;
  speed: number;
  baseSpeed: number;
  boostSpeed: number;
  isBoosting: boolean;
  color: string;
  secondaryColor: string;
  score: number;
  isBot: boolean;
  isDead: boolean;
  eyeOffset: number;
}

const SKINS = [
  { id: 'emerald', name: 'Cyber Viper', color: '#10b981', secondaryColor: '#059669', headColor: '#34d399' },
  { id: 'plasma', name: 'Neon Plasma', color: '#a855f7', secondaryColor: '#7c3aed', headColor: '#c084fc' },
  { id: 'solar', name: 'Solar Blaze', color: '#f59e0b', secondaryColor: '#d97706', headColor: '#fbbf24' },
  { id: 'frost', name: 'Cryo Frost', color: '#06b6d4', secondaryColor: '#0891b2', headColor: '#38bdf8' },
  { id: 'crimson', name: 'Crimson Fury', color: '#ef4444', secondaryColor: '#b91c1c', headColor: '#f87171' },
];

const BOT_NAMES = [
  'ApexPredator', 'NeonWorm', 'ByteBiter', 'SlitherBot_X', 'GlowHunter',
  'TitanBoa', 'VortexSnake', 'ShadowCrawler', 'PixelPython', 'HyperCoil'
];

export const BuiltInSlitherGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('stabikid_slither_high') || '0', 10);
  });
  const [selectedSkin, setSelectedSkin] = useState(SKINS[0]);
  const [playerName, setPlayerName] = useState('StabiPlayer');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; isPlayer?: boolean }[]>([]);

  // Game internal state stored in refs for 60fps loop
  const gameState = useRef<{
    width: number;
    height: number;
    player: Snake | null;
    bots: Snake[];
    pellets: Pellet[];
    mousePos: Point;
    camera: Point;
    keys: { space: boolean; boost: boolean };
    lastScoreUpdate: number;
    rafId: number | null;
  }>({
    width: 3200,
    height: 3200,
    player: null,
    bots: [],
    pellets: [],
    mousePos: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    keys: { space: false, boost: false },
    lastScoreUpdate: 0,
    rafId: null,
  });

  const initGame = () => {
    const W = gameState.current.width;
    const H = gameState.current.height;

    // Create player
    const startX = W / 2;
    const startY = H / 2;
    const initialSegments: Point[] = [];
    for (let i = 0; i < 20; i++) {
      initialSegments.push({ x: startX - i * 8, y: startY });
    }

    const player: Snake = {
      id: 'player',
      name: playerName.trim() || 'StabiPlayer',
      body: initialSegments,
      angle: 0,
      speed: 3.5,
      baseSpeed: 3.5,
      boostSpeed: 6.8,
      isBoosting: false,
      color: selectedSkin.color,
      secondaryColor: selectedSkin.secondaryColor,
      score: 100,
      isBot: false,
      isDead: false,
      eyeOffset: 6,
    };

    // Create Pellets
    const pellets: Pellet[] = [];
    const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#84cc16'];
    for (let i = 0; i < 400; i++) {
      pellets.push({
        x: Math.random() * (W - 100) + 50,
        y: Math.random() * (H - 100) + 50,
        radius: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        glow: colors[Math.floor(Math.random() * colors.length)],
        points: Math.floor(Math.random() * 15) + 10,
      });
    }

    // Create Bot snakes
    const bots: Snake[] = [];
    for (let b = 0; b < 10; b++) {
      const skin = SKINS[b % SKINS.length];
      const bx = Math.random() * (W - 400) + 200;
      const by = Math.random() * (H - 400) + 200;
      const bSegments: Point[] = [];
      const botLen = 15 + Math.floor(Math.random() * 25);
      for (let i = 0; i < botLen; i++) {
        bSegments.push({ x: bx - i * 8, y: by });
      }

      bots.push({
        id: `bot-${b}`,
        name: BOT_NAMES[b % BOT_NAMES.length],
        body: bSegments,
        angle: Math.random() * Math.PI * 2,
        speed: 3.2,
        baseSpeed: 3.2,
        boostSpeed: 6.0,
        isBoosting: false,
        color: skin.color,
        secondaryColor: skin.secondaryColor,
        score: botLen * 10,
        isBot: true,
        isDead: false,
        eyeOffset: 5,
      });
    }

    gameState.current.player = player;
    gameState.current.bots = bots;
    gameState.current.pellets = pellets;
    gameState.current.camera = { x: startX, y: startY };

    setIsPlaying(true);
    setIsGameOver(false);
    setScore(100);
    soundManager.playLaunch();
  };

  // Main Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const updateAndRender = () => {
      const state = gameState.current;
      const player = state.player;
      if (!player || player.isDead) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // 1. UPDATE PLAYER ANGLE
      // Angle towards mouse in screen coordinates
      const screenCenterX = cw / 2;
      const screenCenterY = ch / 2;
      const dx = state.mousePos.x - screenCenterX;
      const dy = state.mousePos.y - screenCenterY;
      const targetAngle = Math.atan2(dy, dx);

      // Smooth angle interpolation
      let angleDiff = targetAngle - player.angle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      player.angle += angleDiff * 0.12;

      // Boosting check
      player.isBoosting = state.keys.boost && player.score > 40;
      player.speed = player.isBoosting ? player.boostSpeed : player.baseSpeed;

      if (player.isBoosting) {
        player.score = Math.max(30, player.score - 0.2);
        // Leave tiny energy pellets behind when boosting
        if (Math.random() < 0.25) {
          const tail = player.body[player.body.length - 1];
          state.pellets.push({
            x: tail.x + (Math.random() - 0.5) * 10,
            y: tail.y + (Math.random() - 0.5) * 10,
            radius: 2.5,
            color: player.color,
            glow: player.secondaryColor,
            points: 4,
          });
        }
      }

      // Move player head
      const head = player.body[0];
      const newHeadX = Math.max(10, Math.min(state.width - 10, head.x + Math.cos(player.angle) * player.speed));
      const newHeadY = Math.max(10, Math.min(state.height - 10, head.y + Math.sin(player.angle) * player.speed));

      // Target body length based on score
      const desiredLength = Math.max(15, Math.floor(player.score / 10));

      player.body.unshift({ x: newHeadX, y: newHeadY });
      while (player.body.length > desiredLength) {
        player.body.pop();
      }

      // Camera smoothly follows player head
      state.camera.x += (newHeadX - state.camera.x) * 0.1;
      state.camera.y += (newHeadY - state.camera.y) * 0.1;

      // 2. UPDATE BOTS
      state.bots.forEach((bot) => {
        if (bot.isDead) return;

        // Bot AI: look for nearby pellet or avoid walls/snakes
        const bHead = bot.body[0];

        // Wall steering
        const margin = 120;
        let steerX = 0;
        let steerY = 0;
        if (bHead.x < margin) steerX += 1;
        if (bHead.x > state.width - margin) steerX -= 1;
        if (bHead.y < margin) steerY += 1;
        if (bHead.y > state.height - margin) steerY -= 1;

        if (steerX !== 0 || steerY !== 0) {
          bot.angle = Math.atan2(steerY, steerX);
        } else if (Math.random() < 0.04) {
          bot.angle += (Math.random() - 0.5) * 1.5;
        }

        const bDesiredLen = Math.max(12, Math.floor(bot.score / 10));
        const bSpeed = bot.speed;
        const bNewHeadX = Math.max(10, Math.min(state.width - 10, bHead.x + Math.cos(bot.angle) * bSpeed));
        const bNewHeadY = Math.max(10, Math.min(state.height - 10, bHead.y + Math.sin(bot.angle) * bSpeed));

        bot.body.unshift({ x: bNewHeadX, y: bNewHeadY });
        while (bot.body.length > bDesiredLen) {
          bot.body.pop();
        }
      });

      // 3. EATING PELLETS
      const headRadius = 16;
      for (let i = state.pellets.length - 1; i >= 0; i--) {
        const p = state.pellets[i];
        // Player eat
        const pDist = Math.hypot(p.x - newHeadX, p.y - newHeadY);
        if (pDist < headRadius + p.radius) {
          player.score += p.points;
          state.pellets.splice(i, 1);
          soundManager.playEat();
          continue;
        }

        // Bot eat
        for (const bot of state.bots) {
          if (bot.isDead) continue;
          const bH = bot.body[0];
          const bDist = Math.hypot(p.x - bH.x, p.y - bH.y);
          if (bDist < headRadius + p.radius) {
            bot.score += p.points;
            state.pellets.splice(i, 1);
            break;
          }
        }
      }

      // Replenish pellets
      if (state.pellets.length < 320) {
        const colors = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899', '#a855f7', '#84cc16'];
        state.pellets.push({
          x: Math.random() * (state.width - 100) + 50,
          y: Math.random() * (state.height - 100) + 50,
          radius: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          glow: colors[Math.floor(Math.random() * colors.length)],
          points: Math.floor(Math.random() * 12) + 8,
        });
      }

      // 4. COLLISIONS (Player hits Bot body -> Player dies; Bot hits Player body -> Bot dies)
      // Check player head against bot bodies
      for (const bot of state.bots) {
        if (bot.isDead) continue;
        for (let s = 2; s < bot.body.length; s++) {
          const seg = bot.body[s];
          const dist = Math.hypot(newHeadX - seg.x, newHeadY - seg.y);
          if (dist < 15) {
            // Player crashed into bot!
            player.isDead = true;
            setIsGameOver(true);
            soundManager.playGameOver();

            // Scatter player mass into pellets
            player.body.forEach((pt) => {
              if (Math.random() < 0.6) {
                state.pellets.push({
                  x: pt.x + (Math.random() - 0.5) * 15,
                  y: pt.y + (Math.random() - 0.5) * 15,
                  radius: 5,
                  color: player.color,
                  glow: '#ffffff',
                  points: 25,
                });
              }
            });

            if (player.score > highScore) {
              setHighScore(Math.floor(player.score));
              localStorage.setItem('stabikid_slither_high', String(Math.floor(player.score)));
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
            }
            break;
          }
        }
        if (player.isDead) break;
      }

      // Check bots head hitting player body
      state.bots.forEach((bot) => {
        if (bot.isDead) return;
        const bH = bot.body[0];
        for (let s = 2; s < player.body.length; s++) {
          const seg = player.body[s];
          const dist = Math.hypot(bH.x - seg.x, bH.y - seg.y);
          if (dist < 16) {
            bot.isDead = true;
            // Bot drops large pellets
            bot.body.forEach((pt) => {
              state.pellets.push({
                x: pt.x + (Math.random() - 0.5) * 12,
                y: pt.y + (Math.random() - 0.5) * 12,
                radius: 4.5,
                color: bot.color,
                glow: '#fff',
                points: 20,
              });
            });
            break;
          }
        }
      });

      // Respawn dead bots after some time
      state.bots.forEach((bot, idx) => {
        if (bot.isDead) {
          const bx = Math.random() * (state.width - 400) + 200;
          const by = Math.random() * (state.height - 400) + 200;
          bot.isDead = false;
          bot.score = 120;
          bot.body = [{ x: bx, y: by }];
          for (let i = 1; i < 15; i++) {
            bot.body.push({ x: bx - i * 8, y: by });
          }
        }
      });

      // Score throttled sync
      const now = Date.now();
      if (now - state.lastScoreUpdate > 150) {
        setScore(Math.floor(player.score));
        state.lastScoreUpdate = now;

        // Leaderboard calculation
        const allSnakes = [
          { name: player.name, score: Math.floor(player.score), isPlayer: true },
          ...state.bots.map((b) => ({ name: b.name, score: Math.floor(b.score) })),
        ].sort((a, b) => b.score - a.score).slice(0, 7);
        setLeaderboard(allSnakes);
      }

      // 5. RENDER CANVAS
      ctx.clearRect(0, 0, cw, ch);

      // Save transform for camera
      ctx.save();
      ctx.translate(cw / 2 - state.camera.x, ch / 2 - state.camera.y);

      // Arena background grid
      const gridSize = 60;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const startGridX = Math.floor((state.camera.x - cw / 2) / gridSize) * gridSize;
      const endGridX = startGridX + cw + gridSize * 2;
      const startGridY = Math.floor((state.camera.y - ch / 2) / gridSize) * gridSize;
      const endGridY = startGridY + ch + gridSize * 2;

      ctx.beginPath();
      for (let x = startGridX; x <= endGridX; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, state.height);
      }
      for (let y = startGridY; y <= endGridY; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(state.width, y);
      }
      ctx.stroke();

      // Arena border
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, state.width, state.height);

      // Draw Pellets
      state.pellets.forEach((p) => {
        // Culling: only draw if in camera view
        if (
          p.x < state.camera.x - cw / 2 - 20 ||
          p.x > state.camera.x + cw / 2 + 20 ||
          p.y < state.camera.y - ch / 2 - 20 ||
          p.y > state.camera.y + ch / 2 + 20
        ) {
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Helper to draw a snake
      const drawSnake = (s: Snake) => {
        if (s.isDead || s.body.length === 0) return;

        // Draw body segments from tail to head
        const baseRadius = 14;
        for (let i = s.body.length - 1; i >= 0; i--) {
          const pt = s.body[i];
          const segRadius = Math.max(7, baseRadius * (1 - i / (s.body.length * 2.5)));
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, segRadius, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? s.color : s.secondaryColor;
          ctx.fill();
        }

        // Draw Head with eyes
        const sHead = s.body[0];
        const hRadius = 16;
        ctx.beginPath();
        ctx.arc(sHead.x, sHead.y, hRadius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();

        // Eyes
        const eyeDist = 9;
        const eyeOffsetAngle = 0.55;
        const eye1X = sHead.x + Math.cos(s.angle + eyeOffsetAngle) * eyeDist;
        const eye1Y = sHead.y + Math.sin(s.angle + eyeOffsetAngle) * eyeDist;
        const eye2X = sHead.x + Math.cos(s.angle - eyeOffsetAngle) * eyeDist;
        const eye2Y = sHead.y + Math.sin(s.angle - eyeOffsetAngle) * eyeDist;

        // Eye whites
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 4.5, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Eye pupils
        const pupilDist = 1.8;
        ctx.beginPath();
        ctx.arc(eye1X + Math.cos(s.angle) * pupilDist, eye1Y + Math.sin(s.angle) * pupilDist, 2.2, 0, Math.PI * 2);
        ctx.arc(eye2X + Math.cos(s.angle) * pupilDist, eye2Y + Math.sin(s.angle) * pupilDist, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Name tag
        ctx.font = 'bold 12px Outfit, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(s.name, sHead.x, sHead.y - 20);
        ctx.shadowBlur = 0;
      };

      // Draw all bots then player
      state.bots.forEach(drawSnake);
      if (!player.isDead) {
        drawSnake(player);
      }

      ctx.restore();

      // Draw Minimap (bottom right corner)
      const miniSize = 110;
      const miniPad = 16;
      const miniX = cw - miniSize - miniPad;
      const miniY = ch - miniSize - miniPad;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(miniX, miniY, miniSize, miniSize, 8);
      ctx.fill();
      ctx.stroke();

      // Minimap dots for bots
      state.bots.forEach((b) => {
        if (b.isDead) return;
        const mbx = miniX + (b.body[0].x / state.width) * miniSize;
        const mby = miniY + (b.body[0].y / state.height) * miniSize;
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(mbx, mby, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Minimap player
      if (!player.isDead) {
        const mpx = miniX + (newHeadX / state.width) * miniSize;
        const mpy = miniY + (newHeadY / state.height) * miniSize;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(mpx, mpy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!player.isDead) {
        animationFrameId = requestAnimationFrame(updateAndRender);
      }
    };

    animationFrameId = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  // Input Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    gameState.current.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = () => {
    gameState.current.keys.boost = true;
  };

  const handleMouseUp = () => {
    gameState.current.keys.boost = false;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : ''
      }`}
    >
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mass:</span>
          <span className="text-xl font-black text-white font-mono">{score.toLocaleString()}</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-400">Best:</span>
          <span className="text-sm font-bold text-amber-300 font-mono">{highScore.toLocaleString()}</span>
        </div>
      </div>

      {/* Top Right Controls & Leaderboard */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Live Leaderboard Widget */}
        {isPlaying && !isGameOver && (
          <div className="bg-slate-900/85 backdrop-blur-md px-3 py-2.5 rounded-xl border border-slate-700/80 w-44 shadow-xl text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Leaderboard</span>
              <span className="text-emerald-400">Live</span>
            </div>
            <div className="space-y-1">
              {leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between font-mono ${
                    item.isPlayer ? 'text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate max-w-[100px]">
                    {idx + 1}. {item.name}
                  </span>
                  <span>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-crosshair block flex-1"
      />

      {/* Start / Pre-Game Lobby Overlay */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <span className="text-3xl">🐍</span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              Stabikid Slither Arena
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Official Built-in IO Arena! Steer with mouse, click to speed boost, and trap enemy snakes.
            </p>

            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Your Nickname
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-white font-medium outline-none transition-colors"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Viper Skin
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {SKINS.map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setSelectedSkin(skin)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        selectedSkin.id === skin.id
                          ? 'border-emerald-400 bg-emerald-500/20 scale-105'
                          : 'border-slate-700 hover:border-slate-500 bg-slate-800/60'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-inner"
                        style={{ backgroundColor: skin.color }}
                      />
                      <span className="text-[10px] text-slate-300 truncate w-full text-center">
                        {skin.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={initGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              Play Now (Instant)
            </button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💥</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Crashed!</h3>
            <p className="text-sm text-slate-400 mb-6">You slithered into an opponent body.</p>

            <div className="bg-slate-800/80 rounded-2xl p-4 mb-6 border border-slate-700/60 flex items-center justify-around">
              <div>
                <div className="text-xs text-slate-400 mb-1">Final Mass</div>
                <div className="text-2xl font-black text-white font-mono">{score.toLocaleString()}</div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <div className="text-xs text-slate-400 mb-1">High Score</div>
                <div className="text-2xl font-black text-amber-400 font-mono">{highScore.toLocaleString()}</div>
              </div>
            </div>

            <button
              onClick={initGame}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none text-xs text-slate-400 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-800">
        Controls: <span className="text-slate-200 font-semibold">Mouse</span> to steer •{' '}
        <span className="text-slate-200 font-semibold">Left Click / Space</span> to Speed Boost
      </div>
    </div>
  );
};

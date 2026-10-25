import React from 'react';

interface GameLogoProps {
  gameId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const GameLogo: React.FC<GameLogoProps> = ({ gameId, size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-xl',
  };

  const containerClasses = `${sizeMap[size]} rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg select-none ${className}`;

  switch (gameId) {
    case 'slither-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-emerald-600 to-teal-400 border border-emerald-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Glowing Coiled Snake Body */}
            <path
              d="M12 44C12 50 18 54 26 54C36 54 42 46 42 36C42 24 30 20 30 14C30 10 34 8 40 8C46 8 50 12 52 16"
              stroke="#047857"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M12 44C12 50 18 54 26 54C36 54 42 46 42 36C42 24 30 20 30 14C30 10 34 8 40 8C46 8 50 12 52 16"
              stroke="#34d399"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Snake Head */}
            <circle cx="14" cy="42" r="7" fill="#6ee7b7" />
            <circle cx="12" cy="40" r="2.2" fill="#064e3b" />
            <circle cx="16" cy="45" r="2.2" fill="#064e3b" />
            <circle cx="11.5" cy="39.5" r="0.8" fill="#ffffff" />
            <circle cx="15.5" cy="44.5" r="0.8" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'agar-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-blue-600 to-indigo-800 border border-blue-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Main Big Cell */}
            <circle cx="28" cy="28" r="18" fill="#3b82f6" />
            <circle cx="24" cy="24" r="14" fill="#60a5fa" fillOpacity="0.4" />
            {/* Split Cell */}
            <circle cx="46" cy="44" r="11" fill="#ec4899" />
            {/* Virus green spiky */}
            <circle cx="48" cy="18" r="7" fill="#22c55e" stroke="#15803d" strokeWidth="2" strokeDasharray="3 2" />
            {/* Pellets */}
            <circle cx="14" cy="48" r="3" fill="#facc15" />
            <circle cx="34" cy="52" r="2.5" fill="#a855f7" />
          </svg>
        </div>
      );

    case 'diep-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-cyan-600 to-blue-800 border border-cyan-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Tank Turret */}
            <rect x="28" y="10" width="10" height="22" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
            {/* Tank Body */}
            <circle cx="33" cy="36" r="15" fill="#06b6d4" stroke="#0e7490" strokeWidth="3" />
            {/* Yellow Square Polygon */}
            <rect x="42" y="10" width="10" height="10" rx="1.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            {/* Red Triangle */}
            <polygon points="12,18 20,30 8,30" fill="#f87171" stroke="#dc2626" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'paper-io-2':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-pink-600 to-rose-700 border border-pink-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Paper territory fill */}
            <path d="M12 20C12 20 22 14 36 16C50 18 52 30 52 42C52 50 40 52 28 50C16 48 12 36 12 20Z" fill="#fb7185" fillOpacity="0.45" />
            {/* Paper trail ribbon */}
            <path d="M14 22L28 16L44 26L48 40" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Player square block */}
            <rect x="42" y="34" width="12" height="12" rx="2.5" fill="#ffffff" stroke="#e11d48" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'hole-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-purple-800 to-black border border-purple-500/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Gravitational swirl */}
            <ellipse cx="32" cy="34" rx="24" ry="16" fill="#09090b" stroke="#a855f7" strokeWidth="3" />
            <ellipse cx="32" cy="34" rx="16" ry="10" fill="#000000" />
            {/* Falling building */}
            <rect x="26" y="14" width="8" height="14" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" transform="rotate(-18 30 21)" />
            {/* Tree getting sucked in */}
            <circle cx="42" cy="24" r="5" fill="#22c55e" />
          </svg>
        </div>
      );

    case 'krunker-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-amber-600 to-stone-900 border border-amber-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Crosshair Outer Ring */}
            <circle cx="32" cy="32" r="22" stroke="#fbbf24" strokeWidth="3" strokeDasharray="6 4" />
            <circle cx="32" cy="32" r="4" fill="#ef4444" />
            {/* Reticle Lines */}
            <line x1="32" y1="6" x2="32" y2="18" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="46" x2="32" y2="58" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="6" y1="32" x2="18" y2="32" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <line x1="46" y1="32" x2="58" y2="32" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    case '1v1-lol':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-red-600 to-amber-700 border border-red-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Ramp / Stairs building */}
            <polygon points="12,48 48,16 52,20 16,52" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            <rect x="22" y="24" width="20" height="24" rx="2" fill="#f87171" fillOpacity="0.4" stroke="#dc2626" strokeWidth="2" />
            {/* Crossed guns */}
            <circle cx="32" cy="32" r="6" fill="#fbbf24" />
          </svg>
        </div>
      );

    case 'shell-shockers':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-yellow-500 to-amber-700 border border-amber-300/50`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Egg Body */}
            <ellipse cx="32" cy="34" rx="16" ry="20" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
            {/* Combat Helmet */}
            <path d="M16 28C16 18 24 14 32 14C40 14 48 18 48 28Z" fill="#15803d" stroke="#14532d" strokeWidth="2" />
            {/* Cool Aviator Goggles */}
            <rect x="20" y="27" width="10" height="7" rx="2" fill="#0284c7" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="34" y="27" width="10" height="7" rx="2" fill="#0284c7" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="30" y1="30" x2="34" y2="30" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'smash-karts':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-blue-600 to-cyan-500 border border-blue-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Kart Wheels */}
            <circle cx="18" cy="46" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="46" cy="46" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            {/* Kart Body */}
            <path d="M12 40L24 24H42L52 40H12Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
            {/* Rocket on top */}
            <rect x="26" y="16" width="14" height="6" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
            <polygon points="40,16 46,19 40,22" fill="#f97316" />
          </svg>
        </div>
      );

    case 'skribbl-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-yellow-400 to-amber-500 border border-yellow-300/50`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Sketch / Scribble curve */}
            <path d="M12 44C20 44 22 28 34 32C44 36 48 20 54 22" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
            {/* Slanted pencil */}
            <g transform="rotate(-35 32 32)">
              <rect x="26" y="10" width="12" height="32" rx="2" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <polygon points="26,42 38,42 32,54" fill="#fde68a" stroke="#78350f" strokeWidth="1.5" />
              <polygon points="30,48 34,48 32,54" fill="#1e293b" />
              <rect x="26" y="6" width="12" height="6" rx="1.5" fill="#f43f5e" />
            </g>
          </svg>
        </div>
      );

    case 'bloxd-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-emerald-600 to-lime-700 border border-emerald-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Isometric Voxel Grass Block */}
            <polygon points="32,8 54,20 32,32 10,20" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
            <polygon points="10,20 32,32 32,54 10,42" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <polygon points="32,32 54,20 54,42 32,54" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'tetr-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-indigo-600 to-purple-800 border border-indigo-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* T-Tetromino */}
            <rect x="22" y="14" width="20" height="20" rx="3" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
            <rect x="2" y="34" width="20" height="20" rx="3" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
            <rect x="22" y="34" width="20" height="20" rx="3" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
            <rect x="42" y="34" width="20" height="20" rx="3" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'zombs-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-lime-600 to-emerald-800 border border-lime-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Gold Stash Box */}
            <rect x="18" y="22" width="28" height="26" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
            {/* Zombie Face Glow */}
            <circle cx="27" cy="32" r="3" fill="#ef4444" />
            <circle cx="37" cy="32" r="3" fill="#ef4444" />
            {/* Spikes */}
            <polygon points="8,40 18,34 18,46" fill="#64748b" />
            <polygon points="56,40 46,34 46,46" fill="#64748b" />
          </svg>
        </div>
      );

    case 'wings-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-sky-500 to-blue-700 border border-sky-400/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Fighter Jet */}
            <polygon points="32,8 44,48 32,42 20,48" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Jet cockpit */}
            <ellipse cx="32" cy="24" rx="3" ry="8" fill="#0284c7" />
            {/* Exhaust trail */}
            <polygon points="30,44 34,44 32,56" fill="#f97316" />
          </svg>
        </div>
      );

    case 'surviv-io':
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-emerald-700 to-amber-800 border border-emerald-500/40`}>
          <svg className="w-4/5 h-4/5 drop-shadow-md" viewBox="0 0 64 64" fill="none">
            {/* Survivor Circular Character */}
            <circle cx="32" cy="32" r="16" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
            {/* Hands */}
            <circle cx="16" cy="38" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="48" cy="38" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
            {/* Military helmet */}
            <ellipse cx="32" cy="26" rx="14" ry="8" fill="#15803d" />
          </svg>
        </div>
      );

    default:
      // Fallback stylized gaming emblem
      return (
        <div className={`${containerClasses} bg-gradient-to-tr from-violet-600 to-cyan-600 border border-white/20`}>
          <div className="font-black text-white font-mono tracking-tighter uppercase">
            {gameId.split('-')[0].slice(0, 3)}
          </div>
        </div>
      );
  }
};

import React from 'react';

interface AnimatedGlobeProps {
  type: 'pimind' | 'battle_arena';
  size?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const AnimatedGlobe: React.FC<AnimatedGlobeProps> = ({
  type,
  size = 200,
  isSelected = false,
  onClick,
}) => {
  const isAi = type === 'pimind';

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className={`relative cursor-pointer group flex items-center justify-center select-none transition-all duration-500 ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
    >
      {/* Outer Atmospheric Glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none"
        style={{
          background: isAi
            ? 'radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(239,68,68,0.25) 60%, transparent 80%)',
          transform: isSelected ? 'scale(1.3)' : 'scale(1.1)',
        }}
      />

      {/* Orbital Ring 1 - Inclined 65deg */}
      <div
        className="absolute rounded-full pointer-events-none animate-spin"
        style={{
          width: size * 1.45,
          height: size * 0.5,
          border: `1.5px dashed ${isAi ? 'rgba(6,182,212,0.5)' : 'rgba(245,158,11,0.55)'}`,
          boxShadow: isAi
            ? '0 0 15px rgba(6,182,212,0.3)'
            : '0 0 15px rgba(245,158,11,0.3)',
          transform: 'rotate(-25deg)',
          animationDuration: '18s',
        }}
      >
        {/* Orbital Satellite Node */}
        <div
          className={`absolute -top-1.5 left-1/3 w-3 h-3 rounded-full ${
            isAi ? 'bg-cyan-300 shadow-[0_0_10px_#22d3ee]' : 'bg-amber-300 shadow-[0_0_10px_#f59e0b]'
          }`}
        />
      </div>

      {/* Orbital Ring 2 - Opposite Inclination */}
      <div
        className="absolute rounded-full pointer-events-none animate-spin"
        style={{
          width: size * 1.3,
          height: size * 0.42,
          border: `1px solid ${isAi ? 'rgba(147,51,234,0.35)' : 'rgba(239,68,68,0.4)'}`,
          transform: 'rotate(40deg)',
          animationDirection: 'reverse',
          animationDuration: '24s',
        }}
      >
        <div
          className={`absolute -bottom-1 right-1/4 w-2 h-2 rounded-full ${
            isAi ? 'bg-purple-300 shadow-[0_0_8px_#c084fc]' : 'bg-red-400 shadow-[0_0_8px_#f87171]'
          }`}
        />
      </div>

      {/* Main Spherical Planet Body */}
      <div
        className="relative rounded-full overflow-hidden shadow-2xl transition-all duration-500"
        style={{
          width: size * 0.82,
          height: size * 0.82,
          boxShadow: isAi
            ? 'inset -18px -18px 35px rgba(0,0,0,0.85), inset 8px 8px 20px rgba(6,182,212,0.6), 0 0 30px rgba(6,182,212,0.35)'
            : 'inset -18px -18px 35px rgba(0,0,0,0.85), inset 8px 8px 20px rgba(245,158,11,0.6), 0 0 30px rgba(245,158,11,0.35)',
          background: isAi
            ? 'radial-gradient(circle at 32% 30%, #22d3ee 0%, #3b82f6 35%, #1e1b4b 75%, #030712 100%)'
            : 'radial-gradient(circle at 32% 30%, #fbbf24 0%, #ea580c 40%, #7f1d1d 75%, #030712 100%)',
        }}
      >
        {/* Animated Rotating Surface Texture (SVG Matrix Overlay) */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: isAi
              ? `radial-gradient(circle, #22d3ee 1.5px, transparent 1.5px), linear-gradient(to right, rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.15) 1px, transparent 1px)`
              : `radial-gradient(circle, #fbbf24 1.5px, transparent 1.5px), linear-gradient(to right, rgba(245,158,11,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(239,68,68,0.2) 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 12px 12px, 12px 12px',
            animation: 'spin 40s linear infinite',
          }}
        />

        {/* Dynamic Curved Surface Latitude Rings */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
          style={{
            transform: 'rotate(-15deg)',
          }}
        >
          {isAi ? (
            <>
              <ellipse cx="50" cy="50" rx="46" ry="20" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.8" strokeDasharray="3 2" />
              <ellipse cx="50" cy="50" rx="46" ry="34" fill="none" stroke="rgba(59,130,246,0.35)" strokeWidth="0.8" />
              <ellipse cx="50" cy="50" rx="20" ry="46" fill="none" stroke="rgba(168,85,247,0.35)" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(34,211,238,0.7)" strokeWidth="1" />
              <circle cx="50" cy="50" r="4" fill="#22d3ee" className="animate-ping" style={{ transformOrigin: '50% 50%' }} />
            </>
          ) : (
            <>
              <polygon points="50,15 80,75 20,75" fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth="0.8" />
              <ellipse cx="50" cy="50" rx="46" ry="18" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="0.9" strokeDasharray="4 2" />
              <ellipse cx="50" cy="50" rx="46" ry="36" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="0.9" />
              <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(251,191,36,0.8)" strokeWidth="1.2" strokeDasharray="5 3" />
              <circle cx="50" cy="50" r="5" fill="#f59e0b" className="animate-pulse" />
            </>
          )}
        </svg>

        {/* Specular Highlight Shielding */}
        <div
          className="absolute top-2 left-3 rounded-full pointer-events-none"
          style={{
            width: size * 0.35,
            height: size * 0.22,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotate(-30deg)',
          }}
        />

        {/* Central Project Insignia Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl backdrop-blur-md border ${
              isAi
                ? 'bg-cyan-950/70 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]'
                : 'bg-amber-950/70 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]'
            }`}
          >
            {isAi ? 'AI' : '⚔️'}
          </div>
        </div>
      </div>

      {/* Pulsing Core Wave */}
      <div
        className={`absolute rounded-full pointer-events-none animate-ping opacity-20 ${
          isAi ? 'bg-cyan-400' : 'bg-amber-400'
        }`}
        style={{
          width: size * 0.75,
          height: size * 0.75,
          animationDuration: '3.5s',
        }}
      />
    </div>
  );
};

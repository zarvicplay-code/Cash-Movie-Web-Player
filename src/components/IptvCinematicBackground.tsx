import React, { useMemo } from 'react';
import bgArtwork from '../assets/images/iptv_cinema_bg_1790913424628.jpg';

export const IptvCinematicBackground: React.FC = () => {
  // Generate random floating particles for the cinema projector ambiance
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.1 + (i % 3) * 7.3) % 96 + 2}%`,
      bottom: `${(i * 3.7) % 60 + 5}%`,
      size: `${(i % 3) * 1.5 + 2}px`,
      delay: `${(i * 0.4) % 6}s`,
      duration: `${7 + (i % 5) * 2}s`,
      opacity: (0.3 + (i % 4) * 0.18).toFixed(2),
      color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#f59e0b' : '#38bdf8',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Base Ultra Deep Cosmic Carbon Layer */}
      <div className="absolute inset-0 bg-[#030509]"></div>

      {/* 2. Luxury Cinematic Backdrop Artwork Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bgArtwork}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px] transform motion-safe:animate-slow-breathe transition-all duration-1000"
        />
        {/* Soft Multiply tint to blend with deep dark theme */}
        <div className="absolute inset-0 bg-[#04060d]/65 mix-blend-multiply"></div>
      </div>

      {/* 3. Top Cinema Projector Beam & Signature Crimson Conical Glow */}
      <div
        className="absolute -top-44 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1300px] h-[550px] rounded-full blur-[120px] animate-ambient-glow"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(220,38,38,0.55) 0%, rgba(185,28,28,0.35) 40%, rgba(69,10,10,0.15) 70%, transparent 100%)',
        }}
      ></div>

      {/* 4. Warm Amber & Gold Horizon Accent (Center/Right Projector Warmth) */}
      <div
        className="absolute top-1/3 -right-28 w-[500px] h-[500px] rounded-full blur-[140px] opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(180,83,9,0.18) 45%, transparent 100%)',
        }}
      ></div>

      {/* 5. Electric Sapphire & Indigo Atmosphere (Bottom Left) */}
      <div
        className="absolute -bottom-24 -left-20 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(30,58,138,0.2) 50%, transparent 100%)',
        }}
      ></div>

      {/* 6. Subtle Digital Broadcast Mesh Pattern (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.09]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="iptvMatrixGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" />
            <circle cx="24" cy="24" r="0.8" fill="#ef4444" fillOpacity="0.8" />
          </pattern>
          <radialGradient id="matrixFade" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <mask id="matrixMask">
            <rect width="100%" height="100%" fill="url(#matrixFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#iptvMatrixGrid)" mask="url(#matrixMask)" />
      </svg>

      {/* 7. Floating Cinema Projector Dust & Ember Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              opacity: p.opacity,
              animation: `floatParticle ${p.duration} ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* 8. Anamorphic Laser Horizon Beam with Periodic Light Sweep */}
      <div className="absolute top-[72px] sm:top-[84px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
      <div className="absolute top-[73px] sm:top-[85px] left-0 right-0 h-[2px] overflow-hidden">
        <div 
          className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-400 to-transparent blur-[1px]"
          style={{
            animation: 'flareSweep 8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        ></div>
      </div>

      {/* 9. Premium IMAX Deep Radial Vignette (Ensures ultra-sharp contrast for UI) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(3,5,9,0.7) 65%, #020307 100%)',
        }}
      ></div>
    </div>
  );
};

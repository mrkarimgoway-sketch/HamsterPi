/**
 * High-performance, mobile-safe confetti celebration system.
 * Uses lightweight DOM particles with GPU-accelerated CSS animations.
 * Eliminates Android WebView / Pi Browser canvas opacity and white-screen blanking bugs.
 */

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
}

const COLORS = [
  '#f59e0b', // amber-500
  '#fbbf24', // amber-400
  '#ec4899', // pink-500
  '#8b5cf6', // purple-500
  '#a855f7', // purple-400
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#f97316', // orange-500
];

export default function confetti(options: ConfettiOptions = {}) {
  if (typeof document === 'undefined') return;

  const count = options.particleCount || 40;
  const originX = (options.origin?.x ?? 0.5) * window.innerWidth;
  const originY = (options.origin?.y ?? 0.5) * window.innerHeight;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '99999';
  container.style.overflow = 'hidden';
  container.style.backgroundColor = 'transparent';

  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = Math.random() * 8 + 6; // 6px - 14px
    const isCircle = Math.random() > 0.6;

    // Angle and velocity
    const angle = (Math.random() * 120 + 210) * (Math.PI / 180); // upward arc
    const velocity = Math.random() * 320 + 220; // 220 - 540 px
    const vx = Math.cos(angle) * velocity * (Math.random() > 0.5 ? 1 : -1);
    const vy = Math.sin(angle) * velocity;
    const rotSpeed = (Math.random() - 0.5) * 720;

    particle.style.position = 'absolute';
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${isCircle ? size : size * 0.5}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = isCircle ? '50%' : '2px';
    particle.style.pointerEvents = 'none';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.opacity = '1';
    particle.style.transition = 'transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 1.1s ease-in';

    container.appendChild(particle);

    // Trigger animation in next animation frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fallDistance = vy + 300; // gravity pull
        particle.style.transform = `translate(calc(-50% + ${vx}px), calc(-50% + ${fallDistance}px)) rotate(${rotSpeed}deg)`;
        particle.style.opacity = '0';
      });
    });
  }

  // Cleanup DOM container after animation finishes
  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 1300);
}

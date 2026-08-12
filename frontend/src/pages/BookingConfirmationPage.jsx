import React, { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, ArrowLeft, Sparkles, PartyPopper } from 'lucide-react';
import TicketPass from '../components/TicketPass';

/**
 * BookingConfirmationPage presents ticket purchase success receipt,
 * renders interactive TicketPass E-Ticket component, and triggers celebration canvas confetti.
 */
export default function BookingConfirmationPage() {
  const location = useLocation();
  const booking = location.state?.booking;
  const canvasRef = useRef(null);

  // Confetti Particle Canvas Animation
  useEffect(() => {
    if (!booking) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e11d48', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'];
    const particleCount = 70;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
      });
    }

    let startTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (elapsed < 4500) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [booking]);

  if (!booking) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-300">No Booking Information Found</h2>
        <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto space-y-8 pb-16 text-center">
      {/* Celebration Confetti Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      <div className="space-y-3 pt-4 animate-scale-up">
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white border-4 border-white dark:border-slate-900 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
          <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          Booking Confirmed! <PartyPopper className="w-8 h-8 text-amber-500" />
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto">
          Your VIP movie tickets have been issued. Show this digital pass or QR code at the cinema entry gate.
        </p>
      </div>

      {/* Ticket Pass Preview */}
      <TicketPass booking={booking} />

      <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-800 shadow-md transition-all hover:scale-105"
        >
          <Ticket className="w-4 h-4 text-rose-500" />
          View All My Bookings
        </Link>

        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}


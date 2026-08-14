import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * MainLayout — top-level shell layout wrapping all BookTicket pages.
 * Renders Navbar at the top, Footer at the bottom, and animates page transitions
 * using Framer Motion. Also tracks mouse position for a subtle cursor-glow ambient effect.
 *
 * @param {React.ReactNode} children - Page content to render in the layout body
 * @param {function} [onSearchChange] - Optional callback to propagate Navbar search input
 */
export default function MainLayout({ children, onSearchChange }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Grid Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70"></div>

      {/* Background Ambient Glows for premium cinematic grading */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 dark:opacity-60 transition-opacity duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ambient-glow-rose"></div>
        <div className="absolute top-[30%] -right-[10%] w-[55%] h-[55%] rounded-full blur-[150px] ambient-glow-indigo"></div>
        <div className="absolute -bottom-[10%] left-[10%] w-[45%] h-[45%] rounded-full blur-[120px] ambient-glow-rose"></div>
      </div>

      {/* Interactive mouse-following spotlight glow */}
      {isHovering && (
        <div
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500 opacity-0 dark:opacity-40"
          style={{
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 42, 95, 0.1), transparent 80%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onSearchChange={onSearchChange} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}



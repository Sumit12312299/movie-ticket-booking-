import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children, onSearchChange }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden">
      {/* Background Ambient Glows for premium cinematic grading */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 dark:opacity-60 transition-opacity duration-500">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ambient-glow-rose"></div>
        <div className="absolute top-[30%] -right-[10%] w-[55%] h-[55%] rounded-full blur-[150px] ambient-glow-indigo"></div>
        <div className="absolute -bottom-[10%] left-[10%] w-[45%] h-[45%] rounded-full blur-[120px] ambient-glow-rose"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar onSearchChange={onSearchChange} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTop component automatically scrolls the window viewport to top
 * on route/pathname transitions and renders a floating scroll-to-top button
 * when the page scroll offset is greater than 400px.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Smooth scroll to top on page/pathname changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  // Track page scroll to show/hide floating button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md hover:bg-rose-600 hover:text-white dark:hover:bg-rose-650 transition-all duration-300 scale-100 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

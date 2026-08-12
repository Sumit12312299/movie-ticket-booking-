import React from 'react';
import { X, Play } from 'lucide-react';

/**
 * Extracts standard 11-character YouTube video ID from various URL formats.
 * @param {string} url - Raw YouTube URL string
 * @returns {string|null} Video ID or null if unparseable
 */
const parseYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Constructs clean YouTube iframe embed URL.
 * @param {string} url - Raw YouTube URL string
 * @returns {string} YouTube embed URL
 */
const getEmbedUrl = (url) => {
  const videoId = parseYoutubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

/**
 * TrailerModal displays movie video trailer content in an overlay modal.
 * Leverages YouTube embedding API helpers to parse URLs and render iframes.
 * 
 * @param {object} props
 * @param {object} props.movie - Catalog movie record containing trailer_url and title
 * @param {function} props.onClose - Close callback handler function
 */
export default function TrailerModal({ movie, onClose }) {
  if (!movie || !movie.trailer_url) return null;

  const embedUrl = getEmbedUrl(movie.trailer_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-slide-up">
      <div className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-bold text-white truncate">{movie.title} — Official Trailer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video iFrame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={embedUrl.includes('autoplay') ? embedUrl : `${embedUrl}?autoplay=1&mute=1`}
            title={`${movie.title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

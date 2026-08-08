import React, { useState, useEffect } from 'react';
import { IndianRupee, Ticket, Film, Users, Plus, Trash2, Edit3, ShieldAlert, BarChart3, TrendingUp, Calendar, MapPin } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { addToast } = useNotification();

  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');

  // Add Movie Modal state
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    synopsis: '',
    genre: 'Sci-Fi, Action',
    language: 'English',
    duration_mins: 120,
    release_date: '2026-08-01',
    poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    trailer_url: 'https://www.youtube.com/embed/Way9Dexny3w',
    status: 'now_showing',
    cast: 'Actor A, Actor B',
    director: 'Director X'
  });

  // Add Showtime state
  const [showAddShowtime, setShowAddShowtime] = useState(false);
  const [newShowtime, setNewShowtime] = useState({
    movie_id: '',
    theater_name: 'CinePlex Grand IMAX',
    screen_type: 'IMAX 3D Laser',
    show_date: new Date().toISOString().split('T')[0],
    show_time: '07:30 PM',
    regular_price: 15.00,
    vip_price: 22.00,
    city: 'Mumbai'
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, bRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/movies', { params: { limit: 100 } }),
        API.get('/admin/bookings')
      ]);
      setStats(sRes.data);
      setMovies(mRes.data.items || []);
      setAllBookings(bRes.data || []);
      if (mRes.data.items?.length > 0) {
        setNewShowtime((prev) => ({ ...prev, movie_id: mRes.data.items[0].id }));
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load admin stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const genreArr = newMovie.genre.split(',').map((g) => g.trim());
      const castArr = newMovie.cast.split(',').map((c) => c.trim());

      await API.post('/movies', {
        ...newMovie,
        duration_mins: Number(newMovie.duration_mins),
        genre: genreArr,
        cast: castArr
      });

      addToast('Movie created successfully!', 'success');
      setShowAddMovie(false);
      fetchAdminData();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to create movie', 'error');
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Delete this movie record?')) return;
    try {
      await API.delete(`/movies/${movieId}`);
      addToast('Movie deleted', 'info');
      fetchAdminData();
    } catch (err) {
      addToast('Failed to delete movie', 'error');
    }
  };

  const handleCreateShowtime = async (e) => {
    e.preventDefault();
    try {
      await API.post('/showtimes', {
        ...newShowtime,
        regular_price: Number(newShowtime.regular_price),
        vip_price: Number(newShowtime.vip_price)
      });
      addToast('Showtime added successfully!', 'success');
      setShowAddShowtime(false);
      fetchAdminData();
    } catch (err) {
      addToast('Failed to add showtime', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-slate-400">Admin privileges required to access the control portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Management Console</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Admin Analytics & Catalog Control</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMovie(true)}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Movie
          </button>

          <button
            onClick={() => setShowAddShowtime(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule Showtime
          </button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Revenue</span>
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">₹{stats.total_revenue.toFixed(2)}</p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18.5% this month</span>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-rose-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tickets Sold</span>
              <Ticket className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stats.total_tickets_sold}</p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Across all screens</span>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Movies</span>
              <Film className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stats.total_movies}</p>
            <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold">Now Showing & Upcoming</span>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-sky-500">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registered Users</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stats.total_users}</p>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Customer Accounts</span>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        {['analytics', 'movies', 'bookings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Analytics Charts */}
      {activeTab === 'analytics' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              Revenue Distribution by Genre
            </h3>
            <div className="space-y-4 pt-2">
              {Object.entries(stats.revenue_by_genre || {}).map(([genre, amount]) => {
                const pct = stats.total_revenue > 0 ? (amount / stats.total_revenue) * 100 : 25;
                return (
                  <div key={genre} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{genre}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">₹{amount.toFixed(2)} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-rose-600 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Recent System Activity Log
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {stats.recent_bookings?.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{b.user_name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{b.movie_title} • {b.seats.join(', ')}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{b.total_amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Movies Catalog CRUD */}
      {activeTab === 'movies' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Movie Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-900 uppercase text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3">Poster</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {movies.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-900/40">
                    <td className="p-3">
                      <img src={m.poster_url} alt={m.title} className="w-10 h-14 object-cover rounded-md" />
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{m.title}</td>
                    <td className="p-3">{m.genre.join(', ')}</td>
                    <td className="p-3 font-mono font-bold text-amber-500">★ {m.rating.toFixed(1)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteMovie(m.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                        title="Delete movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-slide-up">
          <div className="relative max-w-xl w-full glass-card p-6 rounded-3xl border border-rose-500/40 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Movie Record</h3>
              <button onClick={() => setShowAddMovie(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMovie} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Synopsis</label>
                <textarea
                  rows={2}
                  value={newMovie.synopsis}
                  onChange={(e) => setNewMovie({ ...newMovie, synopsis: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Genre (Comma separated)</label>
                  <input
                    type="text"
                    value={newMovie.genre}
                    onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newMovie.duration_mins}
                    onChange={(e) => setNewMovie({ ...newMovie, duration_mins: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Poster URL</label>
                <input
                  type="text"
                  value={newMovie.poster_url}
                  onChange={(e) => setNewMovie({ ...newMovie, poster_url: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-xs">
                Save Movie Entry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Showtime Modal */}
      {showAddShowtime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-slide-up">
          <div className="relative max-w-md w-full glass-card p-6 rounded-3xl border border-amber-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Showtime Slot</h3>
              <button onClick={() => setShowAddShowtime(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateShowtime} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Select Movie</label>
                <select
                  value={newShowtime.movie_id}
                  onChange={(e) => setNewShowtime({ ...newShowtime, movie_id: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">City Location</label>
                <select
                  value={newShowtime.city}
                  onChange={(e) => setNewShowtime({ ...newShowtime, city: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Phagwara">Phagwara</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Theater Venue</label>
                <input
                  type="text"
                  value={newShowtime.theater_name}
                  onChange={(e) => setNewShowtime({ ...newShowtime, theater_name: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Screen Format</label>
                <select
                  value={newShowtime.screen_type}
                  onChange={(e) => setNewShowtime({ ...newShowtime, screen_type: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="IMAX 3D Laser">IMAX 3D Laser</option>
                  <option value="VIP Dolby Atmos">VIP Dolby Atmos</option>
                  <option value="Standard 2D">Standard 2D</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newShowtime.show_date}
                    onChange={(e) => setNewShowtime({ ...newShowtime, show_date: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newShowtime.show_time}
                    onChange={(e) => setNewShowtime({ ...newShowtime, show_time: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newShowtime.regular_price}
                    onChange={(e) => setNewShowtime({ ...newShowtime, regular_price: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">VIP Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={newShowtime.vip_price}
                    onChange={(e) => setNewShowtime({ ...newShowtime, vip_price: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                Create Showtime Slot
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

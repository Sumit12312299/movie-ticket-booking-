import React, { useState, useEffect } from 'react';
import {
  getDashboard,
  getAllMoviesAdmin,
  createMovie,
  deleteMovie,
  getTheatres,
  createTheatre,
  deleteTheatre,
  getAllShows,
  createShow,
  deleteShow,
  getAllUsers,
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Shield, Film, MapPin, Calendar, Users, DollarSign, Plus, Trash2, CheckCircle, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Entities state
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);

  // Add forms state
  const [newMovie, setNewMovie] = useState({
    title: '', description: '', language: 'English', genre: 'Action', duration_mins: 120, release_date: '2025-01-01', poster_url: ''
  });
  const [newTheatre, setNewTheatre] = useState({ name: '', location: '', total_screens: 3 });
  const [newShow, setNewShow] = useState({ movie_id: '', theatre_id: '', screen_id: '', show_time: '', price: 250 });

  const [screensList, setScreensList] = useState([]);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dRes, mRes, tRes, sRes, uRes] = await Promise.all([
        getDashboard(),
        getAllMoviesAdmin(),
        getTheatres(),
        getAllShows(),
        getAllUsers(),
      ]);

      setStats(dRes.data);
      setMovies(mRes.data);
      setTheatres(tRes.data);
      setShows(sRes.data);
      setUsers(uRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await createMovie({
        ...newMovie,
        genre: newMovie.genre.split(',').map((g) => g.trim()),
        duration_mins: Number(newMovie.duration_mins),
      });
      setMsg('Movie added successfully!');
      fetchDashboard();
    } catch (e) {
      setErr(e.response?.data?.detail || 'Failed to add movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      fetchDashboard();
    } catch (e) {
      alert('Failed to delete movie');
    }
  };

  const handleCreateTheatre = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    try {
      await createTheatre({
        ...newTheatre,
        total_screens: Number(newTheatre.total_screens),
      });
      setMsg('Theatre added successfully!');
      fetchDashboard();
    } catch (e) {
      setErr(e.response?.data?.detail || 'Failed to add theatre');
    }
  };

  const handleDeleteTheatre = async (id) => {
    if (!window.confirm('Delete this theatre?')) return;
    try {
      await deleteTheatre(id);
      fetchDashboard();
    } catch (e) {
      alert('Failed to delete theatre');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Management Dashboard</h1>
            <p className="text-xs text-slate-400">System overview, metrics, and catalog management</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">₹{stats?.total_revenue || 0}</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Confirmed Bookings</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.confirmed_bookings || 0}</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.total_users || 0}</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold">Active Movies</span>
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{stats?.active_movies || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        {['overview', 'movies', 'theatres', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl capitalize transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts */}
      {msg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Revenue by Movie</h3>
          <div className="space-y-3">
            {stats?.revenue_by_movie?.map((rm, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40 text-xs">
                <span className="font-semibold text-slate-200">{rm._id}</span>
                <span className="font-bold text-emerald-400">₹{rm.total_revenue} ({rm.total_bookings} bookings)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Manage Movies */}
      {activeTab === 'movies' && (
        <div className="space-y-8">
          {/* Add Movie Form */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add New Movie</span>
            </h3>
            <form onSubmit={handleCreateMovie} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <input
                type="text"
                placeholder="Title"
                required
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Language"
                required
                value={newMovie.language}
                onChange={(e) => setNewMovie({ ...newMovie, language: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Genre (comma separated)"
                required
                value={newMovie.genre}
                onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Duration (mins)"
                required
                value={newMovie.duration_mins}
                onChange={(e) => setNewMovie({ ...newMovie, duration_mins: e.target.value })}
                className="input-field"
              />
              <input
                type="date"
                required
                value={newMovie.release_date}
                onChange={(e) => setNewMovie({ ...newMovie, release_date: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Poster Image URL"
                value={newMovie.poster_url}
                onChange={(e) => setNewMovie({ ...newMovie, poster_url: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                required
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                className="input-field md:col-span-2"
              />
              <button type="submit" className="btn-primary py-2.5 text-xs font-semibold md:col-span-2">
                Save Movie
              </button>
            </form>
          </div>

          {/* Movies List Table */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">Movie Catalog</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] text-slate-500 uppercase bg-slate-800/40">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Language</th>
                    <th className="p-3">Genre</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-bold text-white">{m.title}</td>
                      <td className="p-3">{m.language}</td>
                      <td className="p-3">{m.genre?.join(', ')}</td>
                      <td className="p-3">{m.duration_mins} mins</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteMovie(m.id)}
                          className="text-rose-400 hover:text-rose-300"
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
        </div>
      )}

      {/* Tab 3: Theatres */}
      {activeTab === 'theatres' && (
        <div className="space-y-8">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Add Theatre</span>
            </h3>
            <form onSubmit={handleCreateTheatre} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <input
                type="text"
                placeholder="Theatre Name"
                required
                value={newTheatre.name}
                onChange={(e) => setNewTheatre({ ...newTheatre, name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Location / City"
                required
                value={newTheatre.location}
                onChange={(e) => setNewTheatre({ ...newTheatre, location: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Total Screens"
                required
                value={newTheatre.total_screens}
                onChange={(e) => setNewTheatre({ ...newTheatre, total_screens: e.target.value })}
                className="input-field"
              />
              <button type="submit" className="btn-primary py-2.5 text-xs font-semibold md:col-span-3">
                Save Theatre
              </button>
            </form>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-base font-bold text-white mb-4">Theatres List</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] text-slate-500 uppercase bg-slate-800/40">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Screens</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {theatres.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-bold text-white">{t.name}</td>
                      <td className="p-3">{t.location}</td>
                      <td className="p-3">{t.total_screens}</td>
                      <td className="p-3">
                        <button onClick={() => handleDeleteTheatre(t.id)} className="text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div className="glass-card p-6">
          <h3 className="text-base font-bold text-white mb-4">Registered Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] text-slate-500 uppercase bg-slate-800/40">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/20">
                    <td className="p-3 font-mono text-slate-400">{u.id}</td>
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

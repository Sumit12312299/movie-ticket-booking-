import React from 'react';
import { Layers, Cpu, Database, ShieldCheck, Zap, RefreshCw, Server, Lock } from 'lucide-react';

export default function SystemDesignPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">System Architecture & Future Design</h1>
            <p className="text-xs text-slate-400">High-Availability Distributed Systems Design for Movie Ticket Booking</p>
          </div>
        </div>
      </div>

      {/* 1. Distributed Seat Locking */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-rose-500">
          <Lock className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">1. Distributed Seat Locking (Preventing Double Booking)</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          When thousands of users attempt to purchase seats for high-demand premieres simultaneously, traditional database transactions can suffer from race conditions or lock contention.
        </p>
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
          <p className="text-amber-400 font-bold">// Redis Redlock Algorithm Implementation Pattern</p>
          <p className="text-slate-300">Key Format: <span className="text-rose-400">seat_lock:showtime_101:A5</span></p>
          <p className="text-slate-300">TTL Expiration: <span className="text-emerald-400">300 Seconds (5 Minutes)</span></p>
          <p className="text-slate-400">
            Operation: SET seat_lock:showtime_101:A5 "user_99" NX PX 300000
          </p>
        </div>
      </section>

      {/* 2. Caching Strategy */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <Zap className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">2. High-Speed Multi-Layer Caching (Redis & CDN)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-400 text-sm">Read-Heavy Movie Metadata</h3>
            <p className="text-slate-300">
              Movie titles, cast, posters, and trailer URLs are cached in Redis with a 24-hour TTL and invalidated on Admin updates.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">Static Media Assets CDN</h3>
            <p className="text-slate-300">
              HD posters and video banners served globally via Cloudflare CDN edge nodes for sub-50ms latency.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Message Queues */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-sky-400">
          <RefreshCw className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">3. Asynchronous Task Processing (RabbitMQ / Kafka)</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Decouple booking confirmation from ticket pass rendering, PDF generation, email notifications, and analytics logging using message queues.
        </p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-white block">Booking Producer</span>
            <span className="text-[10px] text-slate-400">Emits TicketConfirmed Event</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-amber-400 block">RabbitMQ Exchange</span>
            <span className="text-[10px] text-slate-400">Routes to Queues</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-emerald-400 block">Worker Consumers</span>
            <span className="text-[10px] text-slate-400">PDF, QR, Email Dispatch</span>
          </div>
        </div>
      </section>

      {/* 4. Database Sharding & Replication */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 text-emerald-400">
          <Database className="w-6 h-6" />
          <h2 className="text-xl font-bold text-white">4. MongoDB Replication & Sharding</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Database collections are structured with compound indexes on <code className="text-rose-400 font-mono">movie_id</code> and <code className="text-rose-400 font-mono">show_date</code>. Read-replicas handle public search queries while Primary nodes process atomic seat bookings.
        </p>
      </section>
    </div>
  );
}

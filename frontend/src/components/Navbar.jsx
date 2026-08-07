import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, LogOut, Ticket, Shield, Menu, X, ChevronDown } from 'lucide-react';
import { getNotifications, markAllNotificationsRead } from '../services/api';

const Logo = () => (
  <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
    {/* Red play icon */}
    <div style={{
      width: '32px', height: '32px', background: 'var(--red)', borderRadius: '6px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <polygon points="3,2 12,7 3,12" fill="white" />
      </svg>
    </div>
    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
      Movie<span style={{ color: 'var(--red)' }}>Hub</span>
    </span>
  </Link>
);

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]         = useState([]);
  const [unread, setUnread]         = useState(0);

  useEffect(() => {
    if (isAuthenticated) fetchNotifs();
  }, [isAuthenticated, location.pathname]);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data);
      setUnread(res.data.filter(n => !n.is_read).length);
    } catch {}
  };

  const handleMarkRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/', label: 'Movies' },
    { to: '/', label: 'Theatres' },
    { to: '/', label: 'Offers' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border)',
        height: '64px', display: 'flex', alignItems: 'center',
        padding: '0 32px',
      }}>
        <div style={{
          maxWidth: '1280px', width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
        }}>
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }} className="hide-mobile">
            {navItems.map(item => (
              <Link key={item.label} to={item.to}
                style={{
                  padding: '8px 14px', borderRadius: '6px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                  color: location.pathname === item.to && item.to !== '/' ? '#fff' : item.to === '/' && location.pathname === '/' ? '#fff' : 'var(--text-mid)',
                  background: location.pathname === item.to ? 'rgba(229,57,53,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseOut={e => {
                  const active = (location.pathname === item.to);
                  e.currentTarget.style.color = active ? '#fff' : 'var(--text-mid)';
                  e.currentTarget.style.background = active ? 'rgba(229,57,53,0.1)' : 'transparent';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} className="hide-mobile">
            {isAuthenticated ? (
              <>
                {/* Bell */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setNotifOpen(p => !p)} style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                    borderRadius: '8px', width: '38px', height: '38px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-mid)', position: 'relative',
                    transition: 'all 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = 'var(--text-mid)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  >
                    <Bell size={17} />
                    {unread > 0 && (
                      <span style={{
                        position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px',
                        background: 'var(--red)', borderRadius: '50%', fontSize: '9px', fontWeight: 800,
                        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid var(--bg-nav)',
                      }}>{unread > 9 ? '9+' : unread}</span>
                    )}
                  </button>

                  {notifOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 10px)',
                      width: '320px', background: 'var(--bg-card2)',
                      border: '1px solid var(--border)', borderRadius: '10px', padding: '16px',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 100,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Notifications</span>
                        {unread > 0 && (
                          <button onClick={handleMarkRead} style={{ fontSize: '11px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {notifs.length === 0 ? (
                          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', padding: '20px' }}>No notifications</p>
                        ) : notifs.map(n => (
                          <div key={n.id} style={{
                            padding: '10px 12px', borderRadius: '6px',
                            background: n.is_read ? 'rgba(255,255,255,0.03)' : 'rgba(229,57,53,0.06)',
                            borderLeft: n.is_read ? '2px solid transparent' : '2px solid var(--red)',
                          }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#f0f0f0' }}>{n.title}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-mid)', marginTop: '3px' }}>{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User avatar */}
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  textDecoration: 'none', padding: '5px 12px 5px 6px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                  borderRadius: '24px', transition: 'all 0.2s',
                }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--red), #ff6b6b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '13px',
                  }}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f0f0', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name}
                  </span>
                </Link>

                <button onClick={handleLogout}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }}>Login</Link>
                <Link to="/register" className="btn-red" style={{ padding: '8px 20px', fontSize: '13px' }}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(p => !p)} className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)', display: 'none' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: 'var(--bg-nav)', borderBottom: '1px solid var(--border)',
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {navItems.map(item => (
            <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}
              style={{ padding: '10px 0', borderBottom: '1px solid var(--border-sm)', color: 'var(--text-mid)', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}
            >{item.label}</Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/my-bookings" onClick={() => setMobileOpen(false)} style={{ padding: '10px 0', color: 'var(--text-mid)', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>My Bookings</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                style={{ textAlign: 'left', padding: '10px 0', color: 'var(--red)', fontSize: '15px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-red" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: flex !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
      `}</style>
    </>
  );
}

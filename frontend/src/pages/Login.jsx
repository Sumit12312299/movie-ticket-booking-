import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Logo = () => (
  <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
    <div style={{ width: '36px', height: '36px', background: 'var(--red)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><polygon points="3,2 12,7 3,12" fill="white" /></svg>
    </div>
    <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
      Movie<span style={{ color: 'var(--red)' }}>Hub</span>
    </span>
  </Link>
);

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.data.user, res.data.access_token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  const inputStyle = (pl = 44) => ({
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: `12px 14px 12px ${pl}px`,
    color: 'var(--text-light)', fontSize: '14px', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Logo />
          <p style={{ marginTop: '10px', fontSize: '15px', color: 'var(--text-mid)' }}>Welcome Back!</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Login to continue to MovieHub</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '36px 32px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)',
              borderRadius: '8px', padding: '12px 14px', marginBottom: '22px',
            }}>
              <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: 'var(--red)', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={inputStyle(44)}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,57,53,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)' }}>Password</label>
                <button type="button" style={{ fontSize: '12px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...inputStyle(44), paddingRight: '44px' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,57,53,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', padding: 0,
                }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-red"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', fontWeight: 800, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
            {[
              { label: 'Google', color: '#fff', icon: 'G' },
              { label: 'Facebook', color: '#1877F2', icon: 'f' },
            ].map(s => (
              <button key={s.label} type="button" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '11px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                color: 'var(--text-light)', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <span style={{ fontWeight: 900, color: s.color, fontSize: '16px', lineHeight: 1 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Demo credentials */}
          <div style={{
            background: 'rgba(229,57,53,0.06)', border: '1px solid rgba(229,57,53,0.2)',
            borderRadius: '8px', padding: '12px 14px', marginBottom: '20px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-mid)', marginBottom: '6px' }}>🎬 Quick Demo</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
              <strong style={{ color: 'var(--text-mid)' }}>Customer:</strong> john@example.com / <code style={{ color: 'var(--red)' }}>john123</code>
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-mid)' }}>Admin:</strong> admin@cinema.com / <code style={{ color: 'var(--red)' }}>admin123</code>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

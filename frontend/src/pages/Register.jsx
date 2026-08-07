import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

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

export default function Register() {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [agreed, setAgreed]     = useState(false);

  const pwdStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthInfo = [
    { label: '', color: 'var(--border)' },
    { label: 'Weak', color: '#f44336' },
    { label: 'Medium', color: '#ff9800' },
    { label: 'Strong', color: '#4caf50' },
  ][pwdStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please agree to the Terms & Conditions.'); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      login(res.data.user, res.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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

  const onFocus = e => { e.target.style.borderColor = 'var(--red)'; e.target.style.boxShadow = '0 0 0 3px rgba(229,57,53,0.12)'; };
  const onBlur  = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  const perks = ['Book tickets instantly', 'Seat selection', 'E-ticket delivery', 'Exclusive offers'];

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Logo />
          <p style={{ marginTop: '10px', fontSize: '15px', color: 'var(--text-mid)' }}>Create Account</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Join MovieHub to book your favourite movies</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '36px 32px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '8px', padding: '12px 14px', marginBottom: '22px' }}>
              <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '13px', color: 'var(--red)', lineHeight: 1.5 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" style={inputStyle()} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle()} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type={showPwd ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" style={{ ...inputStyle(), paddingRight: '44px' }} onFocus={onFocus} onBlur={onBlur} />
                <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1,2,3].map(s => <div key={s} style={{ flex: 1, height: '3px', borderRadius: '2px', background: s <= pwdStrength ? strengthInfo.color : 'var(--border)', transition: 'background 0.3s' }} />)}
                  </div>
                  <span style={{ fontSize: '11px', color: strengthInfo.color, fontWeight: 600 }}>{strengthInfo.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm your password" style={{ ...inputStyle(), borderColor: confirm.length > 0 ? (confirm === password ? '#4caf50' : '#f44336') : 'var(--border)' }} onFocus={onFocus} onBlur={onBlur} />
                {confirm.length > 0 && (
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                    {confirm === password ? <CheckCircle size={16} color="#4caf50" /> : <AlertCircle size={16} color="#f44336" />}
                  </div>
                )}
              </div>
            </div>

            {/* Agree to terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '24px' }}>
              <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '2px', accentColor: 'var(--red)', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, cursor: 'pointer' }}>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'none' }}>Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" style={{ color: 'var(--red)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-red"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', fontWeight: 800, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating Account…' : 'Register'}
            </button>
          </form>

          {/* Perks */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
            {perks.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <CheckCircle size={11} color="#4caf50" /> {p}
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

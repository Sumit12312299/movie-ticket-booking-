import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, getPaymentHistory } from '../services/api';
import { User, Lock, CreditCard, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function UserProfile() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getPaymentHistory();
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoadingProfile(true);

    try {
      const res = await updateProfile({ name, email });
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.detail || 'Update failed' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    setLoadingPass(true);

    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      setPassMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to change password' });
    } finally {
      setLoadingPass(false);
    }
  };

  const AlertBox = ({ msg }) => {
    if (!msg.text) return null;
    const isError = msg.type === 'error';
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        background: isError ? 'rgba(229,57,53,0.08)' : 'rgba(76,175,80,0.08)',
        border: `1px solid ${isError ? 'rgba(229,57,53,0.3)' : 'rgba(76,175,80,0.3)'}`,
        borderRadius: '8px', padding: '12px 14px', marginBottom: '16px'
      }}>
        {isError ? <AlertCircle size={16} color="var(--red)" /> : <CheckCircle size={16} color="#4caf50" />}
        <span style={{ fontSize: '13px', color: isError ? 'var(--red)' : '#4caf50' }}>{msg.text}</span>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }} className="animate-fadeIn">
      <div className="section-heading" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '24px', background: 'var(--red)', borderRadius: '2px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#fff' }}>Account & Profile</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Profile Update */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <User size={18} color="var(--text-mid)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#fff' }}>Personal Information</h2>
          </div>

          <AlertBox msg={profileMsg} />

          <form onSubmit={handleUpdateProfile}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mh-input" required />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mh-input" required />
            </div>

            <button type="submit" disabled={loadingProfile} className="btn-red" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={16} /> {loadingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <Lock size={18} color="var(--text-mid)" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#fff' }}>Security & Password</h2>
          </div>

          <AlertBox msg={passMsg} />

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mh-input" required />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-mid)', marginBottom: '8px' }}>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mh-input" required />
            </div>

            <button type="submit" disabled={loadingPass} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <Lock size={16} /> {loadingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Payment History */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
          <CreditCard size={18} color="var(--text-mid)" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#fff' }}>Payment Transactions</h2>
        </div>

        {payments.length === 0 ? (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No payment transactions found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'var(--bg-card2)' }}>Transaction ID</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'var(--bg-card2)' }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'var(--bg-card2)' }}>Method</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'var(--bg-card2)' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', background: 'var(--bg-card2)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-sm)' }}>
                    <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-mid)' }}>{p.transaction_id}</td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>₹{p.amount}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-light)', textTransform: 'uppercase' }}>{p.payment_method}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(p.payment_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

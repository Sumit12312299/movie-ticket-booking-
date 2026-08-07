import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
    <div style={{ width: '32px', height: '32px', background: 'var(--red)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="3,2 12,7 3,12" fill="white" /></svg>
    </div>
    <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Movie<span style={{ color: 'var(--red)' }}>Hub</span></span>
  </div>
);

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    { title: 'Quick Links', links: [['/', 'Home'], ['/', 'Movies'], ['/', 'Theatres'], ['/', 'Offers'], ['/my-bookings', 'My Bookings']] },
    { title: 'Support',     links: [['#', 'Help & FAQ'], ['#', 'Contact Us'], ['#', 'Refund Policy'], ['#', 'Careers']] },
    { title: 'Legal',       links: [['#', 'Privacy Policy'], ['#', 'Terms of Service'], ['#', 'Cookie Policy'], ['#', 'Sitemap']] },
  ];

  return (
    <footer style={{ background: 'var(--bg-nav)', borderTop: '1px solid var(--border)', marginTop: '60px', padding: '52px 40px 28px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '44px' }}>

          {/* Brand */}
          <div>
            <Logo />
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '240px' }}>
              Your one-stop destination for movie ticket booking. Fast, secure, and seamless experience.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: '34px', height: '34px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-mid)', fontSize: '14px', fontWeight: 800, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-mid)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >{icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map(section => (
            <div key={section.title}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>{section.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.links.map(([href, label]) => (
                  <li key={label}>
                    <Link to={href} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseOver={e => e.target.style.color = 'var(--red)'}
                      onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>© {year} MovieHub Inc. All rights reserved.</p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Built with FastAPI · React · MongoDB</p>
        </div>
      </div>
    </footer>
  );
}

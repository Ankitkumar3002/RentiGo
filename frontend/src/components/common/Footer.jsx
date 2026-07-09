import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h3>RentiGo</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Experience the thrill of driving the world's most luxurious and high-performance cars and bikes. Your dream ride awaits.
          </p>
        </div>
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cars">Vehicles</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/company">Company</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/categories">All Categories</Link></li>
            <li><Link to="/cars?type=4-wheeler">4-Wheeler</Link></li>
            <li><Link to="/cars?type=2-wheeler">2-Wheeler</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul>
            <li style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>123 RentiGo Blvd, Car City</li>
            <li style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>contact@rentigo.com</li>
            <li style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>+1 234 567 8900</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} RentiGo. All rights reserved.</span>
        <span>Privacy Policy | Terms of Service</span>
      </div>
    </footer>
  );
};

export default Footer;

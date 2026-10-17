import { Link } from 'react-router-dom';
import { Package, Truck, BarChart2, Search } from 'lucide-react';

const Landing = () => (
  <div className="landing">
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Ship smarter with <span className="brand-highlight">ShipLink</span>
        </h1>
        <p className="hero-sub">
          A modern shipment tracking platform for businesses, drivers, and customers.
          Create shipments, assign deliveries, and track every step in real time.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary large">Get Started</Link>
          <Link to="/track" className="btn-outline large">Track a Shipment</Link>
        </div>
      </div>
    </section>

    <section className="features-section">
      <div className="features-grid">
        <div className="feature-card">
          <Package size={32} className="feature-icon" />
          <h3>Create Shipments</h3>
          <p>Approved businesses can create and manage shipments with auto-generated tracking numbers.</p>
        </div>
        <div className="feature-card">
          <Truck size={32} className="feature-icon" />
          <h3>Driver Management</h3>
          <p>Assign deliveries to drivers and vehicles. Drivers update status in real time.</p>
        </div>
        <div className="feature-card">
          <Search size={32} className="feature-icon" />
          <h3>Public Tracking</h3>
          <p>Anyone can track a shipment using its unique tracking number — no account needed.</p>
        </div>
        <div className="feature-card">
          <BarChart2 size={32} className="feature-icon" />
          <h3>Reports & Analytics</h3>
          <p>Admins get full visibility into deliveries, payments, and platform performance.</p>
        </div>
      </div>
    </section>

    <section className="cta-section">
      <h2>Ready to digitize your delivery operations?</h2>
      <Link to="/register" className="btn-primary large">Register Your Business</Link>
    </section>
  </div>
);

export default Landing;

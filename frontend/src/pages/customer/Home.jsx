import { Link } from "react-router-dom";
import Footer from "../../components/common/Footer";

const Home = () => (
  <div className="home-page" id="home">

    {/* ── Hero ── */}
    <section className="hero-section">
      <div className="hero-bg-anim" style={{ backgroundImage: `url('/lambo_bg.png')` }} />
      <div className="hero-overlay" />
      <div className="hero-content fade-in-up">
        <h1 className="hero-title">Your Journey, Your Ride:<br />Bikes &amp; Cars</h1>
        <p className="hero-subtitle">
          Rent the perfect 2-wheeler or 4-wheeler for any adventure.<br />
          Whether it's a sleek sports car or a nimble motorcycle, we've got you covered!
        </p>
        <div className="hero-buttons">
          <Link to="/cars"       className="btn-primary"  style={{ padding: "14px 40px", borderRadius: "4px", fontSize: "16px", textDecoration: "none" }}>Book a Ride</Link>
          <Link to="/about"      className="btn-outline"  style={{ padding: "14px 40px", borderRadius: "4px", fontSize: "16px", textDecoration: "none" }}>Learn More</Link>
        </div>
      </div>

      <div className="hero-features floating fade-in-up delay-1">
        <div className="hero-feature-item"><span className="hero-feature-icon">🏍️</span><span className="hero-feature-text">2-Wheelers</span></div>
        <div className="hero-feature-item"><span className="hero-feature-icon">🚗</span><span className="hero-feature-text">4-Wheelers</span></div>
        <div className="hero-feature-item"><span className="hero-feature-icon">💸</span><span className="hero-feature-text">Flexible Rates</span></div>
      </div>
    </section>

    {/* ── Why RentiGo ── */}
    <div className="app-content" style={{ paddingTop: "80px" }}>
      <div style={{ textAlign: "center", marginBottom: "56px" }}>
        <span className="section-badge">Why RentiGo</span>
        <h2 style={{ fontSize: "36px", marginTop: "12px" }}>The Smarter Way to Rent</h2>
        <p style={{ color: "var(--color-text-secondary)", maxWidth: "500px", margin: "12px auto 0" }}>
          Trusted by thousands of riders across India. Here's what makes us different.
        </p>
      </div>
      <div className="why-grid">
        {[
          { icon: "✅", title: "Verified Vehicles",    desc: "Every vehicle is inspected and approved before it appears on our platform." },
          { icon: "⚡", title: "Instant Booking",      desc: "Find your ride and confirm your booking in under 2 minutes — any time, any day." },
          { icon: "💰", title: "Transparent Pricing",  desc: "No hidden fees. See the full price breakdown before you confirm." },
          { icon: "🛡️", title: "Insured & Safe",       desc: "All bookings come with third-party insurance coverage for peace of mind." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="why-card">
            <span className="why-icon">{icon}</span>
            <h4>{title}</h4>
            <p>{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* ── Category Highlights ── */}
    <div className="app-content" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="section-badge">Browse by Category</span>
        <h2 style={{ fontSize: "36px", marginTop: "12px" }}>What Are You Looking For?</h2>
      </div>
      <div className="home-cat-grid">
        <Link to="/cars?type=4-wheeler" className="home-cat-card home-cat-car">
          <span className="home-cat-icon">🚗</span>
          <h3>Cars</h3>
          <p>Sedans, SUVs &amp; more</p>
          <span className="home-cat-cta">Browse Cars →</span>
        </Link>
        <Link to="/cars?type=2-wheeler" className="home-cat-card home-cat-bike">
          <span className="home-cat-icon">🏍️</span>
          <h3>Bikes &amp; Scooters</h3>
          <p>City commutes &amp; adventures</p>
          <span className="home-cat-cta">Browse Bikes →</span>
        </Link>
        <Link to="/categories" className="home-cat-card home-cat-all">
          <span className="home-cat-icon">🗂️</span>
          <h3>All Categories</h3>
          <p>See everything we offer</p>
          <span className="home-cat-cta">View All →</span>
        </Link>
      </div>
    </div>

    <Footer />
  </div>
);

export default Home;

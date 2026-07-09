import Footer from "../../components/common/Footer";

const milestones = [
  { year: "2022", title: "Founded",         desc: "RentiGo launched in Kolkata with just 12 vehicles and 3 agency partners." },
  { year: "2023", title: "City Expansion",  desc: "Expanded to 8 cities across West Bengal and Maharashtra. Crossed 1,000 happy customers." },
  { year: "2024", title: "Platform 2.0",    desc: "Launched our full-featured web platform with real-time booking and fleet management." },
  { year: "2025", title: "Series A Funded", desc: "Raised ₹15 Cr to accelerate growth and onboard 200+ agency partners." },
];

const values = [
  { icon: "🛡️", title: "Safety First",    desc: "Every vehicle is inspected before listing. Zero compromises." },
  { icon: "🤝", title: "Trust & Transparency", desc: "No hidden fees. What you see is what you pay." },
  { icon: "⚡", title: "Speed",            desc: "Book a vehicle in under 2 minutes. We value your time." },
  { icon: "🌱", title: "Sustainability",   desc: "We're actively growing our EV fleet to reduce carbon footprint." },
  { icon: "💬", title: "Customer First",   desc: "24/7 support for every booking. We're always here for you." },
  { icon: "🚀", title: "Innovation",       desc: "Constantly improving our tech so your experience gets better." },
];

const CompanyPage = () => (
  <div className="company-page">

    {/* Hero */}
    <section className="page-hero">
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <span className="page-hero-badge">The Company</span>
        <h1 className="page-hero-title">Driving India Forward</h1>
        <p className="page-hero-subtitle">
          From a small startup in Kolkata to a nationwide platform — here's our story.
        </p>
      </div>
    </section>

    <div className="app-content" style={{ paddingTop: "80px", paddingBottom: "80px" }}>

      {/* Company Intro */}
      <div className="company-intro">
        <div>
          <span className="section-badge">Who We Are</span>
          <h2>RentiGo Pvt. Ltd.</h2>
          <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.8", fontSize: "16px" }}>
            RentiGo is India's fastest-growing vehicle rental marketplace. We connect
            individual customers and businesses with verified rental agencies offering
            premium 2-wheelers and 4-wheelers across 15+ cities.
          </p>
          <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.8", fontSize: "16px", marginTop: "16px" }}>
            Our platform enables agencies to list, manage, and grow their fleet while
            giving customers a seamless booking experience — from search to keys in hand.
          </p>
        </div>
        <div className="company-info-box">
          <div className="info-row"><span>📍 Headquartered in</span><strong>Kolkata, India</strong></div>
          <div className="info-row"><span>📅 Founded</span><strong>2022</strong></div>
          <div className="info-row"><span>👥 Team size</span><strong>50+ employees</strong></div>
          <div className="info-row"><span>🏙️ Cities active</span><strong>15+ cities</strong></div>
          <div className="info-row"><span>🤝 Agency partners</span><strong>200+ agencies</strong></div>
          <div className="info-row"><span>📧 Contact</span><strong>hello@rentigo.com</strong></div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ margin: "80px 0" }}>
        <span className="section-badge">Our Journey</span>
        <h2 style={{ marginBottom: "48px" }}>Milestones That Define Us</h2>
        <div className="timeline">
          {milestones.map(({ year, title, desc }, i) => (
            <div key={year} className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
              <div className="timeline-dot">{year}</div>
              <div className="timeline-content">
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div>
        <span className="section-badge">Core Values</span>
        <h2 style={{ marginBottom: "40px" }}>What We Stand For</h2>
        <div className="values-grid">
          {values.map(({ icon, title, desc }) => (
            <div key={title} className="value-card">
              <span className="value-icon">{icon}</span>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="company-cta">
        <h2>Ready to Ride With Us?</h2>
        <p>Join thousands of happy riders. Book your next vehicle on RentiGo today.</p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/cars" className="btn-primary" style={{ padding: "14px 40px", borderRadius: "4px", textDecoration: "none", fontSize: "16px" }}>
            Browse Vehicles
          </a>
          <a href="/register" className="btn-outline" style={{ padding: "14px 40px", borderRadius: "4px", textDecoration: "none", fontSize: "16px" }}>
            Create Account
          </a>
        </div>
      </div>

    </div>

    <Footer />
  </div>
);

export default CompanyPage;

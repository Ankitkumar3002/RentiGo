import Footer from "../../components/common/Footer";

const stats = [
  { value: "5,000+", label: "Happy Customers" },
  { value: "200+",   label: "Vehicles in Fleet" },
  { value: "15+",    label: "Cities Covered" },
  { value: "99%",    label: "Satisfaction Rate" },
];

const team = [
  { name: "Arjun Mehta",    role: "CEO & Co-Founder",       emoji: "👨‍💼" },
  { name: "Priya Kapoor",   role: "CTO & Co-Founder",       emoji: "👩‍💻" },
  { name: "Rahul Sharma",   role: "Head of Operations",     emoji: "👨‍🔧" },
  { name: "Sneha Gupta",    role: "Head of Customer Success",emoji: "👩‍🎯" },
];

const testimonials = [
  {
    text: "I rented a Royal Enfield for a weekend trip to the mountains. The bike was flawless and the rental process was incredibly smooth. Highly recommend RentiGo!",
    name: "James Holden", role: "Adventure Rider", avatar: "/avatar_1.png",
  },
  {
    text: "I needed a reliable SUV for a family vacation. The car was pristine, spacious, and perfect for the long drive. RentiGo made the entire booking process effortless.",
    name: "Sarah Jenkins", role: "Family Traveler", avatar: "/avatar_2.png",
  },
  {
    text: "Whether I need a quick scooter for city commuting or a luxury car for a special event, this is my go-to platform. Best 2-wheeler and 4-wheeler options around.",
    name: "Marcus Chen", role: "Daily Commuter", avatar: "/avatar_3.png",
  },
];

const AboutPage = () => (
  <div className="about-page">

    {/* Hero */}
    <section className="page-hero">
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <span className="page-hero-badge">About Us</span>
        <h1 className="page-hero-title">We Make Mobility Simple</h1>
        <p className="page-hero-subtitle">
          RentiGo is India's premium vehicle rental marketplace connecting riders
          with top-quality bikes and cars across cities.
        </p>
      </div>
    </section>

    {/* Mission */}
    <div className="app-content" style={{ paddingTop: "80px" }}>
      <div className="about-mission">
        <div className="about-mission-text">
          <span className="section-badge">Our Mission</span>
          <h2>Redefining How India Moves</h2>
          <p>
            Founded in 2022, RentiGo was born from a simple idea: renting a vehicle
            should be as easy as ordering food online. We're building a platform where
            anyone can find the perfect ride — a city scooter, a weekend cruiser, or a
            family SUV — in just a few taps.
          </p>
          <p>
            We partner with verified local agencies to ensure every vehicle meets our
            quality and safety standards. No surprises, no hidden fees — just reliable
            rides when you need them.
          </p>
        </div>
        <div className="about-mission-visual">
          <div className="mission-card">
            <span style={{ fontSize: "48px" }}>🎯</span>
            <h3>Our Vision</h3>
            <p>A world where everyone has access to affordable, quality transportation on demand.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {stats.map(({ value, label }) => (
          <div key={label} className="about-stat-card">
            <span className="about-stat-value">{value}</span>
            <span className="about-stat-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="about-team-section">
        <span className="section-badge">The Team</span>
        <h2 style={{ marginBottom: "40px" }}>Meet the People Behind RentiGo</h2>
        <div className="team-grid">
          {team.map(({ name, role, emoji }) => (
            <div key={name} className="team-card">
              <div className="team-avatar">{emoji}</div>
              <h4>{name}</h4>
              <span>{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ paddingBottom: "80px" }}>
        <span className="section-badge">Testimonials</span>
        <h2 style={{ marginBottom: "10px" }}>What Our Clients Say</h2>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "40px" }}>
          Real experiences from our community of riders and drivers.
        </p>
        <div className="testimonials-grid">
          {testimonials.map(({ text, name, role, avatar }) => (
            <div key={name} className="testimonial-card">
              <p className="testimonial-text">"{text}"</p>
              <div className="testimonial-author">
                <img src={avatar} alt={name} onError={e => { e.target.style.display="none"; }} />
                <div className="testimonial-author-info">
                  <h4>{name}</h4>
                  <span>{role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export default AboutPage;

import { Link } from "react-router-dom";
import Footer from "../../components/common/Footer";

const categories = [
  {
    type: "4-wheeler",
    title: "Cars",
    emoji: "🚗",
    description: "Sedans, SUVs, hatchbacks, and luxury cars for every occasion — city rides, road trips, or family outings.",
    tags: ["Sedan", "SUV", "Hatchback", "Luxury", "MUV"],
    color: "#FF4500",
  },
  {
    type: "2-wheeler",
    title: "Bikes & Scooters",
    emoji: "🏍️",
    description: "From nimble city scooters to powerful touring bikes — perfect for daily commutes and long weekend adventures.",
    tags: ["Scooter", "Sports Bike", "Cruiser", "Tourer", "Commuter"],
    color: "#3B82F6",
  },
  {
    type: "electric",
    title: "Electric Vehicles",
    emoji: "⚡",
    description: "Go green with our growing EV fleet. Zero emissions, low cost, and a smooth silent ride every time.",
    tags: ["E-Scooter", "E-Car", "E-Bike"],
    color: "#10B981",
    comingSoon: true,
  },
  {
    type: "luxury",
    title: "Luxury & Premium",
    emoji: "💎",
    description: "Make a statement. Rent a high-end luxury vehicle for weddings, events, or just an unforgettable experience.",
    tags: ["Sports Car", "Convertible", "Limousine"],
    color: "#F59E0B",
    comingSoon: true,
  },
];

const faqItems = [
  { q: "What documents do I need to rent?", a: "A valid driving licence and a government-issued photo ID (Aadhaar, PAN, or Passport) are required." },
  { q: "Is there a minimum rental period?",  a: "Yes, minimum rental is 24 hours. We offer daily, weekly, and monthly plans." },
  { q: "Can I cancel my booking?",           a: "Yes, cancellations more than 24 hours before the rental start time are fully refunded." },
  { q: "Are vehicles insured?",              a: "All vehicles in our fleet carry third-party insurance. Comprehensive cover is available as an add-on." },
];

const CategoriesPage = () => (
  <div className="categories-page">

    {/* Hero */}
    <section className="page-hero">
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <span className="page-hero-badge">Categories</span>
        <h1 className="page-hero-title">Every Kind of Ride, In One Place</h1>
        <p className="page-hero-subtitle">
          Whether you need a bike for the morning commute or a car for the weekend —
          RentiGo has the right vehicle for every occasion.
        </p>
      </div>
    </section>

    <div className="app-content" style={{ paddingTop: "80px" }}>

      {/* Category Cards */}
      <span className="section-badge">Browse by Category</span>
      <h2 style={{ marginBottom: "40px" }}>What Are You Looking For?</h2>
      <div className="categories-grid">
        {categories.map(({ type, title, emoji, description, tags, color, comingSoon }) => (
          <div key={type} className="category-card" style={{ "--cat-color": color }}>
            {comingSoon && <span className="coming-soon-badge">Coming Soon</span>}
            <div className="category-card-icon">{emoji}</div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="category-tags">
              {tags.map(t => <span key={t} className="category-tag">{t}</span>)}
            </div>
            {!comingSoon && (
              <Link
                to={`/cars?type=${type}`}
                className="category-card-btn"
                style={{ background: color }}
              >
                Browse {title} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ margin: "80px 0" }}>
        <span className="section-badge">How It Works</span>
        <h2 style={{ marginBottom: "48px" }}>Rent a Vehicle in 3 Simple Steps</h2>
        <div className="steps-grid">
          {[
            { step: "01", icon: "🔍", title: "Browse & Choose",    desc: "Pick a category, filter by city and dates, and find your perfect vehicle." },
            { step: "02", icon: "📋", title: "Book Instantly",     desc: "Fill in your details, upload your licence, and confirm your booking online." },
            { step: "03", icon: "🚗", title: "Pick Up & Ride",     desc: "Head to the depot, collect your keys, and enjoy the open road." },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="step-card">
              <div className="step-number">{step}</div>
              <div className="step-icon">{icon}</div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: "80px" }}>
        <span className="section-badge">FAQ</span>
        <h2 style={{ marginBottom: "40px" }}>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqItems.map(({ q, a }) => (
            <div key={q} className="faq-item">
              <h4>❓ {q}</h4>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>

    <Footer />
  </div>
);

export default CategoriesPage;

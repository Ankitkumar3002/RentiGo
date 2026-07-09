import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleAPI } from "../../services/api";
import Footer from "../../components/common/Footer";

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleAPI.getById(id)
      .then(({ data }) => setVehicle(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="vd-page">
      <div style={{ height: "120px" }}></div>
      <p className="loading">Loading…</p>
    </div>
  );
  if (!vehicle) return (
    <div className="vd-page">
      <div style={{ height: "120px" }}></div>
      <p className="empty-state">Vehicle not found.</p>
    </div>
  );

  const { brand, model, type, fuelType, transmission, year, regNumber, city, pricing, photos } = vehicle;

  return (
    <div className="vd-page">
      <div style={{ height: "120px" }}></div>

      <div className="vd-container app-content">
        {/* Hero Image */}
        <div className="vd-hero">
          {photos?.[0] ? (
            <img src={photos[0]} alt={`${brand} ${model}`} className="vd-hero-img" />
          ) : (
            <div className="vd-hero-placeholder">
              <span>{type === "2-wheeler" ? "🏍️" : "🚗"}</span>
            </div>
          )}
          <div className="vd-hero-overlay">
            <span className="vd-type-badge">{type === "2-wheeler" ? "🏍️ Bike" : "🚗 Car"}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="vd-content-grid">
          {/* Left — Info */}
          <div className="vd-info-col">
            <div className="vd-title-block">
              <h1>{brand} {model}</h1>
              <p className="vd-reg">{regNumber}</p>
              {city && <p className="vd-city">📍 {city}</p>}
            </div>

            {/* Spec Cards */}
            <div className="vd-specs-grid">
              <div className="vd-spec-card">
                <div className="vd-spec-icon">⚡</div>
                <span className="vd-spec-label">Type</span>
                <strong>{type}</strong>
              </div>
              <div className="vd-spec-card">
                <div className="vd-spec-icon">⛽</div>
                <span className="vd-spec-label">Fuel</span>
                <strong style={{ textTransform: "capitalize" }}>{fuelType}</strong>
              </div>
              <div className="vd-spec-card">
                <div className="vd-spec-icon">⚙️</div>
                <span className="vd-spec-label">Transmission</span>
                <strong style={{ textTransform: "capitalize" }}>{transmission}</strong>
              </div>
              <div className="vd-spec-card">
                <div className="vd-spec-icon">📅</div>
                <span className="vd-spec-label">Year</span>
                <strong>{year}</strong>
              </div>
            </div>

            {/* Features */}
            <div className="vd-features">
              <h3>What's Included</h3>
              <div className="vd-features-list">
                <span>✅ Free cancellation</span>
                <span>✅ Unlimited km</span>
                <span>✅ Roadside assistance</span>
                <span>✅ Insurance included</span>
              </div>
            </div>
          </div>

          {/* Right — Pricing & Book */}
          <aside className="vd-pricing-col">
            <div className="vd-pricing-card">
              <h3>Pricing Plans</h3>
              {pricing && (
                <div className="vd-pricing-tiers">
                  <div className="vd-tier">
                    <div className="vd-tier-icon">📅</div>
                    <div className="vd-tier-info">
                      <span>Daily</span>
                      <strong>₹{pricing.daily}</strong>
                    </div>
                  </div>
                  <div className="vd-tier highlight">
                    <div className="vd-tier-popular">Most Popular</div>
                    <div className="vd-tier-icon">🗓️</div>
                    <div className="vd-tier-info">
                      <span>Weekly</span>
                      <strong>₹{pricing.weekly}</strong>
                    </div>
                  </div>
                  <div className="vd-tier">
                    <div className="vd-tier-icon">📆</div>
                    <div className="vd-tier-info">
                      <span>Monthly</span>
                      <strong>₹{pricing.monthly}</strong>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="vd-book-btn"
                onClick={() => navigate(`/book/${id}`)}
              >
                🚀 Book Now
              </button>

              <div className="vd-trust">
                <div><span>🔒</span> Secure payments</div>
                <div><span>⭐</span> Verified host</div>
                <div><span>📞</span> 24/7 support</div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetail;

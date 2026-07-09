import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { vehicleAPI } from "../../services/api";
import VehicleCard from "../../components/customer/VehicleCard";
import Footer from "../../components/common/Footer";

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") || "all";

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(typeParam);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await vehicleAPI.getAll({});
      setVehicles(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    setFilter(typeParam);
  }, [typeParam]);

  const handleFilterChange = (key) => {
    setFilter(key);
    if (key === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ type: key });
    }
  };

  const filtered = filter === "all"
    ? vehicles
    : vehicles.filter(v => v.type === filter);

  return (
    <div className="cars-page">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <span className="page-hero-badge">Our Fleet</span>
          <h1 className="page-hero-title">Find Your Perfect Ride</h1>
          <p className="page-hero-subtitle">
            Browse our premium collection of bikes and cars available for rent.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="cars-filter-bar app-content">
        {[
          { key: "all",       label: "All Vehicles", icon: "🚘" },
          { key: "4-wheeler", label: "Cars",         icon: "🚗" },
          { key: "2-wheeler", label: "Bikes",        icon: "🏍️" },
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? "active" : ""}`}
            onClick={() => handleFilterChange(key)}
          >
            <span>{icon}</span> {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="app-content" style={{ paddingTop: "8px", paddingBottom: "60px" }}>
        {loading ? (
          <p className="loading">Loading our fleet…</p>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No vehicles match this filter.</p>
        ) : (
          <>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
              Showing <strong style={{ color: "#fff" }}>{filtered.length}</strong> vehicle{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="vehicle-grid">
              {filtered.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CarsPage;

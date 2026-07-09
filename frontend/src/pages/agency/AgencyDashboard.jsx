import { useState, useEffect } from "react";
import { agencyAPI, bookingAPI } from "../../services/api";
import Footer from "../../components/common/Footer";

const AgencyDashboard = () => {
  const [fleet, setFleet] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    Promise.all([
      agencyAPI.getFleet(),
      bookingAPI.getAgency({ status: "pending" }),
    ])
      .then(([fleetRes, bookingsRes]) => {
        setFleet(fleetRes.data.data);
        setPendingBookings(bookingsRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, status) => {
    try {
      await bookingAPI.updateStatus(id, { status });
      setPendingBookings((prev) => prev.filter((b) => b._id !== id));
      showToast(`Booking request ${status} successfully!`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update booking status", "error");
    }
  };

  if (loading) return (
    <div className="ad-page">
      <div style={{ height: "120px" }}></div>
      <p className="loading">Loading dashboard…</p>
    </div>
  );

  const available   = fleet.filter((v) => v.status === "available").length;
  const rented       = fleet.filter((v) => v.status === "rented").length;
  const maintenance  = fleet.filter((v) => v.status === "maintenance").length;

  return (
    <div className="ad-page">
      <div style={{ height: "120px" }}></div>

      <div className="ad-container app-content">
        <div className="ad-header">
          <h1>Agency Overview</h1>
          <p className="ad-subtitle">Monitor your fleet performance and verify pending bookings</p>
        </div>

        {/* Stats Grid */}
        <div className="ad-metrics">
          <div className="ad-metric-card">
            <div className="ad-metric-top">
              <span className="ad-metric-icon">🚘</span>
              <span className="ad-metric-badge info">Active Fleet</span>
            </div>
            <p className="ad-metric-value">{fleet.length}</p>
            <p className="ad-metric-label">Total Vehicles Listed</p>
            <div className="ad-metric-footer">
              <span className="available">🟢 {available} Available</span>
              <span className="rented">🔵 {rented} Rented</span>
            </div>
          </div>

          <div className="ad-metric-card highlight">
            <div className="ad-metric-top">
              <span className="ad-metric-icon">⏳</span>
              <span className="ad-metric-badge warning">Needs Action</span>
            </div>
            <p className="ad-metric-value">{pendingBookings.length}</p>
            <p className="ad-metric-label">Pending Approvals</p>
            <div className="ad-metric-footer">
              <span className="alert-text">Review KYC & confirm dates</span>
            </div>
          </div>

          <div className="ad-metric-card">
            <div className="ad-metric-top">
              <span className="ad-metric-icon">🔧</span>
              <span className="ad-metric-badge danger">Service</span>
            </div>
            <p className="ad-metric-value">{maintenance}</p>
            <p className="ad-metric-label">In Maintenance</p>
            <div className="ad-metric-footer">
              <span>Block/unblock at any time</span>
            </div>
          </div>
        </div>

        {/* Pending approvals section */}
        <div className="ad-section">
          <h2>Pending Approvals</h2>
          
          {pendingBookings.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-icon">🎉</div>
              <h3>All caught up!</h3>
              <p>No pending booking requests require your approval at the moment.</p>
            </div>
          ) : (
            <div className="ad-list">
              {pendingBookings.map((b) => (
                <div key={b._id} className="ad-row-card">
                  <div className="ad-row-grid">
                    {/* Vehicle Details */}
                    <div className="ad-row-col">
                      <div className="ad-col-label">Vehicle</div>
                      <div className="ad-vehicle-info">
                        <span className="vehicle-type-icon">{b.vehicle?.type === "2-wheeler" ? "🏍️" : "🚗"}</span>
                        <div>
                          <h4>{b.vehicle?.brand} {b.vehicle?.model}</h4>
                          <p className="reg-number">{b.vehicle?.regNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="ad-row-col">
                      <div className="ad-col-label">Customer</div>
                      <div className="ad-customer-info">
                        <h4>{b.customer?.name}</h4>
                        <p className="muted">{b.customer?.email}</p>
                        {b.customer?.phone && <p className="muted">📞 {b.customer?.phone}</p>}
                      </div>
                    </div>

                    {/* Dates & Price */}
                    <div className="ad-row-col">
                      <div className="ad-col-label">Rental Details</div>
                      <div className="ad-rental-info">
                        <div className="ad-dates">
                          <span>📅 {new Date(b.pickupDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          <span className="arrow">→</span>
                          <span>{new Date(b.returnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>
                        <div className="ad-price">Total: <strong>₹{b.pricing?.total}</strong></div>
                      </div>
                    </div>

                    {/* Verification Documents */}
                    <div className="ad-row-col">
                      <div className="ad-col-label">KYC Documents</div>
                      <div className="ad-docs-info">
                        {b.licenceUrl ? (
                          <a href={`http://localhost:5000${b.licenceUrl}`} target="_blank" rel="noopener noreferrer" className="ad-doc-link">
                            🪪 Driving Licence
                          </a>
                        ) : (
                          <span className="no-doc">No Licence uploaded</span>
                        )}
                        {b.aadhaarUrl ? (
                          <a href={`http://localhost:5000${b.aadhaarUrl}`} target="_blank" rel="noopener noreferrer" className="ad-doc-link">
                            🆔 Aadhaar Card
                          </a>
                        ) : (
                          <span className="no-doc">No Aadhaar uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ad-row-actions">
                    <button className="ad-btn approve" onClick={() => handleAction(b._id, "approved")}>
                      ✓ Approve Request
                    </button>
                    <button className="ad-btn reject" onClick={() => handleAction(b._id, "rejected")}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`bh-toast bh-toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AgencyDashboard;

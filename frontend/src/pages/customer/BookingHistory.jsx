import { useState, useEffect, useCallback } from "react";
import { bookingAPI } from "../../services/api";
import Footer from "../../components/common/Footer";

const STATUS_TABS = ["all", "pending", "approved", "active", "completed", "cancelled"];
const STATUS_EMOJI = { pending: "⏳", approved: "✅", active: "🚗", completed: "🏁", cancelled: "❌", rejected: "🚫" };

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null); // booking id
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadBookings = useCallback(() => {
    setLoading(true);
    const params = activeTab === "all" ? {} : { status: activeTab };
    bookingAPI.getMy(params)
      .then(({ data }) => setBookings(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleCancel = async () => {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      await bookingAPI.cancel(cancelModal, { reason: cancelReason || "Customer requested cancellation" });
      setBookings((prev) => prev.map((b) =>
        b._id === cancelModal ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString() } : b
      ));
      showToast("Booking cancelled successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Cancellation failed", "error");
    } finally {
      setCancelling(false);
      setCancelModal(null);
      setCancelReason("");
    }
  };

  return (
    <div className="bh-page">
      <div style={{ height: "120px" }}></div>

      <div className="bh-container app-content">
        <div className="bh-header">
          <h1>My Bookings</h1>
          <p className="bh-subtitle">Track and manage all your vehicle rentals</p>
        </div>

        {/* Status Tabs */}
        <div className="bh-tabs">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              className={`bh-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div className="bh-tab-indicator" />}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bh-loading">
            <div className="bh-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bh-empty">
            <div className="bh-empty-icon">📭</div>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet. Browse vehicles to get started!</p>
          </div>
        ) : (
          <div className="bh-list">
            {bookings.map((b) => (
              <div key={b._id} className={`bh-card bh-card-${b.status}`}>
                <div className="bh-card-left">
                  <div className="bh-card-icon">{b.vehicle?.type === "2-wheeler" ? "🏍️" : "🚗"}</div>
                  <div className="bh-card-info">
                    <h4>{b.vehicle?.brand} {b.vehicle?.model}</h4>
                    <div className="bh-card-dates">
                      <span>📅 {new Date(b.pickupDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="bh-date-arrow">→</span>
                      <span>📅 {new Date(b.returnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="bh-card-price">₹{b.pricing?.total}</div>
                  </div>
                </div>
                <div className="bh-card-right">
                  <span className={`bh-status bh-status-${b.status}`}>
                    {STATUS_EMOJI[b.status] || "📋"} {b.status}
                  </span>
                  {["pending", "approved"].includes(b.status) && (
                    <button className="bh-cancel-btn" onClick={() => setCancelModal(b._id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="bh-modal-overlay" onClick={() => setCancelModal(null)}>
          <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bh-modal-icon">⚠️</div>
            <h3>Cancel Booking?</h3>
            <p>This action cannot be undone. The vehicle will become available for others.</p>
            <textarea
              className="bh-modal-textarea"
              placeholder="Reason for cancellation (optional)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />
            <div className="bh-modal-actions">
              <button className="bh-modal-cancel" onClick={() => setCancelModal(null)}>Keep Booking</button>
              <button className="bh-modal-confirm" disabled={cancelling} onClick={handleCancel}>
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default BookingHistory;

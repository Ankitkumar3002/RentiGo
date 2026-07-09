import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleAPI, bookingAPI } from "../../services/api";
import Footer from "../../components/common/Footer";

const daysBetween = (a, b) =>
  Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

const BookingFlow = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({ pickupDate: "", returnDate: "", pickupDepot: "" });
  const [files, setFiles] = useState({ licenceFile: null, aadhaarFile: null });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vehicleAPI.getById(vehicleId).then(({ data }) => setVehicle(data.data)).catch(console.error);
  }, [vehicleId]);

  if (!vehicle) return (
    <div className="booking-page-container">
      <div style={{ height: "100px" }}></div>
      <p className="loading">Loading vehicle details…</p>
    </div>
  );

  const days = form.pickupDate && form.returnDate
    ? Math.max(daysBetween(form.pickupDate, form.returnDate), 0)
    : 0;

  const estimate = (() => {
    if (!days || !vehicle.pricing) return null;
    let base;
    if (days >= 28) base = vehicle.pricing.monthly;
    else if (days >= 7) base = vehicle.pricing.weekly * Math.ceil(days / 7);
    else base = vehicle.pricing.daily * days;
    const serviceFee = Math.round(base * 0.05);
    const gst = Math.round((base + serviceFee) * 0.18);
    return { base, serviceFee, gst, total: base + serviceFee + gst };
  })();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const setQuickDates = (addDays) => {
    const start = new Date();
    start.setHours(start.getHours() + 2); // default pickup 2 hours from now
    const startIso = start.toISOString().slice(0, 16);
    
    const end = new Date(start);
    end.setDate(end.getDate() + addDays);
    const endIso = end.toISOString().slice(0, 16);
    
    setForm({ ...form, pickupDate: startIso, returnDate: endIso });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (days <= 0) { setError("Return date must be after pickup date"); return; }
    if (!files.licenceFile || !files.aadhaarFile) { setError("Please upload both Licence and Aadhaar documents"); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("vehicleId", vehicleId);
      formData.append("pickupDate", form.pickupDate);
      formData.append("returnDate", form.returnDate);
      formData.append("pickupDepot", form.pickupDepot);
      formData.append("licenceFile", files.licenceFile);
      formData.append("aadhaarFile", files.aadhaarFile);

      await bookingAPI.create(formData);
      navigate("/bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page-container">
      {/* Spacer for absolute navbar */}
      <div style={{ height: "120px" }}></div>
      
      <div className="booking-content-grid app-content">
        {/* Left side: Form */}
        <form onSubmit={handleSubmit} className="booking-form-card">
          <h2>Secure Your Ride</h2>
          <p className="subtitle">Fill in your details to request a booking for {vehicle.brand} {vehicle.model}</p>
          
          {error && <div className="error-text" style={{ background: "var(--color-danger-bg)", padding: "12px", borderRadius: "8px" }}>{error}</div>}

          <div className="quick-dates" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button type="button" className="btn-outline small" onClick={() => setQuickDates(1)}>Tomorrow (1 Day)</button>
            <button type="button" className="btn-outline small" onClick={() => setQuickDates(2)}>Weekend (2 Days)</button>
            <button type="button" className="btn-outline small" onClick={() => setQuickDates(7)}>Next Week (7 Days)</button>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Pickup Date &amp; Time</label>
              <input type="datetime-local" name="pickupDate" value={form.pickupDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Return Date &amp; Time</label>
              <input type="datetime-local" name="returnDate" value={form.returnDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Pickup Depot</label>
            <input name="pickupDepot" value={form.pickupDepot} onChange={handleChange} placeholder="e.g. Kolkata South depot" required />
          </div>

          <div className="form-group">
            <label>Driving Licence Document</label>
            <input type="file" name="licenceFile" accept="image/*" onChange={handleFileChange} required />
          </div>
          
          <div className="form-group">
            <label>Aadhaar Card Document</label>
            <input type="file" name="aadhaarFile" accept="image/*" onChange={handleFileChange} required />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary full-width" style={{ marginTop: "16px", padding: "16px", fontSize: "16px" }}>
            {submitting ? "Sending Request…" : "Send Booking Request"}
          </button>
        </form>

        {/* Right side: Summary */}
        <aside className="order-summary-card">
          <h3>Order Summary</h3>
          <div className="vehicle-summary">
            {vehicle.photos?.[0] ? (
              <img src={vehicle.photos[0]} alt={`${vehicle.brand} ${vehicle.model}`} />
            ) : (
              <div className="vehicle-card-placeholder small">{vehicle.type === "2-wheeler" ? "🏍️" : "🚗"}</div>
            )}
            <div className="vehicle-summary-details">
              <h4>{vehicle.brand} {vehicle.model}</h4>
              <p>{vehicle.type} · {vehicle.fuelType}</p>
            </div>
          </div>

          {estimate ? (
            <div className="summary-pricing">
              <div className="summary-row"><span>{days} day(s) rental</span><span>₹{estimate.base}</span></div>
              <div className="summary-row"><span>Service fee (5%)</span><span>₹{estimate.serviceFee}</span></div>
              <div className="summary-row"><span>GST (18%)</span><span>₹{estimate.gst}</span></div>
              <div className="summary-total"><span>Total</span><span>₹{estimate.total}</span></div>
            </div>
          ) : (
            <p className="muted" style={{ color: "var(--color-text-secondary)", fontSize: "14px", fontStyle: "italic" }}>
              Select pickup and return dates to see the estimated cost.
            </p>
          )}

          <div className="notice">
            <span>ℹ️</span>
            <div>Booking requires agency approval. You will be notified once confirmed.</div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default BookingFlow;

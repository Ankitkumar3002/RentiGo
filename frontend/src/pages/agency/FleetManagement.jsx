import { useState, useEffect } from "react";
import { agencyAPI, vehicleAPI } from "../../services/api";

const emptyForm = {
  regNumber: "", brand: "", model: "", year: "", type: "2-wheeler",
  fuelType: "petrol", transmission: "manual", city: "", depot: "",
  pricing: { daily: "", weekly: "", monthly: "" },
};

const FleetManagement = () => {
  const [fleet, setFleet] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const loadFleet = () =>
    agencyAPI.getFleet().then(({ data }) => setFleet(data.data)).catch(console.error);

  useEffect(() => { loadFleet(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["daily", "weekly", "monthly"].includes(name)) {
      setForm({ ...form, pricing: { ...form.pricing, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await vehicleAPI.update(editingId, form);
      } else {
        await vehicleAPI.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      loadFleet();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (vehicle) => {
    setForm({
      regNumber: vehicle.regNumber, brand: vehicle.brand, model: vehicle.model,
      year: vehicle.year, type: vehicle.type, fuelType: vehicle.fuelType,
      transmission: vehicle.transmission, city: vehicle.city, depot: vehicle.depot || "",
      pricing: vehicle.pricing || { daily: "", weekly: "", monthly: "" },
    });
    setEditingId(vehicle._id);
    setShowForm(true);
  };

  const handleBlock = async (id) => {
    const from  = window.prompt("Block from (YYYY-MM-DD):");
    const until = window.prompt("Block until (YYYY-MM-DD):");
    if (!from || !until) return;
    await vehicleAPI.block(id, { from, until, reason: "Scheduled maintenance" });
    loadFleet();
  };

  return (
    <div className="fleet-page app-content">
      <div style={{ height: "100px" }}></div>

      {/* Header */}
      <div className="fleet-page-header">
        <div>
          <h1>Fleet Management</h1>
          <p className="fleet-page-subtitle">Manage your vehicles, pricing, and availability</p>
        </div>
        <button
          className="fleet-add-btn"
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
        >
          <span>＋</span> Add Vehicle
        </button>
      </div>

      {/* Slide-down form */}
      {showForm && (
        <div className="fleet-form-overlay">
          <form onSubmit={handleSubmit} className="fleet-form-card">
            <div className="fleet-form-header">
              <h2>{editingId ? "✏️ Edit Vehicle" : "🚗 Add New Vehicle"}</h2>
              <button type="button" className="fleet-form-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            {error && <div className="fleet-form-error">{error}</div>}

            {/* Section: Vehicle Details */}
            <div className="fleet-form-section">
              <div className="fleet-form-section-label"><span className="fleet-step">1</span> Vehicle Details</div>
              <div className="fleet-form-grid">
                <div className="fleet-field">
                  <label>Registration No.</label>
                  <input name="regNumber" value={form.regNumber} onChange={handleChange} placeholder="MH 01 AB 1234" required />
                </div>
                <div className="fleet-field">
                  <label>Brand</label>
                  <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Honda" required />
                </div>
                <div className="fleet-field">
                  <label>Model</label>
                  <input name="model" value={form.model} onChange={handleChange} placeholder="e.g. City" required />
                </div>
                <div className="fleet-field">
                  <label>Year</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="2024" required />
                </div>
              </div>
            </div>

            {/* Section: Specifications */}
            <div className="fleet-form-section">
              <div className="fleet-form-section-label"><span className="fleet-step">2</span> Specifications</div>
              <div className="fleet-form-grid">
                <div className="fleet-field">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="2-wheeler">🏍️ 2-Wheeler</option>
                    <option value="4-wheeler">🚗 4-Wheeler</option>
                  </select>
                </div>
                <div className="fleet-field">
                  <label>Fuel Type</label>
                  <select name="fuelType" value={form.fuelType} onChange={handleChange}>
                    <option value="petrol">⛽ Petrol</option>
                    <option value="diesel">🛢️ Diesel</option>
                    <option value="electric">⚡ Electric</option>
                    <option value="hybrid">🔋 Hybrid</option>
                  </select>
                </div>
                <div className="fleet-field">
                  <label>Transmission</label>
                  <select name="transmission" value={form.transmission} onChange={handleChange}>
                    <option value="manual">⚙️ Manual</option>
                    <option value="automatic">🅰️ Automatic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Location */}
            <div className="fleet-form-section">
              <div className="fleet-form-section-label"><span className="fleet-step">3</span> Location</div>
              <div className="fleet-form-grid">
                <div className="fleet-field">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai" required />
                </div>
                <div className="fleet-field">
                  <label>Depot / Pickup Point</label>
                  <input name="depot" value={form.depot} onChange={handleChange} placeholder="e.g. Andheri West" />
                </div>
              </div>
            </div>

            {/* Section: Pricing */}
            <div className="fleet-form-section">
              <div className="fleet-form-section-label"><span className="fleet-step">4</span> Pricing</div>
              <div className="fleet-form-grid fleet-pricing-grid">
                <div className="fleet-pricing-box">
                  <div className="fleet-pricing-icon">📅</div>
                  <label>Daily</label>
                  <div className="fleet-price-input"><span>₹</span><input type="number" name="daily" value={form.pricing.daily} onChange={handleChange} placeholder="500" required /></div>
                </div>
                <div className="fleet-pricing-box">
                  <div className="fleet-pricing-icon">🗓️</div>
                  <label>Weekly</label>
                  <div className="fleet-price-input"><span>₹</span><input type="number" name="weekly" value={form.pricing.weekly} onChange={handleChange} placeholder="3000" required /></div>
                </div>
                <div className="fleet-pricing-box">
                  <div className="fleet-pricing-icon">📆</div>
                  <label>Monthly</label>
                  <div className="fleet-price-input"><span>₹</span><input type="number" name="monthly" value={form.pricing.monthly} onChange={handleChange} placeholder="10000" required /></div>
                </div>
              </div>
            </div>

            <div className="fleet-form-actions">
              <button type="submit" className="fleet-submit-btn">{editingId ? "💾 Save Changes" : "🚀 Add Vehicle"}</button>
              <button type="button" className="fleet-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {fleet.length === 0 && !showForm && (
        <div className="fleet-empty-state">
          <div className="fleet-empty-icon">🚘</div>
          <h3>No vehicles yet</h3>
          <p>Click "Add Vehicle" to list your first car or bike for rent.</p>
        </div>
      )}

      {/* Fleet cards */}
      <div className="fleet-cards-grid">
        {fleet.map((v) => (
          <div key={v._id} className="fleet-vehicle-card">
            <div className="fleet-vehicle-card-top">
              <div className="fleet-vehicle-type-badge">{v.type === "2-wheeler" ? "🏍️" : "🚗"}</div>
              <span className={`fleet-status-pill fleet-status-${v.status}`}>{v.status}</span>
            </div>
            <h4 className="fleet-vehicle-name">{v.brand} {v.model}</h4>
            <div className="fleet-vehicle-meta">
              <span>{v.regNumber}</span>
              <span>{v.year}</span>
              <span style={{ textTransform: "capitalize" }}>{v.fuelType}</span>
            </div>
            {v.pricing && (
              <div className="fleet-vehicle-price">₹{v.pricing.daily}<span>/day</span></div>
            )}
            <div className="fleet-vehicle-actions">
              <button className="fleet-action-btn edit" onClick={() => handleEdit(v)}>✏️ Edit</button>
              <button
                className="fleet-action-btn block"
                disabled={v.status === "rented"}
                onClick={() => handleBlock(v._id)}
              >🔒 Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FleetManagement;

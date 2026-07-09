import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then(({ data }) => setStats(data.data)).catch(console.error);
  }, []);

  if (!stats) return <p className="loading">Loading…</p>;

  return (
    <div className="admin-dashboard">
      <h1>System overview</h1>
      <div className="metric-grid">
        <div className="metric-card">
          <p className="metric-label">Registered users</p>
          <p className="metric-value">{stats.users}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Active agencies</p>
          <p className="metric-value">{stats.agencies}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Listed vehicles</p>
          <p className="metric-value">{stats.vehicles}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Total bookings</p>
          <p className="metric-value">{stats.bookings}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Conflict flags</p>
          <p className="metric-value" style={{ color: stats.conflicts ? "#E24B4A" : undefined }}>
            {stats.conflicts}
          </p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Revenue this month</p>
          <p className="metric-value">₹{stats.monthlyRevenue.toLocaleString("en-IN")}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { to: "/categories", label: "All categories" },
  { to: "/",           label: "Home"           },
  { to: "/about",      label: "About"          },
  { to: "/company",    label: "Company"        },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (to) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={isActive(to) ? "active" : ""}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="navbar-center">
        <Link to="/" className="navbar-brand">RentiGo<span></span></Link>
      </div>

      <div className="navbar-right">
        {!user && (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register" className="btn-primary small" style={{ padding: "8px 24px", borderRadius: "4px" }}>
              Register
            </Link>
          </>
        )}

        {user?.role === "customer" && (
          <button className="btn-outline small" style={{ marginRight: "12px", border: "none", color: "#f39c12", fontWeight: "bold" }} onClick={async () => {
            if (window.confirm("Do you want to become a host and list your vehicles?")) {
              try {
                const { authAPI } = await import("../../services/api");
                const res = await authAPI.becomeHost();
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                window.location.href = "/agency/dashboard";
              } catch (err) {
                alert("Failed to become a host: " + (err.response?.data?.message || err.message));
              }
            }
          }}>
            List Your Vehicle
          </button>
        )}

        {user && (user.role === "customer" || user.role === "agency" || user.role === "admin") && (
          <Link to="/bookings" style={{ marginRight: "12px" }}>My bookings</Link>
        )}

        {user?.role === "agency" && (
          <>
            <Link to="/agency/dashboard" style={{ marginRight: "12px" }}>Overview</Link>
            <Link to="/agency/fleet" style={{ marginRight: "12px" }}>Fleet</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" style={{ marginRight: "12px" }}>Overview</Link>
            <Link to="/admin/users" style={{ marginRight: "12px" }}>Users</Link>
          </>
        )}

        {user && (
          <button className="btn-outline small" onClick={handleLogout}>Log out</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

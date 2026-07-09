import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "customer",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Create your account</h1>
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">Account created! Redirecting to login…</p>}

        <label>Full name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} />

        <label>I am registering as</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="customer">Customer (rent vehicles)</option>
          <option value="agency">Rental agency (list vehicles)</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>

        <div className="divider">or</div>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const user = await googleLogin(credentialResponse.credential);
              if (user.role === "admin") navigate("/admin/dashboard");
              else if (user.role === "agency") navigate("/agency/dashboard");
              else navigate("/");
            } catch (err) {
              setError(err.response?.data?.message || "Google Signup failed");
            }
          }}
          onError={() => setError("Google Signup Failed")}
        />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

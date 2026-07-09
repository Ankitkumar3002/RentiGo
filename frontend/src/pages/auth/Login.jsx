import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === "admin")  navigate("/admin/dashboard");
      else if (user.role === "agency") navigate("/agency/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Log in to RentiGo</h1>
        {error && <p className="error-text">{error}</p>}

        <label>Email</label>
        <input
          type="email" name="email" value={form.email}
          onChange={handleChange} required
        />

        <label>Password</label>
        <input
          type="password" name="password" value={form.password}
          onChange={handleChange} required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
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
              setError(err.response?.data?.message || "Google Login failed");
            }
          }}
          onError={() => setError("Google Login Failed")}
          useOneTap
        />

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

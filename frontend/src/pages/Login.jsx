import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { login, googleAuth } from "../services/api";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const { setLoginUser } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      if (data?.token) localStorage.setItem("authToken", data.token);
      setLoginUser(data?.user); // username returned from backend
      navigate("/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setGoogleLoading(true);
      try {

        const data = await googleAuth({ accessToken: tokenResponse.access_token });
        if (data?.token) localStorage.setItem("authToken", data.token);
        setLoginUser(data?.user);
        navigate("/chat");
      } catch (err) {
        setError(err.message);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError("Google sign-in failed. Please try again."),
  });

  return (
    <AuthCard title="Login">
      <form onSubmit={handleSubmit} className="auth-form">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <Link to="/forgot-password" className="auth-form__link">
          Forgot password?
        </Link>

        <div className="auth-form__divider">
          <span>Login with</span>
          <button
            type="button"
            className="google-btn"
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading}
          >
            <GoogleIcon /> {googleLoading ? "Signing in..." : "Google"}
          </button>
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-form__footer">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </AuthCard>
  );
}
function GoogleIcon(){
  return <FcGoogle size={16} />
}

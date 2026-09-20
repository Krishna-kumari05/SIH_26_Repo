import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { signup, googleAuth } from "../services/api";
import { useAuthFlow } from "../context/AuthFlowContext";
import { useUser } from "../context/UserContext";
import { FcGoogle } from "react-icons/fc";

export default function Signup() {
  const navigate = useNavigate();
  const { setPendingEmail } = useAuthFlow();
  const { setSignupUser, setLoginUser } = useUser();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
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
      await signup(form);
      // Backend is expected to send the OTP to the user's email
      
      setPendingEmail(form.email);
      setSignupUser(form); // { username, email, phone } 
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

 
  const handleGoogleSignup = useGoogleLogin({
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
    onError: () => setError("Google sign-up failed. Please try again."),
  });

  return (
    <AuthCard title="Sign Up">
      <form onSubmit={handleSubmit} className="auth-form">
        <FormField
          label="User Name"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
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
        <FormField
          label="Ph. Number"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <div className="auth-form__divider">
          <span>Signup with</span>
          <button
            type="button"
            className="google-btn"
            onClick={() => handleGoogleSignup()}
            disabled={googleLoading}
          >
           <GoogleIcon /> {googleLoading ? "Signing in..." : "Google"}
          </button>
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthCard>
  );
}
function GoogleIcon(){
  return <FcGoogle size={16} />
}
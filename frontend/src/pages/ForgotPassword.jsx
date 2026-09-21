import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import FormField from "../components/FormField";
import { requestPasswordReset } from "../services/api";
import { useAuthFlow } from "../context/AuthFlowContext";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { setPendingEmail, setOtpPurpose } = useAuthFlow();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setPendingEmail(email);
      setOtpPurpose("reset");
      navigate("/verify-otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Forgot Password">
      <form onSubmit={handleSubmit} className="auth-form">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="auth-form__footer">
          Enter Your Registered Email
        </p>
      </form>
    </AuthCard>
  );
}

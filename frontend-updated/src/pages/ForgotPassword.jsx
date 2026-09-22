import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/api";
import { useAuthFlow } from "../context/AuthFlowContext";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {setPendingEmail,setOtpPurpose,} = useAuthFlow();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await requestPasswordReset({
        email: normalizedEmail,
      });

      setPendingEmail(normalizedEmail);
      setOtpPurpose("PASSWORD_RESET");

      navigate("/verify-otp");
    } catch (err) {
      setError(
        err?.message || "Unable to send password reset OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your registered email and we'll send you an OTP
            to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3
                         outline-none focus:border-blue-600
                         focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3
                       font-medium text-white transition
                       hover:bg-blue-700 disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm text-slate-600 hover:text-blue-600"
          >
            Back to Login
          </button>

        </form>
      </div>
    </div>
  );
}
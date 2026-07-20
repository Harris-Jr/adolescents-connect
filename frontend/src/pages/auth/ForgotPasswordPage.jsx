import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthApi } from "@/hooks/useAuthApi";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/forms/FloatingInput";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error } = useAuthApi();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!email) {
      setSubmitError("Email is required");
      return;
    }

    if (!emailValid) {
      setSubmitError("Invalid email address");
      return;
    }

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(error || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <button
          onClick={() => navigate("/auth")}
          className="mb-6 flex items-center gap-2 text-brand-purple hover:text-brand-pink transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Login</span>
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <img
            src="/images/alinks-logo.jpeg"
            alt="A-LINKS"
            className="mx-auto h-12 w-auto mb-6"
          />

          <h1 className="text-2xl font-extrabold text-brand-navy text-center mb-2">
            Reset Your Password
          </h1>

          {!submitted ? (
            <>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FloatingInput
                  id="forgot-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubmitError("");
                  }}
                  error={submitError || (emailValid ? "" : "Invalid email")}
                  required
                />

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !email || !emailValid}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink font-bold"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-4 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-brand-navy">
                  Check Your Email
                </h2>

                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>

                <p className="text-xs text-muted-foreground">
                  The link will expire in 1 hour. If you don't see it, check
                  your spam folder.
                </p>

                <Button
                  type="button"
                  onClick={() => navigate("/auth")}
                  className="w-full h-12 rounded-xl bg-brand-navy font-bold"
                >
                  Back to Login
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setSubmitted(false);
                  }}
                  className="w-full text-sm text-brand-purple hover:text-brand-pink font-medium"
                >
                  Try another email
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Need help?{" "}
          <a href="mailto:support@alinks.org" className="text-brand-purple hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

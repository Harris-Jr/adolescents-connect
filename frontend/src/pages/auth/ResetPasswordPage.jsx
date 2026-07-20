import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuthApi } from "@/hooks/useAuthApi";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/forms/PasswordInput";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error } = useAuthApi();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  const validatePassword = () => {
    const errors = {};

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirmation is required";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      await resetPassword(token, password, confirmPassword);
      setSubmitted(true);
    } catch (err) {
      // Error is shown via useAuthApi toast
    }
  };

  if (!token) {
    return null;
  }

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
            Create New Password
          </h1>

          {!submitted ? (
            <>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Enter a new password for your A-LINKS account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="relative">
                  <label htmlFor="password" className="text-sm font-medium text-brand-navy">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          password: "",
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder="At least 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    • At least 8 characters
                    <br />
                    • Mix of uppercase and lowercase letters
                    <br />
                    • At least one number and special character
                  </p>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-brand-navy">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors((prev) => ({
                          ...prev,
                          confirmPassword: "",
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink font-bold"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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

                <h2 className="text-xl font-bold text-brand-navy">Password Reset</h2>

                <p className="text-sm text-muted-foreground">
                  Your password has been successfully reset.
                </p>

                <Button
                  onClick={() => navigate("/auth")}
                  className="w-full h-12 rounded-xl bg-brand-navy font-bold"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Still having trouble?{" "}
          <a href="mailto:support@alinks.org" className="text-brand-purple hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}

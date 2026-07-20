import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Check, GraduationCap, User } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FloatingInput } from "@/components/forms/FloatingInput";
import { FloatingSelect } from "@/components/forms/FloatingSelect";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { PhoneInput } from "@/components/forms/PhoneInput";
import { Button } from "@/components/ui/button";
const initialRegister = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};
function AuthPage({ mode: modeProp } = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = modeProp ?? searchParams.get("mode");
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const isLogin = mode !== "register";
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [form, setForm] = useState(initialRegister);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const emailValid = !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const registerValid = useMemo(
    () =>
      Boolean(
        form.firstName.trim() &&
        form.lastName.trim() &&
        phoneValid &&
        emailValid &&
        form.password.length >= 8 &&
        form.password === form.confirmPassword,
      ),
    [form, emailValid, phoneValid],
  );
  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const toggleMode = () => {
    setErrors({});
    void navigate(isLogin ? "/auth?mode=register" : "/auth", { replace: true });
  };
  const routeForRole = (role) => {
    const r = role?.toLowerCase();
    if (r === "teacher") return "/dashboard/teacher";
    if (r === "school_admin") return "/dashboard/school";
    if (r === "programme_admin" || r === "admin") return "/dashboard/admin";
    return "/dashboard/learner";
  };
  const handleLogin = async () => {
    const next = {};
    if (!loginData.email) next.loginEmail = "Email is required.";
    if (!loginData.password) next.loginPassword = "Password is required.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      const user = await login(loginData.email, loginData.password);
      await navigate(routeForRole(user.role));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setPending(false);
    }
  };
  const handleRegister = async () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!isValidPhoneNumber(form.phone)) next.phone = "Enter a valid phone number.";
    if (!emailValid) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      await register(form);
      await navigate("/onboarding");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setPending(false);
    }
  };
  const loginForm = (
    <div className="auth-form mx-auto w-full max-w-md">
      <img src="/images/alinks-logo.jpeg" alt="A-LINKS" className="mx-auto h-11 w-auto" />
      <h1 className="mt-7 text-center text-3xl font-extrabold text-brand-navy">
        {t("auth.welcomeBack")}
      </h1>
      <div className="mt-8 space-y-4">
        <FloatingInput
          id="login-email"
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          value={loginData.email}
          onChange={(e) => setLoginData((c) => ({ ...c, email: e.target.value }))}
          error={errors.loginEmail}
          required
        />
        <PasswordInput
          id="login-password"
          label={t("auth.password")}
          autoComplete="current-password"
          value={loginData.password}
          onChange={(e) => setLoginData((c) => ({ ...c, password: e.target.value }))}
          error={errors.loginPassword}
          required
        />
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-bold text-brand-purple hover:text-brand-pink hover:underline transition-colors"
          >
            {t("auth.forgot")}
          </Link>
        </div>
        <Button
          type="button"
          onClick={handleLogin}
          disabled={pending || !loginData.email || !loginData.password}
          className="min-h-12 w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink font-bold"
        >
          {pending ? "Logging in…" : t("auth.login")}
        </Button>
        <p className="text-center text-sm text-muted-foreground md:hidden">
          {t("auth.noAccount")}{" "}
          <button type="button" onClick={toggleMode} className="font-bold text-brand-purple">
            {t("auth.signup")}
          </button>
        </p>
      </div>
    </div>
  );
  const registerForm = (
    <div className="auth-form mx-auto w-full max-w-xl">
      <img src="/images/alinks-logo.jpeg" alt="A-LINKS" className="mx-auto h-11 w-auto" />
      <h1 className="mt-7 text-center text-3xl font-extrabold text-brand-navy">{t("auth.join")}</h1>
      <div className="mt-6 grid gap-3 min-[1025px]:grid-cols-2">
        <FloatingInput
          label={t("auth.firstName")}
          value={form.firstName}
          onChange={(e) => set("firstName", e.target.value)}
          error={errors.firstName}
          success={Boolean(form.firstName)}
          required
        />
        <FloatingInput
          label={t("auth.lastName")}
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
          error={errors.lastName}
          success={Boolean(form.lastName)}
          required
        />
        <div className="min-[1025px]:col-span-2">
          <FloatingInput
            label={t("auth.emailOpt")}
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
            success={Boolean(form.email && emailValid)}
          />
        </div>
        <div className="min-[1025px]:col-span-2">
          <PhoneInput
            value={form.phone}
            onChange={(e164) => set("phone", e164)}
            onValidityChange={(valid) => {
              setPhoneValid(valid);
              setErrors((current) => ({
                ...current,
                phone: valid ? undefined : "Enter a valid phone number.",
              }));
            }}
            error={errors.phone}
            required
          />
        </div>
        <PasswordInput
          label={t("auth.password")}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          error={errors.password}
          success={form.password.length >= 8}
          required
        />
        <PasswordInput
          label={t("auth.confirmPassword")}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => set("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          success={Boolean(form.confirmPassword && form.confirmPassword === form.password)}
          required
        />
        <Button
          type="button"
          onClick={handleRegister}
          disabled={pending || !registerValid}
          className="min-h-12 w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink font-bold min-[1025px]:col-span-2"
        >
          {pending ? "Creating account…" : t("auth.create")}
        </Button>
        <p className="text-center text-sm text-muted-foreground md:hidden min-[1025px]:col-span-2">
          {t("auth.haveAccount")}{" "}
          <button type="button" onClick={toggleMode} className="font-bold text-brand-purple">
            {t("auth.login")}
          </button>
        </p>
      </div>
    </div>
  );
  return (
    <main className="auth-page min-h-screen px-3 pb-5 pt-10 sm:px-6">
      <div
        className={`auth-container relative w-full overflow-hidden bg-card ${isLogin ? "" : "active"}`}
      >
        <section className="form-box absolute overflow-y-auto bg-card">
          <div className="min-h-full px-5 pb-10 pt-8 md:flex md:items-center md:p-5 md:pb-10 min-[1025px]:px-10">
            {isLogin ? loginForm : registerForm}
          </div>
        </section>
        <section className="toggle-box absolute z-20 overflow-hidden bg-gradient-to-br from-brand-purple to-brand-pink text-primary-foreground">
          <span className="auth-shape left-[12%] top-[18%] h-5 w-5 bg-brand-yellow" />
          <span className="auth-shape right-[14%] top-[28%] h-10 w-10 border-2 border-primary-foreground/40" />
          <span className="auth-shape bottom-[18%] left-[22%] h-7 w-7 bg-brand-teal" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {isLogin ? t("auth.newHere") : t("auth.haveAccount")}
            </h2>
            <p className="mt-4 max-w-md text-base font-semibold leading-relaxed text-primary-foreground/85">
              {isLogin ? t("auth.joinCopy") : t("auth.backCopy")}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={toggleMode}
              className="mt-7 min-h-12 rounded-xl border-2 border-primary-foreground bg-transparent px-8 font-bold text-primary-foreground hover:bg-primary-foreground hover:text-brand-purple"
            >
              {isLogin ? t("auth.create") : t("auth.login")}
            </Button>
            <p className="auth-tagline absolute bottom-8 text-center text-xs font-bold leading-snug tracking-wide sm:text-sm">
              Your future. Your choices. Your voice.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
export default AuthPage;

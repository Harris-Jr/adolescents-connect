import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiPatch } from "@/lib/api";

const fieldCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30";
const labelCls = "mb-1 block text-xs font-bold text-muted-foreground";
const primaryBtn =
  "rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50";

/**
 * Change-password form (current + new + confirm), posting to
 * PATCH /users/me/password. Reused on the learner Profile page and inside
 * AccountSettings for the other roles.
 */
export function ChangePasswordForm() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Fill in all password fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await apiPatch("/users/me/password", form);
      toast.success("Password updated");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className={labelCls}>Current password</label>
        <input
          className={fieldCls}
          type="password"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={set("currentPassword")}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>New password</label>
          <input
            className={fieldCls}
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={set("newPassword")}
          />
        </div>
        <div>
          <label className={labelCls}>Confirm new password</label>
          <input
            className={fieldCls}
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
          />
        </div>
      </div>
      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

/**
 * Name form — updates firstName/lastName via PATCH /users/me and syncs the
 * result into auth state.
 */
function NameForm() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last names are required");
      return;
    }
    setBusy(true);
    try {
      const { user: updated } = await apiPatch("/users/me", {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
      });
      updateUser(updated ?? form);
      toast.success("Account updated");
    } catch (err) {
      toast.error(err.message || "Failed to update account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>First name</label>
          <input className={fieldCls} value={form.firstName} onChange={set("firstName")} />
        </div>
        <div>
          <label className={labelCls}>Last name</label>
          <input className={fieldCls} value={form.lastName} onChange={set("lastName")} />
        </div>
      </div>
      {(user?.email || user?.phone) && (
        <p className="text-[11px] text-muted-foreground">
          Signed in as {user.email || user.phone}
        </p>
      )}
      <button type="submit" disabled={busy} className={primaryBtn}>
        {busy ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

/**
 * Account settings shown on the Teacher / School / Admin dashboards: edit
 * name, and change password.
 */
export function AccountSettings() {
  return (
    <div className="max-w-2xl space-y-4">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-brand-navy">Account details</h2>
        <NameForm />
      </section>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold text-brand-navy">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}

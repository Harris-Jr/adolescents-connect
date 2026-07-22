import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { apiGet, apiPatch } from "@/lib/api";
import { PROVINCES, DISTRICTS_BY_PROVINCE } from "@/lib/zambia-locations";

const fieldCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/30 disabled:opacity-60";
const labelCls = "mb-1 block text-xs font-bold text-muted-foreground";

/**
 * School Admin self-service: edit the school's name, province and district
 * (GET/PATCH /school/profile). A rename cascades server-side to the
 * denormalized copies; we also sync the admin's own schoolName in auth state.
 */
export function SchoolProfileSettings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", province: "", district: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    apiGet("/school/profile")
      .then((d) => {
        if (!active) return;
        setForm({
          name: d.school?.name ?? "",
          province: d.school?.province ?? "",
          district: d.school?.district ?? "",
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load school profile");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!form.name.trim()) {
      toast.error("School name is required");
      return;
    }
    setBusy(true);
    try {
      const { school } = await apiPatch("/school/profile", {
        name: form.name.trim(),
        province: form.province || null,
        district: form.district || null,
      });
      // Keep the header ("Your School") and scoping display in sync.
      if (user?.schoolName !== school.name) updateUser({ schoolName: school.name });
      toast.success("School profile saved");
    } catch (err) {
      toast.error(err.message || "Failed to save school");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="text-sm font-semibold text-brand-pink">{error}</p>;
  }

  return (
    <section className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-base font-extrabold text-brand-navy">School profile</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className={labelCls}>School name</label>
          <input
            className={fieldCls}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Province</label>
            <select
              className={fieldCls}
              value={form.province}
              onChange={(e) => setForm((f) => ({ ...f, province: e.target.value, district: "" }))}
            >
              <option value="">—</option>
              {PROVINCES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>District</label>
            <select
              className={fieldCls}
              value={form.district}
              disabled={!form.province}
              onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
            >
              <option value="">—</option>
              {(DISTRICTS_BY_PROVINCE[form.province] ?? []).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Saving..." : "Save school profile"}
        </button>
      </form>
    </section>
  );
}

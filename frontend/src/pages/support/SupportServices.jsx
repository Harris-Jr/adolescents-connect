import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ArrowLeft, Phone, MapPin, Clock, Navigation, Search } from "lucide-react";
import { SUPPORT_SERVICES, SUPPORT_PROVINCES, SUPPORT_DISTRICTS } from "@/lib/support-data";
const searchSchema = z.object({ category: z.string().optional() });
function SupportServices() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const districts = province ? (SUPPORT_DISTRICTS[province] ?? []) : [];
  const filtered = useMemo(() => {
    return SUPPORT_SERVICES.filter((s) => {
      if (category && s.category !== category) return false;
      if (province && s.province !== province) return false;
      if (district && s.district !== district) return false;
      const q = search.trim().toLowerCase();
      if (q && !`${s.name} ${s.category} ${s.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, province, district, search]);
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
      <Link
        to="/support"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-teal"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Support
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-brand-navy sm:text-4xl">Find Services</h1>
      {category && (
        <p className="mt-2 text-sm text-muted-foreground">
          Showing services for <span className="font-bold text-brand-teal">{category}</span>
        </p>
      )}

      {/* Filters */}
      <section className="mt-6 rounded-3xl bg-card p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">Province</span>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setDistrict("");
              }}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-teal"
            >
              <option value="">All Provinces</option>
              {SUPPORT_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">District</span>
            <select
              value={district}
              disabled={!province}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand-teal disabled:opacity-50"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-teal"
              />
            </div>
          </label>
        </div>
      </section>

      {/* Services list */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No services match your filters.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((s) => (
            <article
              key={s.id}
              className="rounded-3xl bg-card p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <span className="rounded-full bg-surface-mint px-2.5 py-0.5 text-[11px] font-bold text-brand-teal">
                  {s.category}
                </span>
                <h3 className="mt-2 font-extrabold text-brand-navy">{s.name}</h3>
                <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {s.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {s.hours}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 sm:mt-0 sm:shrink-0">
                <a
                  href={`tel:${s.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(s.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                >
                  <Navigation className="h-4 w-4" /> Directions
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
export default SupportServices;

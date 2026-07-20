import { useMemo, useState } from "react";
import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PhoneInput({
  id = "phone",
  value,
  onChange,
  onValidityChange,
  error,
  required,
}) {
  const detected = parsePhoneNumberFromString(value);
  const [country, setCountry] = useState(detected?.country ?? "ZM");
  const [displayValue, setDisplayValue] = useState(detected?.formatNational() ?? "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected =
    COUNTRIES.find((item) => item.iso === country) ?? COUNTRIES.find((item) => item.iso === "ZM");
  const filtered = useMemo(
    () =>
      COUNTRIES.filter((item) =>
        `${item.name} ${item.dial} ${item.iso}`.toLowerCase().includes(search.toLowerCase()),
      ).slice(0, 30),
    [search],
  );
  const update = (raw) => {
    setDisplayValue(raw);
    const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
    onChange(`${selected?.dial ?? "+260"}${digits}`, raw);
  };

  const validate = () => {
    const parsed = parsePhoneNumberFromString(displayValue, country);
    const valid = Boolean(parsed && isValidPhoneNumber(parsed.number));
    if (parsed) onChange(parsed.number, parsed.formatNational());
    onValidityChange?.(valid);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex min-h-12 min-w-0 max-w-full rounded-xl border bg-background transition-[border-color,box-shadow] duration-300 focus-within:border-2 focus-within:border-brand-purple focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-purple)_14%,transparent)]",
          error ? "border-destructive" : value ? "border-brand-teal" : "border-input",
        )}
      >
        <div className="relative z-10 w-[34%] min-w-0 max-w-28 shrink-0 cursor-pointer sm:w-[28%] sm:min-w-20">
          <Button
            type="button"
            variant="ghost"
            className="h-full min-h-12 min-w-0 w-full justify-between gap-1 rounded-r-none px-2 sm:px-3"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label="Choose country code"
          >
            <span className="truncate">
              {selected?.flag} {selected?.dial}
            </span>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
          {open && (
            <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-72 rounded-2xl border border-border bg-popover p-2 shadow-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search country or code"
                  className="min-h-11 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-brand-purple"
                />
              </div>
              <div className="mt-2 max-h-56 overflow-y-auto">
                {filtered.map((item) => (
                  <Button
                    key={item.iso}
                    type="button"
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setCountry(item.iso);
                      setOpen(false);
                      setSearch("");
                      onChange(item.dial, "");
                    }}
                  >
                    {country === item.iso && <Check className="h-4 w-4" />}
                    <span>
                      {item.flag} {item.name}
                    </span>
                    <span className="ml-auto text-muted-foreground">{item.dial}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative min-w-0 flex-1 border-l border-input">
          <input
            id={id}
            type="tel"
            inputMode="tel"
            value={displayValue}
            onChange={(event) => update(event.target.value)}
            onBlur={validate}
            placeholder=" "
            className="peer relative z-10 block min-h-12 w-full min-w-0 bg-transparent px-4 pb-2 pt-5 text-base outline-none"
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-muted-foreground transition-all duration-300 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-purple peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
          >
            Phone number{required && <span className="text-destructive"> ✱</span>}
          </label>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

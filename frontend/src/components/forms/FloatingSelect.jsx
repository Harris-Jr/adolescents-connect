import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingSelect({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  className,
}) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <select
          id={fieldId}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            "min-h-12 w-full appearance-none rounded-xl border bg-background px-4 pb-2 pt-5 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-300 focus:border-2 focus:border-brand-purple focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-purple)_14%,transparent)] disabled:opacity-50",
            error ? "border-destructive" : value ? "border-brand-teal" : "border-input",
          )}
        >
          <option value="" disabled />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={fieldId}
          className={cn(
            "pointer-events-none absolute left-4 transition-all duration-300 ease-in-out",
            value
              ? "top-2 text-xs text-brand-purple"
              : "top-1/2 -translate-y-1/2 text-base text-muted-foreground focus-within:top-2",
          )}
        >
          {label}
          {required && <span className="text-destructive"> ✱</span>}
        </label>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}

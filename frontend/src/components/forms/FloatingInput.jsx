import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const FloatingInput = forwardRef(
  ({ id, label, error, success, required, trailing, className, value, ...props }, ref) => {
    const fieldId = id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (
      <div className="w-full">
        <div className="group relative">
          <input
            {...props}
            ref={ref}
            id={fieldId}
            value={value}
            placeholder=" "
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "peer min-h-12 w-full rounded-xl border bg-background px-4 pb-2 pt-5 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-300",
              "border-input focus:border-2 focus:border-brand-purple focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand-purple)_14%,transparent)]",
              error && "border-destructive focus:border-destructive",
              success && !error && "border-brand-teal",
              trailing && "pr-12",
              className,
            )}
          />
          <label
            htmlFor={fieldId}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-muted-foreground transition-all duration-300 ease-in-out peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-purple peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs"
          >
            {label}
            {required && <span className="text-destructive"> ✱</span>}
          </label>
          {trailing && <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</div>}
        </div>
        {error && (
          <p id={`${fieldId}-error`} className="mt-1.5 text-xs font-semibold text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

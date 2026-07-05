import type { JSX } from "react";
import { AlertCircle } from "lucide-react";

type Props = {
  percentage: number;
  missingFields: string[];
};

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CompletionIndicator({
  percentage,
  missingFields,
}: Props): JSX.Element {
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <section className="flex items-center justify-between gap-6 rounded-xl border border-border bg-surface p-6 shadow-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-error" aria-hidden="true" />
          <h2 className="text-base font-semibold leading-6 text-text-primary">
            Profile needs attention
          </h2>
        </div>
        <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-text-secondary">
          Complete the missing fields to improve your chance of getting
          tailored matches and generating quality resumes.
        </p>
        {missingFields.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-full bg-error/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-error"
              >
                {field}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative flex size-24 shrink-0 items-center justify-center">
        <svg
          viewBox="0 0 84 84"
          className="size-24 -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="42"
            cy="42"
            r={RADIUS}
            fill="none"
            stroke="var(--color-error)"
            strokeOpacity="0.12"
            strokeWidth="8"
          />
          <circle
            cx="42"
            cy="42"
            r={RADIUS}
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">
          {percentage}%
        </span>
      </div>
    </section>
  );
}

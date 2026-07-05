import type { JSX } from "react";

export function ConnectedAccounts(): JSX.Element {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-lg">
      <h2 className="text-base font-semibold leading-6 text-text-primary">
        Connected Accounts
      </h2>
      <p className="mt-1 text-sm font-medium leading-5 text-text-secondary">
        Connect your LinkedIn to let the agent handle manual apply with
        LinkedIn workflows.
      </p>

      <div className="mt-6 flex items-center justify-between rounded-lg border border-border bg-surface-secondary px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-surface">
            <span className="flex size-6 items-center justify-center rounded bg-linkedin text-[11px] font-bold leading-none text-linkedin-foreground">
              in
            </span>
          </span>
          <div>
            <p className="text-sm font-semibold leading-5 text-text-primary">
              LinkedIn
            </p>
            <p className="text-xs font-normal leading-4 text-text-muted">
              Not connected
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full bg-linkedin px-5 py-2 text-sm font-medium leading-5 text-linkedin-foreground transition-colors hover:opacity-90"
        >
          Connect LinkedIn
        </button>
      </div>
    </section>
  );
}

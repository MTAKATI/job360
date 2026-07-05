import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";

type NavKey = "dashboard" | "find-jobs" | "profile";

type Props = {
  active: NavKey;
};

const navItems: { key: NavKey; href: string; label: string }[] = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard" },
  { key: "find-jobs", href: "/find-jobs", label: "Find Jobs" },
  { key: "profile", href: "/profile", label: "Profile" },
];

export function Navbar({ active }: Props): JSX.Element {
  return (
    <header className="h-16 border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        <Link href="/" aria-label="JobPilot home" className="flex items-center">
          <Image
            src="/public/logo.png"
            alt="JobPilot"
            width={118}
            height={40}
            className="h-[34px] w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={
                item.key === active
                  ? "text-sm font-medium leading-5 text-accent"
                  : "text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <SignOutButton />
      </div>
    </header>
  );
}

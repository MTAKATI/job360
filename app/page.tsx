import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
];

const searchFeatures = [
  {
    title: "Find jobs that actually fit",
    body: "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
  },
  {
    title: "Know the Company Before You Apply",
    body: "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    body: "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
  },
];

const confidenceFeatures = [
  {
    title: "Understand your match score",
    body: "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "AI-Powered Job Matching",
    body: "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
  },
  {
    title: "Focus on the right roles",
    body: "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];

function Header({ appHref }: { appHref: string }) {
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
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={appHref}
          className="rounded-md bg-overlay px-4 py-2 text-sm font-medium leading-5 text-accent-foreground transition-colors hover:bg-overlay-dark"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}

function CtaButtons({ appHref }: { appHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href={appHref}
        className="inline-flex min-h-10 items-center justify-center rounded-md bg-overlay px-5 py-2 text-sm font-medium leading-5 text-accent-foreground transition-colors hover:bg-overlay-dark"
      >
        Get Started&nbsp;
        <span aria-hidden="true">&gt;</span>
      </Link>
      <Link
        href={appHref}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-5 py-2 text-sm font-medium leading-5 text-text-primary transition-colors hover:bg-surface-secondary"
      >
        Find Your First Match
      </Link>
    </div>
  );
}

function Hero({ appHref }: { appHref: string }) {
  return (
    <section className="landing-gradient border-b border-border px-6 py-16 text-center md:py-[72px]">
      <div className="mx-auto max-w-[760px]">
        <h1 className="text-[38px] font-bold leading-[1.08] text-text-slate sm:text-[48px] lg:text-[58px]">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mx-auto mt-6 max-w-[610px] text-sm font-medium leading-6 text-text-secondary">
          Stop applying blind. JobPilot finds the jobs, researches the companies,
          and gives you everything you need to stand out.
        </p>
        <div className="mt-7">
          <CtaButtons appHref={appHref} />
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="border-b border-border bg-surface-tertiary px-6 py-14">
      <div className="mx-auto max-w-[1140px]">
        <Image
          src="/public/images/dashboard-demo.png"
          alt="JobPilot dashboard preview showing job stats, recent activity, and research activity"
          width={4788}
          height={2416}
          className="w-full rounded-xl shadow-2xl"
          sizes="(max-width: 1200px) 92vw, 1140px"
        />
      </div>
    </section>
  );
}

function FeatureTextList({
  items,
  accent = "border-accent",
}: {
  items: typeof searchFeatures;
  accent?: string;
}) {
  return (
    <div className="divide-y divide-border">
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`px-6 py-8 md:px-16 ${
            index === 0 ? `border-l-2 ${accent}` : ""
          }`}
        >
          <h3 className="text-base font-semibold leading-6 text-text-primary">
            {item.title}
          </h3>
          <p className="mt-3 max-w-[470px] text-sm font-medium leading-6 text-text-secondary">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}

function SearchFeatureSection() {
  return (
    <section className="grid border-b border-border bg-surface md:grid-cols-2">
      <div className="border-b border-border md:border-b-0 md:border-r">
        <div className="px-6 py-14 md:px-16 md:py-16">
          <h2 className="max-w-[430px] text-[34px] font-bold leading-[1.08] text-text-slate md:text-[43px]">
            Manage Your Job Search With Ease
          </h2>
        </div>
        <FeatureTextList items={searchFeatures} />
      </div>

      <div className="flex items-center justify-center bg-surface-muted px-6 py-14 md:px-8">
        <Image
          src="/public/images/jobs-lists.png"
          alt="Job list showing companies, match scores, salary estimates, and sources"
          width={2364}
          height={1778}
          className="w-full max-w-[585px] rounded-lg shadow-lg"
          sizes="(max-width: 768px) 88vw, 585px"
        />
      </div>
    </section>
  );
}

function ConfidenceFeatureSection() {
  return (
    <section>
      <div className="landing-band h-20 border-b border-border" />
      <div className="grid border-b border-border bg-surface md:grid-cols-2">
        <div className="flex items-center justify-center bg-surface-muted px-6 py-16 md:px-8">
          <Image
            src="/public/images/agnet-log.png"
            alt="Agent log showing JobPilot scanning roles and tailoring application preparation"
            width={2144}
            height={1656}
            className="w-full max-w-[540px] rounded-lg shadow-lg"
            sizes="(max-width: 768px) 88vw, 540px"
          />
        </div>

        <div>
          <div className="px-6 py-14 md:px-16 md:py-16">
            <h2 className="max-w-[560px] text-[34px] font-bold leading-[1.08] text-text-slate md:text-[43px]">
              Apply With More Confidence, Every Time
            </h2>
          </div>
          <FeatureTextList items={confidenceFeatures} accent="border-success" />
        </div>
      </div>
      <div className="landing-band h-20 border-b border-border" />
    </section>
  );
}

function Testimonial() {
  return (
    <section className="border-b border-border bg-surface px-6 py-20 text-center md:py-24">
      <p className="text-xs font-semibold uppercase leading-4 text-accent">
        Success Stories
      </p>
      <blockquote className="mx-auto mt-6 max-w-[760px] text-[24px] font-medium leading-[1.35] text-text-darker md:text-[30px]">
        &quot;I used to spend my evenings copy-pasting resumes. Now I open my
        dashboard to see interviews waiting. It feels like cheating. Had 3
        offers on the table simultaneously.&quot;
      </blockquote>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Image
          src="/public/images/user-icon.png"
          alt="Tom Wilson"
          width={40}
          height={40}
          className="size-10 rounded-md"
        />
        <div className="text-left">
          <p className="text-sm font-semibold leading-5 text-text-primary">
            Tom Wilson
          </p>
          <p className="text-xs font-normal leading-4 text-text-secondary">
            Junior Developer
          </p>
        </div>
      </div>
    </section>
  );
}

function BottomCta({ appHref }: { appHref: string }) {
  return (
    <section>
      <div className="landing-gradient border-b border-border px-6 py-20 text-center md:py-24">
        <h2 className="mx-auto max-w-[760px] text-[34px] font-bold leading-[1.08] text-text-slate md:text-[50px]">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mx-auto mt-6 max-w-[650px] text-sm font-medium leading-6 text-text-secondary">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
        </p>
        <div className="mt-7">
          <CtaButtons appHref={appHref} />
        </div>
      </div>
      <div className="landing-band h-20 border-b border-border" />
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface px-6 py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="JobPilot home" className="flex items-center">
          <Image
            src="/public/logo.png"
            alt="JobPilot"
            width={118}
            height={40}
            className="h-[34px] w-auto"
          />
        </Link>
        <nav className="flex flex-wrap items-center gap-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium leading-5 text-text-dark transition-colors hover:text-accent"
          >
            Terms &amp; Condition
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default async function Home() {
  const user = await getCurrentUser();
  const appHref = user ? "/dashboard" : "/login";

  return (
    <main className="mx-auto w-full max-w-[1440px] overflow-hidden border-x border-border bg-surface">
      <Header appHref={appHref} />
      <Hero appHref={appHref} />
      <DashboardPreview />
      <SearchFeatureSection />
      <ConfidenceFeatureSection />
      <Testimonial />
      <BottomCta appHref={appHref} />
      <Footer />
    </main>
  );
}

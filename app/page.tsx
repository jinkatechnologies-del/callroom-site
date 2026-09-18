import Link from "next/link";
import SkyBackground from "@/components/SkyBackground";
import ProductPreview from "@/components/ProductPreview";

const features = [
  {
    title: "Planner",
    desc: "Shift and call schedule management built around how residency programs actually run.",
    color: "text-blue",
  },
  {
    title: "Board",
    desc: "Patient task tracking that follows your team, not just your login session.",
    color: "text-purple",
  },
  {
    title: "AI-assisted documentation",
    desc: "CPT and ICD-10 code suggestions and operative note drafting, built from your own input.",
    color: "text-teal",
  },
  {
    title: "Case prep",
    desc: "Study guides that pull relevant literature and video references for what's next on your list.",
    color: "text-accent",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <SkyBackground />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background to-background" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-24 text-center md:pt-32">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Modern Medicine&apos;s
            <br />
            <span className="text-accent">Home Screen</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            CallRoom is the clinical workflow app that keeps residents on top
            of schedules, patient tasks, and case prep, all in one place
            built for the way training actually works.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/get-started"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
            >
              Get Started
            </Link>
            <Link
              href="/our-story"
              className="rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
            >
              Our Story
            </Link>
          </div>

          <ProductPreview />
          <p className="mt-3 text-xs text-muted">A glimpse of the CallRoom workspace</p>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Everything on call, in one place
          </h2>
          <p className="mt-3 text-muted">
            HIPAA-compliant by design, encrypted, audit-logged, and built
            with PHI minimization from day one.{" "}
            <Link href="/security" className="text-accent hover:underline">
              See how
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-white/20"
            >
              <h3 className={`text-lg font-semibold ${f.color}`}>{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plugin builder spotlight */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              Plugin Builder
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Build the tool you wish your EMR had
            </h2>
            <p className="mt-4 text-muted">
              Every rotation has its own quirks, its own calculators, its own
              little checklists that never make it into the official
              systems. CallRoom&apos;s Plugin Builder lets you describe what
              you need in plain language and generates a working clinical
              tool, ready to use and ready to share with your team.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Describe a tool in plain language, get a working version in
                minutes
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Share with your team so everyone benefits from what one
                resident builds
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                Lives inside CallRoom, next to the schedule and board you
                already use
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-medium text-muted">You describe it</p>
                <p className="mt-1.5 text-sm text-foreground/90">
                  &ldquo;A quick calculator for fluid resuscitation based on
                  burn percentage&rdquo;
                </p>
              </div>
              <div className="flex justify-center">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6-6m-6 6l-6-6" />
                </svg>
              </div>
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                <p className="text-xs font-medium text-accent">CallRoom builds it</p>
                <p className="mt-1.5 text-sm text-foreground/90">
                  A working tool in your Plugins tab, ready for the whole
                  team to use on rounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to get your program on CallRoom?
          </h2>
          <p className="max-w-md text-muted">
            Program admins can create an account today. Resident sign-up is
            coming soon.
          </p>
          <Link
            href="/get-started"
            className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
          >
            Get Started
          </Link>
        </div>
      </section>
    </>
  );
}

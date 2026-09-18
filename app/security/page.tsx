import Link from "next/link";

const pillars = [
  {
    title: "Encrypted, always",
    color: "text-blue",
    desc: "Every connection uses TLS in transit. Clinical content is encrypted at rest with AES-256-GCM. Encryption keys never touch a client device.",
  },
  {
    title: "Every access, logged",
    color: "text-teal",
    desc: "A two-layer audit system records who touched what, when, and why, retained for six years in line with HIPAA documentation requirements. No one reviews clinical content without leaving a trace.",
  },
  {
    title: "Minimum necessary, by design",
    color: "text-purple",
    desc: "CallRoom doesn't ask for patient names, dates of birth, or medical record numbers. The product is built around room numbers, bed numbers, and initials from the ground up, not as an afterthought.",
  },
  {
    title: "AI runs server-side",
    color: "text-accent",
    desc: "Clinical input never goes straight from your device to a third-party AI API. It passes through access-controlled infrastructure we operate, under our Business Associate Agreement, every time.",
  },
  {
    title: "A signed BAA, not a promise",
    color: "text-blue",
    desc: "Jinka Technologies has an executed Business Associate Agreement with our cloud infrastructure provider covering every service that touches clinical content. Not planned. Signed.",
  },
  {
    title: "Defensible, not derivative",
    color: "text-teal",
    desc: "The core technology is patent-pending. CallRoom was built as clinical infrastructure from day one, not a chat window bolted onto someone else's AI model.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pb-4 pt-20 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Security & Trust
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          CallRoom handles clinical workflow content, so the infrastructure
          underneath it doesn&apos;t get to be an afterthought. Here is
          what that actually means, in plain language.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className={`text-base font-semibold ${p.color}`}>
                {p.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-xl font-bold tracking-tight">
            Why this matters more than a badge
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            A lot of new clinical software is a thin interface in front of
            a general-purpose AI model, with patient-adjacent text sent
            straight to a third-party API and no meaningful audit trail
            behind it. CallRoom was built the other way: every AI call
            runs through our own access-controlled infrastructure, every
            touch of clinical content is logged, and the product was
            designed to minimize what it ever needs to collect in the
            first place. That is a different, slower, more deliberate way
            to build, and it is the only way we think clinical software
            should be built.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hipaa"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Read the full HIPAA statement
            </Link>
            <Link
              href="/privacy"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Read the Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="text-xl font-bold tracking-tight">
          Deploying at a program or institution?
        </h2>
        <p className="mt-3 text-muted">
          We&apos;ll execute a Business Associate Agreement directly with
          your institution before any deployment.
        </p>
        <a
          href="mailto:legal@callroom.md"
          className="mt-5 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent-hover"
        >
          Contact legal@callroom.md
        </a>
      </section>
    </>
  );
}

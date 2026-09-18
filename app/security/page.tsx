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
    desc: "CallRoom only collects what a clinical workflow actually needs, and never asks for more identifying detail than a task requires.",
  },
  {
    title: "AI runs server-side",
    color: "text-accent",
    desc: "Clinical input never goes straight from your device to a third-party AI API. It passes through access-controlled infrastructure we operate, under our Business Associate Agreement, every time.",
  },
  {
    title: "Business Associate Agreement",
    color: "text-blue",
    desc: "Jinka Technologies has an executed Business Associate Agreement with our cloud infrastructure provider, covering every service that touches clinical content.",
  },
  {
    title: "Patent-pending technology",
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
          what that actually means.
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
            How CallRoom is built differently
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Most new clinical AI products send your input straight to a
            general-purpose AI API, with no audit trail behind it. CallRoom
            runs every AI call through infrastructure we control, logs
            every touch of clinical content, and only collects what it
            needs to. It took longer to build it this way. We think
            it&apos;s the right way to build software that touches patient
            care.
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

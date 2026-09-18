export default function SupportPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Support
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Have a question, ran into a bug, or want to talk about bringing
        CallRoom to your program? Reach out, a real person reads every
        message.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="mailto:support@callroom.md"
          className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-white/20"
        >
          <h3 className="text-sm font-semibold text-accent">Email Support</h3>
          <p className="mt-2 text-sm text-muted">support@callroom.md</p>
        </a>

        <a
          href="mailto:admin@callroom.md?subject=Program%20Inquiry"
          className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-white/20"
        >
          <h3 className="text-sm font-semibold text-blue">Program Inquiries</h3>
          <p className="mt-2 text-sm text-muted">
            Bringing CallRoom to your residency program
          </p>
        </a>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Looking for FAQs first?
        </h3>
        <p className="mt-2 text-sm text-muted">
          Check the{" "}
          <a href="/faq" className="text-accent hover:underline">
            FAQ page
          </a>
          . Most common questions about accounts, HIPAA compliance, and
          getting your program set up are answered there.
        </p>
      </div>
    </section>
  );
}

import ProgramInquiryForm from "@/components/ProgramInquiryForm";

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Support
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Have a question or ran into a bug? Reach out, a real person reads
        every message.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h3 className="text-sm font-semibold text-foreground">
          Email Support
        </h3>
        <a
          href="mailto:support@callroom.md"
          className="mt-2 inline-block text-sm text-accent underline underline-offset-2 hover:text-accent-hover"
        >
          support@callroom.md
        </a>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold tracking-tight">
          Program Inquiries
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Bringing CallRoom to your residency program? Tell us a bit about
          it.
        </p>
        <div className="mt-4">
          <ProgramInquiryForm />
        </div>
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

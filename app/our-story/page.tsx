import Image from "next/image";

export default function OurStoryPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Our Story
      </h1>
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-muted">
        <p>
          CallRoom started the way most tools clinicians actually want get
          built: out of necessity, in the middle of a shift, by someone
          living the problem firsthand.
        </p>
        <p>
          As a practicing resident physician, the founder was juggling call
          schedules, patient hand-offs, and case prep across a stack of
          tools that weren&apos;t built for residency training. Sticky
          notes, group texts, and whatever the hospital EMR happened to
          support that week. None of it was designed for how training
          programs actually run.
        </p>
        <p>
          So the tool that seemed missing got built: a single home screen
          for the floor. CallRoom brings together shift planning, patient
          task tracking, clinical notes, and AI-assisted documentation,
          designed around how clinical teams actually hand off care rather
          than how a generic scheduling app assumes they should.
        </p>
        <p>
          It&apos;s built with HIPAA-conscious, privacy-by-default
          principles from day one. Every feature, from the AI parsing on
          the Board to the Plugin Builder that lets residents create their
          own tools, was shaped by what actually helps on a busy service,
          not what looks good in a pitch deck.
        </p>
        <p>
          The underlying technology is patent-pending, and CallRoom was
          accepted into the American Society of Plastic Surgeons&apos;
          Inventors Challenge, a program that evaluates new clinical
          technology built by physicians for physicians.
        </p>
      </div>

      {/* Founder note */}
      <div className="mt-14 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row">
          <Image
            src="/founder/sanjay-headshot.jpg"
            alt="Sanjay Jinka, MD, Founder of CallRoom"
            width={112}
            height={112}
            className="h-28 w-28 shrink-0 rounded-xl object-cover"
          />
          <div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              &ldquo;I built the first version of CallRoom for my own
              team, because I needed it to exist. Every decision since
              then, from how we handle patient data to what the AI is and
              isn&apos;t allowed to do, has been made by someone who
              actually carries the pager.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              Sanjay Jinka, MD
            </p>
            <p className="text-xs text-muted">Founder, CallRoom</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[15px] leading-relaxed text-foreground">
        CallRoom is built for residents and the physicians training them,
        across every specialty where the floor never really stops moving.
      </p>
    </section>
  );
}

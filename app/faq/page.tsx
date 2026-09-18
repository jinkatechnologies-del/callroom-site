"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Who is CallRoom for?",
    a: "CallRoom is built for residents, and for the physicians and programs that train them. It started with surgical residency but the core problem, coordinating schedules, patient tasks, and documentation across a busy training program, isn't specialty-specific. Any residency program looking for a better way to run its floor can use it.",
  },
  {
    q: "Is CallRoom HIPAA-compliant?",
    a: "CallRoom is built on HIPAA-eligible infrastructure with a signed Business Associate Agreement in place with our cloud provider, encryption in transit and at rest, and audit logging on access to protected data. See our HIPAA Compliance page for details.",
  },
  {
    q: "Can I sign up as an individual resident right now?",
    a: "General resident sign-up is coming soon. Today, Program Coordinators and Admins can create an account to set up their program, and residents join through their program's admin.",
  },
  {
    q: "What is the Plugin Builder?",
    a: "It's a way to build your own clinical tools without writing code. Describe what you need in plain language and CallRoom generates a working tool you can use yourself or share with your whole team, right inside the app.",
  },
  {
    q: "How does the AI documentation work?",
    a: "CallRoom uses AI to assist with CPT and ICD-10 code suggestions, operative note drafting, and case prep study guides, built from your own clinical input. Every AI-generated draft is meant for your review, not autonomous documentation.",
  },
  {
    q: "Is there a cost to use CallRoom?",
    a: "CallRoom is free to get started. We'll share more on program-level licensing as the platform grows. Reach out via Support if your program wants to talk pricing now.",
  },
  {
    q: "How is my data protected?",
    a: "Data is encrypted in transit and at rest, access is audit-logged, and PHI exposure is minimized by design. Program admins control access within their own program's data.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Frequently Asked Questions
      </h1>

      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
        {faqs.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-foreground">
                  {item.q}
                </span>
                <span
                  className={`shrink-0 text-accent transition-transform ${
                    open ? "rotate-45" : ""
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </span>
              </button>
              {open && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-muted">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

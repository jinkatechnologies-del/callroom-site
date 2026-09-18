import LegalContent, { type LegalBlock } from "@/components/LegalContent";
import content from "@/lib/hipaa-content.json";

export default function HipaaPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        HIPAA Compliance
      </h1>
      <LegalContent blocks={content as LegalBlock[]} />
    </section>
  );
}

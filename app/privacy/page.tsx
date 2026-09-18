import LegalContent, { type LegalBlock } from "@/components/LegalContent";
import content from "@/lib/privacy-content.json";

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
        Privacy Policy
      </h1>
      <LegalContent blocks={content as LegalBlock[]} />
    </section>
  );
}

export type LegalBlock =
  | { type: "meta"; text: string }
  | { type: "callout"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export default function LegalContent({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="mt-8 space-y-4">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "meta":
            return (
              <p key={i} className="text-xs text-muted">
                {block.text}
              </p>
            );
          case "callout":
            return (
              <p
                key={i}
                className="rounded-xl border border-accent/25 bg-accent/5 px-4 py-3 text-[13px] leading-relaxed text-foreground/90"
              >
                {block.text}
              </p>
            );
          case "h2":
            return (
              <h2
                key={i}
                className="!mt-10 text-lg font-bold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="!mt-6 text-sm font-semibold text-foreground"
              >
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc space-y-1.5 pl-5">
                {block.items.map((item, j) => (
                  <li key={j} className="text-[13px] leading-relaxed text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "p":
          default:
            return (
              <p key={i} className="text-[13px] leading-relaxed text-muted">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}

import { renderRichText } from "@/lib/utils";

/** Renders the light markdown subset used across books, chapters and posts. */
export function RichText({ content, className = "" }: { content: string; className?: string }) {
  const blocks = renderRichText(content);

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="mt-2 font-display text-xl font-semibold text-ink">
                {block.text}
              </h3>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="deva rounded-lg bg-cream-2 px-5 py-4 text-lg text-ink sm:text-xl"
              >
                {block.text.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex} className="block">
                    {line}
                  </span>
                ))}
              </blockquote>
            );
          case "list":
            return (
              <ul key={index} className="flex list-disc flex-col gap-2 pl-5 text-[17px] leading-relaxed text-body">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "empty":
            return null;
          default: {
            const italic = block.text.startsWith("*") && block.text.endsWith("*");
            const text = italic ? block.text.replace(/^\*|\*$/g, "") : block.text;
            return (
              <p
                key={index}
                className={`text-[17px] leading-[1.75] text-body ${italic ? "font-display text-lg italic text-[#6a4c28]" : ""}`}
              >
                {text.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex} className="block">
                    {line.replace(/^\*|\*$/g, "")}
                  </span>
                ))}
              </p>
            );
          }
        }
      })}
    </div>
  );
}

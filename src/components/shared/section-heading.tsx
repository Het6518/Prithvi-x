import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  copy: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="neo-eyebrow">{eyebrow}</p>
      ) : null}
      <h2 className="section-title">{title}</h2>
      <p className={cn("section-copy", align === "center" && "mx-auto")}>{copy}</p>
    </div>
  );
}

import wordmarkDark from "@/tessera_svg_elements_exact/tessera_wordmark_dark_exact.svg";
import wordmarkFooter from "@/tessera_svg_elements_exact/tessera_wordmark_footer_surface_exact.svg";
import wordmarkLight from "@/tessera_svg_elements_exact/tessera_wordmark_light_exact.svg";
import Image from "next/image";

type BrandWordmarkProps = {
  className?: string;
  variant?: "default" | "footer";
  tone?: "dark" | "light";
  imageClassName?: string;
};

export function BrandWordmark({ className, variant = "default", tone = "dark", imageClassName }: BrandWordmarkProps) {
  const src = variant === "footer" ? wordmarkFooter : tone === "light" ? wordmarkLight : wordmarkDark;

  return (
    <span className={className ?? "relative block h-12 w-[260px] overflow-hidden"}>
      <Image
        src={src}
        alt="Tessera"
        fill
        priority
        className={imageClassName ?? "object-contain object-center scale-[2.5]"}
      />
    </span>
  );
}

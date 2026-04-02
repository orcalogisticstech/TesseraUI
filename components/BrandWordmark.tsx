import wordmarkDark from "@/tessera_svg_elements_exact/tessera_wordmark_dark_exact.svg";
import wordmarkFooter from "@/tessera_svg_elements_exact/tessera_wordmark_footer_surface_exact.svg";
import Image from "next/image";

type BrandWordmarkProps = {
  className?: string;
  variant?: "default" | "footer";
  imageClassName?: string;
};

export function BrandWordmark({ className, variant = "default", imageClassName }: BrandWordmarkProps) {
  const src = variant === "footer" ? wordmarkFooter : wordmarkDark;

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

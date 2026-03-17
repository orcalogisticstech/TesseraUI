"use client";

import { useThemeMode } from "@/components/useThemeMode";
import wordmarkDark from "@/tessera_svg_elements_exact/tessera_wordmark_dark_exact.svg";
import wordmarkLight from "@/tessera_svg_elements_exact/tessera_wordmark_light_exact.svg";
import Image from "next/image";

type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className }: BrandWordmarkProps) {
  const themeMode = useThemeMode();
  const src = themeMode === "light" ? wordmarkLight : wordmarkDark;

  return (
    <span className={className ?? "relative block h-12 w-[260px] overflow-hidden"}>
      <Image
        src={src}
        alt="Tessera"
        fill
        priority
        className="object-contain object-center scale-[2.5]"
      />
    </span>
  );
}

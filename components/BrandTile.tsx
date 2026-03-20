"use client";

import { useThemeMode } from "@/components/useThemeMode";
import tileBlackFillLimeOutline from "@/tessera_svg_elements_exact/tile_black_fill_lime_outline.svg";
import tileLimeFillBlackOutline from "@/tessera_svg_elements_exact/tile_lime_fill_black_outline.svg";
import Image from "next/image";

type TileVariant = "collapsed" | "accent";

type BrandTileProps = {
  className?: string;
  variant?: TileVariant;
};

export function BrandTile({ className }: BrandTileProps) {
  const themeMode = useThemeMode();
  const src = themeMode === "light" ? tileLimeFillBlackOutline : tileBlackFillLimeOutline;

  return <Image src={src} alt="Tessera tile mark" width={89} height={45} className={className ?? "h-6 w-auto"} />;
}

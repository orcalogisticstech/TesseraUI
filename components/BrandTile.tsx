"use client";

import tileBlackFillLimeOutline from "@/tessera_svg_elements_exact/tile_black_fill_lime_outline.svg";
import tileLimeFillBlackOutline from "@/tessera_svg_elements_exact/tile_lime_fill_black_outline.svg";
import Image from "next/image";

type TileVariant = "collapsed" | "accent";

type BrandTileProps = {
  className?: string;
  variant?: TileVariant;
  tone?: "dark" | "light";
};

export function BrandTile({ className, tone = "dark" }: BrandTileProps) {
  const src = tone === "light" ? tileLimeFillBlackOutline : tileBlackFillLimeOutline;
  return <Image src={src} alt="Tessera tile mark" width={89} height={45} className={className ?? "h-6 w-auto"} />;
}

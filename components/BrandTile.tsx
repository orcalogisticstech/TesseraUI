"use client";

import tileLimeFill from "@/tessera_svg_elements_exact/tile_lime_fill_exact.svg";
import Image from "next/image";

type TileVariant = "collapsed" | "accent";

type BrandTileProps = {
  className?: string;
  variant?: TileVariant;
};

export function BrandTile({ className, variant = "collapsed" }: BrandTileProps) {
  const src = variant === "accent" ? tileLimeFill : tileLimeFill;

  return <Image src={src} alt="Tessera tile mark" width={89} height={45} className={className ?? "h-6 w-auto"} />;
}

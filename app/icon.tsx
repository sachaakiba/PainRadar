import { ImageResponse } from "next/og";
import { BrandIconMark } from "@/lib/brand-icon-mark";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BrandIconMark size={48} />, { ...size });
}

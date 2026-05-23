/** Shared PainRadar mark (rounded coral tile + Radar icon) for ImageResponse favicons. */
const CORAL = "#ff6b4a";
const CORAL_BG = "rgba(255, 107, 74, 0.15)";

const RADAR_PATHS = [
  "M19.07 4.93A10 10 0 0 0 6.99 3.34",
  "M4 6h.01",
  "M2.29 9.62A10 10 0 1 0 21.31 8.35",
  "M16.24 7.76A6 6 0 1 0 8.23 16.67",
  "M12 18h.01",
  "M17.99 11.66A6 6 0 0 1 15.77 16.67",
  "m13.41 10.59 5.66-5.66",
] as const;

export function BrandIconMark({ size }: { size: number }) {
  const iconSize = Math.round(size * 0.5);
  const borderRadius = Math.round(size * 0.375);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: CORAL_BG,
        borderRadius,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={CORAL}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {RADAR_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
        <circle cx="12" cy="12" r="2" />
      </svg>
    </div>
  );
}

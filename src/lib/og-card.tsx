import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontRegular = await readFile(
  join(process.cwd(), "assets/fonts/jetbrains-mono-latin-400-normal.woff"),
);
const fontBold = await readFile(
  join(process.cwd(), "assets/fonts/jetbrains-mono-latin-700-normal.woff"),
);

const colors = {
  background: "#0a0b0a",
  border: "#22261f",
  foreground: "#e7ede6",
  muted: "#8b968a",
  accent: "#7fd97f",
};

type OgCardProps = {
  command: string;
  title: string;
  subtitle: string;
  body: string;
  footer: string;
};

export function renderOgCard({
  command,
  title,
  subtitle,
  body,
  footer,
}: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.background,
          color: colors.foreground,
          padding: "72px",
          fontFamily: "JetBrains Mono",
          border: `2px solid ${colors.border}`,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, alignItems: "center" }}>
          <span style={{ color: colors.accent }}>daniel@gta</span>
          <span style={{ color: colors.muted }}>:~$</span>
          <span style={{ marginLeft: 16 }}>{command}</span>
          <span
            style={{
              marginLeft: 10,
              width: 16,
              height: 32,
              background: colors.accent,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ fontSize: 42, color: colors.accent, marginTop: 16 }}>
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 28,
              color: colors.muted,
              marginTop: 28,
              maxWidth: 1056,
            }}
          >
            {body}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: colors.muted,
            borderTop: `2px solid ${colors.border}`,
            paddingTop: 28,
          }}
        >
          {footer}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "JetBrains Mono", data: fontRegular, style: "normal", weight: 400 },
        { name: "JetBrains Mono", data: fontBold, style: "normal", weight: 700 },
      ],
    },
  );
}

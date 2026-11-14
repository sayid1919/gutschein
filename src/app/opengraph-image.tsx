import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#060a08",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(47,154,85,0.55), rgba(6,10,8,0) 58%)",
          color: "#f4f0e6",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <polygon points="32,9 51,24 32,56 13,24" fill="#2f9a55" />
          <polygon points="32,9 51,24 32,24" fill="#8fe39a" />
          <polygon points="32,9 13,24 32,24" fill="#57c56e" />
          <polygon points="32,24 51,24 32,56" fill="#1f7a43" />
          <polygon
            points="32,9 51,24 32,56 13,24"
            fill="none"
            stroke="#e3cb97"
            strokeWidth="1.2"
          />
        </svg>
        <div style={{ marginTop: 44, fontSize: 76, letterSpacing: 18, textTransform: "uppercase" }}>
          {site.name}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "#cbab6c",
          }}
        >
          {site.tagline}
        </div>
      </div>
    ),
    size,
  );
}

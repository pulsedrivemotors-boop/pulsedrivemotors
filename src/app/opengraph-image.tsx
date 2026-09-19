import { ImageResponse } from "next/og";

export const alt = "Pulse Drive Motors — Used Cars for Sale in Calgary, AB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px",
          color: "#ffffff",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#a3e635",
            }}
          />
          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#a3e635",
            }}
          >
            PULSE DRIVE MOTORS
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05 }}>
            Used Cars for Sale
          </div>
          <div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05, color: "#a3e635" }}>
            in Calgary, AB
          </div>
          <div style={{ fontSize: "30px", color: "#9ca3af", marginTop: "24px" }}>
            Certified pre-owned · CARFAX reports · Flexible financing
          </div>
        </div>

        {/* Bottom: url + badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "28px", color: "#ffffff" }}>pulsedrivemotors.ca</div>
          <div style={{ fontSize: "24px", color: "#6b7280" }}>AMVIC Registered Dealer</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

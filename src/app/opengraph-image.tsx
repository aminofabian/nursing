import { ImageResponse } from "next/og"

import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top left, #22c55e33, transparent 60%), radial-gradient(circle at bottom right, #3b82f633, transparent 60%), #020617",
          color: "#f9fafb",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "960px",
            padding: "48px 64px",
            borderRadius: "32px",
            border: "1px solid rgba(148, 163, 184, 0.6)",
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.9))",
            boxShadow:
              "0 40px 80px rgba(15, 23, 42, 0.8), 0 0 0 1px rgba(15, 23, 42, 0.9)",
          }}
        >
          <div style={{ fontSize: 24, opacity: 0.8, marginBottom: 12 }}>
            Nursing Study Platform
          </div>
          <div style={{ fontSize: 54, fontWeight: 800, lineHeight: 1.1 }}>
            {APP_NAME}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 26,
              opacity: 0.9,
              maxWidth: 700,
            }}
          >
            {APP_DESCRIPTION}
          </div>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 24,
              fontSize: 20,
              opacity: 0.85,
            }}
          >
            <div>Study notes</div>
            <div>Practice exams</div>
            <div>NCLEX prep</div>
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    },
  )
}


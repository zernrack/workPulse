import { ImageResponse } from "next/og"

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 48,
        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "32px",
        position: "relative",
        boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
      }}
    >
      {/* Lightning bolt icon */}
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          fill="white"
          stroke="white"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Subtle pulse effect background */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "12px",
          height: "12px",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "50%",
        }}
      />
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  )
}

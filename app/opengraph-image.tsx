import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "We Should Catch Up — An iOS app that connects you with friends the moment you're both free.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Load Fraunces font for the headline
  const frauncesMedium = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nk.woff",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const interRegular = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

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
          background: "linear-gradient(145deg, #FBF7F4 0%, #F5EDE8 40%, #F0DDD7 100%)",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Decorative circle top right */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(196, 96, 74, 0.08)",
            display: "flex",
          }}
        />
        {/* Decorative circle bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "rgba(196, 96, 74, 0.06)",
            display: "flex",
          }}
        />

        {/* Speech bubble icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "#C4604A",
            marginBottom: "32px",
            boxShadow: "0 8px 32px rgba(196, 96, 74, 0.3)",
          }}
        >
          <span style={{ fontSize: "36px" }}>💬</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: '"Fraunces"',
            fontSize: "64px",
            fontWeight: 500,
            color: "#2D2926",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>We Should</span>
          <span style={{ color: "#C4604A" }}>Catch Up</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: '"Inter"',
            fontSize: "24px",
            fontWeight: 400,
            color: "#6B6560",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "700px",
            display: "flex",
          }}
        >
          An iOS app that connects you with friends the moment
          you&apos;re both free. Just tap &ldquo;I&apos;m free&rdquo; and talk.
        </div>

        {/* Pill badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "36px",
            background: "rgba(196, 96, 74, 0.1)",
            padding: "10px 24px",
            borderRadius: "999px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#C4604A",
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: '"Inter"',
              fontSize: "16px",
              fontWeight: 500,
              color: "#C4604A",
            }}
          >
            Coming soon to iOS
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: frauncesMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}

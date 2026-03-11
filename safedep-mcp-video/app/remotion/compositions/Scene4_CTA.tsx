import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { SAFEDEP_ENDPOINT, SUPPORTED_TOOLS } from "../utils/constants";

export const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");

  const heroSpring = spring({
    frame,
    fps,
    config: { damping: 120, stiffness: 120 },
  });

  const cardOpacity = interpolate(frame, [34, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sceneOpacity = interpolate(
    frame,
    [0, 8, durationInFrames - 14, durationInFrames - 4],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06101B",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 50% 20%, rgba(0, 194, 168, 0.22), transparent 24%), radial-gradient(circle at 50% 80%, rgba(56, 189, 248, 0.18), transparent 28%), url(${bgImage})`,
          backgroundSize: "auto, auto, cover",
          backgroundPosition: "center",
          opacity: 0.26,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4, 10, 18, 0.78), rgba(4, 10, 18, 0.94))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          padding: "0 72px",
          opacity: heroSpring * sceneOpacity,
          transform: `translateY(${(1 - heroSpring) * 20}px)`,
        }}
      >
        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(103, 232, 249, 0.24)",
            backgroundColor: "rgba(8, 15, 24, 0.6)",
            color: "#67E8F9",
            fontSize: 17,
            fontWeight: 700,
            fontFamily: "Mona Sans, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          SafeDep MCP
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: "-3px",
            fontWeight: 820,
            color: "#F8FAFC",
            fontFamily: "Mona Sans, sans-serif",
            maxWidth: 1100,
          }}
        >
          <AnimatedText
            text="Protect AI coding agents before package install turns into execution."
            startFrame={8}
            durationInFrames={22}
          />
        </div>

        <div
          style={{
            opacity: cardOpacity,
            transform: `translateY(${(1 - cardOpacity) * 14}px)`,
            width: "100%",
            maxWidth: 1160,
            padding: "24px 28px",
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(0, 194, 168, 0.12), rgba(14, 165, 233, 0.08))",
            border: "1px solid rgba(148, 163, 184, 0.16)",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.32)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#67E8F9",
              fontWeight: 700,
              fontFamily: "Mona Sans, sans-serif",
              marginBottom: 12,
            }}
          >
            live endpoint
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#F8FAFC",
              fontFamily: "JetBrains Mono, monospace",
              marginBottom: 20,
            }}
          >
            {SAFEDEP_ENDPOINT}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {SUPPORTED_TOOLS.map((tool) => (
              <div
                key={tool}
                style={{
                  padding: "12px 16px",
                  borderRadius: 999,
                  backgroundColor: "rgba(7, 16, 28, 0.7)",
                  border: "1px solid rgba(148, 163, 184, 0.16)",
                  color: "#E2E8F0",
                  fontSize: 16,
                  fontWeight: 650,
                  fontFamily: "Mona Sans, sans-serif",
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 34,
            color: "#E2E8F0",
            fontFamily: "Mona Sans, sans-serif",
            fontWeight: 700,
          }}
        >
          safedep.io/mcp
        </div>
      </div>
    </AbsoluteFill>
  );
};

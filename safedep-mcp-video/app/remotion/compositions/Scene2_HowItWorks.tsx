import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CodeBlock } from "../components/CodeBlock";
import { FlowDiagram } from "../components/FlowDiagram";
import {
  CODEX_CONFIG_SNIPPET,
  SAFEDEP_HEADERS,
  SAFEDEP_ENDPOINT,
  SUPPORTED_TOOLS,
} from "../utils/constants";

export const Scene2_HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");

  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 120, stiffness: 110 },
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
        backgroundColor: "#06111B",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(135deg, rgba(0, 194, 168, 0.14), rgba(56, 189, 248, 0.08)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.24,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "72px 82px",
          gap: 28,
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            opacity: titleReveal,
            transform: `translateY(${(1 - titleReveal) * 18}px)`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                color: "#67E8F9",
                fontWeight: 700,
                letterSpacing: 0.5,
                fontFamily: "Mona Sans, sans-serif",
                marginBottom: 18,
                textTransform: "uppercase",
              }}
            >
              How it works in production
            </div>
            <div
              style={{
                fontSize: 62,
                lineHeight: 1.06,
                letterSpacing: "-2px",
                color: "#F8FAFC",
                fontWeight: 800,
                fontFamily: "Mona Sans, sans-serif",
                maxWidth: 780,
              }}
            >
              Connect your coding agent to the SafeDep MCP endpoint.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            flex: 1,
          }}
        >
          <div
            style={{
              flex: 1.1,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <CodeBlock
              title="OpenAI Codex config"
              lines={CODEX_CONFIG_SNIPPET}
              startFrame={24}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {SUPPORTED_TOOLS.map((tool, index) => {
                const opacity = interpolate(
                  frame,
                  [70 + index * 6, 90 + index * 6],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                  <div
                    key={tool}
                    style={{
                      opacity,
                      transform: `translateY(${(1 - opacity) * 8}px)`,
                      padding: "12px 16px",
                      borderRadius: 999,
                      border: "1px solid rgba(148, 163, 184, 0.18)",
                      backgroundColor: "rgba(15, 23, 42, 0.72)",
                      color: "#E2E8F0",
                      fontSize: 16,
                      fontWeight: 650,
                      fontFamily: "Mona Sans, sans-serif",
                    }}
                  >
                    {tool}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                padding: "22px 24px",
                borderRadius: 24,
                backgroundColor: "rgba(7, 16, 28, 0.84)",
                border: "1px solid rgba(148, 163, 184, 0.16)",
              }}
            >
              <FlowDiagram currentFrame={frame} />
            </div>
            <div
              style={{
                padding: "26px 28px",
                borderRadius: 24,
                background:
                  "linear-gradient(135deg, rgba(0, 194, 168, 0.16), rgba(14, 165, 233, 0.08))",
                border: "1px solid rgba(0, 194, 168, 0.18)",
              }}
            >
              <div
                style={{
                  color: "#F8FAFC",
                  fontSize: 28,
                  fontWeight: 760,
                  fontFamily: "Mona Sans, sans-serif",
                  marginBottom: 12,
                }}
              >
                Invisible in developer workflow.
              </div>
              <div
                style={{
                  color: "#C7D2E0",
                  fontSize: 22,
                  lineHeight: 1.5,
                  fontFamily: "Mona Sans, sans-serif",
                }}
              >
                Real-time package reputation checks happen before the agent
                finishes the install, so safe packages continue and known threats
                stop in-line.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

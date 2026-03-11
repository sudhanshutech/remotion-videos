import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Terminal } from "../components/Terminal";
import { TEST_PACKAGE } from "../utils/constants";

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");

  const contentSpring = spring({
    frame: frame,
    fps,
    config: { damping: 120, stiffness: 120 },
  });

  const timelineOpacity = interpolate(frame, [90, 130], [0, 1], {
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
        backgroundColor: "#05111D",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(0, 194, 168, 0.18), transparent 30%), radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.18), transparent 28%), url(${bgImage})`,
          backgroundSize: "auto, auto, cover",
          backgroundPosition: "center",
          // opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(5, 17, 29, 0.96), rgba(8, 15, 25, 0.88))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          height: "100%",
          padding: "86px 92px",
          gap: 44,
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            flex: 0.95,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: contentSpring,
            transform: `translateY(${(1 - contentSpring) * 26}px)`,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid rgba(56, 189, 248, 0.32)",
              backgroundColor: "rgba(15, 23, 42, 0.55)",
              color: "#7DD3FC",
              fontSize: 17,
              fontWeight: 650,
              fontFamily: "Mona Sans, sans-serif",
              marginBottom: 24,
            }}
          >
            Package security for autonomous coding agents
          </div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-2.8px",
              color: "#F8FAFC",
              fontFamily: "Mona Sans, sans-serif",
              maxWidth: 760,
            }}
          >
            Your agent clicks install.
            <br />
            SafeDep decides if it lands.
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            opacity: interpolate(frame, [20, 55], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateX(${interpolate(frame, [20, 55], [42, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              fontFamily: "Mona Sans, sans-serif",
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                backgroundColor: "rgba(249, 115, 22, 0.16)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                color: "#FDBA74",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              install event
            </div>
            <div
              style={{
                color: "#93C5FD",
                fontSize: 18,
              }}
            >
              Package requested by an autonomous agent
            </div>
          </div>
          <Terminal
            title="codex workspace"
            typingSpeed={1.6}
            minHeight={320}
            lines={[
              {
                text: `npm install ${TEST_PACKAGE}`,
                delay: 0,
                color: "#CBD5E1",
                prefix: "$",
              },
              {
                text: "SafeDep MCP check initiated",
                delay: 28,
                color: "#67E8F9",
              },
              {
                text: "Threat intelligence match: controlled malicious package",
                delay: 70,
                color: "#FDBA74",
              },
              {
                text: "BLOCKED before installation completed",
                delay: 116,
                color: "#F87171",
              },
              {
                text: "Result: agent workflow continues without package execution",
                delay: 158,
                color: "#A7F3D0",
              },
            ]}
          />
          <div
            style={{
              display: "flex",
              gap: 14,
              opacity: timelineOpacity,
            }}
          >
            {["Install requested", "Threat intel lookup", "Blocked in flow"].map(
              (item, index) => (
                <div
                  key={item}
                  style={{
                    flex: 1,
                    padding: "14px 16px",
                    borderRadius: 16,
                    backgroundColor: "rgba(15, 23, 42, 0.72)",
                    border: "1px solid rgba(148, 163, 184, 0.16)",
                    color: index === 2 ? "#FCA5A5" : "#D8E4F2",
                    fontSize: 16,
                    fontWeight: 650,
                    fontFamily: "Mona Sans, sans-serif",
                    textAlign: "center",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

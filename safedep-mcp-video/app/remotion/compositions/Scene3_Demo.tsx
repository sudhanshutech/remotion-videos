import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Terminal } from "../components/Terminal";
import { TEST_PACKAGE } from "../utils/constants";

const panelStyle = {
  flex: 1,
  padding: "26px 24px 24px",
  borderRadius: 28,
  backgroundColor: "rgba(7, 16, 28, 0.82)",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 30px 70px rgba(0, 0, 0, 0.28)",
};

export const Scene3_Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");

  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 120, stiffness: 120 },
  });

  const leftReveal = interpolate(frame, [24, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightReveal = interpolate(frame, [70, 102], [0, 1], {
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
        backgroundColor: "#07111C",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 30% 25%, rgba(249, 115, 22, 0.14), transparent 24%), radial-gradient(circle at 78% 24%, rgba(0, 194, 168, 0.14), transparent 24%), url(${bgImage})`,
          backgroundSize: "auto, auto, cover",
          backgroundPosition: "center",
          opacity: 0.26,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          padding: "74px 78px",
          display: "flex",
          flexDirection: "column",
          gap: 30,
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            opacity: titleReveal,
            transform: `translateY(${(1 - titleReveal) * 18}px)`,
          }}
        >
          <div
            style={{
              fontSize: 18,
              color: "#67E8F9",
              fontWeight: 700,
              fontFamily: "Mona Sans, sans-serif",
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            Trust through transparency
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 20,
            }}
          >
            <div
              style={{
                fontSize: 62,
                lineHeight: 1.06,
                letterSpacing: "-2px",
                color: "#F8FAFC",
                fontWeight: 800,
                fontFamily: "Mona Sans, sans-serif",
                maxWidth: 760,
              }}
            >
              Show the developer exactly what was blocked, and what passed.
            </div>
            <div
              style={{
                fontSize: 22,
                lineHeight: 1.5,
                color: "#B6C2D1",
                fontFamily: "Mona Sans, sans-serif",
                maxWidth: 460,
              }}
            >
              A controlled malicious package gets denied. A normal package flows
              through without friction.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 26,
            flex: 1,
          }}
        >
          <div
            style={{
              ...panelStyle,
              opacity: leftReveal,
              transform: `translateY(${(1 - leftReveal) * 18}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 14px",
                borderRadius: 999,
                backgroundColor: "rgba(248, 113, 113, 0.12)",
                border: "1px solid rgba(248, 113, 113, 0.24)",
                color: "#FCA5A5",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Mona Sans, sans-serif",
                marginBottom: 18,
              }}
            >
              malicious package blocked
            </div>
            <Terminal
              title="workspace / blocked install"
              typingSpeed={1.5}
              minHeight={330}
              lines={[
                {
                  text: `npm install ${TEST_PACKAGE}`,
                  delay: 0,
                  prefix: "$",
                  color: "#CBD5E1",
                },
                {
                  text: "SafeDep MCP policy evaluation started",
                  delay: 28,
                  color: "#67E8F9",
                },
                {
                  text: "Package reputation: malicious test package",
                  delay: 70,
                  color: "#FDBA74",
                },
                {
                  text: "Action: BLOCKED",
                  delay: 108,
                  color: "#F87171",
                },
                {
                  text: "Reason: install prevented before execution",
                  delay: 142,
                  color: "#FCA5A5",
                },
              ]}
            />
          </div>

          <div
            style={{
              ...panelStyle,
              opacity: rightReveal,
              transform: `translateY(${(1 - rightReveal) * 18}px)`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                padding: "10px 14px",
                borderRadius: 999,
                backgroundColor: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.24)",
                color: "#86EFAC",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Mona Sans, sans-serif",
                marginBottom: 18,
              }}
            >
              clean package allowed
            </div>
            <Terminal
              title="workspace / successful install"
              typingSpeed={1.5}
              minHeight={330}
              lines={[
                {
                  text: "npm install express",
                  delay: 0,
                  prefix: "$",
                  color: "#CBD5E1",
                },
                {
                  text: "SafeDep MCP policy evaluation started",
                  delay: 30,
                  color: "#67E8F9",
                },
                {
                  text: "Package reputation: clean",
                  delay: 72,
                  color: "#A7F3D0",
                },
                {
                  text: "Action: ALLOWED",
                  delay: 110,
                  color: "#4ADE80",
                },
                {
                  text: "Install completed successfully",
                  delay: 148,
                  color: "#93C5FD",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

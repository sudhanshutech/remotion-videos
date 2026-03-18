import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const PHASES = [
  "Planning and Design",
  "Code Generation",
  "Dependency Management",
  "Code Review",
  "Testing",
  "CI/CD and Deployment",
  "Monitoring and Response",
  "Audit and Governance",
];

const REVEAL_GAP = 80;

const phaseAccent = (index: number) => {
  const accents = [
    "#57E6FF",
    "#7CF29A",
    "#FDBA74",
    "#F9A8D4",
    "#93C5FD",
    "#FDE68A",
    "#C4B5FD",
    "#FCA5A5",
  ];

  return accents[index % accents.length];
};

export const AINativeSDLCPhases: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 140 },
  });

  const sceneOpacity = interpolate(
    frame,
    [0, 12, durationInFrames - 18, durationInFrames - 4],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const glowPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.8, 1.12], {
    easing: Easing.ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at top left, rgba(69, 207, 255, 0.16), transparent 28%), radial-gradient(circle at 85% 18%, rgba(125, 242, 154, 0.12), transparent 24%), linear-gradient(160deg, #061018 0%, #08131F 45%, #030711 100%)",
        color: "#F8FAFC",
        fontFamily: "Mona Sans, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.18) 55%, transparent)",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 140,
          top: 140,
          width: 420,
          height: 420,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(87, 230, 255, 0.2), rgba(87, 230, 255, 0.03) 48%, transparent 72%)",
          transform: `scale(${glowPulse})`,
          filter: "blur(16px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "84px 96px 72px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 48,
            opacity: intro,
            transform: `translateY(${(1 - intro) * 20}px)`,
          }}
        >
          <div style={{ maxWidth: 980 }}>
            <div
              style={{
                fontSize: 78,
                lineHeight: 0.98,
                fontWeight: 800,
                letterSpacing: "-0.06em",
              }}
            >
              Every phase now has
              <br />
              an autonomous actor.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 22,
            flex: 1,
            alignContent: "start",
          }}
        >
          {PHASES.map((phase, index) => {
            const start = 24 + index * REVEAL_GAP;
            const reveal = spring({
              fps,
              frame: Math.max(0, frame - start),
              config: { damping: 26, stiffness: 130, mass: 0.9 },
            });

            const shimmer = interpolate(frame, [start, start + 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={phase}
                style={{
                  position: "relative",
                  padding: "26px 28px",
                  borderRadius: 28,
                  minHeight: 128,
                  display: "flex",
                  alignItems: "center",
                  background:
                    "linear-gradient(145deg, rgba(10, 22, 35, 0.92), rgba(8, 18, 30, 0.7))",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  boxShadow:
                    reveal > 0.03
                      ? `0 22px 60px rgba(2, 8, 23, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 0 0 1px ${phaseAccent(index)}18`
                      : "none",
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 34}px) scale(${
                    0.96 + reveal * 0.04
                  })`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 28,
                    background: `linear-gradient(110deg, transparent 0%, transparent ${
                      28 + shimmer * 18
                    }%, ${phaseAccent(index)}14 ${40 + shimmer * 18}%, transparent ${
                      56 + shimmer * 18
                    }%, transparent 100%)`,
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      backgroundColor: phaseAccent(index),
                      boxShadow: `0 0 18px ${phaseAccent(index)}88`,
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 34,
                      lineHeight: 1.08,
                      fontWeight: 720,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {phase}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

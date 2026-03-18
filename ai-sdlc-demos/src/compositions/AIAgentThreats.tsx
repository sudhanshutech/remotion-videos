import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const THREATS = [
  "Package Hallucination",
  "Dependency Confusion",
  "Prompt Injection",
  "Training Data Poisoning",
  "Agent Privilege Escalation",
];

const REVEAL_GAP = 68;

const accentFor = (index: number) => {
  const accents = ["#FF7A59", "#FFB84D", "#F96CB7", "#8B9BFF", "#6CE0B5"];
  return accents[index % accents.length];
};

export const AIAgentThreats: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const intro = spring({
    fps,
    frame,
    config: { damping: 170, stiffness: 125 },
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

  const orbScale = interpolate(Math.sin(frame / 22), [-1, 1], [0.92, 1.08], {
    easing: Easing.ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 15%, rgba(255, 122, 89, 0.16), transparent 22%), radial-gradient(circle at 82% 18%, rgba(139, 155, 255, 0.12), transparent 24%), linear-gradient(160deg, #120A0F 0%, #170E15 42%, #05070B 100%)",
        color: "#FCFBFA",
        fontFamily: "Mona Sans, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          opacity: 0.26,
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.25) 62%, transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 124,
          bottom: 92,
          width: 360,
          height: 360,
          borderRadius: 999,
          transform: `scale(${orbScale})`,
          background:
            "radial-gradient(circle, rgba(255, 122, 89, 0.18), rgba(255, 122, 89, 0.02) 50%, transparent 70%)",
          filter: "blur(18px)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "82px 96px 76px",
          opacity: sceneOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 52,
            opacity: intro,
            transform: `translateY(${(1 - intro) * 18}px)`,
          }}
        >
          <div style={{ maxWidth: 1020 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255, 122, 89, 0.24)",
                backgroundColor: "rgba(26, 12, 16, 0.72)",
                color: "#FFB29D",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Threat Landscape
            </div>
            <div
              style={{
                fontSize: 76,
                lineHeight: 0.98,
                fontWeight: 820,
                letterSpacing: "-0.06em",
              }}
            >
              What changes when
              <br />
              agents start acting?
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            width: "100%",
          }}
        >
          {THREATS.map((threat, index) => {
            const start = 26 + index * REVEAL_GAP;
            const reveal = spring({
              fps,
              frame: Math.max(0, frame - start),
              config: { damping: 24, stiffness: 132, mass: 0.92 },
            });

            const track = interpolate(frame, [start, start + 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={threat}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  minHeight: 104,
                  padding: "0 30px",
                  borderRadius: 28,
                  background:
                    "linear-gradient(145deg, rgba(23, 13, 18, 0.95), rgba(10, 8, 12, 0.82))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    reveal > 0.03
                      ? `0 20px 48px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 1px ${accentFor(index)}14`
                      : "none",
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 30}px) scale(${
                    0.97 + reveal * 0.03
                  })`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${track * 100}%`,
                    borderRadius: 28,
                    background: `linear-gradient(90deg, ${accentFor(index)}18, transparent 72%)`,
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${accentFor(index)}18`,
                    border: `1px solid ${accentFor(index)}30`,
                    color: accentFor(index),
                    fontSize: 20,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  0{index + 1}
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: 38,
                    lineHeight: 1.02,
                    fontWeight: 740,
                    letterSpacing: "-0.045em",
                  }}
                >
                  {threat}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

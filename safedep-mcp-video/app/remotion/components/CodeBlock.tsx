import { interpolate, useCurrentFrame } from "remotion";

interface CodeBlockProps {
  title: string;
  lines: string[];
  startFrame?: number;
  accentColor?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  title,
  lines,
  startFrame = 0,
  accentColor = "#00C2A8",
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        backgroundColor: "rgba(7, 16, 28, 0.92)",
        borderRadius: 24,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 32px 80px rgba(0, 0, 0, 0.38)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 22px",
          borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
          background:
            "linear-gradient(90deg, rgba(0, 194, 168, 0.18), rgba(14, 165, 233, 0.08))",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((color) => (
            <div
              key={color}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#D8E4F2",
            fontFamily: "Mona Sans, sans-serif",
            letterSpacing: 0.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: accentColor,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          live config
        </div>
      </div>
      <div
        style={{
          padding: "24px 26px 28px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 18,
          lineHeight: 1.7,
          color: "#E2E8F0",
        }}
      >
        {lines.map((line, index) => {
          const revealProgress = interpolate(
            frame,
            [startFrame + index * 10, startFrame + index * 10 + 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={`${line}-${index}`}
              style={{
                display: "flex",
                opacity: revealProgress,
                transform: `translateY(${(1 - revealProgress) * 12}px)`,
              }}
            >
              <span
                style={{
                  width: 26,
                  color: "rgba(148, 163, 184, 0.5)",
                  userSelect: "none",
                }}
              >
                {index + 1}
              </span>
              <span>{line || " "}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

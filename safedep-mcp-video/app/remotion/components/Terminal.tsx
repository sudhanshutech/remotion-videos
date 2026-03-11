import { interpolate, useCurrentFrame } from "remotion";

interface TerminalLine {
  text: string;
  delay: number;
  color?: string;
  prefix?: string;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  typingSpeed?: number;
  minHeight?: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  title = "Terminal",
  typingSpeed = 1,
  minHeight = 220,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(10, 18, 30, 0.98), rgba(5, 10, 18, 0.98))",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.4)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        fontFamily: "JetBrains Mono, Fira Code, monospace",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#FF5F56",
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#FFBD2E",
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#27C93F",
          }} />
        </div>
        <div style={{
          flex: 1,
          textAlign: "center",
          fontSize: "13px",
          color: "#A8B3C7",
          fontWeight: "600",
          letterSpacing: "0.2px",
        }}>
          {title}
        </div>
        <div style={{ width: "76px" }} />
      </div>
      <div style={{
        padding: "24px 28px",
        minHeight,
      }}>
        {lines.map((line, index) => {
          const lineVisibility = interpolate(
            frame,
            [line.delay - 6, line.delay],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const shouldShow = frame >= line.delay;
          const framesSinceShow = Math.max(0, frame - line.delay);
          const charsToShow = Math.min(
            Math.floor(framesSinceShow * typingSpeed),
            line.text.length
          );
          const displayText = shouldShow ? line.text.substring(0, charsToShow) : "";
          const showCursor = shouldShow && charsToShow < line.text.length;

          return (
            <div
              key={index}
              style={{
                color: line.color || "#58A6FF",
                marginBottom: "10px",
                fontSize: "18px",
                lineHeight: "1.65",
                fontFamily: "JetBrains Mono, monospace",
                opacity: lineVisibility,
                transform: `translateY(${(1 - lineVisibility) * 8}px)`,
                display: "flex",
                alignItems: "center",
              }}
            >
              {line.prefix && (
                <span style={{ 
                  color: "#8B949E",
                  marginRight: "8px",
                  userSelect: "none",
                }}>
                  {line.prefix}
                </span>
              )}
              <span>{displayText}</span>
              {showCursor && (
                <span style={{
                  backgroundColor: line.color || "#58A6FF",
                  width: "8px",
                  height: "18px",
                  display: "inline-block",
                  marginLeft: "2px",
                  animation: "blink 1s infinite",
                }}>
                  {" "}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

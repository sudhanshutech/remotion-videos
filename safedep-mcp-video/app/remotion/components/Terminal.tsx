import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useState, useEffect } from "react";

interface TerminalLine {
  text: string;
  delay: number;
  color?: string;
  prefix?: string;
}

interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ lines, title = "Terminal" }) => {
  const frame = useCurrentFrame();

  // Typing animation speed (characters per frame)
  const typingSpeed = 2;

  return (
    <div style={{
      backgroundColor: "#0D1117", // GitHub dark background
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      fontFamily: "JetBrains Mono, Fira Code, monospace",
    }}>
      {/* Window Chrome */}
      <div style={{
        backgroundColor: "#161B22",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}>
        {/* Traffic Lights */}
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

        {/* Title */}
        <div style={{
          flex: 1,
          textAlign: "center",
          fontSize: "13px",
          color: "#8B949E",
          fontWeight: "500",
        }}>
          {title}
        </div>

        {/* Spacer for symmetry */}
        <div style={{ width: "76px" }} />
      </div>

      {/* Terminal Content */}
      <div style={{
        padding: "24px",
        minHeight: "200px",
      }}>
        {lines.map((line, index) => {
          const shouldShow = frame >= line.delay;
          const framesSinceShow = frame - line.delay;
          const charsToShow = Math.min(
            Math.floor(framesSinceShow / typingSpeed),
            line.text.length
          );
          
          const displayText = shouldShow 
            ? line.text.substring(0, charsToShow)
            : "";
          
          const showCursor = shouldShow && charsToShow < line.text.length;

          return (
            <div
              key={index}
              style={{
                color: line.color || "#58A6FF",
                marginBottom: "8px",
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "JetBrains Mono, monospace",
                opacity: shouldShow ? 1 : 0,
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
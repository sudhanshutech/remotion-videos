import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig, staticFile } from "remotion";
import { Terminal } from "../components/Terminal";

export const Scene1_Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Import background
  const bgImage = staticFile("brand-bg.png"); // adjust filename

  const titleOpacity = spring({
    frame: frame - 10,
    fps,
    config: { damping: 100 },
  });

  const terminalAppear = spring({
    frame: frame - 80,
    fps,
    config: { damping: 80 },
  });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "#0a0a0a",
      position: "relative",
    }}>
      {/* Background Image */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.7, // Adjust opacity so text is readable
        filter: "blur(0px)", // Add blur if needed
      }} />

      {/* Dark overlay for better text contrast */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 10, 10, 0.6)", // Semi-transparent overlay
      }} />

      {/* Content (relative positioning so it's above background) */}
      <div style={{
        position: "relative",
        zIndex: 1,
        padding: "80px",
        height: "100%",
      }}>
        {/* Timestamp */}
        <div style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: titleOpacity,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "96px",
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: "-2px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)", // Text shadow for readability
            fontFamily: "Mona Sans, sans-serif",
          }}>
            3:47 AM
          </div>
          <div style={{
            fontSize: "32px",
            color: "#9CA3AF",
            marginTop: "16px",
            fontWeight: "500",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}>
            Your AI agent just installed a package
          </div>
        </div>

        {/* Terminal */}
        <div style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: `translateX(-50%) scale(${terminalAppear})`,
          opacity: terminalAppear,
          width: "900px",
        }}>
          <Terminal
            title="claude-code — workspace"
            lines={[
              { 
                text: "npm install pino-sdk-v2", 
                delay: 0,
                color: "#8B949E",
                prefix: "$"
              },
              { 
                text: "added 1 package in 847ms", 
                delay: 40,
                color: "#58A6FF"
              },
              { 
                text: "", 
                delay: 60,
                color: "#58A6FF"
              },
              { 
                text: "✓ pino-sdk-v2@9.9.0 installed", 
                delay: 80,
                color: "#3FB950"
              },
              { 
                text: "💀 Malware executed - credentials exfiltrated", 
                delay: 140,
                color: "#F85149"
              },
            ]}
          />
        </div>

        {/* Question */}
        <div style={{
          position: "absolute",
          bottom: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}>
            <div style={{
              width: "6px",
              height: "60px",
              backgroundColor: "#F85149",
              borderRadius: "3px",
            }} />
            <div style={{
              fontSize: "42px",
              color: "#F85149",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
            }}>
              How did the agent know it was safe?
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
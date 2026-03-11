import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate, staticFile } from "remotion";
import { Terminal } from "../components/Terminal";

export const Scene3_Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");

  const leftSpring = spring({ frame: frame - 30, fps, config: { damping: 80 } });
  const rightSpring = spring({ frame: frame - 90, fps, config: { damping: 80 } });
  const titleSpring = spring({ frame: frame - 10, fps, config: { damping: 100 } });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "#0a0a0a",
      padding: "60px",
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
      {/* Grid background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(13, 148, 136, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(13, 148, 136, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: 0.2,
      }} />

      {/* Title */}
      <div style={{
        position: "absolute",
        top: "6%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: titleSpring,
        zIndex: 10,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "6px",
            height: "48px",
            backgroundColor: "#0D9488",
            borderRadius: "3px",
          }} />
          <h2 style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#FFFFFF",
            margin: 0,
            letterSpacing: "-1.5px",
            fontFamily: "Mona Sans, sans-serif",
          }}>
            Live Demo
          </h2>
        </div>
      </div>

      {/* Split container */}
      <div style={{
        position: "absolute",
        top: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        display: "flex",
        gap: "40px",
      }}>
        {/* Left: Blocked */}
        <div style={{
          flex: 1,
          opacity: leftSpring,
          transform: `translateY(${(1 - leftSpring) * 30}px)`,
        }}>
          {/* Label */}
          <div style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#F85149",
              boxShadow: "0 0 20px rgba(248, 81, 73, 0.5)",
            }} />
            <span style={{
              fontSize: "24px",
              color: "#F85149",
              fontWeight: "700",
              fontFamily: "Mona Sans, sans-serif",
            }}>
              Malicious Package
            </span>
          </div>

          <Terminal
            title="safedep-mcp — blocked"
            lines={[
              { 
                text: "npm install pino-sdk-v2", 
                delay: 0,
                color: "#8B949E",
                prefix: "$"
              },
              { 
                text: "", 
                delay: 20,
                color: "#58A6FF"
              },
              { 
                text: "⚡ SafeDep MCP checking...", 
                delay: 30,
                color: "#0D9488"
              },
              { 
                text: "", 
                delay: 60,
                color: "#58A6FF"
              },
              { 
                text: "🚫 BLOCKED", 
                delay: 70,
                color: "#F85149"
              },
              { 
                text: "Reason: Known credential stealer", 
                delay: 100,
                color: "#F85149"
              },
              { 
                text: "Recommendation: Use official 'pino'", 
                delay: 130,
                color: "#9CA3AF"
              },
              { 
                text: "", 
                delay: 160,
                color: "#58A6FF"
              },
              { 
                text: "✓ Agent using safe alternative", 
                delay: 170,
                color: "#3FB950"
              },
            ]}
          />
        </div>

        {/* Right: Allowed */}
        <div style={{
          flex: 1,
          opacity: rightSpring,
          transform: `translateY(${(1 - rightSpring) * 30}px)`,
        }}>
          {/* Label */}
          <div style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#3FB950",
              boxShadow: "0 0 20px rgba(63, 185, 80, 0.5)",
            }} />
            <span style={{
              fontSize: "24px",
              color: "#3FB950",
              fontWeight: "700",
              fontFamily: "Mona Sans, sans-serif",
            }}>
              Clean Package
            </span>
          </div>

          <Terminal
            title="safedep-mcp — allowed"
            lines={[
              { 
                text: "npm install express", 
                delay: 0,
                color: "#8B949E",
                prefix: "$"
              },
              { 
                text: "", 
                delay: 20,
                color: "#58A6FF"
              },
              { 
                text: "⚡ SafeDep MCP checking...", 
                delay: 30,
                color: "#0D9488"
              },
              { 
                text: "", 
                delay: 60,
                color: "#58A6FF"
              },
              { 
                text: "✓ CLEAN", 
                delay: 70,
                color: "#3FB950"
              },
              { 
                text: "Status: Verified safe package", 
                delay: 100,
                color: "#3FB950"
              },
              { 
                text: "", 
                delay: 130,
                color: "#58A6FF"
              },
              { 
                text: "added 57 packages in 1.2s", 
                delay: 140,
                color: "#58A6FF"
              },
              { 
                text: "✓ express@4.18.2 installed", 
                delay: 170,
                color: "#3FB950"
              },
            ]}
          />
        </div>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute",
        bottom: "8%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity: interpolate(frame, [240, 270], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: "28px",
          color: "white",
          textAlign: "center",
          fontWeight: "600",
        }}>
          Zero friction for clean packages • Automatic blocking for threats
        </div>
      </div>
    </AbsoluteFill>
  );
};
import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";
import { AnimatedText } from "../components/AnimatedText";

export const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");
  const contentSpring = spring({ frame: frame - 20, fps });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
      }}
    >
      <div
        style={{
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
        }}
      />
      {/* Main CTA */}
      <div
        style={{
          opacity: contentSpring,
          transform: `scale(${contentSpring})`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#ffffff",
            marginBottom: "40px",
          }}
        >
          <AnimatedText
            text="Get Started in 2 Minutes"
            startFrame={10}
          />
        </h2>

        <div
          style={{
            fontSize: "42px",
            color: "#4a9eff",
            marginBottom: "60px",
            fontFamily: "monospace",
          }}
        >
          safedep.io/mcp
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: "60px",
            justifyContent: "center",
            fontSize: "28px",
            color: "#888",
          }}
        >
          <div>✓ Free tier available</div>
          <div>✓ Works with Cursor, Claude Code, Windsurf</div>
          <div>✓ Real-time protection</div>
        </div>
      </div>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "32px",
          color: "#666",
        }}
      >
        SafeDep
      </div>
    </AbsoluteFill>
  );
};

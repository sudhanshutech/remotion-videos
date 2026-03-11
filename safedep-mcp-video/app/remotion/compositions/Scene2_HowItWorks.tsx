import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  staticFile,
} from "remotion";
import { FlowDiagram } from "../components/FlowDiagram";
import { AnimatedText } from "../components/AnimatedText";

export const Scene2_HowItWorks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgImage = staticFile("brand-bg.png");
  const logo = staticFile("safedep-logo.svg");
  const titleSpring = spring({ frame: frame - 10, fps });
  const diagramSpring = spring({ frame: frame - 60, fps });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
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
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: titleSpring,
        }}
      >
        <h2
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            margin: 0,
          }}
        >
          How SafeDep MCP Works
        </h2>
      </div>

      {/* Flow Diagram */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: `translateX(-50%) scale(${diagramSpring})`,
          opacity: diagramSpring,
          width: "80%",
        }}
      >
        <FlowDiagram currentFrame={frame} />
      </div>

      {/* Steps explanation */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
        }}
      >
        <AnimatedText
          text="Real-time threat intelligence • Zero friction • Autonomous protection"
          startFrame={180}
          style={{
            fontSize: "32px",
            color: "white",
            textAlign: "center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

import { interpolate, spring, useVideoConfig, useCurrentFrame } from "remotion";
import { CSSProperties, ReactNode } from "react";

interface FlowDiagramProps {
  currentFrame: number;
}

interface BoxProps {
  children: ReactNode;
  opacity: number;
  color: string;
  glow?: boolean;
}

interface ArrowProps {
  opacity: number;
}

const Box: React.FC<BoxProps> = ({ children, opacity, color, glow = false }) => (
  <div style={{
    backgroundColor: "#161B22",
    border: `3px solid ${color}`,
    borderRadius: "16px",
    padding: "32px 48px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#FFFFFF",
    opacity,
    minWidth: "320px",
    textAlign: "center",
    boxShadow: glow 
      ? `0 0 40px ${color}40, 0 20px 60px rgba(0,0,0,0.3)`
      : "0 20px 60px rgba(0,0,0,0.3)",
    fontFamily: "Mona Sans, sans-serif",
    letterSpacing: "-0.5px",
  }}>
    {children}
  </div>
);

const Arrow: React.FC<ArrowProps> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const arrowPulse = spring({
    frame: frame % 60,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 100 },
  });

  return (
    <div style={{
      fontSize: "56px",
      color: "#0D9488",
      opacity,
      margin: "0 24px",
      transform: `scale(${arrowPulse})`,
      filter: `drop-shadow(0 0 10px rgba(13, 148, 136, 0.4))`,
    }}>
      →
    </div>
  );
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ currentFrame }) => {
  const step1Opacity = interpolate(currentFrame, [30, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const step2Opacity = interpolate(currentFrame, [90, 120], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const step3Opacity = interpolate(currentFrame, [150, 180], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0",
    }}>
      <Box opacity={step1Opacity} color="#58A6FF">
        🤖<br/>
        AI Agent
      </Box>
      
      <Arrow opacity={step2Opacity} />
      
      <Box opacity={step2Opacity} color="#0D9488" glow={true}>
        🛡️<br/>
        SafeDep MCP<br/>
        <span style={{ fontSize: "18px", color: "#9CA3AF", fontWeight: "500" }}>
          Real-time threat intel
        </span>
      </Box>
      
      <Arrow opacity={step3Opacity} />
      
      <Box opacity={step3Opacity} color="#3FB950">
        ✓ Allow<br/>
        <span style={{ fontSize: "20px", color: "#9CA3AF" }}>or</span><br/>
        ✗ Block
      </Box>
    </div>
  );
};
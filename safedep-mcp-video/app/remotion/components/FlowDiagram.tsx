import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface FlowDiagramProps {
  currentFrame: number;
}

const cardStyle = {
  backgroundColor: "rgba(7, 16, 28, 0.94)",
  borderRadius: 24,
  padding: "28px 24px",
  border: "1px solid rgba(148, 163, 184, 0.16)",
  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.32)",
  minWidth: 250,
};

interface DiagramCardProps {
  title: string;
  subtitle: string;
  accent: string;
  opacity: number;
}

const DiagramCard: React.FC<DiagramCardProps> = ({
  title,
  subtitle,
  accent,
  opacity,
}) => {
  return (
    <div
      style={{
        ...cardStyle,
        opacity,
        transform: `translateY(${(1 - opacity) * 24}px)`,
      }}
    >
      <div
        style={{
          width: 48,
          height: 6,
          borderRadius: 999,
          backgroundColor: accent,
          marginBottom: 18,
          boxShadow: `0 0 18px ${accent}`,
        }}
      />
      <div
        style={{
          fontSize: 30,
          fontWeight: 750,
          color: "#F8FAFC",
          fontFamily: "Mona Sans, sans-serif",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 18,
          lineHeight: 1.5,
          color: "#94A3B8",
          fontFamily: "Mona Sans, sans-serif",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const Connector: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({
    frame: frame % 45,
    fps,
    from: 0.9,
    to: 1,
    config: { damping: 100 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        transform: `scale(${pulse})`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 2,
          backgroundColor: "rgba(56, 189, 248, 0.5)",
        }}
      />
      <div
        style={{
          fontSize: 24,
          color: "#38BDF8",
          fontWeight: 700,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {">"}
      </div>
      <div
        style={{
          width: 40,
          height: 2,
          backgroundColor: "rgba(56, 189, 248, 0.5)",
        }}
      />
    </div>
  );
};

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ currentFrame }) => {
  const card1 = interpolate(currentFrame, [20, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card2 = interpolate(currentFrame, [58, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const card3 = interpolate(currentFrame, [98, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <DiagramCard
        title="AI Coding Agent"
        subtitle=""
        accent="#38BDF8"
        opacity={card1}
      />
      <Connector opacity={card2} />
      <DiagramCard
        title="SafeDep MCP"
        subtitle=""
        accent="#00C2A8"
        opacity={card2}
      />
      <Connector opacity={card3} />
      <DiagramCard
        title="Decision"
        subtitle=""
        accent="#F97316"
        opacity={card3}
      />
    </div>
  );
};

import { interpolate, useCurrentFrame } from "remotion";
import { CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  style?: CSSProperties;
  durationInFrames?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  startFrame, 
  style,
  durationInFrames = 20,
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [30, 0],
    { extrapolateRight: "clamp" }
  );

  return (
    <div style={{
      ...style,
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      {text}
    </div>
  );
};

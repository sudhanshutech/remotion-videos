import { interpolate, useCurrentFrame } from "remotion";
import { CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  style?: CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  startFrame, 
  style 
}) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 20],
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
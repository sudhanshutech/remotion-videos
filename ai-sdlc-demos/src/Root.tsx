import React from "react";
import { Composition } from "remotion";
import { AINativeSDLCPhases } from "./compositions/AINativeSDLCPhases";
import { AIAgentThreats } from "./compositions/AIAgentThreats";
import { ReactRefreshCompromiseDemo } from "./compositions/ReactRefreshCompromiseDemo";
import {
  AI_AGENT_THREATS_DURATION,
  AI_SDLC_PHASES_DURATION,
  AI_SDLC_PHASES_FPS,
  AI_SDLC_PHASES_HEIGHT,
  AI_SDLC_PHASES_WIDTH,
  REACT_REFRESH_COMPROMISE_DURATION,
} from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AINativeSDLCPhases"
        component={AINativeSDLCPhases}
        durationInFrames={AI_SDLC_PHASES_DURATION}
        fps={AI_SDLC_PHASES_FPS}
        width={AI_SDLC_PHASES_WIDTH}
        height={AI_SDLC_PHASES_HEIGHT}
      />
      <Composition
        id="AIAgentThreats"
        component={AIAgentThreats}
        durationInFrames={AI_AGENT_THREATS_DURATION}
        fps={AI_SDLC_PHASES_FPS}
        width={AI_SDLC_PHASES_WIDTH}
        height={AI_SDLC_PHASES_HEIGHT}
      />
      <Composition
        id="ReactRefreshCompromiseDemo"
        component={ReactRefreshCompromiseDemo}
        durationInFrames={REACT_REFRESH_COMPROMISE_DURATION}
        fps={AI_SDLC_PHASES_FPS}
        width={AI_SDLC_PHASES_WIDTH}
        height={AI_SDLC_PHASES_HEIGHT}
      />
    </>
  );
};

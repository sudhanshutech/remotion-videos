import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Scene1_Problem } from "./compositions/Scene1_Problem";
import { Scene2_HowItWorks } from "./compositions/Scene2_HowItWorks";
import { Scene3_Demo } from "./compositions/Scene3_Demo";
import { Scene4_CTA } from "./compositions/Scene4_CTA";
import { fade } from "@remotion/transitions/fade";
import {
  SCENE_1_FRAMES,
  SCENE_2_FRAMES,
  SCENE_3_FRAMES,
  SCENE_4_FRAMES,
  TRANSITION_FRAMES,
} from "./utils/constants";

export const SafeDepMCPVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_1_FRAMES}>
          <Scene1_Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_2_FRAMES}>
          <Scene2_HowItWorks />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_3_FRAMES}>
          <Scene3_Demo />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_4_FRAMES}>
          <Scene4_CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

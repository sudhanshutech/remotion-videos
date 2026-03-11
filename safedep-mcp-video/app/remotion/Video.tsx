import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { Scene1_Problem } from "./compositions/Scene1_Problem";
import { Scene2_HowItWorks } from "./compositions/Scene2_HowItWorks";
import { Scene3_Demo } from "./compositions/Scene3_Demo";
import { Scene4_CTA } from "./compositions/Scene4_CTA";
import { fade } from "@remotion/transitions/fade";

const SCENE_1_FRAMES = 270;
const SCENE_2_FRAMES = 270;
const SCENE_3_FRAMES = 330;
const SCENE_4_FRAMES = 210;
const TRANSITION_FRAMES = 30;

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

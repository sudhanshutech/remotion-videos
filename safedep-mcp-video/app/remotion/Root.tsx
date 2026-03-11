import React from "react";
import { Composition } from "remotion";
import { SafeDepMCPVideo } from "./Video";

const SCENE_1_FRAMES = 270;
const SCENE_2_FRAMES = 270;
const SCENE_3_FRAMES = 330;
const SCENE_4_FRAMES = 210;
const TRANSITION_FRAMES = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SafeDepMCPVideo"
        component={SafeDepMCPVideo}
        durationInFrames={
          SCENE_1_FRAMES +
          SCENE_2_FRAMES +
          SCENE_3_FRAMES +
          SCENE_4_FRAMES -
          TRANSITION_FRAMES * 3
        }
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

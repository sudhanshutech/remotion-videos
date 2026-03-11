import React from "react";
import { Composition } from "remotion";
import { SafeDepMCPVideo } from "./Video";
import {
  SCENE_1_FRAMES,
  SCENE_2_FRAMES,
  SCENE_3_FRAMES,
  SCENE_4_FRAMES,
  TRANSITION_FRAMES,
} from "./utils/constants";

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

# Beginner Guide: Building Videos with Remotion in Next.js App Router

This guide explains how to use this project as a reusable video workspace.

It is written for beginners.

You do not need prior knowledge of Remotion, video editing, or this codebase.

The goal is simple:

- understand how this project is organized
- quickly start creating new videos
- know where to change scenes, timing, and visuals
- learn a simple method to plan scene ideas before coding

## 1. What this project is

This project combines:

- `Next.js` with App Router
- `Remotion` for creating videos with React
- `TypeScript`

You can use this setup to create many kinds of videos, for example:

- product demos
- explainer videos
- launch videos
- tutorials
- social media clips
- testimonials
- internal training videos

The website code lives in `app/`.

The video code lives in `app/remotion/`.

That separation is useful because:

- the app can still work like a normal Next.js project
- the video work stays organized in one place

## 2. Install the project

From the project root, run:

```bash
npm install
```

After installation, you are ready to start working.

## 3. Main commands

Run the Remotion editor:

```bash
npm run remotion:studio
```

Preview the video:

```bash
npm run remotion:preview
```

Render the final video:

```bash
npm run remotion:render
```

Run the Next.js app:

```bash
npm run dev
```

If you are only working on the video, `npm run remotion:studio` is the most important command.

## 4. Project structure

This is the key structure:

```text
app/
  remotion/
    index.ts
    Root.tsx  // defines the whole video composition
    Video.tsx  // controls the timeline and scene order
    utils/
      constants.ts
    components/
      AnimatedText.tsx
      CodeBlock.tsx
      FlowDiagram.tsx
      Terminal.tsx
    compositions/
      Scene1_Problem.tsx
      Scene2_HowItWorks.tsx
      Scene3_Demo.tsx
      Scene4_CTA.tsx
public/
  ...
```

Even if future video topics change, the structure can stay the same.

You can create new scene files, rename them, or replace them with your own video structure.

## 5. What each Remotion file does

## `app/remotion/index.ts`

This is the Remotion entrypoint.

It registers the root of the video app.

Think of it as:

"Start Remotion from here."

## `app/remotion/Root.tsx`

This file defines the main composition.

A composition is the full video.

This file sets:

- composition id
- total duration
- FPS
- width
- height

Typical example:

- `1920x1080` for landscape video
- `30 fps` for standard motion

If the full video length changes, this file usually needs an update.

## `app/remotion/Video.tsx`

This is the main timeline.

It decides:

- which scenes appear
- in what order
- for how long
- what transitions are used between them

If you want to change the structure of the video, this is one of the first files to edit.

## `app/remotion/compositions/`

Each file in this folder is a scene.

Think of a scene as one segment of the video.

A scene might be:

- a title section
- a problem statement
- a feature explanation
- a demo
- a testimonial
- a call to action

These files are where most creative work happens.

## `app/remotion/components/`

This folder contains reusable UI building blocks.

Examples:

- animated headlines
- code blocks
- terminal windows
- diagrams
- badges
- cards

Use components when multiple scenes share the same visual pattern.

This saves time and keeps the video style consistent.

## `app/remotion/utils/constants.ts`

This file stores shared values.

Examples:

- scene durations
- transition duration
- repeated text
- theme values
- labels used in multiple places

A good rule:

if the same value appears in multiple places, move it to `constants.ts`.

## 6. How the timeline works

This project uses `TransitionSeries`.

That means:

- one scene plays
- then a transition happens
- then the next scene plays

Basic pattern:

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene1 />
  </TransitionSeries.Sequence>

  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: 20})}
  />

  <TransitionSeries.Sequence durationInFrames={150}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

Important idea:

- `Sequence` = the scene itself
- `Transition` = the change between scenes

## 7. Understanding frames and duration

Remotion uses frames instead of seconds.

If your video is `30 fps`, then:

- `30 frames = 1 second`
- `60 frames = 2 seconds`
- `90 frames = 3 seconds`
- `150 frames = 5 seconds`

So when you see:

```ts
durationInFrames={150}
```

that means the scene lasts 5 seconds at 30 fps.

## 8. Where to change scene duration

In this project, scene durations are kept in:

- `app/remotion/utils/constants.ts`

Example:

```ts
export const SCENE_1_FRAMES = 180;
```

If a scene feels too fast:

- increase the frame count

If a scene feels too slow:

- reduce the frame count

## 9. How to add a new scene

## Step 1. Create a file inside `compositions`

Example:

`app/remotion/compositions/Scene5_Testimonial.tsx`

## Step 2. Export a React component

Example:

```tsx
import {AbsoluteFill} from "remotion";

export const Scene5_Testimonial: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        color: "white",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Testimonial scene
    </AbsoluteFill>
  );
};
```

## Step 3. Add duration in `constants.ts`

Example:

```ts
export const SCENE_5_FRAMES = 180;
```

## Step 4. Add the scene to `Video.tsx`

Import the new scene and place it in the timeline.

## Step 5. Update total duration in `Root.tsx`

If you add or remove scenes, update the composition duration.

## 10. How to change visuals

Here is the simplest way to work:

## Change text

Edit the scene file directly.

## Change reusable UI

Edit files inside:

- `app/remotion/components/`

## Change timing

Edit:

- `app/remotion/utils/constants.ts`

## Change assets

Add new images, icons, or audio files to:

- `public/`

Then load them in Remotion using `staticFile()`.

Example:

```tsx
const image = staticFile("background.png");
```

## 11. How to plan scene ideas before coding

This part is very important.

Do not start with code.

Start by planning the story of the video.

The easiest beginner method is to plan scene by scene.

Use this simple template.

## Scene planning template

1. Purpose
   What should the viewer understand after this scene?

2. Visual
   What will appear on screen?

3. Key message
   What is the one main sentence of the scene?

4. Motion
   What changes over time?

5. Duration
   How long should the scene stay on screen?

6. Transition
   How should it move into the next scene?

## Example planning ideas

### Example: Product demo video

1. Scene 1 purpose
   Introduce the product problem.

2. Scene 2 purpose
   Show how the product works.

3. Scene 3 purpose
   Show proof or demo.

4. Scene 4 purpose
   End with CTA.

### Example: Tutorial video

1. Scene 1 purpose
   Introduce the goal.

2. Scene 2 purpose
   Show setup steps.

3. Scene 3 purpose
   Show the main workflow.

4. Scene 4 purpose
   Summarize and next steps.

### Example: Social media video

1. Scene 1 purpose
   Grab attention quickly.

2. Scene 2 purpose
   Explain one strong benefit.

3. Scene 3 purpose
   Show the result.

4. Scene 4 purpose
   End with a clear CTA.

## 12. A good planning workflow for beginners

Follow this order:

1. Define the audience
2. Decide the goal of the video
3. Write the video in 4 to 8 scenes
4. Give each scene one job only
5. Estimate time for each scene
6. Build simple rough scenes first
7. Preview in Studio
8. Fix pacing
9. Improve design and motion
10. Add voiceover or music
11. Render final output

This approach is much better than jumping directly into animation.

## 13. How to know if a scene idea is strong

A scene is usually strong when:

- it communicates one clear idea
- the viewer knows where to look
- the visual supports the message
- the duration feels justified
- it naturally leads into the next scene

A scene is usually weak when:

- too many ideas are packed together
- too much text appears at once
- nothing important changes during the animation
- it repeats the previous scene
- it looks decorative but does not move the story forward

## 14. Types of scenes you can create

You can mix different scene styles in one video.

Common scene types:

- headline scene
- problem scene
- comparison scene
- step-by-step explainer
- product demo scene
- code or terminal scene
- feature highlight
- chart or stat scene
- testimonial scene
- quote scene
- CTA scene

This project structure works for all of them.

## 15. Beginner tips

- Keep one scene focused on one message.
- Use large readable text.
- Make movement support the message.
- Reuse components whenever possible.
- Keep timing values centralized.
- Preview often while building.
- Start simple, then polish.

## 16. Common mistakes

- starting animation before planning the story
- making scenes too long
- using too much text
- using too many transitions
- repeating styles without reusable components
- hardcoding values in many files
- trying to perfect visuals before pacing is solved

## 17. A practical way to start a brand new video

If your team wants to create a new video from this codebase, use this quick process:

1. Duplicate or replace the scene files in `app/remotion/compositions/`
2. Rename scenes to match your story
3. Update the scene order in `Video.tsx`
4. Update durations in `constants.ts`
5. Update total composition length in `Root.tsx`
6. Replace visuals, copy, and assets
7. Preview and refine

## 18. Suggested naming pattern for future videos

Use scene names that describe purpose, not topic.

Examples:

- `Scene1_Hook.tsx`
- `Scene2_Problem.tsx`
- `Scene3_Solution.tsx`
- `Scene4_Demo.tsx`
- `Scene5_Proof.tsx`
- `Scene6_CTA.tsx`

This makes the structure reusable across many projects.

## 19. Quick summary

If you remember only these things, you can still work effectively:

1. `index.ts` starts Remotion
2. `Root.tsx` defines the whole composition
3. `Video.tsx` controls the timeline
4. `compositions/` contains scenes
5. `components/` contains reusable building blocks
6. `constants.ts` is the best place for shared timing values
7. plan scenes before coding

That is enough to begin building new videos confidently in this workspace.

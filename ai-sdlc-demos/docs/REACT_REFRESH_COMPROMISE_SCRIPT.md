# React Refresh Compromise Demo Script

Composition: `ReactRefreshCompromiseDemo`  
FPS: `30`  
Duration: `18s` (`540` frames)

## Narration

`0.0s - 2.4s`
This attack starts with a fake npm package named react-refresh-update.

`2.4s - 4.9s`
It looks close enough to a trusted React package that a developer or agent can install it without noticing.

`4.9s - 7.6s`
During install, the package executes on the developer machine and reaches out to remote attacker infrastructure.

`7.6s - 10.7s`
That server can then choose platform-specific payloads for Windows, Linux, or macOS.

`10.7s - 14.3s`
At that point, the compromise moves beyond one package into workstation access, tokens, and developer credentials.

`14.3s - 18.0s`
This is why package trust has to be verified before install, not after execution.

## Recording Notes

- Keep the delivery steady and neutral, around `125 to 140 WPM`.
- Leave a short pause between segments instead of rushing transitions.
- If you generate TTS, target `18s` total runtime so it stays aligned with the current animation timing.

## Audio Hook

- Place the final narration file at `ai-sdlc-demos/public/react-refresh-narration.mp3`.
- In [ReactRefreshCompromiseDemo.tsx](d:/Open-source/remotion-videos/ai-sdlc-demos/src/compositions/ReactRefreshCompromiseDemo.tsx#L1), set `ENABLE_NARRATION_AUDIO` to `true`.
- The composition already includes synced subtitle timing, so the audio should line up if the final MP3 stays near `18s`.

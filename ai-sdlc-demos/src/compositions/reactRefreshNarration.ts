// Narration segments synced to scene boundaries in ReactRefreshCompromiseDemo.tsx
// All frame values are at 30fps. Total duration: 1710 frames (57 seconds).
//
// Scene map:
//   0    - 120  : Intro
//   120  - 420  : ACT1 - Fake package comparison
//   420  - 660  : ACT2 - Developer machine / import execution
//   660  - 930  : ACT3 - C2 beaconing / attribution
//   930  - 1260 : ACT4 - Platform-specific payload drop
//   1260 - 1440 : ACT5 - Credential exfiltration outcome
//   1440 - 1710 : Outro

export const REACT_REFRESH_NARRATION = [
  {
    start: 140,
    end: 390,
    text: "A fake npm package named react-refresh-update, nearly identical to a trusted React package with 42 million weekly downloads.",
  },
  {
    start: 460,
    end: 640,
    text: "It executes silently on the developer's machine the moment it is imported. No install hooks. No visible warnings. Standard scanners miss it entirely.",
  },
  {
    start: 710,
    end: 900,
    text: "The payload reaches out to a remote C2 server, infrastructure independently tracked as Lazarus Group, and requests a second-stage binary.",
  },
  {
    start: 980,
    end: 1230,
    text: "That server delivers a platform-specific trojan: a self-extracting P E binary on Windows, and a shell script dropped to slash var slash tmp on Linux and macOS.",
  },
  {
    start: 1310,
    end: 1425,
    text: "At that point, tokens, S S H keys, cloud credentials, and full workstation access are in the attacker's hands.",
  },
] as const;

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { REACT_REFRESH_NARRATION } from "./reactRefreshNarration";

// ─────────────────────────────────────────────
// TIMING CONFIG  (all values are raw frames @ 30fps)
// Total duration: 1290 frames = 43 seconds
// ─────────────────────────────────────────────
const TOTAL_FRAMES = 1710;
const FPS = 30;
const NARRATION_AUDIO_FILES = [
  "react-refresh-audios/1.mp3",
  "react-refresh-audios/2.mp3",
  "react-refresh-audios/3.mp3",
  "react-refresh-audios/4.mp3",
  "react-refresh-audios/5.mp3",
] as const;
const OUTRO_AUDIO_FILE = "react-refresh-audios/6.mp3";

// Scene boundaries (frames)
const SCENE = {
  INTRO_START: 0,
  INTRO_END: 120,       // 0–4s  : SafeDep logo + title card
  ACT1_START: 120,
  ACT1_END: 420,        // 4–14s : Fake package reveal
  ACT2_START: 420,
  ACT2_END: 660,        // 14–22s: Developer machine + import execution
  ACT3_START: 660,
  ACT3_END: 930,        // 22–31s: C2 beacon + network reach-out
  ACT4_START: 930,
  ACT4_END: 1260,       // 31–42s: Platform payload drop (Win/Lin/Mac)
  ACT5_START: 1260,
  ACT5_END: 1440,       // 42–48s: Credential exfil outcome
  OUTRO_START: 1440,
  OUTRO_END: 1710,      // 48–57s: SafeDep outro / CTA
};
const ENABLE_NARRATION_AUDIO = true;
const AUDIO_SEQUENCE_STARTS = [140, 460, 710, 980, 1310] as const;
const OUTRO_AUDIO_START = 1485;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const ease = (
  frame: number,
  start: number,
  end: number,
  from = 0,
  to = 1,
  easingFn = Easing.out(Easing.cubic)
) =>
  interpolate(frame, [start, end], [from, to], {
    easing: easingFn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const spr = (frame: number, start: number, fps: number, cfg = {}) =>
  spring({ fps, frame: Math.max(0, frame - start), config: { damping: 22, stiffness: 120, mass: 0.85, ...cfg } });

const pulse = (frame: number, speed = 12, lo = 0.9, hi = 1.1) =>
  interpolate(Math.sin(frame / speed), [-1, 1], [lo, hi], {
    easing: Easing.ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const getActiveNarration = (
  frame: number,
  narration: ReadonlyArray<{ start: number; end: number; text: string }>
) => narration.find((s) => frame >= s.start && frame < s.end) ?? null;

// ─────────────────────────────────────────────
// DESIGN TOKENS — SafeDep brand
// ─────────────────────────────────────────────
const BRAND = {
  bg0: "#03070D",
  bg1: "#061019",
  bg2: "#09131F",
  surface: "rgba(14,22,36,0.96)",
  surfaceBorder: "rgba(255,255,255,0.07)",
  cyan: "#00D2FF",
  cyanDim: "rgba(0,210,255,0.18)",
  cyanBorder: "rgba(0,210,255,0.28)",
  blue: "#60A5FA",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.16)",
  redBorder: "rgba(248,113,113,0.28)",
  amber: "#FBBF24",
  green: "#34D399",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  font: "'Mona Sans', 'DM Sans', system-ui, sans-serif",
};

// ─────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────

const GridOverlay: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
    backgroundSize: "80px 80px",
    pointerEvents: "none",
  }} />
);

const NoiseBg: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0,
    background: `radial-gradient(ellipse at 15% 15%, rgba(0,210,255,0.10) 0%, transparent 38%),
                 radial-gradient(ellipse at 85% 20%, rgba(96,165,250,0.09) 0%, transparent 32%),
                 radial-gradient(ellipse at 50% 80%, rgba(248,113,113,0.07) 0%, transparent 36%),
                 linear-gradient(160deg, ${BRAND.bg1} 0%, ${BRAND.bg2} 50%, ${BRAND.bg0} 100%)`,
    pointerEvents: "none",
  }} />
);

const Subtitle: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => (
  <div style={{
    position: "absolute",
    bottom: 56,
    left: "50%",
    transform: `translateX(-50%) translateY(${(1 - opacity) * 12}px)`,
    width: 920,
    maxWidth: "calc(100% - 160px)",
    padding: "18px 28px",
    borderRadius: 20,
    background: "linear-gradient(145deg, rgba(4,10,18,0.94), rgba(8,14,24,0.78))",
    border: `1px solid ${BRAND.surfaceBorder}`,
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 48px rgba(0,0,0,0.32)",
    color: BRAND.text,
    fontSize: 22,
    lineHeight: 1.4,
    fontWeight: 500,
    letterSpacing: "-0.015em",
    textAlign: "center",
    opacity,
    zIndex: 10,
    fontFamily: BRAND.font,
  }}>
    {text}
  </div>
);

const Tag: React.FC<{ label: string; color?: string; bg?: string; border?: string }> = ({
  label, color = BRAND.cyan, bg = BRAND.cyanDim, border = BRAND.cyanBorder
}) => (
  <div style={{
    display: "inline-flex", alignItems: "center",
    padding: "7px 14px", borderRadius: 999,
    backgroundColor: bg, border: `1px solid ${border}`,
    color, fontSize: 13, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    fontFamily: BRAND.font,
  }}>
    {label}
  </div>
);

const GlowDot: React.FC<{ color: string; scale?: number; opacity?: number }> = ({
  color, scale = 1, opacity = 1
}) => (
  <div style={{
    width: 14, height: 14, borderRadius: 999,
    backgroundColor: color,
    boxShadow: `0 0 18px 4px ${color}66`,
    transform: `scale(${scale})`,
    opacity,
  }} />
);

// Flow line (horizontal)
const FlowLine: React.FC<{
  x: number; y: number; width: number; progress: number;
  from?: string; to?: string; vertical?: boolean;
}> = ({ x, y, width, progress, from = BRAND.cyan, to = "transparent", vertical = false }) => (
  <div style={{
    position: "absolute",
    left: x, top: y,
    width: vertical ? 3 : Math.max(0, width * progress),
    height: vertical ? Math.max(0, width * progress) : 3,
    background: vertical
      ? `linear-gradient(180deg, transparent, ${from}, ${to})`
      : `linear-gradient(90deg, transparent, ${from}, ${to})`,
    opacity: progress,
    borderRadius: 2,
  }} />
);

// Animated particle dots on a line
const FlowParticles: React.FC<{ frame: number; x: number; y: number; length: number; color: string; active: boolean }> = ({
  frame, x, y, length, color, active
}) => {
  if (!active) return null;
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = ((frame * 2.2 + i * 60) % 100) / 100;
        return (
          <div key={i} style={{
            position: "absolute",
            left: x + t * length - 4,
            top: y - 4,
            width: 8, height: 8, borderRadius: 999,
            backgroundColor: color,
            boxShadow: `0 0 10px 2px ${color}`,
            opacity: Math.sin(t * Math.PI) * 0.9,
          }} />
        );
      })}
    </>
  );
};

// ─────────────────────────────────────────────
// SCENE 1 — INTRO (frames 0–150)
// ─────────────────────────────────────────────
const IntroScene: React.FC<{ frame: number }> = ({ frame }) => {
  const safeDepLogo = staticFile("safedep-logo.png");

  const logoReveal = spr(frame, 10, FPS);
  const taglineReveal = spr(frame, 30, FPS);
  const titleReveal = spr(frame, 50, FPS);
  const subtitleReveal = spr(frame, 72, FPS);
  const exitFade = ease(frame, 130, 150, 1, 0);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 0,
      opacity: exitFade,
    }}>
      {/* Logo */}
      <div style={{
        opacity: logoReveal,
        transform: `scale(${0.85 + logoReveal * 0.15})`,
        marginBottom: 40,
      }}>
        <img src={safeDepLogo} style={{ height: 52, objectFit: "contain" }} />
      </div>

      {/* Tag */}
      <div style={{
        opacity: taglineReveal,
        transform: `translateY(${(1 - taglineReveal) * 20}px)`,
        marginBottom: 28,
      }}>
        <Tag label="Threat Analysis" color={BRAND.red} bg={BRAND.redDim} border={BRAND.redBorder} />
      </div>

      {/* Title */}
      <div style={{
        opacity: titleReveal,
        transform: `translateY(${(1 - titleReveal) * 24}px)`,
        textAlign: "center", maxWidth: 960,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 820,
          letterSpacing: "-0.06em", lineHeight: 1.0,
          color: BRAND.text, fontFamily: BRAND.font,
        }}>
          One fake package.
          <br />
          <span style={{ color: BRAND.cyan }}>Full machine compromise.</span>
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        opacity: subtitleReveal,
        transform: `translateY(${(1 - subtitleReveal) * 18}px)`,
        marginTop: 28, textAlign: "center",
      }}>
        <div style={{
          fontSize: 22, color: BRAND.textMuted,
          fontWeight: 400, letterSpacing: "-0.01em",
          fontFamily: BRAND.font,
        }}>
          How <code style={{ color: BRAND.cyan, fontWeight: 700, fontSize: 20 }}>react-refresh-update</code> drops a cross-platform trojan on developer machines
        </div>
      </div>

      {/* Decorative line */}
      <div style={{
        marginTop: 56, width: ease(frame, 80, 140, 0, 380) * subtitleReveal,
        height: 1, background: `linear-gradient(90deg, transparent, ${BRAND.cyan}60, transparent)`,
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 2 — FAKE PACKAGE (frames 150–330)
// ─────────────────────────────────────────────
const PackageScene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.ACT1_START;

  const cardReveal = spr(f, 8, FPS);
  const realReveal = spr(f, 40, FPS);
  const fakeReveal = spr(f, 60, FPS);
  const diffReveal = spr(f, 90, FPS);
  const versionWarn = spr(f, 100, FPS);

  const compareRow = (label: string, real: string, fake: string, warn = false, delay = 0) => {
    const r = spr(f, 100 + delay, FPS);
    return (
      <div key={label} style={{
        display: "grid", gridTemplateColumns: "180px 1fr 1fr",
        gap: 0, padding: "14px 0",
        borderBottom: `1px solid ${BRAND.surfaceBorder}`,
        opacity: r, transform: `translateX(${(1 - r) * -20}px)`,
        fontFamily: BRAND.font,
      }}>
        <div style={{ color: BRAND.textDim, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", paddingTop: 2 }}>{label}</div>
        <div style={{ color: BRAND.green, fontSize: 17, fontWeight: 600, fontFamily: "monospace" }}>{real}</div>
        <div style={{ color: warn ? BRAND.red : BRAND.textMuted, fontSize: 17, fontWeight: warn ? 700 : 500, fontFamily: "monospace" }}>
          {fake}
          {warn && <span style={{ marginLeft: 10, fontSize: 12, color: BRAND.red, fontWeight: 700, letterSpacing: "0.08em" }}>⚠ SUSPICIOUS</span>}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      padding: "60px 80px", display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        opacity: cardReveal,
        transform: `translateY(${(1 - cardReveal) * 20}px)`,
        marginBottom: 40,
      }}>
        <Tag label="Step 1 — The Fake Package" />
        <div style={{
          marginTop: 20, fontSize: 52, fontWeight: 800,
          letterSpacing: "-0.05em", color: BRAND.text,
          fontFamily: BRAND.font, lineHeight: 1.1,
        }}>
          Impersonating <span style={{ color: BRAND.cyan }}>react-refresh</span>
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 18, marginTop: 10, fontFamily: BRAND.font }}>
          42 million weekly downloads. Used in virtually every React build toolchain.
        </div>
      </div>

      {/* Comparison table */}
      <div style={{
        flex: 1,
        background: BRAND.surface,
        border: `1px solid ${BRAND.surfaceBorder}`,
        borderRadius: 24, padding: "28px 32px",
        boxShadow: "0 28px 64px rgba(0,0,0,0.26)",
        opacity: realReveal,
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "180px 1fr 1fr",
          gap: 0, paddingBottom: 16, marginBottom: 4,
          borderBottom: `1px solid ${BRAND.surfaceBorder}`,
          opacity: realReveal,
          fontFamily: BRAND.font,
        }}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: BRAND.green }} />
            <span style={{ color: BRAND.green, fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>react-refresh (real)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: fakeReveal }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: BRAND.red }} />
            <span style={{ color: BRAND.red, fontSize: 20, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>react-refresh-update (fake)</span>
          </div>
        </div>

        {[
          { label: "Publisher",   real: "facebook/react", fake: "jaime9008",    warn: true,  delay: 0  },
          { label: "Version",     real: "0.18.0",         fake: "2.0.5",        warn: true,  delay: 8  },
          { label: "Weekly DLs",  real: "42,152,852",     fake: "38",           warn: false, delay: 16 },
          { label: "File count",  real: "9 files",        fake: "9 files",      warn: false, delay: 24 },
          { label: "Modified",    real: "—",              fake: "runtime.js ⚑", warn: true,  delay: 32 },
          { label: "C2 contact",  real: "none",           fake: "malicanbur.pro", warn: true, delay: 40 },
        ].map((row) => compareRow(row.label, row.real, row.fake, row.warn, row.delay))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 3 — DEVELOPER MACHINE (frames 330–570)
// ─────────────────────────────────────────────
const MachineScene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.ACT2_START;

  const headerReveal = spr(f, 8, FPS);
  const terminalReveal = spr(f, 30, FPS);
  const line1 = ease(f, 50, 70, 0, 1);
  const line2 = ease(f, 80, 100, 0, 1);
  const line3 = ease(f, 105, 125, 0, 1);
  const line4 = ease(f, 130, 150, 0, 1);
  const alertReveal = spr(f, 150, FPS);

  const termLine = (text: string, color: string, opacity: number, prefix = "$") => (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      opacity, fontFamily: "monospace",
    }}>
      <span style={{ color: BRAND.cyanDim.replace("0.18", "0.6"), fontSize: 16, flexShrink: 0, paddingTop: 1 }}>{prefix}</span>
      <span style={{ color, fontSize: 17, lineHeight: 1.6 }}>{text}</span>
    </div>
  );

  return (
    <div style={{ width: "100%", height: "100%", padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ opacity: headerReveal, transform: `translateY(${(1 - headerReveal) * 20}px)`, marginBottom: 36 }}>
        <Tag label="Step 2 — Install Execution" />
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em", color: BRAND.text, fontFamily: BRAND.font, lineHeight: 1.1 }}>
          Runs on <span style={{ color: BRAND.amber }}>require()</span>, not install
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 18, marginTop: 10, fontFamily: BRAND.font }}>
          No postinstall hooks. No visible triggers. Standard scanners miss it entirely.
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {/* Terminal */}
        <div style={{
          flex: 1, background: "rgba(6,10,16,0.97)",
          border: `1px solid ${BRAND.surfaceBorder}`,
          borderRadius: 20, padding: "24px 28px",
          opacity: terminalReveal,
          boxShadow: "0 24px 56px rgba(0,0,0,0.36)",
        }}>
          {/* Terminal header bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[BRAND.red, BRAND.amber, BRAND.green].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: c, opacity: 0.8 }} />
            ))}
            <span style={{ color: BRAND.textDim, fontSize: 13, marginLeft: 10, fontFamily: "monospace" }}>developer@macbook ~/project</span>
          </div>
          {termLine("npm install react-refresh-update", BRAND.cyan, line1)}
          {termLine("added 1 package in 0.8s", BRAND.textMuted, line2, " ")}
          {termLine("node -e \"require('react-refresh-update')\"", BRAND.cyan, line3)}
          {termLine(
            "// payload executes silently on require()...",
            BRAND.red, line4, " "
          )}
        </div>

        {/* Alert card */}
        <div style={{
          width: 340,
          background: BRAND.surface,
          border: `1px solid ${BRAND.redBorder}`,
          borderRadius: 20, padding: "24px",
          opacity: alertReveal,
          transform: `translateX(${(1 - alertReveal) * 24}px)`,
          boxShadow: `0 0 0 1px ${BRAND.redBorder}, 0 24px 52px rgba(0,0,0,0.28)`,
        }}>
          <div style={{ color: BRAND.red, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, fontFamily: BRAND.font }}>
            ⚑ Execution Chain
          </div>
          {[
            { icon: "📦", label: "Package installed", color: BRAND.textMuted },
            { icon: "⚡", label: "pino2.js → lib/tools.js", color: BRAND.textMuted },
            { icon: "🔍", label: "Scans .env files", color: BRAND.amber },
            { icon: "📡", label: "Reaches C2 server", color: BRAND.red },
            { icon: "💀", label: "Drops second stage", color: BRAND.red },
          ].map((item, i) => {
            const r = spr(f, 155 + i * 12, FPS);
            return (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: "10px 0", borderBottom: i < 4 ? `1px solid ${BRAND.surfaceBorder}` : "none",
                opacity: r, transform: `translateX(${(1 - r) * 16}px)`,
                fontFamily: BRAND.font,
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ color: item.color, fontSize: 16, fontWeight: 500 }}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 4 — C2 BEACON (frames 570–810)
// ─────────────────────────────────────────────
const C2Scene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.ACT3_START;

  const headerReveal = spr(f, 8, FPS);
  const mapReveal = spr(f, 30, FPS);
  const c2Reveal = spr(f, 50, FPS);
  const lineProgress = ease(f, 70, 160, 0, 1);
  const lazarusReveal = spr(f, 160, FPS);

  const c2Pulse = pulse(frame, 14, 0.88, 1.12);
  const beaconPulse = pulse(frame, 8, 0.94, 1.06);

  return (
    <div style={{ width: "100%", height: "100%", padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ opacity: headerReveal, transform: `translateY(${(1 - headerReveal) * 20}px)`, marginBottom: 40 }}>
        <Tag label="Step 3 — C2 Beaconing" color={BRAND.red} bg={BRAND.redDim} border={BRAND.redBorder} />
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em", color: BRAND.text, fontFamily: BRAND.font, lineHeight: 1.1 }}>
          Reaching <span style={{ color: BRAND.red }}>Lazarus Group</span> infrastructure
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 18, marginTop: 10, fontFamily: BRAND.font }}>
          malicanbur.pro — independently tracked as North Korea-aligned threat actor C2
        </div>
      </div>

      {/* Network diagram */}
      <div style={{ flex: 1, position: "relative", opacity: mapReveal }}>
        {/* Developer machine node */}
        <div style={{
          position: "absolute", left: 80, top: 60,
          width: 220, padding: "20px 22px",
          background: BRAND.surface, border: `1px solid ${BRAND.cyanBorder}`,
          borderRadius: 20, boxShadow: "0 20px 44px rgba(0,0,0,0.22)",
          fontFamily: BRAND.font,
        }}>
          <div style={{ color: BRAND.cyan, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Developer machine</div>
          <div style={{ fontSize: 22, fontWeight: 720, letterSpacing: "-0.04em", marginBottom: 8 }}>macbook-pro.local</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ transform: `scale(${beaconPulse})` }}>
              <GlowDot color={BRAND.amber} />
            </div>
            <span style={{ color: BRAND.amber, fontSize: 14, fontWeight: 600 }}>Payload executing</span>
          </div>
        </div>

        {/* Animated flow line */}
        <FlowLine x={302} y={136} width={280} progress={lineProgress} from={BRAND.red} to="transparent" />
        <FlowParticles frame={frame} x={302} y={130} length={280} color={BRAND.red} active={lineProgress > 0.3} />

        {/* C2 node */}
        <div style={{
          position: "absolute", right: 60, top: 40,
          width: 260, height: 260, borderRadius: 999,
          border: `1px solid ${BRAND.redBorder}`,
          background: `radial-gradient(circle, ${BRAND.redDim}, rgba(248,113,113,0.04) 55%, transparent 72%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: c2Reveal,
          transform: `scale(${0.9 + c2Reveal * 0.1})`,
        }}>
          <div style={{
            width: 160, height: 160, borderRadius: 999,
            background: "linear-gradient(145deg, rgba(28,8,12,0.97), rgba(14,6,10,0.86))",
            border: `1px solid ${BRAND.redBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
            transform: `scale(${c2Pulse})`,
            boxShadow: "0 0 56px rgba(248,113,113,0.22)",
            textAlign: "center",
          }}>
            <div style={{ color: BRAND.red, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontFamily: BRAND.font }}>C2 Server</div>
            <div style={{ fontSize: 18, fontWeight: 760, letterSpacing: "-0.04em", fontFamily: BRAND.font, lineHeight: 1.3 }}>malicanbur<br />.pro</div>
          </div>
        </div>

        {/* Lazarus Group attribution card */}
        <div style={{
          position: "absolute", left: 80, bottom: 30,
          width: 680, padding: "20px 24px",
          background: "linear-gradient(135deg, rgba(28, 8, 12, 0.94), rgba(18, 6, 10, 0.82))",
          border: `1px solid ${BRAND.redBorder}`,
          borderRadius: 20,
          opacity: lazarusReveal, transform: `translateY(${(1 - lazarusReveal) * 20}px)`,
          display: "flex", alignItems: "center", gap: 24,
          fontFamily: BRAND.font,
        }}>
          <div style={{ fontSize: 36 }}>🇰🇵</div>
          <div>
            <div style={{ color: BRAND.red, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Threat Attribution</div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>Lazarus Group · DeceptiveDevelopment campaign</div>
            <div style={{ color: BRAND.textMuted, fontSize: 15, marginTop: 4 }}>Second-stage classified as PylangGhost RAT · Targets developers and freelancers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 5 — PLATFORM PAYLOADS (frames 810–1050)
// ─────────────────────────────────────────────
const PayloadScene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.ACT4_START;

  const headerReveal = spr(f, 8, FPS);
  const winReveal = spr(f, 40, FPS);
  const linReveal = spr(f, 68, FPS);
  const macReveal = spr(f, 96, FPS);

  const platforms = [
    {
      name: "Windows",
      accent: BRAND.blue,
      icon: "🪟",
      reveal: winReveal,
      steps: [
        "Downloads cdrivWin.sh (28.71 MB)",
        "Self-extracting PE binary archive",
        "Executes start.vbs via wscript",
        "Hidden, detached process",
      ],
    },
    {
      name: "Linux",
      accent: BRAND.amber,
      icon: "🐧",
      reveal: linReveal,
      steps: [
        "Downloads shell script payload",
        "Drops to /var/tmp/macspatch.sh",
        "Executes with bash",
        "Persists across sessions",
      ],
    },
    {
      name: "macOS",
      accent: BRAND.green,
      icon: "🍎",
      reveal: macReveal,
      steps: [
        "Downloads shell script payload",
        "Drops to /var/tmp/macspatch.sh",
        "Executes with bash",
        "Persists across sessions",
      ],
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%", padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ opacity: headerReveal, transform: `translateY(${(1 - headerReveal) * 20}px)`, marginBottom: 40 }}>
        <Tag label="Step 4 — Platform Payloads" color={BRAND.amber} bg="rgba(251,191,36,0.14)" border="rgba(251,191,36,0.28)" />
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em", color: BRAND.text, fontFamily: BRAND.font, lineHeight: 1.1 }}>
          Cross-platform <span style={{ color: BRAND.amber }}>trojan dropper</span>
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 18, marginTop: 10, fontFamily: BRAND.font }}>
          The C2 delivers a different second-stage binary for each OS. No target is safe.
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {platforms.map((p) => (
          <div key={p.name} style={{
            flex: 1,
            background: BRAND.surface,
            border: `1px solid ${p.accent}28`,
            borderRadius: 24, padding: "28px 24px",
            opacity: p.reveal,
            transform: `translateY(${(1 - p.reveal) * 28}px) scale(${0.96 + p.reveal * 0.04})`,
            boxShadow: `0 24px 56px rgba(0,0,0,0.24), 0 0 0 1px ${p.accent}18`,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 760, letterSpacing: "-0.04em", marginBottom: 8, fontFamily: BRAND.font }}>{p.name}</div>
            <div style={{ width: 40, height: 3, backgroundColor: p.accent, borderRadius: 2, marginBottom: 20, opacity: 0.8 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {p.steps.map((step, i) => {
                const r = spr(f, 40 + i * 14 + (platforms.indexOf(p) * 28), FPS);
                return (
                  <div key={i} style={{
                    display: "flex", gap: 10, alignItems: "flex-start",
                    opacity: r, transform: `translateX(${(1 - r) * -12}px)`,
                    fontFamily: BRAND.font,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: p.accent, marginTop: 6, flexShrink: 0 }} />
                    <span style={{ color: BRAND.textMuted, fontSize: 20, lineHeight: 1.5 }}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 6 — EXFIL OUTCOME (frames 1050–1170)
// ─────────────────────────────────────────────
const OutcomeScene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.ACT5_START;

  const headerReveal = spr(f, 8, FPS);

  const tokens = [
    { label: "GitHub Token",     icon: "🔑", color: BRAND.red,   delay: 30 },
    { label: "AWS Credentials",  icon: "☁️",  color: BRAND.amber, delay: 44 },
    { label: "SSH Keys",         icon: "🗝️",  color: BRAND.red,   delay: 58 },
    { label: ".env Secrets",     icon: "📄", color: BRAND.amber, delay: 72 },
    { label: "Cloud Tokens",     icon: "⚡", color: BRAND.red,   delay: 86 },
    { label: "Workstation Access", icon: "💻", color: BRAND.red, delay: 100 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", padding: "60px 80px", display: "flex", flexDirection: "column" }}>
      <div style={{ opacity: headerReveal, transform: `translateY(${(1 - headerReveal) * 20}px)`, marginBottom: 48 }}>
        <Tag label="Outcome — Credential Exfiltration" color={BRAND.red} bg={BRAND.redDim} border={BRAND.redBorder} />
        <div style={{ marginTop: 20, fontSize: 52, fontWeight: 800, letterSpacing: "-0.05em", color: BRAND.text, fontFamily: BRAND.font, lineHeight: 1.1 }}>
          Everything on your machine <span style={{ color: BRAND.red }}>is now in play</span>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20,
      }}>
        {tokens.map((t) => {
          const r = spr(f, t.delay, FPS);
          return (
            <div key={t.label} style={{
              background: BRAND.surface,
              border: `1px solid ${t.color}28`,
              borderRadius: 20, padding: "24px 22px",
              display: "flex", alignItems: "center", gap: 16,
              opacity: r, transform: `scale(${0.92 + r * 0.08})`,
              boxShadow: `0 16px 36px rgba(0,0,0,0.22)`,
              fontFamily: BRAND.font,
            }}>
              <div style={{ fontSize: 32 }}>{t.icon}</div>
              <div>
                <div style={{ color: t.color, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Compromised</div>
                <div style={{ fontSize: 18, fontWeight: 680, letterSpacing: "-0.03em" }}>{t.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom message */}
      <div style={{
        marginTop: "auto", paddingTop: 32,
        opacity: spr(f, 110, FPS),
        textAlign: "center", fontFamily: BRAND.font,
      }}>
        <div style={{ color: BRAND.textMuted, fontSize: 18, lineHeight: 1.6 }}>
          One package. Zero install hooks. Standard scanners miss it entirely.
          <br />
          <span style={{ color: BRAND.cyan, fontWeight: 600 }}>Package trust must be verified before install — not after execution.</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SCENE 7 — OUTRO (frames 1170–1290)
// ─────────────────────────────────────────────
const OutroScene: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - SCENE.OUTRO_START;
  const safeDepLogo = staticFile("safedep-logo.png");

  const fadeIn = ease(f, 0, 24, 0, 1);
  const logoReveal = spr(f, 10, FPS);
  const lineReveal = spr(f, 24, FPS);
  const textReveal = spr(f, 36, FPS);
  const linkReveal = spr(f, 55, FPS);
  const exitFade = ease(f, 235, 268, 1, 0);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 0,
      opacity: fadeIn * exitFade,
    }}>
      <div style={{ opacity: logoReveal, transform: `scale(${0.85 + logoReveal * 0.15})`, marginBottom: 36 }}>
        <img src={safeDepLogo} style={{ height: 56, objectFit: "contain" }} />
      </div>

      <div style={{
        width: ease(f, 24, 80) * 320,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${BRAND.cyan}70, transparent)`,
        marginBottom: 36,
      }} />

      <div style={{
        opacity: textReveal, transform: `translateY(${(1 - textReveal) * 18}px)`,
        textAlign: "center", fontFamily: BRAND.font,
      }}>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.05em", marginBottom: 14, lineHeight: 1.1 }}>
          Protect your packages.<br />
          <span style={{ color: BRAND.cyan }}>Before they execute.</span>
        </div>
        <div style={{ color: BRAND.textMuted, fontSize: 18, marginBottom: 32 }}>
          Full malware analysis · IOCs · Detection guidance
        </div>
      </div>

      <div style={{
        opacity: linkReveal, transform: `translateY(${(1 - linkReveal) * 14}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        fontFamily: BRAND.font,
      }}>
        <div style={{
          padding: "14px 28px", borderRadius: 14,
          background: BRAND.cyanDim, border: `1px solid ${BRAND.cyanBorder}`,
          color: BRAND.cyan, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em",
        }}>
          safedep.io/malicious-npm-react-refresh-update
        </div>
        <div style={{ color: BRAND.textDim, fontSize: 14, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          safedep.io · Open Source Supply Chain Security
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ROOT COMPOSITION
// ─────────────────────────────────────────────
export const ReactRefreshCompromiseDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const activeNarration = getActiveNarration(frame, REACT_REFRESH_NARRATION);
  const subtitleOpacity = activeNarration
    ? interpolate(
        frame,
        [
          activeNarration.start,
          activeNarration.start + 12,
          activeNarration.end - 10,
          activeNarration.end,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // Scene crossfade opacity helper
  const sceneFade = (start: number, end: number) =>
    interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ background: BRAND.bg0, color: BRAND.text, fontFamily: BRAND.font, overflow: "hidden" }}>
      {/* Background layers */}
      <NoiseBg />
      <GridOverlay />

      {/* Audio */}
      {ENABLE_NARRATION_AUDIO
        ? REACT_REFRESH_NARRATION.map((segment, index) => (
            <Sequence
              key={NARRATION_AUDIO_FILES[index]}
              from={AUDIO_SEQUENCE_STARTS[index]}
              durationInFrames={durationInFrames - AUDIO_SEQUENCE_STARTS[index]}
            >
              <Audio src={staticFile(NARRATION_AUDIO_FILES[index])} volume={0.92} />
            </Sequence>
          ))
        : null}
      {ENABLE_NARRATION_AUDIO ? (
        <Sequence
          from={OUTRO_AUDIO_START}
          durationInFrames={durationInFrames - OUTRO_AUDIO_START}
        >
          <Audio src={staticFile(OUTRO_AUDIO_FILE)} volume={0.92} />
        </Sequence>
      ) : null}

      {/* INTRO */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.INTRO_START, SCENE.INTRO_END) }}>
        <IntroScene frame={frame} />
      </AbsoluteFill>

      {/* ACT 1 — Package */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.ACT1_START, SCENE.ACT1_END) }}>
        <PackageScene frame={frame} />
      </AbsoluteFill>

      {/* ACT 2 — Machine */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.ACT2_START, SCENE.ACT2_END) }}>
        <MachineScene frame={frame} />
      </AbsoluteFill>

      {/* ACT 3 — C2 */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.ACT3_START, SCENE.ACT3_END) }}>
        <C2Scene frame={frame} />
      </AbsoluteFill>

      {/* ACT 4 — Payloads */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.ACT4_START, SCENE.ACT4_END) }}>
        <PayloadScene frame={frame} />
      </AbsoluteFill>

      {/* ACT 5 — Outcome */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.ACT5_START, SCENE.ACT5_END) }}>
        <OutcomeScene frame={frame} />
      </AbsoluteFill>

      {/* OUTRO */}
      <AbsoluteFill style={{ opacity: sceneFade(SCENE.OUTRO_START, SCENE.OUTRO_END) }}>
        <OutroScene frame={frame} />
      </AbsoluteFill>

      {/* Subtitle bar — always on top */}
      {activeNarration && (
        <Subtitle text={activeNarration.text} opacity={subtitleOpacity} />
      )}

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: `${(frame / durationInFrames) * 100}%`,
        height: 3,
        background: `linear-gradient(90deg, ${BRAND.cyan}, ${BRAND.blue})`,
        opacity: 0.6,
      }} />
    </AbsoluteFill>
  );
};

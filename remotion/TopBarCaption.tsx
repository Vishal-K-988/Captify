
import React from "react";
import { useVideoConfig, useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { HINGLISH_FONT_FAMILY } from "./fonts";

interface TopBarCaptionProps {
  text: string;
}

export const TopBarCaption: React.FC<TopBarCaptionProps> = ({ text }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  // Smooth fade in/out
  const fadeIn = interpolate(frame, [0, fps * 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.2, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const fontSize = 44;
  const barHeight = 80;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "4%",
        paddingLeft: "5%",
        paddingRight: "5%",
      }}
    >
      {/* Top bar background */}
      <div
        style={{
          backgroundColor: "transparent",
          width: "100%",
          minHeight: `${barHeight}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 30px",
          opacity,
          transform: `translateY(${(1 - opacity) * -20}px)`,
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
            fontFamily: HINGLISH_FONT_FAMILY,
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.3,
            textAlign: "center",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            wordBreak: "break-word",
            maxWidth: "95%",
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};




import React from "react";
import { useVideoConfig, useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

interface BottomCenteredCaptionProps {
  text: string;
}

export const BottomCenteredCaption: React.FC<BottomCenteredCaptionProps> = ({ text }) => {
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

  // Standard font size
  const fontSize = 48;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "8%",
        paddingLeft: "5%",
        paddingRight: "5%",
      }}
    >
      <p
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "600",
          color: "#FFFFFF",
          margin: 0,
          lineHeight: 1.4,
          textAlign: "center",
          textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.5)",
          wordBreak: "break-word",
          maxWidth: "90%",
          opacity,
          transform: `translateY(${(1 - opacity) * 10}px)`,
        }}
      >
        {text}
      </p>
    </AbsoluteFill>
  );
};


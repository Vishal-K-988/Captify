

import React from "react";
import { AbsoluteFill } from "remotion";

interface TikTokCaptionProps {
  text: string;
}

export const TikTokCaption: React.FC<TikTokCaptionProps> = ({ text }) => {
  const opacity = 1;

  // Calculate font size based on text length
  const baseFontSize = 60;
  const maxLength = 50;
  const fontSize = Math.max(
    baseFontSize - (text.length - maxLength) * 0.5,
    baseFontSize * 0.7
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: "10%",
        paddingLeft: "5%",
        paddingRight: "5%",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          padding: "20px 30px",
          borderRadius: "12px",
          maxWidth: "90%",
          textAlign: "center",
          opacity,
          transform: `translateY(${(1 - opacity) * 20}px)`,
          transition: "all 0.3s ease",
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "semibold",
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.3,
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            wordBreak: "break-word",
          }}
        >
          {text}
        </p>
      </div>
    </AbsoluteFill>
  );
};


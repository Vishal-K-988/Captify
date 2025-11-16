
// This is the main component which is used to display the captions in justi like the tick-tock style :
// at the bottom center of the video and with a semi-transpatrent background aand bold text ! 
// 
//  Props:
  // - videoUrl: The URL of the video to display (GET presigned URL from S3)
//  - words: Array of word objects with timing information from AssemblyAI
//  

import React from "react";
import {
  AbsoluteFill,
  useVideoConfig,
  useCurrentFrame,
  Video,
} from "remotion";
import { TikTokCaption } from "./TikTokCaption";
import { BottomCenteredCaption } from "./BottomCenteredCaption";
import { TopBarCaption } from "./TopBarCaption";
import { KaraokeCaption } from "./KaraokeCaption";
import type { CaptionStyle } from "./CaptionStyles";

// these are the response which we get from the Assembly AI in order to display the captions on the video ! 
interface Word {
  start: number;
  end: number; 
  text: string;
  confidence: number;
  speaker?: string;
}

export interface VideoWithCaptionsProps {
  videoUrl: string;
  words: Word[];
  captionStyle?: CaptionStyle;
}

export const VideoWithCaptions: React.FC<VideoWithCaptionsProps> = ({
  videoUrl,
  words,
  captionStyle = "tiktok",
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps; 

  // Find all words visible at current time and combine them
  const visibleWords = words.filter(
    (word) => currentTime >= word.start && currentTime <= word.end
  );

  const currentCaptionText = visibleWords.map((w) => w.text).join(" ");

  // Render caption based on selected style
  const renderCaption = () => {
    if (visibleWords.length === 0) {
      return null;
    }

    switch (captionStyle) {
      case "bottom-centered":
        return <BottomCenteredCaption text={currentCaptionText} />;
      
      case "top-bar":
        return <TopBarCaption text={currentCaptionText} />;
      
      case "karaoke":
        // For karaoke, pass all words and current time for word-by-word highlighting
        // KaraokeCaption handles its own word filtering
        return <KaraokeCaption words={words} currentTime={currentTime} />;
      
      case "tiktok":
      default:
        return <TikTokCaption text={currentCaptionText} />;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video Layer */}
      <AbsoluteFill>
        <Video
          src={videoUrl}
          startFrom={0}
          endAt={durationInFrames}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>

      {/* Captions Layer - Show words that are visible at current time */}
      {/* For karaoke, show even if no words at exact current time (shows upcoming words) */}
      {(visibleWords.length > 0 || captionStyle === "karaoke") && (
        <AbsoluteFill>
          {renderCaption()}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};



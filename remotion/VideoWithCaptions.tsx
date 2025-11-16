
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
  interpolate,
  Sequence,
} from "remotion";
import { TikTokCaption } from "./TikTokCaption";

// these are the response which we get from the Assembly AI in order to display the captions on the video ! 
interface Word {
  start: number;
  end: number; 
  text: string;
  confidence: number;
  speaker?: string;
}

interface VideoWithCaptionsProps {
  videoUrl: string;
  words: Word[];
}

export const VideoWithCaptions: React.FC<VideoWithCaptionsProps> = ({
  videoUrl,
  words,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps; 

  // Find all words visible at current time and combine them
  const visibleWords = words.filter(
    (word) => currentTime >= word.start && currentTime <= word.end
  );


  const currentCaptionText = visibleWords.map((w) => w.text).join(" ");

  // Calculate the time range for the current caption
  const captionStart = visibleWords.length > 0 ? Math.min(...visibleWords.map(w => w.start)) : 0;
  const captionEnd = visibleWords.length > 0 ? Math.max(...visibleWords.map(w => w.end)) : 0;

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
      {visibleWords.length > 0 && (
        <AbsoluteFill>
          <TikTokCaption text={currentCaptionText} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};



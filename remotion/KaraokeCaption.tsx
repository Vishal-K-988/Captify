
import React from "react";
import { AbsoluteFill } from "remotion";

interface Word {
  start: number;
  end: number;
  text: string;
}

interface KaraokeCaptionProps {
  words: Word[];
  currentTime: number;
}

export const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({ words, currentTime }) => {

  
  const visibleWords = words.filter((word) => {
    // Handle both seconds and milliseconds
    let wordStart = word.start;
    let wordEnd = word.end;
    
  
    if (wordStart > 1000 || wordEnd > 1000) {
      wordStart = wordStart / 1000;
      wordEnd = wordEnd / 1000;
    }
    
    // Show word if current time is past its start time
    // Keep it visible for a bit after it ends
    return currentTime >= wordStart - 0.2 && currentTime <= wordEnd + 0.5;
  });

  // Find the currently active word (being spoken)
  const activeWord = words.find((word) => {
    let wordStart = word.start;
    let wordEnd = word.end;
    
    if (wordStart > 1000 || wordEnd > 1000) {
      wordStart = wordStart / 1000;
      wordEnd = wordEnd / 1000;
    }
    
    return currentTime >= wordStart && currentTime <= wordEnd;
  });

  if (visibleWords.length === 0) {
    return null;
  }

  const fontSize = 56;

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
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          maxWidth: "90%",
        }}
      >
        {visibleWords.map((word, index) => {
      
          let wordStart = word.start;
          let wordEnd = word.end;
          if (wordStart > 1000 || wordEnd > 1000) {
            wordStart = wordStart / 1000;
            wordEnd = wordEnd / 1000;
          }
          
          const isActive = activeWord?.text === word.text && 
            (activeWord.start > 1000 ? activeWord.start / 1000 : activeWord.start) === wordStart;
          const isPast = currentTime > wordEnd;
          const isFuture = currentTime < wordStart;

          // Calculate opacity based on state
          let opacity = 1;
          if (isPast) {
            opacity = 0.4; 
          } else if (isFuture) {
            opacity = 0.6; 

          }

          // Highlight active word - no background, just text styling
          const backgroundColor = "transparent";
          const color = "#FFFFFF";
          const scale = isActive ? 1.15 : 1;

          return (
            <span
              key={`${word.start}-${index}`}
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: isActive ? "bold" : "600",
                color: color,
                backgroundColor: backgroundColor,
                padding: "4px 8px",
                borderRadius: "0px",
                margin: "4px",
                opacity,
                transform: `scale(${scale})`,
                transition: "all 0.2s ease",
                textShadow: isActive 
                  ? "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5)" 
                  : "1px 1px 2px rgba(0, 0, 0, 0.5)",
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};


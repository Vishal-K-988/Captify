

export type CaptionStyle = "tiktok" | "bottom-centered" | "top-bar" | "karaoke";

export interface CaptionStyleInfo {
  id: CaptionStyle;
  name: string;
  description: string;
}

// THESE are the caption styling we ar e USING  
export const CAPTION_STYLES: CaptionStyleInfo[] = [
  {
    id: "tiktok",
    name: "TikTok Style",
    description: "Bottom-centered with rounded background (current style)",
  },
  {
    id: "bottom-centered",
    name: "Standard Subtitles",
    description: "Classic bottom-centered subtitles with simple styling",
  },
  {
    id: "top-bar",
    name: "News Style",
    description: "Top bar captions like news broadcasts",
  },
  {
    id: "karaoke",
    name: "Karaoke Style",
    description: "Word-by-word highlighting as they're spoken",
  },
];

export const DEFAULT_CAPTION_STYLE: CaptionStyle = "tiktok";


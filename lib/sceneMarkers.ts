import type {
  TranscriptionData,
  SceneMarker,
  TimedSegment,
  Word,
} from "@/app/store/uploadStore";

const toSeconds = (value?: number): number => {
  if (!value || Number.isNaN(value)) {
    return 0;
  }
  return value > 1000 ? value / 1000 : value;
};

const buildMarkersFromSegments = (
  segments: TimedSegment[],
  source: SceneMarker["source"],
  fallbackLabel = "Untitled"
): SceneMarker[] => {
  return segments.map((segment, index) => {
    const start = toSeconds(segment.start);
    const end = Math.max(start, toSeconds(segment.end));
    const words = segment.words ?? [];
    const avgConfidence =
      words.length > 0
        ? words.reduce((sum, word) => sum + (word.confidence ?? 0), 0) /
          words.length
        : segment.confidence;

    const label =
      segment.speaker ||
      segment.text?.slice(0, 64) ||
      `${fallbackLabel} ${index + 1}`;

    return {
      id: `${source}-${index}`,
      start,
      end,
      label,
      source,
      confidence: avgConfidence,
    };
  });
};

const buildMarkersFromWords = (words: Word[]): SceneMarker[] => {
  if (words.length === 0) {
    return [];
  }

  const markers: SceneMarker[] = [];
  const chunkDuration = 8; // seconds
  let currentStart = toSeconds(words[0].start);
  let currentEnd = currentStart + chunkDuration;
  let index = 0;

  while (currentStart < toSeconds(words[words.length - 1].end)) {
    markers.push({
      id: `words-${index}`,
      start: currentStart,
      end: currentEnd,
      label: `Scene ${index + 1}`,
      source: "words",
    });
    index += 1;
    currentStart = currentEnd;
    currentEnd = currentStart + chunkDuration;
  }

  return markers;
};

export const extractSceneMarkers = (
  data: TranscriptionData | null
): SceneMarker[] => {
  if (!data) {
    return [];
  }

  if (data.chapters && data.chapters.length > 0) {
    return data.chapters.map((chapter, index) => ({
      id: `chapter-${index}`,
      start: toSeconds(chapter.start),
      end: Math.max(toSeconds(chapter.start), toSeconds(chapter.end)),
      label:
        chapter.headline ||
        chapter.summary?.slice(0, 64) ||
        `Chapter ${index + 1}`,
      source: "chapter",
    }));
  }

  if (data.paragraphs && data.paragraphs.length > 0) {
    return buildMarkersFromSegments(data.paragraphs, "paragraph", "Paragraph");
  }

  if (data.utterances && data.utterances.length > 0) {
    return buildMarkersFromSegments(data.utterances, "utterance", "Speaker");
  }

  if (data.words && data.words.length > 0) {
    return buildMarkersFromWords(data.words);
  }

  return [];
};


// making this store in order to lift the state of react and use the udated pre-Signed url and Upload_Status instead of false one  and also to store the transcription data ! ! 
'use client'

import { create } from "zustand"
import type { CaptionStyle } from "@/remotion/CaptionStyles";

// If there is a situations persists ti use the interface then I can think aboiut that ! 
export interface Word {
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
}

export interface TimedSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
  words?: Word[];
}

export interface ChapterSegment {
  start: number;
  end: number;
  summary?: string;
  headline?: string;
  gist?: string;
}

export interface TranscriptionData {
  text: string;
  words: Word[];
  status: string;
  utterances?: TimedSegment[];
  paragraphs?: TimedSegment[];
  chapters?: ChapterSegment[];
  audioDuration?: number;
  transcriptId?: string;
}

export interface SceneMarker {
  id: string;
  start: number;
  end: number;
  label: string;
  source: "chapter" | "paragraph" | "utterance" | "words";
  confidence?: number;
}

export interface BrollAssignment {
  sceneId: string;
  source: "pexels";
  url: string;
  label?: string;
  providerId?: string | number;
  quality?: string;
  width?: number;
  height?: number;
  thumbnail?: string;
  start: number;
  end: number;
}

interface UploadState {
  uploadURL: string;
  uploadDone: boolean;
  getURL: string;
  transcriptionData: TranscriptionData | null;
  sceneMarkers: SceneMarker[];
  activeSceneMarker: SceneMarker | null;
  brollAssignments: Record<string, BrollAssignment>;
  selectedCaptionStyle: CaptionStyle;
  orientation: string;
  size: string;
  Keyword: string;

  setUploadURL: (url: string) => void;
  setUploadDone: (done: boolean) => void;
  setGetURL: (url: string) => void;
  setTranscriptionData: (data: TranscriptionData | null) => void;
  setSceneMarkers: (markers: SceneMarker[]) => void;
  setActiveSceneMarker: (marker: SceneMarker | null) => void;
  setBrollAssignment: (sceneId: string, assignment: BrollAssignment) => void;
  clearBrollAssignment: (sceneId: string) => void;
  setSelectedCaptionStyle: (style: CaptionStyle) => void;
  setOrientation: (orientation: string) => void;
  setSize: (size: string) => void;
  setKeyword: (keyword: string) => void;
}





export const useUploadStore = create<UploadState>((set) => ({
  uploadURL: "",
  uploadDone: false,
  getURL: "",
  transcriptionData: null,
  sceneMarkers: [],
  activeSceneMarker: null,
  brollAssignments: {},
  selectedCaptionStyle: "tiktok",
  // the default selected value ! 
  orientation: "portrait",
  size: "small",
  Keyword: "",

  setUploadURL: (url) => set({ uploadURL: url }),
  setUploadDone: (done) => set({ uploadDone: done }),
  setGetURL: (url) => set({
    getURL: url
  }),
  setTranscriptionData: (data) => set({ transcriptionData: data }),
  setSceneMarkers: (markers) => set({ sceneMarkers: markers }),
  setActiveSceneMarker: (marker) => set({ activeSceneMarker: marker }),
  setBrollAssignment: (sceneId, assignment) =>
    set((state) => ({
      brollAssignments: {
        ...state.brollAssignments,
        [sceneId]: assignment,
      },
    })),
  clearBrollAssignment: (sceneId) =>
    set((state) => {
      const next = { ...state.brollAssignments };
      delete next[sceneId];
      return { brollAssignments: next };
    }),
  setSelectedCaptionStyle: (style) => set({ selectedCaptionStyle: style }),

  // Orientation and Size e
  setOrientation: (orientation) => set({
    orientation: orientation
  }),
  setSize: (size) => set({
    size: size
  }),
  setKeyword: (keyword) => set({ Keyword: keyword })
}));
// making this store in order to lift the state of react and use the udated pre-Signed url and Upload_Status instead of false one  and also to store the transcription data ! ! 
'use client' 

import { create } from "zustand"

// If there is a situations persists ti use the interface then I can think aboiut that ! 
interface Word {
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
}

interface TranscriptionData {
  text: string;
  words: Word[];
  status: string;
}

interface UploadState {
  uploadURL: string;
  uploadDone: boolean;
  getURL : string;
  transcriptionData: TranscriptionData | null;

  setUploadURL: (url: string) => void;
  setUploadDone: (done: boolean) => void;
  setGetURL : (url : string ) => void;
  setTranscriptionData: (data: TranscriptionData | null) => void;
}


export const useUploadStore = create<UploadState>((set) => ({
  uploadURL: "",
  uploadDone: false,
  getURL : "",
  transcriptionData: null,

  setUploadURL: (url) => set({ uploadURL: url }),
  setUploadDone: (done) => set({ uploadDone: done }),
  setGetURL : (url ) => set({
    getURL : url 
  }),
  setTranscriptionData: (data) => set({ transcriptionData: data })
}));
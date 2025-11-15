// making this store in order to lift the state of react and use the udated pre-Signed url and Upload_Status instead of false one ! 
'use client' 

import { create } from "zustand"

// If there is a situations persists ti use the interface then I can think aboiut that ! 
interface UploadState {
  uploadURL: string;
  uploadDone: boolean;

  setUploadURL: (url: string) => void;
  setUploadDone: (done: boolean) => void;
}
export const useUploadStore = create<UploadState>((set) => ({
  uploadURL: "",
  uploadDone: false,

  setUploadURL: (url) => set({ uploadURL: url }),
  setUploadDone: (done) => set({ uploadDone: done }),
}));
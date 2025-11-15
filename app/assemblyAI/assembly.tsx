"use client";

import { useUploadStore } from "../store/uploadStore";
import { AssemblyAI } from "assemblyai";

export function Captions() {
  const uploadURL = useUploadStore((s: any ) => s.uploadURL);
  const uploadDone = useUploadStore((s: any ) => s.uploadDone);

  const apiKey = process.env.NEXT_PUBLIC_ASSEMBLY_KEY;

  if (!apiKey) throw new Error("Missing Assembly API key");

  if (!uploadDone) {
    return <>Upload a video first!</>;
  }

  console.log("Uploaded S3 File URL:", uploadURL);

  const client = new AssemblyAI({ apiKey });

  // Now you can call AssemblyAI transcript API here

  return <>Ready to generate captions!</>;
}

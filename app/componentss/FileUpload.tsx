"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadStore } from "../store/uploadStore";

export function UploadFile() {
    const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const setUploadURL = useUploadStore((s : any) => s.setUploadURL);
  const setUploadDone = useUploadStore((s : any ) => s.setUploadDone);
  const setGetURL = useUploadStore ( (s : any ) => s.setGetURL)

  async function uploadFile(e: any) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      // generating the r presigned URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: `videos/${file.name.replace(/\s+/g, "_")}`,
          fileType: file.type,
        }),
      });

      const { uploadURL, fileURL , getURL } = await res.json();

      // upload file to s3 with pre-Signed url 
      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "video/mp4",
        },
        body: file,
      });

      setUploading(false);

      if (uploadRes.ok) {
        
        // Put pre-signed URL 
        setUploadURL(uploadURL);
        setUploadDone(uploadRes.status);
        // GET pre-signed url 
        setGetURL(getURL)

        router.push("/generator")

      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-4 mx-5">
      <Label htmlFor="video">Upload Video</Label>
      <Input id="video" type="file" accept="video/mp4" onChange={uploadFile} />
    </div>
  );
}

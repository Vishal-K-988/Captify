'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileType } from "lucide-react";
import { useState } from "react"

export function UploadFile() {
    const [uploading, setUploading ] = useState(false) ;
    const [preSignedURL , setPresignedURL ] = useState("");

    async function uploadFile(e:any) {

        try {
        console.log("uploading the FILE "); 

        const file = e.target.files[0];
        if(!file)  {
            console.log ("file is not present ") 
            return ;
        }

        // if file is selected -> we will send a post req 
        setUploading(true);

        // getting the pre-signed url 
        const res = await fetch("/api/upload-url", {
            method : "POST" , 
           headers: { "Content-Type": "application/json" },
            body : JSON.stringify({
                fileName :`videos/${file.name.replace(/\s+/g, "_")}`,
                fileType: file.type
            })
        });
        

        const {uploadURL  } = await res.json ();


        // uploading the file to s3 
       const testing =  await fetch (uploadURL , {
            method : "PUT",
            headers : {
                "Content-Type" : "video/mp4"
            },
            body : file 
        });

        console.log (" Response while uploading to S3 from /components/fileupload.tsx/43   : ", testing  )

        // after all this thing we reset the Uploading status 
        setUploading(false); 
        setPresignedURL(uploadURL)
        
        alert ("File uploading fdone , here's is the Presigned url for ASSEMBLT AI : " + uploadURL)
    }
    catch(error ) {
            console.log("error occured :  " , error )
    }

    }

  return (
    <div className="grid  w-full max-w-sm items-center mx-5 gap-4  ">
      <Label htmlFor="Video">Upload Video </Label>
      <Input id="video" type="file"accept="video/mp4"  onChange={uploadFile}/>
      
      <h3 className="font-extrabold text-2xl "> status of uploading  {uploading} and the presigned url : {preSignedURL}</h3>

    </div>
  )
}

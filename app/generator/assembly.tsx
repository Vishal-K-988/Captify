"use client";

import { Video } from "../componentss/Video";
import { useUploadStore } from "../store/uploadStore";


export  function Captions() {
  const uploadURL = useUploadStore((s: any ) => s.uploadURL);
  const uploadDone = useUploadStore((s: any ) => s.uploadDone);
  // this  is the get-presigned URL 
  const getURL = useUploadStore( (s:any ) => s.getURL);

  if (!uploadDone) {
    return (<>
      <h2>
        Upload a video First ! 
      </h2>
    </>)
  }

  console.log("PUT presigned URL :", uploadURL);
  console.log ("GET Presigned url : " ,getURL )

  // Function to get the transcriptID 


  const data = {
    audio_url: getURL,
     speaker_labels: true,
  format_text: true,
  punctuate: true,
  speech_model: "universal",
  language_detection: true,
  language_detection_options: {
    "code_switching": true,
    "code_switching_confidence_threshold": 0.5
},
  }

  async function CallingAssemblyAI () {
  
    try {
    const start  = await fetch("/api/transcription", {
      method : "POST",
      headers :{
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(data)
    })

      const {id } = await start.json ();

      console.log("Transcription id is  : " , id )


      const poll = await fetch ("/api/polling" , {
        method: "POST" , 
        headers : {
          "Content-Type" : "application/json" 
        }, 
        body : JSON.stringify({id})
      })

      const {text}= await poll.json();
      console.log ("generated caption /Text is : " , text)
  }catch (error) {
        console.log ("error occured : " , error )
      }
  }




  CallingAssemblyAI();

  return (<>
  
    <div className="flex justify-around ">

        <h1 className="text-4xl flex min-h-screen items-center ">
            AssemblyAi 
        </h1>   
        <div className="p-4 m-2 ">
          <Video/>
        </div>
    </div>
  </>);
}

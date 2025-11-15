'use client'

import { useRouter } from "next/navigation"
import { UploadFile } from "../componentss/FileUpload";

export default function Dashboard () {

    const router = useRouter();

    function ToLandingPage () {
        router.push("/")
    }

return (<>
    
    <button className="ring-2 rounded-xl ring-blue-700  p-2  m-2" onClick={ToLandingPage}>Landing Page </button>

        <h1 className="text-2xl font-bold  flex min-h-screen items-center justify-around">
            Dashboard 
            <br />
           <UploadFile/>
           <br />
       
        </h1>
    
      




    </>)
}
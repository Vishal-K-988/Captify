'use client'


import { DashboardTitle } from "../componentss/Dashboard";
import { Background } from "../componentss/DashboardBackground";
import { UploadFile } from "../componentss/FileUpload";


export default function Dashboard () {

  

    

return (<>

<div className="relative min-h-screen w-full flex items-center justify-center px-4 py-16 sm:px-12 sm:py-20">

  <div className="absolute inset-0 -z-10 pointer-events-none">
    <Background />
  </div>
  <div className="flex flex-col md:flex-row items-center justify-center w-full gap-8 sm:gap-12 md:gap-16 lg:gap-24">
    <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
      <div className="max-w-lg w-full">
        <DashboardTitle />
      </div>
    </div>
    <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto">
      <div className="max-w-lg w-full">
        <UploadFile />
      </div>
    </div>
  </div>
</div>



       
           
        
       
    
      




    </>)
}
'use client'

import { useRouter } from "next/navigation";

import { ComicText } from "@/components/ui/comic-text";
import { HeroVideoDialogDemo } from "./componentss/WorkingVideo";
import { GetStarted } from "./componentss/GetStarted";
import { Description } from "./componentss/Description";
import { DockDemo } from "./componentss/Dock";





export default function Home() {

  const router  = useRouter();

  function handleClick () {
 
  
    router.push("/dashboard")
    
  }

  
  return (
    <>
    <div className="w-full bg-zinc-50 font-sans dark:bg-black">

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12">
        <ComicText>Captify</ComicText>
        <div className="mt-4 sm:mt-6">
          <GetStarted onClick={handleClick} />
        </div>
      </div>
      
    
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:gap-16 gap-8 md:gap-12">
        <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto md:pr-8">
          <Description />
        </div>
        <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto md:pl-8 max-w-full">
          <HeroVideoDialogDemo />
        </div>
      </div>
      
    
     
    </div>
   
   
         
      </>
  );
}

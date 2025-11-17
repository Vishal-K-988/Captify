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
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <ComicText>Captify</ComicText>
        <div className="mt-6">
          <GetStarted onClick={handleClick} />
        </div>
      </div>
      
      <div className="flex items-center justify-between min-h-screen w-full px-16 py-12 gap-16">
        <div className="flex-1 flex justify-end pr-8">
          <Description />
        </div>
        <div className="flex-1 flex justify-start pl-8">
          <HeroVideoDialogDemo />
        </div>
      </div>
      <div className="fixed bottom-3 left-0 w-full flex items-center justify-center z-50">
        <DockDemo />
      </div>
    </div>
   
   
         
      </>
  );
}

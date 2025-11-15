'use client'

import { useRouter } from "next/navigation";
import { GetStarted } from "./componentss/GetStarted";
import { LightRaysComponent } from "./componentss/LightRays";
import { ThemeToggler } from "./componentss/Theme";



export default function Home() {

  const router  = useRouter();

  function handleClick () {

    router.push("/dashboard")
    
  }

  
  return (
    <>
  
      
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="p-2 ring-2 ring-blue-800 rounded-xl">
     <  button onClick={handleClick}> Get Started </button>
      </div>
    
 
     <LightRaysComponent/>
    </div>
         
      </>
  );
}

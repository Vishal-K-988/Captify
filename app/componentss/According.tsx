import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function AccordingFooter() {
    return (
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Why There is a Delay ? </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
             There are a bunch of reasons. Primary one which I figured was, Browser does a lot of task under the hood to render the video and captions. So, it takes a bit of time to render the video and captions.
            </p>
            <p>
             DNS lookup , TLS handlshake (Browser and the S3 ) , Cors configurations, GET request to the API,  Verification of the Pre-Signed URL , Browser is waiting for the first byte to be received from S3, Decodes mp4 metadatat , Generate the seek table , etc  
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Longer Delay ; Check Console </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              If there exists a more delay while rendering the video it might be due to the cause that : 
            </p>
            <p>
              my AssemblyAI API key might rate limited , or the API might be down , or the API might be slow , or the API might be busy , etc  
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>For more Details about Captify </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              Click on the Documentation (file) Icon present in the bottom dock ! 
            </p>
            <p>
            Also don&apos;t forget to visit my portfolio website  : https://vishalkumargeed.in
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Note that It would take the same time as that of the video length </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
                meow meow
            </p>
          </AccordionContent>
        </AccordionItem>
     
     
      </Accordion>
    )
  }
  
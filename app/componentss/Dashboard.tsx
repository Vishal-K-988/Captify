import { Highlighter } from "@/components/ui/highlighter"


export function DashboardTitle() {
  return (
    <div className="text-center space-y-3">
      <p className="leading-relaxed">
        <Highlighter action="underline" color="#2563eb">
          Captify AI
        </Highlighter>{" "}
        {" "}
        <Highlighter action="highlight" color="#facc15" >
          <span className="text-black  dark:text-black">
            generate captions
          </span>
        </Highlighter>{" "}
        for your videos and audio quickly and effortlessly.
      </p>
     
      <p className="leading-relaxed">
        Simply{" "}
        <Highlighter action="underline" color="#2563eb">
          upload your video or audio file
        </Highlighter>
        , and let Captify do the rest.
      </p>
    </div>
  )
}

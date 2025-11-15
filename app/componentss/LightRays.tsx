import { LightRays } from "@/components/ui/light-rays"



export function LightRaysComponent() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg border">
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-xs font-semibold tracking-[0.35em] text-slate-800/60 uppercase dark:text-slate-200/60">
          Real-time Caption Generator 
        </span>
        <h1 className="text-foreground text-4xl font-bold md:text-5xl">
          Capsify
        </h1>
       
      </div>
      <LightRays />
    </div>
  )
}

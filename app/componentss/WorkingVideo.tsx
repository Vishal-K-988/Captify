import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
export function HeroVideoDialogDemo() {
    const videoURL = "https://www.youtube.com/watch?v=ak-Ei831dtk"
  return (
    <div className="relative w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <HeroVideoDialog
        className="block dark:hidden w-full"
        animationStyle="from-center"
        videoSrc={videoURL}
        thumbnailSrc="/ThumbnailLight.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block w-full"
        animationStyle="from-center"
        videoSrc={videoURL}
        thumbnailSrc="/ThumbnailDark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  )
}

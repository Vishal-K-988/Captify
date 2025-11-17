import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
export function HeroVideoDialogDemo() {
    const videoURL = "https://www.youtube.com/watch?v=ak-Ei831dtk"
  return (
    <div className="relative">
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc={videoURL}
        thumbnailSrc="/ThumbnailLight.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc={videoURL}
        thumbnailSrc="/ThumbnailDark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  )
}

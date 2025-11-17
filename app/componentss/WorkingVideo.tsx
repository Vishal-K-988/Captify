import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
export function HeroVideoDialogDemo() {
    const videoURL = "https://youtu.be/bLdggi6cTVE"
  return (
    <div className="relative w-full max-w-[95vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl">
      <HeroVideoDialog
        className="block dark:hidden w-full"
        animationStyle="from-center"
        videoSrc={videoURL}
        thumbnailSrc="/thumbnailLight.png"
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

import { TextAnimate } from "@/components/ui/text-animate"

export function Description() {
  return (
    <TextAnimate 
      animation="blurIn" 
      as="h1" 
      className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center md:text-left px-4 sm:px-0" 
      delay={0.4}
    >
    Captivate your story—one caption at a time.
    </TextAnimate>
  )
}

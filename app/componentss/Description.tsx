import { TextAnimate } from "@/components/ui/text-animate"

export function Description() {
  return (
    <TextAnimate animation="blurIn" as="h1" className="text-4xl  font-semibold not-only:" delay={0.4}>
    Captivate your story—one caption at a time.
    </TextAnimate>
  )
}

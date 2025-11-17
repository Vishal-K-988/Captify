import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
export function GetStarted({ onClick }: { onClick: () => void }) {
  return <InteractiveHoverButton onClick={onClick}>Get Started </InteractiveHoverButton>
}

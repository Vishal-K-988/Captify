import { NumberTicker } from "@/components/ui/number-ticker"
export function Loader() {
  return (
    <NumberTicker
      value={100}
      className="text-8xl font-medium tracking-tighter whitespace-pre-wrap text-black dark:text-white"
    />
  )
}

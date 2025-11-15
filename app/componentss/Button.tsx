"use client"

import { Button } from "@/components/ui/button"

export default function TestButton() {
  return (
    <Button
      onClick={() => {
        console.log("Button clicked!")
      }}
    >
      Click me
    </Button>
  )
}

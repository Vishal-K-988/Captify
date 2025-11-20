"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUploadStore } from "../store/uploadStore";

export function OrientationDropDown () {
    const setOrientation = useUploadStore((s) => s.setOrientation);
    const orientation = useUploadStore((s) => s.orientation);


        console.log("Orientation : " , orientation)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Orienetations</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select the Orientation </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={orientation} onValueChange={setOrientation}>
          <DropdownMenuRadioItem value="portrait">Portrait (Vertical) </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="landscape">Landscape (Horizontal) </DropdownMenuRadioItem>

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

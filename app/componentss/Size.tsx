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
import { useUploadStore } from "../store/uploadStore"

export function SizeDropDown() {
 const setSize = useUploadStore((s) => s.setSize);
 const Size = useUploadStore((s)=> s.size);

    console.log("Size is : " , Size )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Resolution</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Resolution </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={Size} onValueChange={setSize}>
          <DropdownMenuRadioItem value="small">HD</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">FULL HD  </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="large">LARGE </DropdownMenuRadioItem>

        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

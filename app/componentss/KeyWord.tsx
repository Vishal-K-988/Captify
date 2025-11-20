import { Input } from "@/components/ui/input"
import { useUploadStore } from "../store/uploadStore"

export function Keyword() {
    const setKeyword = useUploadStore((s)=> s.setKeyword);
    const Keyword = useUploadStore((s) => s.Keyword)

    console.log("Keyword : " , Keyword )
  return (
    <Input
      type="text"
      placeholder="Flowers"
      value={Keyword}
      onChange={(e) => setKeyword(e.target.value)}
    />
  )
}

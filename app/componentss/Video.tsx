import { useUploadStore } from "../store/uploadStore"

export function Video() {
    const getURL = useUploadStore((s:any ) => s.getURL);

    console.log("get URL : " , getURL)
  return (
    <video width="320" height="240" controls preload="none">
      <source src={getURL} type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      Your browser does not support the video tag.
    </video>
  )
}
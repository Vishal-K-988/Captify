
import React from "react";
import { Composition } from "remotion";
import { VideoWithCaptions } from "./VideoWithCaptions";


// Basically what we are doing is that we are registering the VideoWithCaptions component via component atttribure of the   Composition componment of the remotion librarry !  So as to render the video with that this ciomponent ! 
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoWithCaptions"
        // @ts-expect-error - Remotion Composition type compatibility
        component={VideoWithCaptions}
        // thesse are the meta data which are linked with the output video 
        durationInFrames={3000} 
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoUrl: "",
          words: [],
          captionStyle: "tiktok",
        }}
      />
    </>
  );
};


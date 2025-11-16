"use client";

import { useState, useEffect, useCallback } from "react";
import { useUploadStore } from "../store/uploadStore";
import dynamic from "next/dynamic";

// Dynamically import Remotion Player to avoid SSR issues
const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

// Import Remotion composition
import { VideoWithCaptions } from "@/remotion/VideoWithCaptions";
import { CAPTION_STYLES, type CaptionStyle } from "@/remotion/CaptionStyles";
import { HINGLISH_FONT_FAMILY } from "@/remotion/fonts";

// response from the Assem,bly AI 
interface Word {
  start: number;
  end: number;
  text: string;
  confidence: number;
  speaker?: string;
}


export function Captions() {
  const uploadDone = useUploadStore((s) => s.uploadDone);
  const getURL = useUploadStore((s) => s.getURL);
  const transcriptionData = useUploadStore((s) => s.transcriptionData);
  const setTranscriptionData = useUploadStore((s) => s.setTranscriptionData);
  const selectedCaptionStyle = useUploadStore((s) => s.selectedCaptionStyle);
  const setSelectedCaptionStyle = useUploadStore((s) => s.setSelectedCaptionStyle);

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  // Function to get transcription from AssemblyAI
  const callAssemblyAI = useCallback(async () => {
    if (!getURL) {
      setTranscriptionError("No video URL available");
      return;
    }

    // If transcription already exists, don't call again
    if (transcriptionData) {
      return;
    }

    setIsTranscribing(true);
    setTranscriptionError(null) 

    // these are all from assembly ai documentation 
  const data = {
    audio_url: getURL,
     speaker_labels: true,
  format_text: true,
  punctuate: true,
  speech_model: "universal",
  language_detection: true,
  language_detection_options: {
        code_switching: true,
        code_switching_confidence_threshold: 0.5,
      },
    };

    try {
      // Step 1: Start transcription
      const start = await fetch("/api/transcription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!start.ok) {
        throw new Error("Failed to start transcription");
      }

      const { id } = await start.json();
      console.log("Transcription id is:", id);

      // Step 2: Poll for transcription completion
      const poll = await fetch("/api/polling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!poll.ok) {
        throw new Error("Failed to poll transcription");
      }

      const response = await poll.json();
      console.log("Generated caption/Text is:", response.words);

      // Storing th e transcription data in Zustand store
      // Alos checking if the 'response.words' exists and is an array
      if (response.words && Array.isArray(response.words)) {
        setTranscriptionData({
          text: response.text || "",
          words: response.words,
          status: response.status || "completed",
        });

        // phase -2 is done ; If you are seeing this line of code then give me some Redbull 
      } else {
        throw new Error("No words array in response");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Transcription failed";
      console.error("Error occurred:", error);
      setTranscriptionError(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  }, [getURL, transcriptionData, setTranscriptionData]);

  // Calling   AssemblyAI when component mounts
  useEffect(() => {
    if (uploadDone && getURL && !transcriptionData) {
      callAssemblyAI();
    }
  }, [uploadDone, getURL, transcriptionData, callAssemblyAI]);

  // Load video metadata to get actual duration
  useEffect(() => {
    if (getURL && !videoDuration) {
      const video = document.createElement("video");
      video.src = getURL;
      video.addEventListener("loadedmetadata", () => {
        setVideoDuration(video.duration);
      });
      video.load();
    }
  }, [getURL, videoDuration]);

  // Get actual video duration from video metadata
  const getVideoDuration = () => {
    // Use actual video duration if available, otherwise fallback to words
    if (videoDuration) {
      return videoDuration;
    }
    if (transcriptionData?.words && transcriptionData.words.length > 0) {
      const lastWord = transcriptionData.words[transcriptionData.words.length - 1];
      // adding plus 5 in for buffer 
      return Math.ceil(lastWord.end) + 5; 
      
    }
    return 40; 
  };

  // Will convert this to loaderr 
  if (!uploadDone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl">Upload a video First!</h2>
      </div>
    );
  }

  // video rendering with canvas overlay
  const handleRender = async () => {
    if (!transcriptionData || !getURL || !videoDuration) {
      alert("Transcription data, video URL, or duration is missing");
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);

    try {
     
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = getURL;
      video.muted = false;
      video.playsInline = true;
      video.volume = 1.0; 
      
    
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => {
          // Ensure video dimensions are available
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            resolve();
          }
        };
        video.oncanplay = () => {
          resolve();
        };
        video.onerror = (e) => {
          console.error("Video error:", e);
          reject(new Error("Failed to load video"));
        };
        video.load();
      });

      // This is a canvas for showing the video 
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      canvas.style.display = "none";
      document.body.appendChild(canvas);
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      
      const canvasStream = canvas.captureStream(30); 
      
          //  MediaStream that combines canvas video with source video audio
      const combinedStream = new MediaStream();
      
   
      const videoTracks = canvasStream.getVideoTracks();
      if (videoTracks.length > 0) {
        combinedStream.addTrack(videoTracks[0]);
      }
      
    // PLaying the video
      try {
        await video.play();
      } catch (playError) {
        console.error("Play error:", playError);
     
        throw new Error("Failed to play video. Please check browser autoplay settings.");
      }

      // Wait for video to be playing to get audio track
      await new Promise<void>((resolve) => {
        const setupAudio = () => {
          try {
            // an audio context to capture audio from video element
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const audioContext = new AudioContextClass();
            
         
            const source = audioContext.createMediaElementSource(video);
            
           
            const destination = audioContext.createMediaStreamDestination();
            
            // Connect source only to destination for recording (NOT to audioContext.destination to avoid playback)
            source.connect(destination);
            
            // Note: We don't connect to audioContext.destination to prevent audio playback during rendering
            
            // Adding the  audio tracks to combined stream
            const audioTracks = destination.stream.getAudioTracks();
            if (audioTracks.length > 0) {
              combinedStream.addTrack(audioTracks[0]);
              console.log("Audio track added to stream");
            } else {
              console.warn("No audio tracks found");
            }
            
            resolve();
          } catch (audioError) {
            console.error("Audio setup error:", audioError);
            // Continue without audio if setup fails
            resolve();
          }
        };
        
        // Setup audio when video starts playing
        if (video.readyState >= 2) {
          setupAudio();
        } else {
          video.addEventListener("canplay", setupAudio, { once: true });
          // Fallback timeout
          setTimeout(setupAudio, 1000);
        }
      });
      
      // Check for supported MIME type
      // checked from the internet 
      let mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm;codecs=vp8,opus";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "video/webm";
        }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
        audioBitsPerSecond: 128000, // 128 kbps for audio
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRenderedVideoUrl(url);
        setIsRendering(false);
        setRenderProgress(100);
        // Cleanup
        canvas.remove();
        video.remove();
      };

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setIsRendering(false);
        canvas.remove();
        video.remove();
      };

      // Wait a bit for audio to be set up
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Start recording
      mediaRecorder.start(100);
         // Collect  data every 100ms

      let animationFrameId: number;
      let isRendering = true;

      // Render function
      const renderFrame = () => {
        if (!isRendering || video.ended) {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
          return;
        }

        // Check if video is ready
        if (video.readyState >= 2) { 
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw video frame
          const videoAspect = video.videoWidth / video.videoHeight;
          const canvasAspect = canvas.width / canvas.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let offsetX = 0;
          let offsetY = 0;

          if (videoAspect > canvasAspect) {
            drawHeight = canvas.width / videoAspect;
            offsetY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * videoAspect;
            offsetX = (canvas.width - drawWidth) / 2;
          }

          try {
            ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

            // Draw captions
            const currentTime = video.currentTime;
            
            // Handle both seconds and milliseconds 
            const visibleWords = transcriptionData.words.filter((word) => {
              // Check if word has text property
              if (!word.text) {
                return false;
              }
              
              // Convert to seconds if needed (if start > 100, likely milliseconds)
              let wordStart = word.start;
              let wordEnd = word.end;
              
              
              if (wordStart > 1000 || wordEnd > 1000) {
                wordStart = wordStart / 1000;
                wordEnd = wordEnd / 1000;
              }
              
              return currentTime >= wordStart && currentTime <= wordEnd;
            });

            // For karaoke style, always draw (it handles its own word filtering)
            // For other styles, only draw if there are visible words
            if (selectedCaptionStyle === "karaoke") {
              drawCaption(
                ctx,
                "", // Empty text for karaoke (it uses words array)
                canvas.width,
                canvas.height,
                selectedCaptionStyle,
                transcriptionData.words,
                currentTime
              );
            } else if (visibleWords.length > 0) {
              const captionText = visibleWords.map((w) => w.text || "").filter(Boolean).join(" ");
              // FOr my debuggin I guess I will keep this ! 
                // Debug: Log captions periodically (every 0.5 seconds)
              if (Math.floor(currentTime * 2) % 1 === 0) {
                console.log(`[${currentTime.toFixed(2)}s] Found ${visibleWords.length} words, Text: "${captionText.substring(0, 50)}"`);
              }
              
              if (captionText.trim().length > 0) {
                drawCaption(
                  ctx,
                  captionText,
                  canvas.width,
                  canvas.height,
                  selectedCaptionStyle,
                  transcriptionData.words,
                  currentTime
                );
              }
            }
          } catch (drawError) {
            console.error("Draw error:", drawError);
          }

          // Update progress
          const progress = Math.min((video.currentTime / videoDuration) * 100, 100);
          setRenderProgress(progress);
        }

        animationFrameId = requestAnimationFrame(renderFrame);
      };

      // Debug: Log words structure and verify data
      console.log("=== RENDERING DEBUG ===");
      console.log("Total words:", transcriptionData.words.length);
      console.log("Video duration:", videoDuration, "seconds");
      if (transcriptionData.words.length > 0) {
        const firstWord = transcriptionData.words[0];
        const lastWord = transcriptionData.words[transcriptionData.words.length - 1];
        console.log("First word:", firstWord);
        console.log("Last word:", lastWord);
        console.log("Word timing range:", {
          firstStart: firstWord.start,
          firstEnd: firstWord.end,
          lastStart: lastWord.start,
          lastEnd: lastWord.end,
        });
        console.log("Sample words (first 3):", transcriptionData.words.slice(0, 3));
      }

      // Canvas is ready for rendering

      // Start rendering
      renderFrame();

      // Stop when video ends
      video.onended = () => {
        isRendering = false;
        if (mediaRecorder.state === "recording") {
          mediaRecorder.stop();
        }
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Render error:", error);
      alert("Failed to render video: " + errorMessage);
      setIsRendering(false);
    }
  };

  // Helper function to draw captions based on selected style
  const drawCaption = (
    ctx: CanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number,
    style: CaptionStyle,
    words?: Word[],
    currentTime?: number
  ) => {
    switch (style) {
      case "karaoke":
        // Karaoke style doesn't need text, it uses words array
        if (words && currentTime !== undefined) {
          drawKaraokeCaption(ctx, words, currentTime, canvasWidth, canvasHeight);
        }
        break;
      case "bottom-centered":
        if (text && text.trim().length > 0) {
          drawBottomCenteredCaption(ctx, text, canvasWidth, canvasHeight);
        }
        break;
      case "top-bar":
        if (text && text.trim().length > 0) {
          drawTopBarCaption(ctx, text, canvasWidth, canvasHeight);
        }
        break;
      case "tiktok":
      default:
        if (text && text.trim().length > 0) {
          drawTikTokCaption(ctx, text, canvasWidth, canvasHeight);
        }
        break;
    }
  };

  // TikTok-style caption
  const drawTikTokCaption = (
    ctx: CanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    const fontSize = 60;
    const maxWidth = canvasWidth * 0.9;
    const bottomOffset = canvasHeight * 0.1;

    ctx.font = `bold ${fontSize}px ${HINGLISH_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    
    const bgY = canvasHeight - bottomOffset;

    // Draw text
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    if (textWidth > maxWidth) {
      const words = text.split(" ");
      let line = "";
      let y = bgY;
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testMetrics = ctx.measureText(testLine);
        if (testMetrics.width > maxWidth && line.length > 0) {
          ctx.fillText(line.trim(), canvasWidth / 2, y);
          line = words[i] + " ";
          y += textHeight + 10;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), canvasWidth / 2, y);
    } else {
      ctx.fillText(text, canvasWidth / 2, bgY);
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
  };

  //  bottom-centered standard caption
  const drawBottomCenteredCaption = (
    ctx: CanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    const fontSize = 48;
    const bottomOffset = canvasHeight * 0.08;

    ctx.font = `600 ${fontSize}px ${HINGLISH_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const y = canvasHeight - bottomOffset;

    // strong shadow
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    //  wrapping
    const maxWidth = canvasWidth * 0.9;
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? " " : "") + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, canvasWidth / 2, currentY);
        line = words[i];
        currentY -= fontSize + 10;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, canvasWidth / 2, currentY);
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
  };

  // top-bar news-style caption
  const drawTopBarCaption = (
    ctx: CanvasRenderingContext2D,
    text: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    const fontSize = 44;
    const topOffset = canvasHeight * 0.04;

    ctx.font = `bold ${fontSize}px ${HINGLISH_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

 
    const y = topOffset + 40; 
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    const maxWidth = canvasWidth * 0.95;

    // Handle wrapping
    const words = text.split(" ");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? " " : "") + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, canvasWidth / 2, currentY);
        line = words[i];
        currentY += fontSize + 8;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, canvasWidth / 2, currentY);
    }

    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
  };

  // karaoke-style caption 
  const drawKaraokeCaption = (
    ctx: CanvasRenderingContext2D,
    words: Word[],
    currentTime: number,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    ctx.save();

    // Find visible words
    const visibleWords = words.filter((word) => {
      let wordStart = word.start;
      let wordEnd = word.end;
      if (wordStart > 1000 || wordEnd > 1000) {
        wordStart = wordStart / 1000;
        wordEnd = wordEnd / 1000;
      }
      return currentTime >= wordStart - 0.2 && currentTime <= wordEnd + 0.5;
    });

    if (visibleWords.length === 0) {
      ctx.restore();
      return;
    }

    //  active word
    const activeWord = words.find((word) => {
      let wordStart = word.start;
      let wordEnd = word.end;
      if (wordStart > 1000 || wordEnd > 1000) {
        wordStart = wordStart / 1000;
        wordEnd = wordEnd / 1000;
      }
      return currentTime >= wordStart && currentTime <= wordEnd;
    });

    const fontSize = 56;
    const bottomOffset = canvasHeight * 0.1;
    const startX = canvasWidth / 2;
    let currentX = startX;
    const currentY = canvasHeight - bottomOffset;

    ctx.textBaseline = "middle";

    // Calculate total width to center
    let totalWidth = 0;
    const wordMetrics: Array<{ word: Word; width: number }> = [];
    for (const word of visibleWords) {
      ctx.font = `600 ${fontSize}px ${HINGLISH_FONT_FAMILY}`;
      const metrics = ctx.measureText(word.text);
      const width = metrics.width + 16; 
      // padding
      wordMetrics.push({ word, width });
      totalWidth += width + 8; 
    }
    totalWidth -= 8; 

    // Start from center minus half width
    currentX = startX - totalWidth / 2;

    // Draw each word
    for (const { word, width } of wordMetrics) {
      const isActive = activeWord?.text === word.text && activeWord?.start === word.start;
      const isPast = currentTime > (word.end > 1000 ? word.end / 1000 : word.end);


      const textColor = "#FFFFFF";
      const opacity = isPast ? 0.4 : 1;

    
      ctx.globalAlpha = opacity;
      ctx.fillStyle = textColor;
      
      
      if (isActive) {
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      } else {
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }

      ctx.font = `${isActive ? "bold" : "600"} ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(word.text, currentX, currentY);
      
      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      currentX += width + 8;
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  };

 
  
  const handleDownload = () => {
    if (renderedVideoUrl) {
      const link = document.createElement("a");
      link.href = renderedVideoUrl;
      link.download = "video-with-captions.webm";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Video with Captions</h1>

      {/* Transcription Status */}
      {isTranscribing && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">Transcribing video... Please wait.</p>
        </div>
      )}

      {transcriptionError && (
        <div className="mb-4 p-4 bg-red-100 rounded-lg">
          <p className="text-red-800">Error: {transcriptionError}</p>
          <button
            onClick={callAssemblyAI}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Caption Style Selector */}
      {transcriptionData && transcriptionData.words && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Caption Style</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {CAPTION_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedCaptionStyle(style.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCaptionStyle === style.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={style.description}
              >
                {style.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            {CAPTION_STYLES.find((s) => s.id === selectedCaptionStyle)?.description}
          </p>
        </div>
      )}

      {/* Remotion Player Preview */}
      {transcriptionData && transcriptionData.words && getURL && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="flex justify-center bg-black rounded-lg p-4">
            <div style={{ width: "540px", height: "960px" }}>
              <Player
                // @ts-expect-error - Remotion Player type compatibility
                component={VideoWithCaptions}
                durationInFrames={Math.ceil(getVideoDuration() * 30)} 
                compositionWidth={1080}
                compositionHeight={1920}
                fps={30}
                controls
                inputProps={{
                  videoUrl: getURL,
                  words: transcriptionData.words,
                  captionStyle: selectedCaptionStyle,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Render and Download Section */}
      {transcriptionData && transcriptionData.words && (
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRender}
              disabled={isRendering}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isRendering ? `Rendering... ${Math.round(renderProgress)}%` : "Render Video"}
            </button>

            {renderedVideoUrl && (
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download Video
              </button>
            )}
          </div>

          {renderedVideoUrl && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Rendered Video</h3>
              <video
                src={renderedVideoUrl}
                controls
                className="w-full max-w-2xl mx-auto rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {!transcriptionData && !isTranscribing && !transcriptionError && (
        <div className="text-center">
          <p className="text-gray-600">Preparing transcription...</p>
        </div>
      )}
    </div>
  );
}

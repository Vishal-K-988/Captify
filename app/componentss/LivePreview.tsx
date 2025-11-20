import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BrollAssignment } from "../store/uploadStore";
import { useUploadStore } from "../store/uploadStore";

interface LivePreviewProps {
  videoUrl: string;
  assignments: BrollAssignment[];
}

export function LivePreview({ videoUrl, assignments }: LivePreviewProps) {
  const baseVideoRef = useRef<HTMLVideoElement | null>(null);
  const overlayVideoRef = useRef<HTMLVideoElement | null>(null);
  const selectionTrackRef = useRef<HTMLDivElement | null>(null);
  const { start: selectionStart, end: selectionEnd } = useUploadStore(
    (s) => s.timelineSelection
  );
  const setTimelineSelection = useUploadStore((s) => s.setTimelineSelection);

  const sortedAssignments = useMemo(
    () => [...assignments].sort((a, b) => a.start - b.start),
    [assignments]
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<BrollAssignment | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<"start" | "end" | null>(null);

  const MIN_RANGE = 0.1;

  const normalizeSelection = useCallback(
    (startValue: number, endValue: number) => {
      if (!duration || duration <= 0) {
        return { start: 0, end: 0 };
      }
      let start = Math.max(0, Math.min(startValue, duration));
      let end = Math.max(0, Math.min(endValue, duration));
      if (end - start < MIN_RANGE) {
        end = Math.min(duration, start + MIN_RANGE);
        start = Math.max(0, end - MIN_RANGE);
      }
      return { start, end };
    },
    [duration]
  );

  const normalizedSelection = useMemo(
    () =>
      normalizeSelection(
        selectionStart,
        selectionEnd > selectionStart ? selectionEnd : selectionStart + MIN_RANGE
      ),
    [selectionStart, selectionEnd, normalizeSelection]
  );

  const handleSelectionStartChange = (value: number) => {
    const next = normalizeSelection(value, normalizedSelection.end);
    setTimelineSelection(next.start, next.end);
  };

  const handleSelectionEndChange = (value: number) => {
    const next = normalizeSelection(normalizedSelection.start, value);
    setTimelineSelection(next.start, next.end);
  };

  const updateHandleFromClientX = useCallback(
    (clientX: number, handle: "start" | "end") => {
      if (!selectionTrackRef.current || !duration) {
        return;
      }
      const rect = selectionTrackRef.current.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const clampedRatio = Math.min(Math.max(0, ratio), 1);
      const newTime = clampedRatio * duration;
      if (handle === "start") {
        handleSelectionStartChange(newTime);
      } else {
        handleSelectionEndChange(newTime);
      }
    },
    [duration, handleSelectionEndChange, handleSelectionStartChange]
  );

  useEffect(() => {
    if (!draggingHandle) {
      return;
    }
    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateHandleFromClientX(event.clientX, draggingHandle);
    };
    const stopDragging = () => setDraggingHandle(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [draggingHandle, updateHandleFromClientX]);

  useEffect(() => {
    const baseVideo = baseVideoRef.current;
    const overlayVideo = overlayVideoRef.current;
    if (!baseVideo || !overlayVideo) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(baseVideo.duration || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleTimeUpdate = () => {
      const time = baseVideo.currentTime;
      setCurrentTime(time);

      const nextAssignment =
        sortedAssignments.find(
          (assignment) => time >= assignment.start && time <= assignment.end
        ) || null;

      if (
        (nextAssignment?.sceneId || null) !== (activeAssignment?.sceneId || null)
      ) {
        setActiveAssignment(nextAssignment);
      }

      if (!nextAssignment) {
        overlayVideo.pause();
        return;
      }

      if (overlayVideo.src !== nextAssignment.url) {
        overlayVideo.src = nextAssignment.url;
        overlayVideo.load();
      }

      const relativeTime = Math.max(0, time - nextAssignment.start);

      if (
        overlayVideo.readyState >= 2 &&
        Number.isFinite(overlayVideo.duration) &&
        overlayVideo.duration > 0
      ) {
        const normalizedTime = Math.min(
          overlayVideo.duration - 0.1,
          relativeTime % overlayVideo.duration
        );
        if (Math.abs(overlayVideo.currentTime - normalizedTime) > 0.25) {
          overlayVideo.currentTime = normalizedTime;
        }
      } else {
        overlayVideo.currentTime = relativeTime;
      }

      if (overlayVideo.paused) {
        overlayVideo.play().catch(() => undefined);
      }
    };

    baseVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    baseVideo.addEventListener("play", handlePlay);
    baseVideo.addEventListener("pause", handlePause);
    baseVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      baseVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      baseVideo.removeEventListener("play", handlePlay);
      baseVideo.removeEventListener("pause", handlePause);
      baseVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [activeAssignment?.sceneId, sortedAssignments]);

  const togglePlayback = () => {
    const baseVideo = baseVideoRef.current;
    if (!baseVideo) return;
    if (baseVideo.paused) {
      void baseVideo.play();
    } else {
      baseVideo.pause();
    }
  };

  const handleSeek = (value: number) => {
    const baseVideo = baseVideoRef.current;
    if (!baseVideo) return;
    baseVideo.currentTime = value;
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-white/70 p-4 shadow-sm dark:bg-zinc-900/70">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Live Preview</p>
          <p className="text-xs text-muted-foreground">
            Review B-roll placement before exporting
          </p>
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          className="rounded-full border border-border px-4 py-1 text-sm font-medium"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-black">
        <video
          ref={baseVideoRef}
          src={videoUrl}
          playsInline
          controls={false}
          className="h-full w-full object-cover"
        />

        <video
          ref={overlayVideoRef}
          playsInline
          muted
          loop
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
            activeAssignment ? "opacity-100" : "opacity-0"
          }`}
        />

        {activeAssignment && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-xs font-semibold text-white backdrop-blur">
            {activeAssignment.label} · {activeAssignment.start.toFixed(1)}s –
            {activeAssignment.end.toFixed(1)}s
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{currentTime.toFixed(2)}s</span>
          <span>{duration ? `${duration.toFixed(2)}s` : "..."}</span>
        </div>
      </div>

      {duration > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Select Range</p>
            <p className="text-xs text-muted-foreground">
              Used as default B-roll timeframe
            </p>
          </div>
          <div
            ref={selectionTrackRef}
            className="relative h-4 cursor-pointer select-none"
            onClick={(event) => {
              if (!duration) return;
              if (!selectionTrackRef.current) return;
              const rect = selectionTrackRef.current.getBoundingClientRect();
              const ratio = (event.clientX - rect.left) / rect.width;
              const newTime = Math.min(Math.max(0, ratio * duration), duration);
              const distanceToStart = Math.abs(newTime - normalizedSelection.start);
              const distanceToEnd = Math.abs(newTime - normalizedSelection.end);
              if (distanceToStart <= distanceToEnd) {
                handleSelectionStartChange(newTime);
              } else {
                handleSelectionEndChange(newTime);
              }
            }}
          >
            <div className="absolute inset-0 rounded-full bg-muted" />
            <div
              className="absolute h-full rounded-full bg-primary/40"
              style={{
                left: `${(normalizedSelection.start / duration) * 100}%`,
                width: `${
                  ((normalizedSelection.end - normalizedSelection.start) / duration) * 100
                }%`,
              }}
            />
            <div
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize rounded-full border-2 border-white bg-primary shadow"
              style={{ left: `${(normalizedSelection.start / duration) * 100}%` }}
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingHandle("start");
              }}
            />
            <div
              className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-ew-resize rounded-full border-2 border-white bg-primary shadow"
              style={{ left: `${(normalizedSelection.end / duration) * 100}%` }}
              onPointerDown={(event) => {
                event.preventDefault();
                setDraggingHandle("end");
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{normalizedSelection.start.toFixed(2)}s</span>
            <span>{normalizedSelection.end.toFixed(2)}s</span>
          </div>
        </div>
      )}

      {sortedAssignments.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {sortedAssignments.map((assignment) => (
            <button
              key={`jump-${assignment.sceneId}`}
              type="button"
              onClick={() => handleSeek(assignment.start)}
              className="rounded-full border border-border px-3 py-1 font-semibold hover:border-primary"
            >
              {assignment.label ?? assignment.sceneId} (
              {assignment.start.toFixed(1)}s)
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { useUploadStore } from "../store/uploadStore";
import type { SceneMarker, BrollAssignment } from "../store/uploadStore";
import { Keyword } from "./KeyWord";
import { OrientationDropDown } from "./Orientation";
import { SizeDropDown } from "./Size";
import type { PexelsVideoFile } from "@/lib/pexels";

interface SceneActionModalProps {
  marker: SceneMarker;
  assignment?: BrollAssignment;
  pexelsVideos: PexelsVideoFile[];
  videoDuration: number;
  onClose: () => void;
  onSearch: () => void;
  onSelectVideo: (file: PexelsVideoFile, start: number, end: number) => void;
}

export function SceneActionModal({
  marker,
  assignment,
  pexelsVideos,
  videoDuration,
  onClose,
  onSearch,
  onSelectVideo,
}: SceneActionModalProps) {
  const safeDuration =
    Number.isFinite(videoDuration) && videoDuration > 0
      ? videoDuration
      : marker.end || marker.start || 0;

  const MIN_RANGE = 0.1;

  const timelineSelection = useUploadStore((s) => s.timelineSelection);
  const setTimelineSelection = useUploadStore((s) => s.setTimelineSelection);
  const selectionValid =
    timelineSelection.end - timelineSelection.start >= MIN_RANGE;

  const clamp = useCallback(
    (value: number) => Math.min(Math.max(0, value), safeDuration),
    [safeDuration]
  );

  useEffect(() => {
    if (!selectionValid) {
      setTimelineSelection(marker.start, marker.end);
    }
  }, [selectionValid, marker.start, marker.end, setTimelineSelection]);

  const startTime = selectionValid
    ? timelineSelection.start
    : marker.start;
  const endTime = selectionValid ? timelineSelection.end : marker.end;

  const timeError =
    startTime >= endTime ? "Start time must be less than end time." : null;

  const handleStartChange = (value: number) => {
    const nextStart = clamp(value);
    let nextEnd = endTime;
    if (nextStart >= nextEnd - MIN_RANGE) {
      nextEnd = clamp(nextStart + MIN_RANGE);
    }
    setTimelineSelection(nextStart, nextEnd);
  };

  const handleEndChange = (value: number) => {
    const nextEnd = clamp(value);
    let nextStart = startTime;
    if (nextEnd <= nextStart + MIN_RANGE) {
      nextStart = clamp(nextEnd - MIN_RANGE);
      setTimelineSelection(nextStart, clamp(nextEnd));
    } else {
      setTimelineSelection(nextStart, nextEnd);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              B-roll
            </p>
            <h3 className="mt-1 text-2xl font-bold text-foreground">B-roll</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-3 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          {assignment ? (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
              <p className="text-xs font-semibold uppercase tracking-wide">Current selection</p>
              <p className="text-sm font-medium">
                {assignment.source.toUpperCase()} clip attached
              </p>
            </div>
          ) : (
            <p>
              Set up your B-roll search parameters. You can search Pexels directly from this panel
              and preview the results here before assigning one to the scene.
            </p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-sm font-semibold text-foreground">Timeframe (seconds)</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Start
              </label>
              <input
                type="number"
                min={0}
                max={safeDuration.toFixed(2)}
                value={startTime.toFixed(2)}
                onChange={(e) => handleStartChange(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                End
              </label>
              <input
                type="number"
                min={0}
                max={safeDuration.toFixed(2)}
                value={endTime.toFixed(2)}
                onChange={(e) => handleEndChange(parseFloat(e.target.value) || 0)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          {timeError && (
            <p className="mt-2 text-xs font-medium text-destructive">{timeError}</p>
          )}
        </div>

        <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Keyword />
            <OrientationDropDown />
            <SizeDropDown />
          </div>
          <Button
            type="button"
            className="w-full"
            onClick={onSearch}
          >
            Search Pexels
          </Button>
        </div>

        {pexelsVideos.length > 0 && (
          <div className="mt-6 max-h-80 overflow-y-auto">
            <div className="grid gap-4 sm:grid-cols-2">
              {pexelsVideos.map((file) => (
                <button
                  key={`modal-video-${file.id}-${file.quality}`}
                  type="button"
                  disabled={Boolean(timeError)}
                  onClick={() => {
                    if (!timeError) {
                      onSelectVideo(file, startTime, endTime);
                      onClose();
                    }
                  }}
                  className="w-full rounded-xl border border-border bg-white p-3 text-left shadow-sm transition hover:border-primary/60 dark:bg-zinc-900"
                >
                  <div className="w-full aspect-9/16 overflow-hidden rounded-lg bg-black">
                    <video
                      src={file.link}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-2 text-sm">
                    <p className="font-semibold text-foreground">
                      {file.quality.toUpperCase()} · {file.width}×{file.height}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


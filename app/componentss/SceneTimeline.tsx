import { useState } from "react";
import type { SceneMarker, BrollAssignment } from "../store/uploadStore";

const formatTimestamp = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};

interface SceneTimelineProps {
  markers: SceneMarker[];
  duration: number;
  onSelect?: (marker: SceneMarker) => void;
  assignedScenes?: Record<string, BrollAssignment>;
}

export function SceneTimeline({
  markers,
  duration,
  onSelect,
  assignedScenes,
}: SceneTimelineProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!markers || markers.length === 0 || !duration || duration <= 0) {
    return null;
  }

  const selectMarker = (marker: SceneMarker) => {
    setActiveId(marker.id);
    onSelect?.(marker);
  };

  return (
    <div className="w-full space-y-6 rounded-2xl border border-border bg-white/80 p-6 shadow-sm dark:bg-zinc-900/70">
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>0:00</span>
          <span>{formatTimestamp(duration)}</span>
        </div>
        <div className="relative mt-2 h-3 w-full rounded-full bg-muted">
          {markers.map((marker) => {
            const startPercent = Math.max(
              0,
              Math.min(100, (marker.start / duration) * 100)
            );
            const widthPercent = Math.max(
              2,
              Math.min(
                100,
                ((marker.end - marker.start) / duration) * 100
              )
            );
            return (
              <button
                key={marker.id}
                type="button"
                className={`absolute top-0 h-full rounded-full transition ${
                  activeId === marker.id
                    ? "bg-primary shadow-lg"
                    : "bg-primary/60 hover:bg-primary/80"
                }`}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
                onClick={() => selectMarker(marker)}
                aria-label={`Scene from ${formatTimestamp(
                  marker.start
                )} to ${formatTimestamp(marker.end)}`}
              />
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {markers.map((marker) => {
          const isActive = activeId === marker.id;
          return (
            <button
              key={`card-${marker.id}`}
              type="button"
              onClick={() => selectMarker(marker)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>{marker.source}</span>
                {marker.confidence != null && (
                  <span>{Math.round(marker.confidence)}%</span>
                )}
              </div>
              {assignedScenes && assignedScenes[marker.id] && (
                <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  B-roll linked
                </span>
              )}
              <p className="mt-2 text-base font-semibold text-foreground line-clamp-2">
                {marker.label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatTimestamp(marker.start)} — {formatTimestamp(marker.end)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}


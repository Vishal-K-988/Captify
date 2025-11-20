import { useState } from "react";
import type { SceneMarker, BrollAssignment } from "../store/uploadStore";

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
              <p className="mt-2 text-base font-semibold text-foreground">B-roll</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}


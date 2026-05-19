import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Zone = { label: string; tz: string };

const ZONES: Zone[] = [
  { label: "San Francisco", tz: "America/Los_Angeles" },
  { label: "New York", tz: "America/New_York" },
  { label: "Londra", tz: "Europe/London" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "İstanbul", tz: "Europe/Istanbul" },
  { label: "Dubai", tz: "Asia/Dubai" },
  { label: "Astana", tz: "Asia/Almaty" },
  { label: "Şanghay", tz: "Asia/Shanghai" },
  { label: "Tokyo", tz: "Asia/Tokyo" },
  { label: "Sydney", tz: "Australia/Sydney" },
];

const formatTime = (tz: string, now: Date) =>
  new Intl.DateTimeFormat("tr-TR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

const WorldClocksBand = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 px-1 mb-2">
        <Clock className="h-4 w-4 text-primary" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Dünya Saatleri
        </h2>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-500 tabular-nums">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          CANLI
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {ZONES.map((z) => (
          <div
            key={z.tz}
            title={z.tz}
            className="shrink-0 snap-start flex flex-col items-center justify-center rounded-md border border-emerald-500/20 bg-slate-950 px-1.5 py-0.5 shadow-[inset_0_0_8px_rgba(16,185,129,0.08)]"
          >
            <span className="text-[7px] font-semibold uppercase tracking-[0.12em] text-emerald-400/70">
              {z.label}
            </span>
            <span
              className="text-[10px] font-bold tabular-nums text-emerald-400 tracking-wider"
              style={{
                fontFamily:
                  "'JetBrains Mono', 'Courier New', ui-monospace, monospace",
                textShadow: "0 0 6px rgba(16,185,129,0.55)",
              }}
            >
              {formatTime(z.tz, now)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClocksBand;

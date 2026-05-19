import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Zone = { flag: string; label: string; tz: string };

const ZONES: Zone[] = [
  { flag: "🇹🇷", label: "Türkiye", tz: "Europe/Istanbul" },
  { flag: "🇩🇪", label: "Almanya", tz: "Europe/Berlin" },
  { flag: "🇳🇱", label: "Hollanda", tz: "Europe/Amsterdam" },
  { flag: "🇫🇷", label: "Fransa", tz: "Europe/Paris" },
  { flag: "🇬🇧", label: "İngiltere", tz: "Europe/London" },
  { flag: "🇸🇪", label: "İsveç", tz: "Europe/Stockholm" },
  { flag: "🇧🇪", label: "Belçika", tz: "Europe/Brussels" },
  { flag: "🇦🇹", label: "Avusturya", tz: "Europe/Vienna" },
  { flag: "🇨🇭", label: "İsviçre", tz: "Europe/Zurich" },
  { flag: "🇮🇹", label: "İtalya", tz: "Europe/Rome" },
  { flag: "🇪🇸", label: "İspanya", tz: "Europe/Madrid" },
  { flag: "🇵🇹", label: "Portekiz", tz: "Europe/Lisbon" },
  { flag: "🇦🇪", label: "BAE", tz: "Asia/Dubai" },
  { flag: "🇺🇸", label: "ABD (NY)", tz: "America/New_York" },
  { flag: "🇺🇸", label: "ABD (LA)", tz: "America/Los_Angeles" },
  { flag: "🇨🇦", label: "Kanada", tz: "America/Toronto" },
  { flag: "🇦🇺", label: "Avustralya", tz: "Australia/Sydney" },
  { flag: "🇯🇵", label: "Japonya", tz: "Asia/Tokyo" },
];

const formatTime = (tz: string, now: Date) =>
  new Intl.DateTimeFormat("tr-TR", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);

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
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ülkelerden Saatler</h2>
        <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">Canlı · güncellenir</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {ZONES.map((z) => (
          <div
            key={z.tz}
            className="shrink-0 snap-start flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-1.5 hover:border-primary/40 transition-colors"
            title={z.tz}
          >
            <span className="text-base leading-none" aria-hidden="true">{z.flag}</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">{z.label}</span>
              <span className="text-sm font-bold tabular-nums text-foreground">{formatTime(z.tz, now)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClocksBand;

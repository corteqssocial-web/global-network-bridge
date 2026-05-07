import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ComposableMap, Geographies, Geography, Marker, Line,
} from "react-simple-maps";
import { ArrowLeft, MapPin, Sparkles, Users, Globe2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * 19 Mayıs Global Diaspora Haritası
 * Standalone animated world map – CorteQS palette.
 * Not the platform's /map. Landing-only experience.
 */

// World TopoJSON (Natural Earth, public CDN)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Ankara as the symbolic radiating origin for animated arcs.
const ORIGIN: [number, number] = [32.85, 39.93];

// Seed cities — major Turkish diaspora hubs (lng, lat).
// Coordinates are well-known approximations.
type Seed = { name: string; coords: [number, number]; country: string };
const SEED_CITIES: Seed[] = [
  { name: "Berlin",     coords: [13.40, 52.52], country: "Almanya" },
  { name: "Londra",     coords: [-0.13, 51.51], country: "Birleşik Krallık" },
  { name: "Paris",      coords: [2.35, 48.85],  country: "Fransa" },
  { name: "Amsterdam",  coords: [4.90, 52.37],  country: "Hollanda" },
  { name: "Brüksel",    coords: [4.35, 50.85],  country: "Belçika" },
  { name: "Viyana",     coords: [16.37, 48.21], country: "Avusturya" },
  { name: "Stockholm",  coords: [18.07, 59.33], country: "İsveç" },
  { name: "Kopenhag",   coords: [12.57, 55.68], country: "Danimarka" },
  { name: "Zürih",      coords: [8.54, 47.37],  country: "İsviçre" },
  { name: "Roma",       coords: [12.50, 41.90], country: "İtalya" },
  { name: "Madrid",     coords: [-3.70, 40.42], country: "İspanya" },
  { name: "Atina",      coords: [23.73, 37.98], country: "Yunanistan" },
  { name: "Lefkoşa",    coords: [33.38, 35.19], country: "KKTC" },
  { name: "Bakü",       coords: [49.87, 40.41], country: "Azerbaycan" },
  { name: "Doha",       coords: [51.53, 25.29], country: "Katar" },
  { name: "Dubai",      coords: [55.30, 25.20], country: "BAE" },
  { name: "Riyad",      coords: [46.72, 24.71], country: "Suudi Arabistan" },
  { name: "Kahire",     coords: [31.24, 30.04], country: "Mısır" },
  { name: "Johannesburg", coords: [28.04, -26.20], country: "Güney Afrika" },
  { name: "Lagos",      coords: [3.38, 6.52],   country: "Nijerya" },
  { name: "New York",   coords: [-74.00, 40.71], country: "ABD" },
  { name: "Washington", coords: [-77.04, 38.91], country: "ABD" },
  { name: "Los Angeles",coords: [-118.24, 34.05], country: "ABD" },
  { name: "Chicago",    coords: [-87.65, 41.88], country: "ABD" },
  { name: "Toronto",    coords: [-79.38, 43.65], country: "Kanada" },
  { name: "Montreal",   coords: [-73.57, 45.50], country: "Kanada" },
  { name: "São Paulo",  coords: [-46.63, -23.55], country: "Brezilya" },
  { name: "Buenos Aires", coords: [-58.38, -34.60], country: "Arjantin" },
  { name: "Mexico City",coords: [-99.13, 19.43], country: "Meksika" },
  { name: "Tokyo",      coords: [139.69, 35.69], country: "Japonya" },
  { name: "Seul",       coords: [126.98, 37.57], country: "Güney Kore" },
  { name: "Pekin",      coords: [116.40, 39.90], country: "Çin" },
  { name: "Singapur",   coords: [103.82, 1.35],  country: "Singapur" },
  { name: "Bangkok",    coords: [100.50, 13.75], country: "Tayland" },
  { name: "Sidney",     coords: [151.21, -33.87], country: "Avustralya" },
  { name: "Melbourne",  coords: [144.96, -37.81], country: "Avustralya" },
  { name: "Auckland",   coords: [174.76, -36.85], country: "Yeni Zelanda" },
  { name: "Moskova",    coords: [37.62, 55.76],  country: "Rusya" },
  { name: "Astana",     coords: [71.45, 51.18],  country: "Kazakistan" },
  { name: "Taşkent",    coords: [69.24, 41.31],  country: "Özbekistan" },
];

type LivePin = {
  id: string;
  full_name: string | null;
  country: string | null;
  city: string | null;
  message: string | null;
};

const TURQUOISE = "hsl(174, 72%, 46%)";
const TURQUOISE_LIGHT = "hsl(174, 65%, 56%)";
const PRIMARY = "hsl(14, 85%, 55%)";
const NAVY = "hsl(220, 30%, 12%)";

const May19Map = () => {
  const [livePins, setLivePins] = useState<LivePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("may19_submissions")
        .select("id, full_name, country, city, message")
        .eq("kind", "map_pin")
        .eq("status", "approved")
        .eq("show_on_map", true)
        .limit(500);
      setLivePins(data ?? []);
      setLoading(false);
    })();
  }, []);

  // Stagger arc animations
  const arcs = useMemo(
    () => SEED_CITIES.map((c, i) => ({ ...c, delay: (i * 120) % 4000 })),
    [],
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Header bar */}
      <header className="relative pt-20 pb-6 bg-gradient-hero border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Link to="/19-mayis" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3">
                <ArrowLeft className="h-3.5 w-3.5" /> 19 Mayıs Buluşması
              </Link>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise/15 border border-turquoise/30 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-turquoise" />
                <span className="text-xs font-semibold text-turquoise">Canlı Yayın · 5 Kıta · 19 Saat</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                19 Mayıs <span className="text-gradient-primary">Global Diaspora Haritası</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl font-body">
                Dünyanın dört bir yanındaki Türkler aynı anda burada. Şehrini ekle, haritada parlamaya başla.
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Link to="/19-mayis#modules">
                <Button size="lg" className="bg-turquoise hover:bg-turquoise-light text-primary-foreground gap-2">
                  <MapPin className="h-4 w-4" /> Haritada Yerimi İşaretle
                </Button>
              </Link>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-turquoise" /> {arcs.length}+ Şehir</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> {livePins.length} Canlı Pin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Map area */}
      <main className="flex-1 relative bg-[hsl(220,30%,8%)] overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{ background: TURQUOISE }} />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full blur-3xl opacity-15"
            style={{ background: PRIMARY }} />
          {/* Star field */}
          <svg className="absolute inset-0 w-full h-full opacity-40" aria-hidden>
            <defs>
              <pattern id="stars" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <circle cx="20"  cy="30" r="0.6" fill="white" opacity="0.6"/>
                <circle cx="80"  cy="60" r="0.4" fill="white" opacity="0.4"/>
                <circle cx="50"  cy="100" r="0.5" fill="white" opacity="0.5"/>
                <circle cx="100" cy="20" r="0.3" fill="white" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)"/>
          </svg>
        </div>

        {loading && (
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2 text-xs text-white/70 bg-white/5 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Canlı pinler yükleniyor…
          </div>
        )}

        <div className="relative w-full" style={{ height: "min(78vh, 820px)" }}>
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 175 }}
            style={{ width: "100%", height: "100%" }}
          >
            {/* Subtle ocean gradient via background already; geographies = land */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="hsl(220, 25%, 16%)"
                    stroke="hsl(174, 72%, 46% / 0.25)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover:   { fill: "hsl(220, 25%, 22%)", outline: "none", transition: "fill 0.3s" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Animated arcs from origin to each seed city */}
            {arcs.map((c) => (
              <Line
                key={`arc-${c.name}`}
                from={ORIGIN}
                to={c.coords}
                stroke={TURQUOISE_LIGHT}
                strokeWidth={0.6}
                strokeOpacity={0.35}
                strokeLinecap="round"
                strokeDasharray="2 4"
                style={{
                  animation: `dashFlow 6s linear infinite`,
                  animationDelay: `${c.delay}ms`,
                } as React.CSSProperties}
              />
            ))}

            {/* Origin – Türkiye */}
            <Marker coordinates={ORIGIN}>
              <circle r={9} fill={PRIMARY} opacity={0.25}>
                <animate attributeName="r" from="6" to="22" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.55" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle r={5} fill={PRIMARY} stroke="white" strokeWidth={1.5} />
              <text y={-12} textAnchor="middle" style={{ fontFamily: "Plus Jakarta Sans", fontSize: 10, fontWeight: 700, fill: "white" }}>
                Türkiye
              </text>
            </Marker>

            {/* Seed city pulses */}
            {arcs.map((c, i) => (
              <Marker key={c.name} coordinates={c.coords}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle r={3} fill={TURQUOISE} opacity={0.35}>
                  <animate attributeName="r" from="2" to="10" dur="2.6s" begin={`${(i % 18) * 0.18}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.55" to="0" dur="2.6s" begin={`${(i % 18) * 0.18}s`} repeatCount="indefinite" />
                </circle>
                <circle r={2.4} fill={TURQUOISE_LIGHT} stroke="white" strokeWidth={0.6}
                  style={{ cursor: "pointer", filter: hovered === c.name ? "drop-shadow(0 0 6px white)" : undefined }} />
                {hovered === c.name && (
                  <g>
                    <rect x={6} y={-14} rx={4} ry={4} width={Math.max(48, c.name.length * 6 + 18)} height={18} fill={NAVY} opacity={0.92} />
                    <text x={12} y={-2} style={{ fontFamily: "Inter", fontSize: 9, fontWeight: 600, fill: "white" }}>
                      {c.name} · {c.country}
                    </text>
                  </g>
                )}
              </Marker>
            ))}

            {/* Live submitted pins (gold, slightly larger) – plotted only if we can resolve coords */}
            {livePins.map((p) => {
              const seed = SEED_CITIES.find(
                (s) => s.name.toLowerCase() === (p.city || "").toLowerCase(),
              );
              if (!seed) return null;
              return (
                <Marker key={p.id} coordinates={seed.coords}>
                  <circle r={3} fill="hsl(40, 90%, 55%)" opacity={0.9}>
                    <animate attributeName="r" from="3" to="9" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.9" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 rounded-full px-4 py-2 text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: PRIMARY, boxShadow: `0 0 8px ${PRIMARY}` }} /> Türkiye
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: TURQUOISE, boxShadow: `0 0 8px ${TURQUOISE}` }} /> Diaspora şehri
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(40,90%,55%)", boxShadow: "0 0 8px hsl(40,90%,55%)" }} /> Canlı katılımcı
            </span>
          </div>
          <p className="text-white/50">
            19 Mayıs · 19.00 TR · 19 saat canlı yayın · 5 kıta
          </p>
        </div>
      </main>

      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -120; }
        }
      `}</style>
    </div>
  );
};

export default May19Map;

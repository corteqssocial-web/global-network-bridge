import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Rocket, Sparkles, TrendingUp, Users, Building2, GraduationCap, Lightbulb,
  HandCoins, Briefcase, Megaphone, Search, Send, ShieldCheck, Eye,
  Calendar, MapPin, ExternalLink, MessageSquare, Star, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CountryCitySelector from "@/components/CountryCitySelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useDiaspora } from "@/contexts/DiasporaContext";
import { bloggers } from "@/data/mock";

type SegmentKey =
  | "girisimci" | "melek" | "vc" | "kulucka" | "mentor" | "servis"
  | "fon" | "corp" | "talent" | "etkinlik" | "medya" | "scout";

const segments: { key: SegmentKey; label: string; icon: any; color: string; desc: string }[] = [
  { key: "girisimci", label: "Girişimciler", icon: Rocket, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30", desc: "Erken aşamadan büyüme aşamasına startup kurucuları" },
  { key: "melek", label: "Melek Yatırımcılar", icon: Sparkles, color: "text-amber-600 bg-amber-500/10 border-amber-500/30", desc: "Pre-seed / seed yatırım yapan bireysel yatırımcılar" },
  { key: "vc", label: "VC & Fonlar", icon: TrendingUp, color: "text-primary bg-primary/10 border-primary/30", desc: "Risk sermayesi şirketleri ve girişim fonları" },
  { key: "kulucka", label: "Kuluçka & Hızlandırıcılar", icon: Building2, color: "text-turquoise bg-turquoise/10 border-turquoise/30", desc: "Inkübatör, akselatör ve teknopark programları" },
  { key: "mentor", label: "Mentorlar", icon: GraduationCap, color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/30", desc: "Sektör ve yolculuk mentörleri, eski kurucular" },
  { key: "servis", label: "Startup Servisleri", icon: Briefcase, color: "text-blue-600 bg-blue-500/10 border-blue-500/30", desc: "Hukuk, finans, pazarlama, ürün, dev shop'lar" },
  { key: "fon", label: "Fon & Hibeler", icon: HandCoins, color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/30", desc: "Hibe programları, devlet fonları, EU grants" },
  { key: "corp", label: "Corporate Innovation", icon: Building2, color: "text-slate-600 bg-slate-500/10 border-slate-500/30", desc: "Kurumsal inovasyon, CVC ve venture client ekipleri" },
  { key: "talent", label: "Startup Talent", icon: Users, color: "text-rose-600 bg-rose-500/10 border-rose-500/30", desc: "Startup'ta çalışmak isteyen yetenekler" },
  { key: "etkinlik", label: "Etkinlikler", icon: Megaphone, color: "text-orange-600 bg-orange-500/10 border-orange-500/30", desc: "Demo Day'ler, pitch geceleri, zirveler" },
  { key: "medya", label: "Medya & İçerik", icon: Megaphone, color: "text-pink-600 bg-pink-500/10 border-pink-500/30", desc: "Startup gazeteciliği, podcast ve içerik üreticileri" },
  { key: "scout", label: "Startup Scout'lar", icon: Eye, color: "text-purple-600 bg-purple-500/10 border-purple-500/30", desc: "Yatırım fonları adına deal scout'luğu yapanlar" },
];

const VentureHub = () => {
  const { toast } = useToast();
  const { selectedCountry } = useDiaspora();
  const [filterCity, setFilterCity] = useState("all");
  const [activeSegment, setActiveSegment] = useState<SegmentKey | "all">("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", segment: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [openSegment, setOpenSegment] = useState<SegmentKey | null>(null);
  const [contact, setContact] = useState({ name: "", email: "", note: "" });

  const visibleSegments = useMemo(
    () => segments.filter((s) =>
      activeSegment === "all" ? true : s.key === activeSegment,
    ).filter((s) =>
      !search ? true : (s.label + " " + s.desc).toLowerCase().includes(search.toLowerCase()),
    ),
    [activeSegment, search],
  );

  const handleInterest = async () => {
    if (!form.email) {
      toast({ title: "E-posta gerekli", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("interest_registrations").insert({
        category: "venture_hub",
        name: form.name || null,
        email: form.email,
        role: form.segment || null,
        message: form.note || null,
        source: "venture-hub-page",
      });
      toast({ title: "Kaydın alındı 🚀", description: "Venture Hub açıldığında ilk sen haberdar olacaksın." });
      setForm({ name: "", email: "", segment: "", note: "" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      toast({ title: "Gönderilemedi", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const activeSeg = openSegment ? segments.find((s) => s.key === openSegment) : null;

  const handleSegmentContact = async () => {
    if (!openSegment) return;
    if (!contact.email) {
      toast({ title: "E-posta gerekli", variant: "destructive" });
      return;
    }
    try {
      await supabase.from("interest_registrations").insert({
        category: "venture_hub",
        name: contact.name || null,
        email: contact.email,
        role: activeSeg?.label || openSegment,
        message: contact.note || null,
        country: selectedCountry !== "all" ? selectedCountry : null,
        city: filterCity !== "all" ? filterCity : null,
        source: `venture-hub:${openSegment}`,
      });
      toast({ title: "İlgi bildirimin alındı 🚀", description: `${activeSeg?.label} kategorisinde sana ulaşacağız.` });
      setContact({ name: "", email: "", note: "" });
      setOpenSegment(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
      toast({ title: "Gönderilemedi", description: msg, variant: "destructive" });
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 via-primary/10 to-turquoise/10 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-emerald-500/15 text-emerald-700 border-0"><Rocket className="h-3 w-3 mr-1" /> Venture Hub</Badge>
              <Badge variant="outline" className="border-gold/40 text-gold-foreground bg-gold/10">Girişim & Yatırım</Badge>
              <Badge className="bg-amber-500/15 text-amber-700 border-0">DEMO</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
              Fikrini, sermayeni, mentorluğunu ve pazar bağlantını <span className="text-gradient-primary">CorteQS Venture Hub</span>'da buluştur.
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
              Global Türk girişimcileri, yatırımcıları, mentorları ve ekosistem aktörleri için buluşma alanı.
              Yatırım, mentor, ekip, pazar, müşteri ve global bağlantı ihtiyaçlarını doğru kişilerle eşleştirir.
            </p>
          </section>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
            <div className="flex-1 min-w-0">
              <CountryCitySelector city={filterCity} onCityChange={setFilterCity} />
            </div>
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Segment, isim, sektör..." className="pl-9 h-10" />
            </div>
          </div>

          {/* Segment chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            <Button size="sm" variant={activeSegment === "all" ? "default" : "outline"} onClick={() => setActiveSegment("all")}>Tümü</Button>
            {segments.map((s) => (
              <Button
                key={s.key}
                size="sm"
                variant={activeSegment === s.key ? "default" : "outline"}
                onClick={() => setActiveSegment(s.key)}
                className="gap-1.5"
              >
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </Button>
            ))}
          </div>

          {/* Segment grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
            {visibleSegments.map((s) => (
              <Card
                key={s.key}
                onClick={() => { setOpenSegment(s.key); setContact({ name: "", email: "", note: "" }); }}
                className="p-4 hover:shadow-card hover:border-primary/40 transition-all relative cursor-pointer group"
              >
                <Badge className="absolute top-2 right-2 bg-amber-500/15 text-amber-700 border-0 text-[10px]">DEMO</Badge>
                <div className={`w-10 h-10 rounded-lg border ${s.color} flex items-center justify-center mb-3`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{s.label}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{s.desc}</p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>⭐ Google Rating</span>
                  <span className="inline-flex items-center gap-0.5 text-primary group-hover:translate-x-0.5 transition-transform">
                    Detay <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Interest form */}
          <section className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <Badge className="bg-emerald-500/15 text-emerald-700 border-0 mb-1">Erken Erişim</Badge>
                <h2 className="text-lg md:text-xl font-bold">Venture Hub'a Erken Kayıt Ol</h2>
                <p className="text-sm text-muted-foreground">Profilini öne çıkar, doğru taraflarla eşleş. Açılışta sana özel listede yer al.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Ad Soyad / Şirket</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Adınız veya şirket adınız" />
              </div>
              <div>
                <Label className="text-xs">E-posta *</Label>
                <Input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="ornek@mail.com" />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Hangi segment?</Label>
                <Input value={form.segment} onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))} placeholder="Örn: Melek Yatırımcı, VC, Kurucu, Mentor..." />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Kısa not</Label>
                <Textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} placeholder="Ne arıyorsun? Ne sunuyorsun?" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Button onClick={handleInterest} disabled={submitting} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="h-4 w-4" /> {submitting ? "Gönderiliyor..." : "Erken Kayıt Ol"}
              </Button>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> KVKK / GDPR uyumlu, istediğin zaman silebilirsin.
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Segment detail dialog */}
      <Dialog open={openSegment !== null} onOpenChange={(o) => !o && setOpenSegment(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {activeSeg && (() => {
            const SegIcon = activeSeg.icon;
            return (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg border ${activeSeg.color} inline-flex items-center justify-center`}>
                    <SegIcon className="h-4 w-4" />
                  </span>
                  {activeSeg.label}
                  <Badge className="ml-2 bg-amber-500/15 text-amber-700 border-0 text-[10px]">DEMO</Badge>
                </DialogTitle>
                <DialogDescription>{activeSeg.desc}</DialogDescription>
              </DialogHeader>

              <SegmentDetailBody
                segmentKey={openSegment!}
                segmentLabel={activeSeg.label}
                country={selectedCountry}
                city={filterCity}
                contact={contact}
                setContact={setContact}
                onSubmit={handleSegmentContact}
              />

              <DialogFooter className="text-[11px] text-muted-foreground flex sm:justify-start">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> KVKK / GDPR uyumlu — istediğin zaman silebilirsin.
              </DialogFooter>
            </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

/* -------------------- Segment detail body -------------------- */

interface SegmentDetailBodyProps {
  segmentKey: SegmentKey;
  segmentLabel: string;
  country: string;
  city: string;
  contact: { name: string; email: string; note: string };
  setContact: React.Dispatch<React.SetStateAction<{ name: string; email: string; note: string }>>;
  onSubmit: () => void;
}

const SegmentDetailBody = ({ segmentKey, segmentLabel, country, city, contact, setContact, onSubmit }: SegmentDetailBodyProps) => {
  if (segmentKey === "etkinlik") return <EventsByLocation country={country} city={city} />;
  if (segmentKey === "medya") return <MediaByLocation country={country} city={city} />;

  // Default CTA panel for the other segments
  return (
    <div className="space-y-4">
      <Card className="p-3 bg-muted/30 border-dashed">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Filtre:</span>
          <Badge variant="outline" className="text-[10px]">{country === "all" ? "Tüm Ülkeler" : country}</Badge>
          <Badge variant="outline" className="text-[10px]">{city === "all" ? "Tüm Şehirler" : city}</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {segmentCtas(segmentKey).map((c, i) => (
          <a key={i} href={c.href} className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors">
            <c.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium">{c.label}</div>
              <div className="text-[11px] text-muted-foreground line-clamp-2">{c.desc}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Send className="h-4 w-4 text-emerald-600" />
          <h4 className="font-semibold text-sm">{segmentLabel} için ilgini bildir</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Açıldığında bu kategoride sana özel eşleşmeleri ve davetleri gönderelim.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input placeholder="Ad Soyad / Şirket" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
          <Input placeholder="E-posta *" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
          <Textarea className="sm:col-span-2" rows={2} placeholder="Kısa not: ne arıyorsun, ne sunuyorsun?" value={contact.note} onChange={(e) => setContact((c) => ({ ...c, note: e.target.value }))} />
        </div>
        <div className="flex justify-end mt-3">
          <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSubmit}>
            <Send className="h-3.5 w-3.5" /> Gönder
          </Button>
        </div>
      </div>
    </div>
  );
};

const segmentCtas = (key: SegmentKey): { icon: any; label: string; desc: string; href: string }[] => {
  const base = [
    { icon: Calendar, label: "Etkinlikleri Gör", desc: "Bu segmente ait demo day, pitch ve toplulukları gör.", href: "/events" },
    { icon: Briefcase, label: "İş Fırsatları", desc: "Startup pozisyonları ve iş ilanları.", href: "/is-ilanlari" },
  ];
  if (key === "talent") return [
    { icon: Briefcase, label: "Açık Pozisyonlar", desc: "Türk startup'larındaki ilanları keşfet.", href: "/is-ilanlari" },
    { icon: Users, label: "Topluluk", desc: "Startup yeteneklerinin buluştuğu akışa katıl.", href: "/feed" },
  ];
  if (key === "mentor") return [
    { icon: GraduationCap, label: "Mentor Profilleri", desc: "Gönüllü mentorlar ve danışmanlar.", href: "/consultants" },
    { icon: MessageSquare, label: "Mentor Talebi Aç", desc: "AI destekli hizmet talebi oluştur.", href: "/relocation" },
  ];
  if (key === "servis") return [
    { icon: Briefcase, label: "Danışmanlar", desc: "Hukuk, finans, pazarlama, ürün danışmanları.", href: "/consultants" },
    { icon: Building2, label: "Türk İşletmeleri", desc: "Servis sağlayan global Türk şirketleri.", href: "/businesses" },
  ];
  if (key === "kulucka") return [
    { icon: Building2, label: "Kuluçka & Hızlandırıcılar", desc: "Kuruluşlar dizininde inkübatörleri gör.", href: "/associations" },
    ...base,
  ];
  if (key === "vc" || key === "melek" || key === "fon" || key === "scout") return [
    { icon: TrendingUp, label: "Yatırımcı Topluluğu", desc: "Yatırımcılarla doğrudan iletişime geç.", href: "/diaspora-people" },
    ...base,
  ];
  if (key === "corp") return [
    { icon: Building2, label: "Kurumsal Diziniş", desc: "Kurumsal inovasyon ekiplerini incele.", href: "/businesses" },
    ...base,
  ];
  return [
    { icon: Rocket, label: "Girişimciler", desc: "Diaspora kurucularının profilleri.", href: "/diaspora-people" },
    ...base,
  ];
};

/* -------------------- Events pulled from main events table -------------------- */

const EventsByLocation = ({ country, city }: { country: string; city: string }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("events")
        .select("id,title,description,event_date,start_time,city,country,location,online_url,type,category,registration_url,price")
        .eq("status", "published")
        .gte("event_date", new Date().toISOString().slice(0, 10))
        .order("event_date", { ascending: true })
        .limit(20);
      if (country !== "all") q = q.eq("country", country);
      if (city !== "all") q = q.eq("city", city);
      const { data } = await q;
      if (!cancelled) {
        setEvents(data || []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [country, city]);

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-muted/30 border-dashed flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>Platformdaki etkinliklerden çekiliyor:</span>
        <Badge variant="outline" className="text-[10px]">{country === "all" ? "Tüm Ülkeler" : country}</Badge>
        <Badge variant="outline" className="text-[10px]">{city === "all" ? "Tüm Şehirler" : city}</Badge>
        <Link to="/events" className="ml-auto text-primary text-[11px] inline-flex items-center gap-0.5">
          Tümünü Gör <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>

      {loading ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Yükleniyor…</p>
      ) : events.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bu lokasyonda yakın etkinlik bulunamadı.</p>
          <Link to="/events"><Button size="sm" variant="outline" className="mt-3 gap-1.5"><Calendar className="h-3.5 w-3.5" /> Etkinlik Takvimini Aç</Button></Link>
        </div>
      ) : (
        events.map((ev) => {
          const dt = new Date(ev.event_date);
          const day = String(dt.getDate()).padStart(2, "0");
          const mon = dt.toLocaleString("tr-TR", { month: "short" });
          return (
            <Link key={ev.id} to={`/event/${ev.id}`} className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <div className="text-center w-12 shrink-0">
                <div className="text-xl font-bold text-primary leading-none">{day}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{mon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm">{ev.title}</h4>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{ev.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{ev.description}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px] text-muted-foreground">
                  {(ev.city || ev.country) && (
                    <span className="inline-flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{[ev.city, ev.country].filter(Boolean).join(", ")}</span>
                  )}
                  {ev.price ? <span className="font-medium text-foreground">€{ev.price}</span> : <span className="text-success font-medium">Ücretsiz</span>}
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
};

/* -------------------- Media pulled from main bloggers section -------------------- */

const MediaByLocation = ({ country, city }: { country: string; city: string }) => {
  const list = useMemo(() => {
    return bloggers.filter((b) => {
      if (country !== "all" && b.country !== country) return false;
      if (city !== "all" && b.city !== city) return false;
      return true;
    }).slice(0, 12);
  }, [country, city]);

  return (
    <div className="space-y-3">
      <Card className="p-3 bg-muted/30 border-dashed flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span>Diaspora medya kütüphanesinden çekiliyor:</span>
        <Badge variant="outline" className="text-[10px]">{country === "all" ? "Tüm Ülkeler" : country}</Badge>
        <Badge variant="outline" className="text-[10px]">{city === "all" ? "Tüm Şehirler" : city}</Badge>
        <Link to="/bloggers" className="ml-auto text-primary text-[11px] inline-flex items-center gap-0.5">
          Tümünü Gör <ArrowRight className="h-3 w-3" />
        </Link>
      </Card>

      {list.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <Megaphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bu lokasyonda içerik üretici bulunamadı.</p>
          <Link to="/bloggers"><Button size="sm" variant="outline" className="mt-3 gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Tüm Medya Kütüphanesi</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {list.map((b) => (
            <Link key={b.id} to={`/blogger/${b.id}`} className="flex gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <img src={b.photo} alt={b.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-sm truncate">{b.name}</h4>
                  <Badge variant="secondary" className="text-[9px] capitalize">{b.type}</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" />{b.city}, {b.country}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="inline-flex items-center gap-0.5 text-amber-600"><Star className="h-2.5 w-2.5 fill-amber-500" /> {b.rating}</span>
                  <span className="text-muted-foreground">{b.followers.toLocaleString()} takipçi</span>
                </div>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground self-center" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VentureHub;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Lightbulb, Camera, Radio, Sparkles, Loader2, CheckCircle2,
  Upload, X, Globe, Users, Calendar, Star, Mic2, Trophy, Briefcase, Palette,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";


type Kind = "map_pin" | "idea" | "moment" | "livestream";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  social_handle: "",
  title: "",
  description: "",
  message: "",
  link: "",
  show_on_map: true,
  consent: false,
  livestream_participation: "",
  livestream_time_slot: "",
  livestream_topic: "",
  bio: "",
};

const ideaExamples = [
  "Global Türk gençleri için mentorluk ağı",
  "Yurt dışındaki Türk işletmeleri haritası",
  "Türk öğrenciler için şehir rehberleri",
  "Diaspora kadın girişimciler ağı",
  "Ülke ülke Türk başarı hikâyeleri serisi",
  "Global Türk yatırımcı ve girişimci ağı",
  "Türkçe kültür ve medya içerik arşivi",
  "Türk profesyoneller için networking sistemi",
];

const momentExamples = [
  "Melbourne'dan 19 Mayıs selamları.",
  "Berlin'de Türk gençleri olarak 19 Mayıs bizim için…",
  "Londra'daki Türk diasporasından bir an.",
  "Sydney'de bir Türk işletmesinin başarı hikâyesi.",
  "Doha'dan global Türk diasporasına selamlar.",
];

// 19 Kişilik global davet listesi
const guests = [
  { name: "Aziz Sancar", title: "Bilim / Nobel", region: "ABD", icon: Star },
  { name: "Selçuk Şirin", title: "Akademi / Eğitim", region: "ABD", icon: Star },
  { name: "Can Yaman", title: "Oyuncu", region: "Avrupa", icon: Mic2 },
  { name: "Eren Bali", title: "Teknoloji Girişimcisi", region: "ABD", icon: Briefcase },
  { name: "Refik Anadol", title: "AI Sanatçısı", region: "ABD / Global", icon: Palette },
  { name: "Alperen Şengün", title: "NBA Oyuncusu", region: "ABD / TR", icon: Trophy },
  { name: "Arda Güler", title: "Futbolcu", region: "İspanya / TR", icon: Trophy },
  { name: "Cem Yılmaz", title: "Komedyen / Yönetmen", region: "Türkiye", icon: Mic2 },
  { name: "Kaan Sekban", title: "Komedyen / Yazar", region: "Türkiye", icon: Mic2 },
  { name: "Metin Akpınar", title: "Tiyatro Sanatçısı", region: "Türkiye", icon: Palette },
  { name: "Müjdat Gezen", title: "Tiyatro / Eğitimci", region: "Türkiye", icon: Palette },
  { name: "Hulusi Derici", title: "Reklam / Marka", region: "Türkiye", icon: Briefcase },
  { name: "Dilek Gürsoy", title: "Kalp Cerrahı", region: "Almanya", icon: Star },
  { name: "Barbaros Özbuğutu", title: "Fintech Girişimcisi", region: "DE / TR", icon: Briefcase },
  { name: "Saygın Yalçın", title: "Girişimci / Yatırımcı", region: "Dubai", icon: Briefcase },
  { name: "Hanzade Doğan Boyner", title: "Dijital Ekonomi", region: "Türkiye", icon: Briefcase },
  { name: "Demet Mutlu", title: "Teknoloji Girişimcisi", region: "Türkiye", icon: Briefcase },
  { name: "Meltem Demirors", title: "Yatırımcı / Dijital Varlıklar", region: "ABD / Global", icon: Briefcase },
  { name: "Gökhan İnler", title: "Futbolcu", region: "İsviçre / TR", icon: Trophy },
];

const May19 = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Kind>("map_pin");
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [doneKind, setDoneKind] = useState<Kind | null>(null);

  const update = <K extends keyof typeof initialForm>(k: K, v: (typeof initialForm)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const reset = () => { setForm(initialForm); setFiles([]); };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    if (files.length + list.length > 5) {
      toast({ title: "En fazla 5 dosya", variant: "destructive" });
      return;
    }
    const big = list.find((f) => f.size > 25 * 1024 * 1024);
    if (big) {
      toast({ title: "Dosya çok büyük", description: `${big.name} > 25MB`, variant: "destructive" });
      return;
    }
    setFiles((p) => [...p, ...list]);
  };

  const upload = async (kind: Kind) => {
    const urls: string[] = [];
    for (const f of files) {
      const ext = f.name.split(".").pop() || "bin";
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("may19-uploads").upload(path, f, { contentType: f.type });
      if (error) throw error;
      const { data } = supabase.storage.from("may19-uploads").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const submit = async (kind: Kind) => {
    // Validation per kind
    if (kind === "map_pin" && (!form.full_name || !form.country || !form.city)) {
      toast({ title: "Ad, ülke ve şehir gerekli", variant: "destructive" }); return;
    }
    if (kind === "idea" && (!form.title || !form.description || !form.consent)) {
      toast({ title: "Başlık, açıklama ve onay gerekli", variant: "destructive" }); return;
    }
    if (kind === "moment" && (!form.title || !form.consent)) {
      toast({ title: "Başlık ve paylaşım onayı gerekli", variant: "destructive" }); return;
    }
    if (kind === "livestream" && (!form.full_name || !form.livestream_participation)) {
      toast({ title: "Ad ve katılım türü gerekli", variant: "destructive" }); return;
    }
    setSubmitting(true);
    try {
      const attachment_urls = await upload(kind);
      const { error } = await supabase.from("may19_submissions").insert({
        kind,
        full_name: form.full_name || null,
        email: form.email || null,
        phone: form.phone || null,
        country: form.country || null,
        city: form.city || null,
        social_handle: form.social_handle || null,
        title: form.title || null,
        description: form.description || null,
        message: form.message || null,
        link: form.link || null,
        attachment_urls,
        show_on_map: form.show_on_map,
        consent: form.consent,
        livestream_participation: form.livestream_participation || null,
        livestream_time_slot: form.livestream_time_slot || null,
        livestream_topic: form.livestream_topic || null,
        bio: form.bio || null,
      });
      if (error) throw error;
      setDoneKind(kind);
      reset();
      toast({ title: "Teşekkürler!", description: "Gönderimin alındı." });
    } catch (err) {
      toast({
        title: "Hata",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "h-9 text-sm";
  const labelCls = "text-xs font-medium mb-1 block";

  const FileInput = (
    <div className="col-span-2">
      <Label className={labelCls}>Dosya / Foto / Video (maks 5 × 25MB)</Label>
      <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-turquoise/60 hover:bg-turquoise/5 transition-colors">
        <Upload className="h-3.5 w-3.5 text-turquoise" />
        <span className="text-[11px] text-muted-foreground">Yüklemek için seç</span>
        <input type="file" multiple className="hidden" onChange={handleFiles}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov,.webm" />
      </label>
      {files.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between text-[11px] bg-muted/50 px-2 py-0.5 rounded">
              <span className="truncate">{f.name}</span>
              <button type="button" onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="text-destructive">
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const ModuleVisual = ({ kind }: { kind: Kind }) => {
    if (kind === "map_pin") return (
      <div className="relative h-full min-h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-turquoise/20 via-turquoise/5 to-transparent border border-turquoise/20 p-5 flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-turquoise/20 blur-2xl" />
        <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
        <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
          <defs><pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.6" fill="hsl(174 72% 46%)"/></pattern></defs>
          <rect width="200" height="120" fill="url(#grid1)"/>
        </svg>
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-turquoise/20 text-[10px] font-bold text-turquoise">MODÜL 01</div>
          <h3 className="text-xl font-extrabold mt-2 leading-tight">Global Haritada<br/>Kendini İşaretle</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Ülkeni, şehrini ve mesajını paylaş; CorteQS Türk Diaspora Haritası'nda parla.</p>
        </div>
        <div className="relative flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-turquoise/30 flex items-center justify-center animate-pulse"><MapPin className="h-5 w-5 text-turquoise" /></div>
          <div className="flex-1 text-[11px] text-muted-foreground">5 kıta · 80+ ülke · canlı pin akışı</div>
        </div>
      </div>
    );
    if (kind === "idea") return (
      <div className="relative h-full min-h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-amber-400/25 via-amber-200/10 to-transparent border border-amber-400/30 p-5 flex flex-col justify-between">
        <div className="absolute -top-12 -left-8 w-44 h-44 rounded-full bg-amber-300/30 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-700">MODÜL 02</div>
          <h3 className="text-xl font-extrabold mt-2 leading-tight">Diasporayı Güçlendirecek<br/><span className="text-amber-600">19 Fikir</span></h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">En etkili 19 fikir CorteQS tarafından öne çıkarılır.</p>
        </div>
        <div className="relative grid grid-cols-3 gap-1.5 mt-4">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <div key={n} className="aspect-square rounded bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-[10px] font-bold text-amber-700">
              {n === 5 ? <Lightbulb className="h-4 w-4" /> : n}
            </div>
          ))}
        </div>
      </div>
    );
    if (kind === "moment") return (
      <div className="relative h-full min-h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-primary/25 via-primary/5 to-transparent border border-primary/30 p-5 flex flex-col justify-between">
        <div className="absolute -bottom-10 -right-8 w-44 h-44 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-[10px] font-bold text-primary">MODÜL 03</div>
          <h3 className="text-xl font-extrabold mt-2 leading-tight">19 Mayıs ve<br/>Diaspora Anını Gönder</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Foto, 19 saniyelik video veya kısa mesaj — global hesaplarımızda paylaşalım.</p>
        </div>
        <div className="relative flex gap-2 mt-4">
          <div className="aspect-[3/4] flex-1 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center"><Camera className="h-5 w-5 text-primary" /></div>
          <div className="aspect-[3/4] flex-1 rounded-lg bg-primary/15 border border-primary/30 -mt-2 flex items-center justify-center text-[10px] font-bold text-primary">19s</div>
          <div className="aspect-[3/4] flex-1 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary">★</div>
        </div>
      </div>
    );
    return (
      <div className="relative h-full min-h-[260px] rounded-xl overflow-hidden bg-gradient-to-br from-rose-500/25 via-rose-300/10 to-transparent border border-rose-500/30 p-5 flex flex-col justify-between">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-rose-400/25 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-600">MODÜL 04</div>
          <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">● CANLI</span>
          <h3 className="text-xl font-extrabold mt-2 leading-tight">5 Kıtada<br/>19 Saatlik Canlı Yayın</h3>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">19 Mayıs · 19.00 TR · canlı bağlantı, video mesaj veya yazılı destek.</p>
        </div>
        <div className="relative grid grid-cols-5 gap-1 mt-4">
          {["EU","NA","SA","AS","OC"].map(c => (
            <div key={c} className="aspect-square rounded bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-[10px] font-bold text-rose-700">{c}</div>
          ))}
        </div>
      </div>
    );
  };

  const Done = ({ kind }: { kind: Kind }) => (
    <div className="flex flex-col items-center text-center py-12 gap-3">
      <CheckCircle2 className="h-14 w-14 text-turquoise" />
      <h3 className="text-2xl font-bold">Teşekkürler!</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Gönderimini aldık. CorteQS ekibi inceledikten sonra seninle iletişime geçecek.
      </p>
      <Button variant="outline" onClick={() => setDoneKind(null)}>Yeni Gönderim</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-16 min-h-[60vh] flex items-center bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-80 h-80 bg-turquoise/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 pt-20 pb-12 relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/15 border border-amber-400/30 mb-6 shadow-md">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">19 Mayıs Gençlik ve Spor Bayramı</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            19 Mayıs <span className="text-gradient-primary">Global Diaspora Buluşması</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-8 font-body">
            19 Mayıs Gençlik ve Spor Bayramı vesilesiyle, dünyanın dört bir yanındaki Türkleri CorteQS
            platformunda bir araya getiriyoruz. Global haritada yerini işaretle, diasporayı güçlendirecek
            fikrini paylaş, 19 Mayıs ve diaspora anını gönder, 5 kıtadan ünlü isimlerin de katılacağı
            19 saatlik canlı yayında yerini al.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="bg-turquoise hover:bg-turquoise-light text-primary-foreground gap-2"
              onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}>
              <Sparkles className="h-5 w-5" /> Kayıt Ol ve Katıl
            </Button>
            <Link to="/19-mayis/harita"><Button size="lg" variant="outline" className="gap-2"><Globe className="h-4 w-4" />Global Diaspora Haritası</Button></Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground mt-8">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-turquoise" /> 5 Kıta</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> 19 Saat Canlı</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-amber-500" /> Global Diaspora</span>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as Kind); setDoneKind(null); }}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-1.5 bg-transparent p-0 mb-5">
              <TabsTrigger value="map_pin" className="data-[state=active]:bg-turquoise data-[state=active]:text-primary-foreground rounded-lg border border-border h-auto py-2 flex flex-col gap-0.5">
                <MapPin className="h-4 w-4" /><span className="text-[11px] font-semibold">1. Harita</span>
              </TabsTrigger>
              <TabsTrigger value="idea" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-lg border border-border h-auto py-2 flex flex-col gap-0.5">
                <Lightbulb className="h-4 w-4" /><span className="text-[11px] font-semibold">2. 19 Fikir</span>
              </TabsTrigger>
              <TabsTrigger value="moment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border border-border h-auto py-2 flex flex-col gap-0.5">
                <Camera className="h-4 w-4" /><span className="text-[11px] font-semibold">3. Anı Gönder</span>
              </TabsTrigger>
              <TabsTrigger value="livestream" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg border border-border h-auto py-2 flex flex-col gap-0.5">
                <Radio className="h-4 w-4" /><span className="text-[11px] font-semibold">4. Canlı Yayın</span>
              </TabsTrigger>
            </TabsList>

            {/* MODULE 1 */}
            <TabsContent value="map_pin">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card grid md:grid-cols-[260px_1fr] gap-5">
                <ModuleVisual kind="map_pin" />
                {doneKind === "map_pin" ? <Done kind="map_pin" /> : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label className={labelCls}>Ad Soyad *</Label><Input className={inputCls} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                    <div><Label className={labelCls}>Ülke *</Label><Input className={inputCls} value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                    <div><Label className={labelCls}>Şehir *</Label><Input className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Kısa mesaj</Label><Textarea rows={2} className="text-sm min-h-0" value={form.message} onChange={(e) => update("message", e.target.value)} placeholder={`Ben ${form.city || "[şehir]"}/${form.country || "[ülke]"}'den katılıyorum.`} /></div>
                    <div><Label className={labelCls}>Sosyal medya</Label><Input className={inputCls} value={form.social_handle} onChange={(e) => update("social_handle", e.target.value)} placeholder="@kullanici" /></div>
                    <div><Label className={labelCls}>E-posta</Label><Input className={inputCls} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                    <label className="col-span-2 flex items-center gap-2 text-xs cursor-pointer">
                      <Checkbox checked={form.show_on_map} onCheckedChange={(v) => update("show_on_map", !!v)} />
                      Haritada görünmek istiyorum
                    </label>
                    <Button onClick={() => submit("map_pin")} disabled={submitting} className="col-span-2 bg-turquoise hover:bg-turquoise-light text-primary-foreground" size="sm">
                      {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
                      Haritada Yerimi İşaretle
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MODULE 2 */}
            <TabsContent value="idea">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card grid md:grid-cols-[260px_1fr] gap-5">
                <ModuleVisual kind="idea" />
                {doneKind === "idea" ? <Done kind="idea" /> : (
                  <div className="grid grid-cols-2 gap-3">
                    <details className="col-span-2 text-xs bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/50 rounded-md px-2 py-1.5">
                      <summary className="cursor-pointer font-semibold text-amber-700">Fikir örnekleri</summary>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-muted-foreground">
                        {ideaExamples.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </details>
                    <div><Label className={labelCls}>Ad Soyad</Label><Input className={inputCls} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                    <div><Label className={labelCls}>E-posta</Label><Input className={inputCls} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Fikir başlığı *</Label><Input className={inputCls} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="19 kelimelik fikrin / proje adın" /></div>
                    <div className="col-span-2"><Label className={labelCls}>Fikir açıklaması *</Label><Textarea rows={3} className="text-sm min-h-0" value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Diasporayı nasıl güçlendirir?</Label><Textarea rows={2} className="text-sm min-h-0" value={form.message} onChange={(e) => update("message", e.target.value)} /></div>
                    <div><Label className={labelCls}>Ülke / topluluk</Label><Input className={inputCls} value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                    <div><Label className={labelCls}>Şehir</Label><Input className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Link (sunum / video / doküman)</Label><Input className={inputCls} value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                    {FileInput}
                    <label className="col-span-2 flex items-start gap-2 text-xs cursor-pointer">
                      <Checkbox checked={form.consent} onCheckedChange={(v) => update("consent", !!v)} className="mt-0.5" />
                      Fikrimin CorteQS tarafından değerlendirilip paylaşılmasına izin veriyorum *
                    </label>
                    <Button onClick={() => submit("idea")} disabled={submitting} className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white" size="sm">
                      {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                      Fikrimi Gönder
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MODULE 3 */}
            <TabsContent value="moment">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card grid md:grid-cols-[260px_1fr] gap-5">
                <ModuleVisual kind="moment" />
                {doneKind === "moment" ? <Done kind="moment" /> : (
                  <div className="grid grid-cols-2 gap-3">
                    <details className="col-span-2 text-xs bg-primary/5 border border-primary/20 rounded-md px-2 py-1.5">
                      <summary className="cursor-pointer font-semibold text-primary">Örnek içerikler</summary>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-muted-foreground">
                        {momentExamples.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </details>
                    <div className="col-span-2"><Label className={labelCls}>Ad Soyad</Label><Input className={inputCls} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                    <div><Label className={labelCls}>Ülke</Label><Input className={inputCls} value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                    <div><Label className={labelCls}>Şehir</Label><Input className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>İçerik başlığı *</Label><Input className={inputCls} value={form.title} onChange={(e) => update("title", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Kısa açıklama</Label><Textarea rows={2} className="text-sm min-h-0" value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
                    <div><Label className={labelCls}>Link (YouTube/Drive/IG)</Label><Input className={inputCls} value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                    <div><Label className={labelCls}>Sosyal medya</Label><Input className={inputCls} value={form.social_handle} onChange={(e) => update("social_handle", e.target.value)} /></div>
                    {FileInput}
                    <label className="col-span-2 flex items-start gap-2 text-xs cursor-pointer">
                      <Checkbox checked={form.consent} onCheckedChange={(v) => update("consent", !!v)} className="mt-0.5" />
                      İçeriğimin CorteQS platformunda, canlı yayın ve sosyal medyada paylaşılmasına izin veriyorum *
                    </label>
                    <Button onClick={() => submit("moment")} disabled={submitting} className="col-span-2" size="sm">
                      {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                      Anımı Gönder
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* MODULE 4 */}
            <TabsContent value="livestream">
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card grid md:grid-cols-[260px_1fr] gap-5">
                <ModuleVisual kind="livestream" />
                {doneKind === "livestream" ? <Done kind="livestream" /> : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><Label className={labelCls}>Ad Soyad *</Label><Input className={inputCls} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                    <div><Label className={labelCls}>E-posta</Label><Input className={inputCls} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                    <div><Label className={labelCls}>Telefon / WhatsApp</Label><Input className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                    <div><Label className={labelCls}>Ülke</Label><Input className={inputCls} value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                    <div><Label className={labelCls}>Şehir</Label><Input className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                    <div className="col-span-2">
                      <Label className={labelCls}>Katılım türü *</Label>
                      <Select value={form.livestream_participation} onValueChange={(v) => update("livestream_participation", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Seç" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="live">Canlı bağlantı (5–15 dk)</SelectItem>
                          <SelectItem value="video_message">19 sn video mesaj</SelectItem>
                          <SelectItem value="support_video">1 dk destek videosu</SelectItem>
                          <SelectItem value="written">Yazılı mesaj</SelectItem>
                          <SelectItem value="prerecorded">Önceden kayıtlı konuşma</SelectItem>
                          <SelectItem value="viewer">İzleyici</SelectItem>
                          <SelectItem value="sponsor">Sponsor / Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label className={labelCls}>Uygun saat (TR)</Label><Input className={inputCls} value={form.livestream_time_slot} onChange={(e) => update("livestream_time_slot", e.target.value)} placeholder="22:00 – 23:30" /></div>
                    <div><Label className={labelCls}>Sosyal medya / web</Label><Input className={inputCls} value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                    <div className="col-span-2"><Label className={labelCls}>Konuşmak istediğin konu</Label><Textarea rows={2} className="text-sm min-h-0" value={form.livestream_topic} onChange={(e) => update("livestream_topic", e.target.value)} /></div>
                    <div className="col-span-2"><Label className={labelCls}>Kısa biyografi</Label><Textarea rows={2} className="text-sm min-h-0" value={form.bio} onChange={(e) => update("bio", e.target.value)} /></div>
                    {FileInput}
                    <Button onClick={() => submit("livestream")} disabled={submitting} className="col-span-2 bg-rose-500 hover:bg-rose-600 text-white" size="sm">
                      {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Radio className="h-4 w-4 mr-2" />}
                      Canlı Yayına Katıl
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* GUEST INVITATION LIST */}
      <section className="py-14 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 mb-3">
              <Radio className="h-3.5 w-3.5 text-rose-500" />
              <span className="text-xs font-semibold text-rose-600">19 Kişilik Davet Listesi</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold mb-2">
              19 Saatlik Global Yayın <span className="text-gradient-primary">Konukları</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-body">
              5 kıtadan bilim, sanat, spor, girişimcilik ve teknoloji dünyasının önde gelen Türk isimlerini
              19 Mayıs canlı yayınımıza davet ediyoruz.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {guests.map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.name} className="group relative rounded-xl border border-border bg-background p-3 hover:border-turquoise/50 hover:shadow-card-hover transition-all">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-turquoise/15 via-primary/10 to-amber-400/15 flex items-center justify-center mb-2 relative overflow-hidden">
                    <Icon className="h-7 w-7 text-turquoise/70 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-background/80 backdrop-blur text-[9px] font-bold text-muted-foreground">
                      {g.region}
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-foreground leading-tight">{g.name}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{g.title}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-6 italic">
            Davet listesi güncellenmektedir. Konuk katılımları onay sürecindedir.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default May19;

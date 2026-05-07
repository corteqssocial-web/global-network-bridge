import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Lightbulb, Camera, Radio, Sparkles, Loader2, CheckCircle2,
  Upload, X, Globe, Users, Calendar,
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

  const FileInput = (
    <div>
      <Label>Dosya / Fotoğraf / Video (opsiyonel, maks 5 × 25MB)</Label>
      <label className="mt-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-turquoise/60 hover:bg-turquoise/5 transition-colors">
        <Upload className="h-4 w-4 text-turquoise" />
        <span className="text-xs text-muted-foreground">Yüklemek için seç</span>
        <input type="file" multiple className="hidden" onChange={handleFiles}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg,.mp4,.mov,.webm" />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between text-xs bg-muted/50 px-2 py-1 rounded">
              <span className="truncate">{f.name}</span>
              <button type="button" onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} className="text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

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
            <Link to="/map"><Button size="lg" variant="outline" className="gap-2"><Globe className="h-4 w-4" />Haritayı Gör</Button></Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground mt-8">
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-turquoise" /> 5 Kıta</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> 19 Saat Canlı</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-amber-500" /> Global Diaspora</span>
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as Kind); setDoneKind(null); }}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto gap-2 bg-transparent p-0 mb-6">
              <TabsTrigger value="map_pin" className="data-[state=active]:bg-turquoise data-[state=active]:text-primary-foreground rounded-xl border border-border h-auto py-3 flex flex-col gap-1">
                <MapPin className="h-5 w-5" /><span className="text-xs font-semibold">1. Haritada İşaretle</span>
              </TabsTrigger>
              <TabsTrigger value="idea" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded-xl border border-border h-auto py-3 flex flex-col gap-1">
                <Lightbulb className="h-5 w-5" /><span className="text-xs font-semibold">2. 19 Fikir</span>
              </TabsTrigger>
              <TabsTrigger value="moment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl border border-border h-auto py-3 flex flex-col gap-1">
                <Camera className="h-5 w-5" /><span className="text-xs font-semibold">3. An Gönder</span>
              </TabsTrigger>
              <TabsTrigger value="livestream" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-xl border border-border h-auto py-3 flex flex-col gap-1">
                <Radio className="h-5 w-5" /><span className="text-xs font-semibold">4. Canlı Yayın</span>
              </TabsTrigger>
            </TabsList>

            {/* MODULE 1: MAP PIN */}
            <TabsContent value="map_pin">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
                {doneKind === "map_pin" ? <Done kind="map_pin" /> : (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-turquoise/15 flex items-center justify-center shrink-0"><MapPin className="h-6 w-6 text-turquoise" /></div>
                      <div>
                        <h2 className="text-2xl font-bold">Global Haritada Kendini İşaretle</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Dünyanın neresinde yaşıyorsan, CorteQS Global Türk Diaspora Haritası'nda yerini al.
                          Ülkeni, şehrini ve kısa mesajını paylaş; yaşadığın yerden global Türk ağına katıl.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div><Label>Ad Soyad *</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Ülke *</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                        <div><Label>Şehir *</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                      </div>
                      <div>
                        <Label>Kısa mesaj</Label>
                        <Textarea rows={2} value={form.message} onChange={(e) => update("message", e.target.value)}
                          placeholder={`Ben ${form.city || "[şehir]"}/${form.country || "[ülke]"}'den katılıyorum.`} />
                      </div>
                      <div><Label>Sosyal medya hesabı (opsiyonel)</Label><Input value={form.social_handle} onChange={(e) => update("social_handle", e.target.value)} placeholder="@kullaniciadi veya link" /></div>
                      <div><Label>E-posta (opsiyonel, iletişim için)</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.show_on_map} onCheckedChange={(v) => update("show_on_map", !!v)} />
                        Haritada görünmek istiyorum
                      </label>
                      <Button onClick={() => submit("map_pin")} disabled={submitting} className="w-full bg-turquoise hover:bg-turquoise-light text-primary-foreground" size="lg">
                        {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MapPin className="h-4 w-4 mr-2" />}
                        Haritada Yerimi İşaretle
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* MODULE 2: IDEA */}
            <TabsContent value="idea">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
                {doneKind === "idea" ? <Done kind="idea" /> : (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0"><Lightbulb className="h-6 w-6 text-amber-500" /></div>
                      <div>
                        <h2 className="text-2xl font-bold">Diasporayı Güçlendirecek 19 Fikir</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Eğitimden girişimciliğe, kültürden teknolojiye, gençlikten iş dünyasına kadar diasporayı
                          güçlendirecek fikir, proje, video konsepti veya sosyal fayda önerilerini topluyoruz.
                          En etkili 19 fikir CorteQS tarafından öne çıkarılacak.
                        </p>
                      </div>
                    </div>
                    <details className="mb-4 text-sm bg-muted/40 rounded-lg p-3">
                      <summary className="cursor-pointer font-semibold">Fikir örnekleri</summary>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        {ideaExamples.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </details>
                    <div className="space-y-4">
                      <div><Label>Ad Soyad</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                      <div><Label>E-posta</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                      <div><Label>Fikir başlığı *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="19 kelimelik fikrin / proje adın" /></div>
                      <div><Label>Fikir açıklaması *</Label><Textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
                      <div><Label>Bu fikir diasporayı nasıl güçlendirir?</Label><Textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Hangi ülke / topluluk?</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                        <div><Label>Şehir (opsiyonel)</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                      </div>
                      <div><Label>Link (sunum, video, doküman)</Label><Input value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                      {FileInput}
                      <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.consent} onCheckedChange={(v) => update("consent", !!v)} className="mt-0.5" />
                        Fikrimin CorteQS tarafından değerlendirilmesine ve paylaşılmasına izin veriyorum *
                      </label>
                      <Button onClick={() => submit("idea")} disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-white" size="lg">
                        {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Lightbulb className="h-4 w-4 mr-2" />}
                        Fikrimi Gönder
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* MODULE 3: MOMENT */}
            <TabsContent value="moment">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
                {doneKind === "moment" ? <Done kind="moment" /> : (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0"><Camera className="h-6 w-6 text-primary" /></div>
                      <div>
                        <h2 className="text-2xl font-bold">19 Mayıs ve Diaspora Anını Gönder</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Yaşadığın ülkeden 19 Mayıs'a ve Türk diasporasına dair bir anını, fotoğrafını veya
                          kısa videonu gönder; CorteQS global hesaplarında ve canlı yayında paylaşalım.
                        </p>
                      </div>
                    </div>
                    <details className="mb-4 text-sm bg-muted/40 rounded-lg p-3">
                      <summary className="cursor-pointer font-semibold">Örnek içerikler</summary>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        {momentExamples.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </details>
                    <div className="space-y-4">
                      <div><Label>Ad Soyad</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Ülke</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                        <div><Label>Şehir</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                      </div>
                      <div><Label>İçerik başlığı *</Label><Input value={form.title} onChange={(e) => update("title", e.target.value)} /></div>
                      <div><Label>Kısa açıklama</Label><Textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
                      <div><Label>Link (YouTube, Drive, Instagram vs.)</Label><Input value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                      {FileInput}
                      <div><Label>Sosyal medya hesabı</Label><Input value={form.social_handle} onChange={(e) => update("social_handle", e.target.value)} /></div>
                      <label className="flex items-start gap-2 text-sm cursor-pointer">
                        <Checkbox checked={form.consent} onCheckedChange={(v) => update("consent", !!v)} className="mt-0.5" />
                        İçeriğimin CorteQS platformu, canlı yayın ve sosyal medya hesaplarında paylaşılmasına izin veriyorum *
                      </label>
                      <Button onClick={() => submit("moment")} disabled={submitting} className="w-full" size="lg">
                        {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Camera className="h-4 w-4 mr-2" />}
                        Anımı Gönder
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* MODULE 4: LIVESTREAM */}
            <TabsContent value="livestream">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-card">
                {doneKind === "livestream" ? <Done kind="livestream" /> : (
                  <>
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0"><Radio className="h-6 w-6 text-rose-500" /></div>
                      <div>
                        <h2 className="text-2xl font-bold">5 Kıtada 19 Saatlik Canlı Yayın</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          19 Mayıs akşamı Türkiye saatiyle 19.00'da başlayacak 19 saatlik global canlı yayında,
                          5 kıtadan Türk diasporası temsilcileri bir araya geliyor. Konukların aynı anda yayında
                          olması gerekmiyor — kendi uygun saatinde bağlanabilir veya video mesaj gönderebilir.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div><Label>Ad Soyad *</Label><Input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>E-posta</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                        <div><Label>Telefon / WhatsApp</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Ülke</Label><Input value={form.country} onChange={(e) => update("country", e.target.value)} /></div>
                        <div><Label>Şehir</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                      </div>
                      <div>
                        <Label>Katılım türü *</Label>
                        <Select value={form.livestream_participation} onValueChange={(v) => update("livestream_participation", v)}>
                          <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="live">Canlı bağlantı (5–15 dk)</SelectItem>
                            <SelectItem value="video_message">19 saniyelik video mesaj</SelectItem>
                            <SelectItem value="support_video">1 dakikalık destek videosu</SelectItem>
                            <SelectItem value="written">Yazılı destek mesajı</SelectItem>
                            <SelectItem value="prerecorded">Önceden kaydedilmiş konuşma</SelectItem>
                            <SelectItem value="viewer">İzleyici</SelectItem>
                            <SelectItem value="sponsor">Sponsor / Partner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label>Uygun saat aralığı (TR saatiyle)</Label><Input value={form.livestream_time_slot} onChange={(e) => update("livestream_time_slot", e.target.value)} placeholder="Örn: 22:00 – 23:30" /></div>
                      <div><Label>Konuşmak istediğiniz konu</Label><Textarea rows={2} value={form.livestream_topic} onChange={(e) => update("livestream_topic", e.target.value)} /></div>
                      <div><Label>Kısa biyografi</Label><Textarea rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} /></div>
                      <div><Label>Sosyal medya / web sitesi linki</Label><Input value={form.link} onChange={(e) => update("link", e.target.value)} placeholder="https://..." /></div>
                      {FileInput}
                      <Button onClick={() => submit("livestream")} disabled={submitting} className="w-full bg-rose-500 hover:bg-rose-600 text-white" size="lg">
                        {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Radio className="h-4 w-4 mr-2" />}
                        Canlı Yayına Katıl
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default May19;

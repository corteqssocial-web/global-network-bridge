import { useState, useEffect, useRef } from "react";
import { Send, MapPin, Globe, Info, ImagePlus, Video, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allCountries, countryCities } from "@/data/countryCities";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Props {
  onCreated: () => void;
  cafeId?: string;
}

interface MediaItem { type: "image" | "video"; url: string; path: string }

const isTRPhone = (p?: string | null) => {
  if (!p) return false;
  const x = p.replace(/\s|-/g, "");
  return x.startsWith("+90") || x.startsWith("0090");
};

const CreatePostForm = ({ onCreated, cafeId }: Props) => {
  const { user, accountType, profile } = useAuth();
  const isTR = (profile?.country === "Türkiye") || isTRPhone(profile?.phone);
  const [content, setContent] = useState("");
  const [profileCountry, setProfileCountry] = useState<string>("");
  const [profileCity, setProfileCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [globalOnly, setGlobalOnly] = useState(false);
  const [kopruOnly, setKopruOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const vidInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("country, city")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setProfileCountry(data.country || "");
        setProfileCity(data.city || "");
        setCountry((prev) => prev || data.country || "");
        setCity((prev) => prev || data.city || "");
      }
    })();
  }, [user]);

  const cities = country ? countryCities[country] || [] : [];

  const handleFiles = async (files: FileList | null, kind: "image" | "video") => {
    if (!files || !user) return;
    const arr = Array.from(files);
    const maxImg = 8 * 1024 * 1024; // 8MB per image
    const maxVid = 80 * 1024 * 1024; // 80MB per video
    setUploading(true);
    try {
      for (const f of arr) {
        if (kind === "image" && f.size > maxImg) {
          toast({ title: `${f.name} çok büyük (max 8MB)`, variant: "destructive" });
          continue;
        }
        if (kind === "video" && f.size > maxVid) {
          toast({ title: `${f.name} çok büyük (max 80MB)`, variant: "destructive" });
          continue;
        }
        const ext = f.name.split(".").pop() || (kind === "image" ? "jpg" : "mp4");
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from("post-archive").upload(path, f, { contentType: f.type });
        if (error) {
          toast({ title: "Yükleme başarısız", description: error.message, variant: "destructive" });
          continue;
        }
        const { data: pub } = supabase.storage.from("post-archive").getPublicUrl(path);
        setMedia((m) => [...m, { type: kind, url: pub.publicUrl, path }]);
      }
    } finally {
      setUploading(false);
      if (imgInputRef.current) imgInputRef.current.value = "";
      if (vidInputRef.current) vidInputRef.current.value = "";
    }
  };

  const removeMedia = async (idx: number) => {
    const item = media[idx];
    setMedia((m) => m.filter((_, i) => i !== idx));
    if (item) await supabase.storage.from("post-archive").remove([item.path]);
  };

  const submit = async () => {
    if (!user) {
      toast({ title: "Giriş yapmalısınız", variant: "destructive" });
      return;
    }
    if (!content.trim() && media.length === 0) return;

    const finalCountry = kopruOnly ? "Köprü" : (isTR ? "Türkiye" : (globalOnly ? null : (country || null)));
    const finalCity = kopruOnly ? null : (isTR ? (profileCity || city || null) : (globalOnly ? null : (city || null)));

    setSubmitting(true);
    const firstImg = media.find((m) => m.type === "image");
    const { error } = await supabase.from("feed_posts").insert({
      user_id: user.id,
      content: content.trim(),
      country: finalCountry,
      city: finalCity,
      author_role: accountType || "user",
      image_url: firstImg?.url || null,
      media: media.map(({ type, url }) => ({ type, url })) as any,
      ...(cafeId ? { cafe_id: cafeId } : {}),
    } as any);
    setSubmitting(false);

    if (error) {
      toast({ title: "Paylaşım eklenemedi", description: error.message, variant: "destructive" });
      return;
    }
    setContent("");
    setMedia([]);
    setCountry(profileCountry);
    setCity(profileCity);
    setGlobalOnly(false);
    setKopruOnly(false);
    toast({ title: "Paylaşım yayınlandı" });
    onCreated();
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground text-center">
        Feed'e paylaşım yapmak için giriş yapmalısınız.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <Textarea
        placeholder="Diaspora'ya bir şeyler paylaş..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none"
      />

      {media.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {media.map((m, i) => (
            <div key={i} className="relative group">
              {m.type === "image" ? (
                <img src={m.url} alt="" className="h-20 w-20 object-cover rounded-lg ring-1 ring-border" />
              ) : (
                <video src={m.url} className="h-20 w-32 object-cover rounded-lg ring-1 ring-border bg-black" muted />
              )}
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow"
                aria-label="Kaldır"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isTR ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Türkiye merkezli kullanıcı olarak paylaşımların <strong>@Türkiye caddesinde</strong> yayınlanır. Yüksek etkileşim alan paylaşımlar Global akışta da görünür.
          </span>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Varsayılan olarak profilindeki <strong>{profileCity || "şehir"} · {profileCountry || "ülke"}</strong> akışında görünür. İstersen başka bir @Ülke / @Şehir seç ya da sadece global yayınla.
        </p>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files, "image")} />
        <input ref={vidInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => handleFiles(e.target.files, "video")} />
        <Button type="button" variant="outline" size="sm" onClick={() => imgInputRef.current?.click()} disabled={uploading} className="h-9 gap-1.5">
          <ImagePlus className="h-4 w-4 text-emerald-500" /> Fotoğraf
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => vidInputRef.current?.click()} disabled={uploading} className="h-9 gap-1.5">
          <Video className="h-4 w-4 text-violet-500" /> Video
        </Button>
        {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}

        <button
          type="button"
          onClick={() => setKopruOnly((v) => !v)}
          className={`h-9 px-3 rounded-md border text-xs font-bold flex items-center gap-1.5 transition-colors ${
            kopruOnly
              ? "bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 text-white border-transparent"
              : "bg-background border-border hover:bg-muted"
          }`}
          title="TR-Diaspora arasında Taşınanlar / İş Yapanlar / Mentör Arayanlar"
        >
          🌉 {kopruOnly ? "Köprü ✓" : "Köprü"}
        </button>
        {!isTR && !kopruOnly && (
          <>
            <button
              type="button"
              onClick={() => setGlobalOnly((v) => !v)}
              className={`h-9 px-3 rounded-md border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                globalOnly
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:bg-muted"
              }`}
            >
              <Globe className="h-3.5 w-3.5" /> {globalOnly ? "Global'de yayınla ✓" : "Sadece Global"}
            </button>
            <Select
              value={country}
              onValueChange={(v) => { setCountry(v); setCity(""); setGlobalOnly(false); }}
              disabled={globalOnly}
            >
              <SelectTrigger className="h-9 text-xs w-44">
                <Globe className="h-3.5 w-3.5 text-primary mr-1" />
                <SelectValue placeholder="@Ülke seç" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {allCountries.map((c) => (
                  <SelectItem key={c} value={c}>@{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={(v) => { setCity(v); setGlobalOnly(false); }} disabled={!country || globalOnly}>
              <SelectTrigger className="h-9 text-xs w-44">
                <MapPin className="h-3.5 w-3.5 text-turquoise mr-1" />
                <SelectValue placeholder="@Şehir seç" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>@{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!globalOnly && (country || city) && (
              <div className="flex items-center gap-1 text-[11px] flex-wrap">
                {city && <span className="px-1.5 py-0.5 rounded-full bg-turquoise/10 text-turquoise font-semibold">@{city}</span>}
                {country && <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">@{country}</span>}
              </div>
            )}
            {globalOnly && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">🌍 Global</span>
            )}
          </>
        )}
        {isTR && !kopruOnly && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">@Türkiye 🇹🇷</span>
        )}
        {kopruOnly && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 text-white font-semibold">🌉 Köprü — TR↔Diaspora</span>
        )}
        <Button
          onClick={submit}
          disabled={submitting || uploading || (!content.trim() && media.length === 0)}
          className="ml-auto gap-1.5"
          size="sm"
        >
          <Send className="h-4 w-4" /> Paylaş
        </Button>
      </div>
    </div>
  );
};

export default CreatePostForm;

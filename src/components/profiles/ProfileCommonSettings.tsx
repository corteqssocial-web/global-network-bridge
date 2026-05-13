import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Save, Loader2, Plus, X, Upload, BadgeCheck, ShieldCheck, MapPin, MessageCircle, FileText, Image as ImageIcon, Cake, Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ProfileRole =
  | "individual"
  | "consultant"
  | "business"
  | "association"
  | "blogger"
  | "ambassador";

interface RoleConfig {
  fullNameLabel: string;
  showOrgName?: boolean;
  showTagLine: boolean; // tüm rollerde true (25 char)
  showBio: boolean;
  showBirthDate: boolean;
  showFoundedYear: boolean;
  showSector: boolean;
  showTheme: boolean;
  showAvatar: boolean;
  showWebsites: boolean;
  showShowOnMap: boolean;
  showWhatsAppCta: boolean;
  showPresentationUpload: boolean;
  showBusinessSubtype: boolean;
  showVerifiedBadgeRequest: boolean;
  showCorteqsPasaportu: boolean;
  showGiftAcceptance?: boolean;
}

const ROLE_CONFIG: Record<ProfileRole, RoleConfig> = {
  individual: {
    fullNameLabel: "Ad Soyad *",
    showTagLine: true, showBio: true, showBirthDate: true, showFoundedYear: false,
    showSector: false, showTheme: false, showAvatar: true, showWebsites: true,
    showShowOnMap: false, showWhatsAppCta: false, showPresentationUpload: false,
    showBusinessSubtype: false, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
    showGiftAcceptance: true,
  },
  consultant: {
    fullNameLabel: "Ad Soyad *",
    showTagLine: true, showBio: true, showBirthDate: true, showFoundedYear: true,
    showSector: true, showTheme: true, showAvatar: true, showWebsites: true,
    showShowOnMap: true, showWhatsAppCta: true, showPresentationUpload: true,
    showBusinessSubtype: false, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
  },
  business: {
    fullNameLabel: "Yetkili Ad Soyad *",
    showOrgName: true,
    showTagLine: true, showBio: true, showBirthDate: false, showFoundedYear: true,
    showSector: true, showTheme: false, showAvatar: true, showWebsites: true,
    showShowOnMap: true, showWhatsAppCta: true, showPresentationUpload: true,
    showBusinessSubtype: true, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
  },
  association: {
    fullNameLabel: "Yetkili Ad Soyad *",
    showOrgName: true,
    showTagLine: true, showBio: true, showBirthDate: false, showFoundedYear: true,
    showSector: true, showTheme: false, showAvatar: true, showWebsites: true,
    showShowOnMap: true, showWhatsAppCta: true, showPresentationUpload: false,
    showBusinessSubtype: false, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
  },
  blogger: {
    fullNameLabel: "Ad Soyad *",
    showTagLine: true, showBio: true, showBirthDate: false, showFoundedYear: false,
    showSector: false, showTheme: true, showAvatar: true, showWebsites: true,
    showShowOnMap: false, showWhatsAppCta: false, showPresentationUpload: false,
    showBusinessSubtype: false, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
  },
  ambassador: {
    fullNameLabel: "Ad Soyad *",
    showTagLine: true, showBio: true, showBirthDate: false, showFoundedYear: false,
    showSector: false, showTheme: false, showAvatar: true, showWebsites: true,
    showShowOnMap: false, showWhatsAppCta: true, showPresentationUpload: false,
    showBusinessSubtype: false, showVerifiedBadgeRequest: true, showCorteqsPasaportu: true,
  },
};

const ProfileCommonSettings = ({ role }: { role: ProfileRole }) => {
  const cfg = ROLE_CONFIG[role];
  const { user, refreshProfile, isGlobalDiaspora } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [foundedYear, setFoundedYear] = useState<string>("");
  const [sector, setSector] = useState("");
  const [theme, setTheme] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [websites, setWebsites] = useState<string[]>([""]);
  const [showOnMap, setShowOnMap] = useState(false);
  const [whatsappCta, setWhatsappCta] = useState(false);
  const [businessSubtype, setBusinessSubtype] = useState("classic");
  const [presentationName, setPresentationName] = useState<string | null>(null);
  const [presentationPath, setPresentationPath] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [birthdayReminder, setBirthdayReminder] = useState(false);
  const [giftAcceptance, setGiftAcceptance] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, business_name, avatar_url, tag_line, bio, birth_date, founded_year, business_sector, theme, websites, show_on_map, whatsapp_cta_enabled, business_subtype, presentation_name, presentation_path, is_verified, birthday_reminder_enabled, gift_acceptance_enabled")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name ?? "");
        setOrgName(data.business_name ?? "");
        setAvatarUrl(data.avatar_url ?? null);
        setTagLine(data.tag_line ?? "");
        setBio(data.bio ?? "");
        setBirthDate(data.birth_date ?? "");
        setFoundedYear(data.founded_year ? String(data.founded_year) : "");
        setSector(data.business_sector ?? "");
        setTheme((data as any).theme ?? "");
        const ws = (data as any).websites;
        setWebsites(Array.isArray(ws) && ws.length > 0 ? ws : [""]);
        setShowOnMap(!!data.show_on_map);
        setWhatsappCta(!!(data as any).whatsapp_cta_enabled);
        setBusinessSubtype((data as any).business_subtype ?? "classic");
        setPresentationName(data.presentation_name ?? null);
        setPresentationPath(data.presentation_path ?? null);
        setIsVerified(!!data.is_verified);
        setBirthdayReminder(!!(data as any).birthday_reminder_enabled);
        setGiftAcceptance(!!(data as any).gift_acceptance_enabled);
      }
      setEmail(user.email ?? "");
      setLoading(false);
    })();
  }, [user]);

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl);
      toast({ title: "Profil fotoğrafı yüklendi" });
    } catch (e: any) {
      toast({ title: "Yüklenemedi", description: e?.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const uploadPresentation = async (file: File) => {
    if (!user) return;
    if (file.size > 25 * 1024 * 1024) {
      toast({ title: "Dosya çok büyük", description: "En fazla 25MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const path = `${user.id}/presentation-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("presentations").upload(path, file, { upsert: true });
      if (error) throw error;
      setPresentationName(file.name);
      setPresentationPath(path);
      toast({ title: "Sunum yüklendi", description: file.name });
    } catch (e: any) {
      toast({ title: "Yüklenemedi", description: e?.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast({ title: "Ad Soyad zorunlu", variant: "destructive" });
      return;
    }
    if (cfg.showOrgName && !orgName.trim()) {
      toast({ title: role === "association" ? "Kuruluş adı zorunlu" : "İşletme adı zorunlu", variant: "destructive" });
      return;
    }
    if (tagLine.length > 25) {
      toast({ title: "Tag line en fazla 25 karakter olabilir", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const cleanWebsites = websites.map((w) => w.trim()).filter(Boolean).slice(0, 5);
      const payload: any = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
        tag_line: tagLine.trim() || null,
        bio: bio.trim() || null,
        websites: cleanWebsites,
      };
      if (cfg.showOrgName) payload.business_name = orgName.trim();
      if (cfg.showBirthDate) {
        payload.birth_date = birthDate || null;
        payload.birthday_reminder_enabled = birthdayReminder;
      }
      if (cfg.showFoundedYear) payload.founded_year = foundedYear ? Number(foundedYear) : null;
      if (cfg.showSector) payload.business_sector = sector.trim() || null;
      if (cfg.showTheme) payload.theme = theme.trim() || null;
      if (cfg.showShowOnMap) payload.show_on_map = showOnMap;
      if (cfg.showWhatsAppCta) payload.whatsapp_cta_enabled = whatsappCta;
      if (cfg.showBusinessSubtype) payload.business_subtype = businessSubtype;
      if (cfg.showPresentationUpload) {
        payload.presentation_name = presentationName;
        payload.presentation_path = presentationPath;
      }
      if (cfg.showGiftAcceptance) payload.gift_acceptance_enabled = giftAcceptance;
      const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
      if (error) throw error;
      toast({ title: "Profil bilgileri kaydedildi" });
      await refreshProfile();
    } catch (e: any) {
      toast({ title: "Kaydedilemedi", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const requestVerifiedBadge = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from("approval_requests").insert({
        user_id: user.id,
        request_type: "verified_account",
        payload: { role, full_name: fullName, business_name: orgName },
      });
      if (error) throw error;
      toast({ title: "Mavi tik başvurun gönderildi", description: "Yönetici onayından sonra hesabında görünecek." });
    } catch (e: any) {
      toast({ title: "Başvuru gönderilemedi", description: e?.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Profil Bilgileri
        </h2>
        <div className="flex items-center gap-2">
          {isVerified && (
            <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30 gap-1">
              <BadgeCheck className="h-3.5 w-3.5" /> Onaylı Hesap
            </Badge>
          )}
          {cfg.showCorteqsPasaportu && isGlobalDiaspora && (
            <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> CorteQS Pasaportu
            </Badge>
          )}
        </div>
      </div>

      {/* Avatar */}
      {cfg.showAvatar && (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <Label className="text-sm">Profil Fotoğrafı (isteğe bağlı)</Label>
            <Input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
              className="mt-1 max-w-xs"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>{cfg.fullNameLabel}</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Adınız Soyadınız" />
        </div>
        {cfg.showOrgName && (
          <div>
            <Label>{role === "association" ? "Kuruluş Adı *" : "İşletme Adı *"}</Label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>
        )}
        <div>
          <Label>E-posta * <span className="text-xs text-muted-foreground">(hesap)</span></Label>
          <Input value={email} disabled />
        </div>
        {cfg.showTagLine && (
          <div>
            <Label>Tag Line ({tagLine.length}/25) <span className="text-xs text-muted-foreground">Örn: Founder, Coach, CEO, Öğrenci, Kahve, Diaspora</span></Label>
            <Input
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value.slice(0, 25))}
              maxLength={25}
              placeholder="Kısa tanıtım"
            />
          </div>
        )}
        {cfg.showBirthDate && (
          <div>
            <Label>Doğum Tarihi</Label>
            <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <div className="mt-2 flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <div className="flex items-start gap-2">
                <Cake className="h-4 w-4 text-pink-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Doğum günü hatırlatması</p>
                  <p className="text-xs text-muted-foreground">
                    Açıkken: doğum gününe 14 gün kala bağlantılarına “🎁 Hediye kupon gönder” CTA gösterilir.
                  </p>
                </div>
              </div>
              <Switch checked={birthdayReminder} onCheckedChange={setBirthdayReminder} disabled={!birthDate} />
            </div>
            {cfg.showGiftAcceptance && (
              <div className="mt-2 flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
                <div className="flex items-start gap-2">
                  <Gift className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Hediye Kabul Et</p>
                    <p className="text-xs text-muted-foreground">
                      Açıkken profil ön ve detay kartında “🎁 Discount Kupon Hediye Et” CTA görünür. (Yakında — buton kilitli açılır.)
                    </p>
                  </div>
                </div>
                <Switch checked={giftAcceptance} onCheckedChange={setGiftAcceptance} />
              </div>
            )}
          </div>
        )}
        {cfg.showFoundedYear && (
          <div>
            <Label>Kuruluş Yılı</Label>
            <Input type="number" min={1900} max={new Date().getFullYear()} value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="2010" />
          </div>
        )}
        {cfg.showSector && (
          <div>
            <Label>Sektör</Label>
            <Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="Örn: Finans, Eğitim, Sağlık" />
          </div>
        )}
        {cfg.showTheme && (
          <div>
            <Label>Ünvan / Uzmanlık + Tema</Label>
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Örn: Yatırım Danışmanı / Startup Teması" />
          </div>
        )}
        {cfg.showBusinessSubtype && (
          <div>
            <Label>İşletme Tipi</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={businessSubtype}
              onChange={(e) => setBusinessSubtype(e.target.value)}
            >
              <option value="classic">Klasik İşletme</option>
              <option value="startup">1 - Start-up</option>
              <option value="online">2 - Online İşletme</option>
            </select>
          </div>
        )}
      </div>

      {cfg.showBio && (
        <div>
          <Label>Bio / Hakkında</Label>
          <Textarea
            rows={4}
            maxLength={role === "blogger" ? 3000 : 500}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendinizi/markanızı kısaca anlatın"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {bio.length}/{role === "blogger" ? 3000 : 500}
          </p>
        </div>
      )}

      {cfg.showWebsites && (
        <div>
          <Label>Web Siteleri (en fazla 5)</Label>
          <div className="space-y-2 mt-1">
            {websites.map((w, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={w}
                  onChange={(e) => setWebsites((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))}
                  placeholder="https://..."
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setWebsites((arr) => arr.filter((_, idx) => idx !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {websites.length < 5 && (
              <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => setWebsites((arr) => [...arr, ""])}>
                <Plus className="h-4 w-4" /> Link Ekle
              </Button>
            )}
          </div>
        </div>
      )}

      {(cfg.showShowOnMap || cfg.showWhatsAppCta) && (
        <div className="space-y-3 border-t border-border pt-4">
          {cfg.showShowOnMap && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Haritada Yer Al</p>
                  <p className="text-xs text-muted-foreground">Profilin harita aramalarında ve şehir listelerinde görünür.</p>
                </div>
              </div>
              <Switch checked={showOnMap} onCheckedChange={setShowOnMap} />
            </div>
          )}
          {cfg.showWhatsAppCta && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">WhatsApp CTA</p>
                  <p className="text-xs text-muted-foreground">Doğrulanmış telefondan otomatik. Profil kartında WhatsApp butonu gösterilir.</p>
                </div>
              </div>
              <Switch checked={whatsappCta} onCheckedChange={setWhatsappCta} />
            </div>
          )}
        </div>
      )}

      {cfg.showPresentationUpload && (
        <div className="border-t border-border pt-4">
          <Label className="flex items-center gap-1.5">
            <Upload className="h-4 w-4" /> Sunum / Tanıtım (PDF, PPT, PPTX, KEY)
          </Label>
          <Input
            type="file"
            accept=".pdf,.ppt,.pptx,.key,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && uploadPresentation(e.target.files[0])}
            className="mt-1 max-w-md"
          />
          {presentationName && (
            <p className="text-xs text-muted-foreground mt-2">Yüklü: {presentationName}</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        <Button onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Bilgileri Kaydet
        </Button>
        {cfg.showVerifiedBadgeRequest && !isVerified && (
          <Button variant="outline" onClick={requestVerifiedBadge} className="gap-1.5">
            <BadgeCheck className="h-4 w-4 text-blue-500" /> Mavi Tik Başvur
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileCommonSettings;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Loader2, Linkedin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { useIsPremium } from "@/hooks/useIsPremium";
import { toast } from "@/hooks/use-toast";

const THEMES = [
  "IT",
  "Hekimler",
  "Profesyoneller",
  "İşletmeler",
  "Kuruluşlar",
  "Blogger/Vlogger",
  "Genel",
];

interface Props {
  trigger?: React.ReactNode;
  onCreated?: () => void;
}

const CreateCafeForm = ({ trigger, onCreated }: Props) => {
  const { user } = useAuth();
  const isPremium = useIsPremium();
  const navigate = useNavigate();
  const duration = isPremium ? 4 : 2;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("Genel");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [extra, setExtra] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cities = country ? countryCities[country] || [] : [];

  const submit = async () => {
    if (!user) {
      toast({ title: "Giriş yapmalısın", variant: "destructive" });
      return;
    }
    if (!name.trim() || !linkedin.trim()) {
      toast({ title: "Cafe adı ve LinkedIn zorunlu", variant: "destructive" });
      return;
    }
    try {
      new URL(linkedin);
    } catch {
      toast({ title: "Geçerli LinkedIn URL gir", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const opens = new Date();
    const closes = new Date(opens.getTime() + duration * 60 * 60 * 1000);
    const { data, error } = await supabase
      .from("cafes" as any)
      .insert({
        name: name.trim(),
        theme,
        country: country || null,
        city: city || null,
        linkedin_url: linkedin.trim(),
        extra_links: extra.trim() ? [extra.trim()] : [],
        created_by: user.id,
        opens_at: opens.toISOString(),
        closes_at: closes.toISOString(),
        duration_hours: duration,
      })
      .select("id")
      .single();

    if (error) {
      setSubmitting(false);
      const msg = error.message?.includes("cafes_name_unique_lower") || error.code === "23505"
        ? "Bu isimde bir cafe zaten var. Farklı bir isim seç."
        : error.message;
      toast({ title: "Cafe açılamadı", description: msg, variant: "destructive" });
      return;
    }

    // Auto-join own cafe (subject to daily limit)
    const cafeId = (data as any).id as string;
    await supabase.from("cafe_memberships" as any).insert({ cafe_id: cafeId, user_id: user.id });

    setSubmitting(false);
    setOpen(false);
    setName("");
    setLinkedin("");
    setExtra("");
    toast({ title: "Cafe açıldı ☕", description: `${duration} saat boyunca aktif.` });
    onCreated?.();
    navigate(`/cadde/${cafeId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="w-full gap-1.5 h-8 text-[11px]">
            <Coffee className="h-3.5 w-3.5" /> + Cafe Aç
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" /> Yeni Cafe Aç
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Cafe Adı *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Berlin Devs Cafe" maxLength={60} />
          </div>
          <div>
            <Label className="text-xs">Tema</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {THEMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Ülke</Label>
              <Select value={country} onValueChange={(v) => { setCountry(v); setCity(""); }}>
                <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {allCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Şehir</Label>
              <Select value={city} onValueChange={setCity} disabled={!country}>
                <SelectTrigger><SelectValue placeholder="Seç" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs flex items-center gap-1"><Linkedin className="h-3 w-3" /> LinkedIn URL *</Label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
          <div>
            <Label className="text-xs">Ek Link (opsiyonel)</Label>
            <Input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="https://..." />
          </div>
          <div className="rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
            Açılış süresi: <strong className="text-foreground">{duration} saat</strong>{" "}
            {isPremium ? "(Premium)" : "(Premium: 4 saat)"}
          </div>
          <Button className="w-full" disabled={submitting} onClick={submit}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Cafe'yi Aç
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCafeForm;

import { useEffect, useState } from "react";
import { MapPin, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { countryCities } from "@/data/countryCities";
import PhoneVerification from "@/components/PhoneVerification";

/**
 * Reusable settings block: required Country + City selectors (synced to profiles table)
 * and the PhoneVerification widget. Drop into the "Profil Ayarları" tab of every
 * profile type so onboarding completion fields are always editable.
 */
const ProfileLocationPhoneSettings = () => {
  const { profile, refreshProfile, isGlobalDiaspora } = useAuth();
  const { toast } = useToast();
  const [country, setCountry] = useState(profile?.country ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.country && !country) setCountry(profile.country);
    if (profile?.city && !city) setCity(profile.city);
  }, [profile?.country, profile?.city]);

  const countries = Object.keys(countryCities).sort();
  const cities = country && countryCities[country] ? countryCities[country] : [];

  const save = async () => {
    if (!country || !city) {
      toast({ title: "Ülke ve şehir zorunludur", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum bulunamadı");
      // Mark onboarding complete if phone already verified
      const updates: any = { country, city };
      if (profile?.phone_verified) updates.onboarding_completed = true;
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;
      toast({ title: "Konum kaydedildi" });
      await refreshProfile();
    } catch (e: any) {
      toast({ title: "Kaydedilemedi", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Label className="flex items-center gap-1.5 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary" /> Konum (zorunlu)
          </Label>
          {isGlobalDiaspora && (
            <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30">CorteQS Pasaport</Badge>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Ülke *</Label>
            <Select value={country} onValueChange={(v) => { setCountry(v); setCity(""); }}>
              <SelectTrigger><SelectValue placeholder="Ülke seçin" /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Şehir *</Label>
            <Select value={city} onValueChange={setCity} disabled={!country}>
              <SelectTrigger><SelectValue placeholder={country ? "Şehir seçin" : "Önce ülke"} /></SelectTrigger>
              <SelectContent>
                {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="sm" onClick={save} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Konumu Kaydet
        </Button>
      </div>

      <PhoneVerification />
    </div>
  );
};

export default ProfileLocationPhoneSettings;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FileText, Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ORGANIZATION_CATEGORIES, findOrgCategory } from "@/data/organizationCategories";
import { countryList } from "@/contexts/DiasporaContext";
import { countryCities } from "@/data/countryCities";

const STORAGE_KEY = "association_profile_v1";

export interface AssociationProfileData {
  name: string;
  categoryKey: string;
  subcategoryKey: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  country: string;
  city: string;
  address: string;
  founded: string;
}

export const defaultAssociationProfile: AssociationProfileData = {
  name: "",
  categoryKey: "",
  subcategoryKey: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  country: "",
  city: "",
  address: "",
  founded: "",
};

export const loadAssociationProfile = (): AssociationProfileData => {
  if (typeof window === "undefined") return defaultAssociationProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAssociationProfile;
    return { ...defaultAssociationProfile, ...JSON.parse(raw) };
  } catch {
    return defaultAssociationProfile;
  }
};

interface Props {
  onSaved?: (data: AssociationProfileData) => void;
}

const AssociationSettingsForm = ({ onSaved }: Props) => {
  const { toast } = useToast();
  const [data, setData] = useState<AssociationProfileData>(defaultAssociationProfile);

  useEffect(() => { setData(loadAssociationProfile()); }, []);

  const update = <K extends keyof AssociationProfileData>(k: K, v: AssociationProfileData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const cat = findOrgCategory(data.categoryKey);
  const cities = data.country && countryCities[data.country] ? countryCities[data.country] : [];

  const handleSave = () => {
    if (!data.name.trim()) {
      toast({ title: "Kuruluş adı zorunlu", variant: "destructive" });
      return;
    }
    if (!data.categoryKey) {
      toast({ title: "Kategori seçin", variant: "destructive" });
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast({ title: "Kaydedildi", description: "Kuruluş bilgileri güncellendi." });
    onSaved?.(data);
    window.dispatchEvent(new Event("association-profile-updated"));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Genel bilgiler */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Kuruluş Bilgileri
        </h2>
        <div className="space-y-4">
          <div>
            <Label>Kuruluş Adı *</Label>
            <Input value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="Örn. Almanya Türk Toplumu Derneği" />
          </div>

          <div>
            <Label>Ana Kategori *</Label>
            <Select value={data.categoryKey} onValueChange={(v) => { update("categoryKey", v); update("subcategoryKey", ""); }}>
              <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
              <SelectContent>
                {ORGANIZATION_CATEGORIES.map((c) => (
                  <SelectItem key={c.key} value={c.key}>{c.icon} {c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {cat && (
            <div>
              <Label>Tür (Alt Kategori) *</Label>
              <Select value={data.subcategoryKey} onValueChange={(v) => update("subcategoryKey", v)}>
                <SelectTrigger><SelectValue placeholder="Tür seçin" /></SelectTrigger>
                <SelectContent>
                  {cat.subcategories.map((s) => (
                    <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Tanıtım Metni</Label>
            <Textarea
              rows={4}
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Kuruluşunuzu kısaca tanıtın..."
              maxLength={500}
            />
          </div>

          <div>
            <Label>Kuruluş Yılı</Label>
            <Input
              type="number"
              value={data.founded}
              onChange={(e) => update("founded", e.target.value)}
              placeholder="2008"
            />
          </div>
        </div>
      </div>

      {/* İletişim & adres */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" /> İletişim & Adres
        </h2>
        <div className="space-y-4">
          <div>
            <Label>E-posta</Label>
            <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="iletisim@dernek.de" />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+49 30 1234567" />
          </div>
          <div>
            <Label>Web Sitesi</Label>
            <Input value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="dernek.de" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Ülke</Label>
              <Select value={data.country} onValueChange={(v) => { update("country", v); update("city", ""); }}>
                <SelectTrigger><SelectValue placeholder="Ülke" /></SelectTrigger>
                <SelectContent>
                  {countryList.filter((c) => c !== "all").map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Şehir</Label>
              <Select value={data.city} onValueChange={(v) => update("city", v)} disabled={!data.country}>
                <SelectTrigger><SelectValue placeholder={data.country ? "Şehir" : "Önce ülke seçin"} /></SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Açık Adres</Label>
            <Textarea
              rows={3}
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Sokak, No, Posta Kodu..."
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <Button className="w-full gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Bilgileri Kaydet
        </Button>
      </div>
    </div>
  );
};

export default AssociationSettingsForm;

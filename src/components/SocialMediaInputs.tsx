import { useState } from "react";
import { Globe, Instagram, Facebook, Linkedin, Youtube, Twitter, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SocialMediaValues {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
  website?: string;
}

const FIELDS: Array<{
  key: keyof SocialMediaValues;
  label: string;
  placeholder: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  { key: "instagram", label: "Instagram", placeholder: "@kullaniciadi veya tam URL", Icon: Instagram, color: "text-pink-500" },
  { key: "facebook", label: "Facebook", placeholder: "Sayfa URL'si", Icon: Facebook, color: "text-blue-600" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/...", Icon: Linkedin, color: "text-sky-700" },
  { key: "youtube", label: "YouTube", placeholder: "@kanal veya URL", Icon: Youtube, color: "text-red-600" },
  { key: "tiktok", label: "TikTok", placeholder: "@kullaniciadi", Icon: Music2, color: "text-foreground" },
  { key: "x", label: "X (Twitter)", placeholder: "@kullaniciadi", Icon: Twitter, color: "text-foreground" },
  { key: "website", label: "Web Sitesi", placeholder: "https://...", Icon: Globe, color: "text-primary" },
];

interface Props {
  defaultValues?: SocialMediaValues;
  title?: string;
}

const SocialMediaInputs = ({ defaultValues = {}, title = "Sosyal Medya Hesapları" }: Props) => {
  const [values, setValues] = useState<SocialMediaValues>(defaultValues);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
      <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" /> {title}
      </h2>
      <p className="text-xs text-muted-foreground font-body mb-5">
        Profilinde göstereceğin sosyal medya hesaplarını ekle. Boş bırakılan alanlar profilde görünmez.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, placeholder, Icon, color }) => (
          <div key={key}>
            <Label className="flex items-center gap-1.5">
              <Icon className={`h-4 w-4 ${color}`} /> {label}
            </Label>
            <Input
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              placeholder={placeholder}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaInputs;

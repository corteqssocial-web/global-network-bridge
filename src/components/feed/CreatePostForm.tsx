import { useState } from "react";
import { Send, MapPin, Globe } from "lucide-react";
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

const CreatePostForm = ({ onCreated, cafeId }: Props) => {
  const { user, accountType } = useAuth();
  const [content, setContent] = useState("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const cities = country ? countryCities[country] || [] : [];

  const submit = async () => {
    if (!user) {
      toast({ title: "Giriş yapmalısınız", variant: "destructive" });
      return;
    }
    if (!content.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from("feed_posts").insert({
      user_id: user.id,
      content: content.trim(),
      country: country || null,
      city: city || null,
      author_role: accountType || "user",
      ...(cafeId ? { cafe_id: cafeId } : {}),
    } as any);
    setSubmitting(false);

    if (error) {
      toast({ title: "Paylaşım eklenemedi", description: error.message, variant: "destructive" });
      return;
    }
    setContent("");
    setCountry("");
    setCity("");
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
      <p className="text-[11px] text-muted-foreground">
        İstersen @Ülke veya @Şehir etiketleyerek o bölgenin akışında görün. Boş bırakırsan global yayınlanır.
      </p>
      <div className="flex flex-wrap gap-2">
        <Select value={country} onValueChange={(v) => { setCountry(v); setCity(""); }}>
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
        <Select value={city} onValueChange={setCity} disabled={!country}>
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
        {(country || city) && (
          <div className="flex items-center gap-1 text-[11px] flex-wrap">
            {city && <span className="px-1.5 py-0.5 rounded-full bg-turquoise/10 text-turquoise font-semibold">@{city}</span>}
            {country && <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">@{country}</span>}
          </div>
        )}
        <Button
          onClick={submit}
          disabled={submitting || !content.trim()}
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

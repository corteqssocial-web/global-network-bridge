import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Coffee, Calendar, MessageSquare, Info, ShieldCheck, Users, Heart, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFollow } from "@/hooks/useFollow";

interface Props {
  name: string;
  avatarInitials: string;
  tagline?: string;
  worldMessage?: string;
  city?: string;
  country?: string;
  corteqsPassport?: boolean;
  recentEvents: Array<{ id: string; title: string; date: string; city?: string; source: "joined" | "followed" }>;
  relocating?: { country?: string; city?: string } | null;
}

const IndividualPublicCard = ({
  name,
  avatarInitials,
  tagline,
  worldMessage,
  city,
  country,
  corteqsPassport,
  recentEvents,
  relocating,
}: Props) => {
  const { user } = useAuth();
  const { list } = useFollow();
  const [activeCafe, setActiveCafe] = useState<{ id: string; name: string; theme?: string } | null>(null);
  const [followers, setFollowers] = useState<number>(0);
  const followingCount = list("user").length;

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      // Active cafe membership in the last 24h
      const { data } = await supabase
        .from("cafe_memberships")
        .select("cafe_id, joined_at, cafes:cafe_id(id, name, theme, closes_at)")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const row: any = data?.[0];
      if (row?.cafes && new Date(row.cafes.closes_at).getTime() > Date.now()) {
        setActiveCafe({ id: row.cafes.id, name: row.cafes.name, theme: row.cafes.theme });
      }
      const { count } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);
      if (!cancelled) setFollowers(count || 0);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
      <div className="flex items-start gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shrink-0">
          {avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-foreground">{name}</h2>
            {corteqsPassport && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30">
                      <ShieldCheck className="h-3 w-3" /> CorteQS Pasaportu
                      <Info className="h-3 w-3 opacity-70" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    Yabancı telefon ile kayıt olan diaspora üyelerine verilen dijital kimliktir.
                    Profilini doğrulanmış olarak gösterir; etkinlik ve hizmetlerde öncelik sağlar.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {tagline && <p className="text-sm text-muted-foreground italic mt-0.5">"{tagline}"</p>}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> <strong className="text-foreground">{followers}</strong> takipçi</span>
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> <strong className="text-foreground">{followingCount}</strong> takip</span>
            {(city || country) && (
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {[city, country].filter(Boolean).join(", ")}</span>
            )}
          </div>

          {worldMessage && (
            <div className="mt-3 rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm text-foreground/90">
              <span className="text-xs font-semibold text-primary mr-2">Dünyaya Mesajım:</span>
              {worldMessage}
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" className="gap-1.5">
          <MessageSquare className="h-4 w-4" /> Mesaj Gönder
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Son 2 ayda etkinlikler</span>
          </div>
          {recentEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground">Henüz etkinlik yok.</p>
          ) : (
            <ul className="space-y-1">
              {recentEvents.slice(0, 4).map((e) => (
                <li key={e.id} className="text-xs flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px]">{e.source === "joined" ? "Katıldı" : "Takip"}</Badge>
                  <span className="truncate">{e.title}</span>
                  <span className="text-muted-foreground ml-auto shrink-0">{e.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border p-3">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold">Cadde'de Takılıyor</span>
          </div>
          {activeCafe ? (
            <Link to={`/cadde/${activeCafe.id}`} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              ☕ {activeCafe.name}{activeCafe.theme ? ` · ${activeCafe.theme}` : ""}
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground">Şu an aktif bir cafe'de değil.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndividualPublicCard;

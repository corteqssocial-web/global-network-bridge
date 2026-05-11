import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Cafe {
  id: string;
  name: string;
  theme: string;
  country: string | null;
  city: string | null;
  linkedin_url: string;
  extra_links: any;
  created_by: string;
  opens_at: string;
  closes_at: string;
  duration_hours: number;
  created_at: string;
}

export const useActiveCafes = (filters?: { countries?: string[]; cities?: string[] }) => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("cafes" as any)
      .select("*")
      .gt("closes_at", new Date().toISOString())
      .order("opens_at", { ascending: false });
    if (filters?.cities && filters.cities.length > 0) q = q.in("city", filters.cities);
    else if (filters?.countries && filters.countries.length > 0) q = q.in("country", filters.countries);
    const { data, error } = await q;
    setLoading(false);
    if (!error && data) setCafes(data as unknown as Cafe[]);
  }, [JSON.stringify(filters?.countries || []), JSON.stringify(filters?.cities || [])]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { cafes, loading, refresh };
};

export const useCafe = (cafeId: string | undefined) => {
  const { user } = useAuth();
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!cafeId) return;
    setLoading(true);
    const { data } = await supabase.from("cafes" as any).select("*").eq("id", cafeId).maybeSingle();
    setCafe((data as unknown as Cafe) || null);
    if (user) {
      const { data: m } = await supabase
        .from("cafe_memberships" as any)
        .select("id")
        .eq("cafe_id", cafeId)
        .eq("user_id", user.id)
        .maybeSingle();
      setIsMember(!!m);
    }
    setLoading(false);
  }, [cafeId, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const join = async () => {
    if (!user) {
      toast({ title: "Giriş yapmalısın", variant: "destructive" });
      return false;
    }
    if (!cafeId) return false;
    const { error } = await supabase
      .from("cafe_memberships" as any)
      .insert({ cafe_id: cafeId, user_id: user.id });
    if (error) {
      const msg = error.message?.includes("daily_cafe_limit")
        ? "Bugün başka bir cafe'ye katıldın. Yarın tekrar dene."
        : error.message;
      toast({ title: "Cafe'ye katılınamadı", description: msg, variant: "destructive" });
      return false;
    }
    setIsMember(true);
    toast({ title: "Cafe'ye katıldın 🎉" });
    return true;
  };

  return { cafe, isMember, loading, join, refresh };
};

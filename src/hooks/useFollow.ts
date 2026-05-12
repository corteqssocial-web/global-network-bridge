import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "corteqs:followed";

type FollowMap = Record<string, true>;

const read = (): FollowMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const write = (map: FollowMap) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("corteqs:follow-change"));
  } catch {}
};

const makeKey = (kind: string, id: string) => `${kind}:${id}`;

export function useFollow() {
  const [map, setMap] = useState<FollowMap>(() => (typeof window !== "undefined" ? read() : {}));
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setMap(read());
    window.addEventListener("storage", sync);
    window.addEventListener("corteqs:follow-change", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("corteqs:follow-change", sync as EventListener);
    };
  }, []);

  const isFollowed = useCallback(
    (kind: string, id: string) => !!map[makeKey(kind, id)],
    [map]
  );

  const toggle = useCallback(
    (kind: string, id: string, name: string) => {
      if (!user) {
        toast({
          title: "Giriş gerekli",
          description: "Takip etmek için lütfen giriş yapın veya kayıt olun.",
          variant: "destructive",
        });
        navigate("/auth");
        return false;
      }
      const key = makeKey(kind, id);
      const current = read();
      if (current[key]) {
        delete current[key];
        write(current);
        setMap({ ...current });
        toast({ title: "Takipten çıkıldı", description: `${name} artık takip edilmiyor.` });
        return false;
      }
      current[key] = true;
      write(current);
      setMap({ ...current });
      toast({ title: "Takip edildi! 🔔", description: `${name} yeni paylaşım yaptığında bildirim alacaksınız.` });
      return true;
    },
    [toast]
  );

  const list = useCallback(
    (kind?: string) => {
      const entries = Object.keys(map);
      if (!kind) return entries;
      const prefix = `${kind}:`;
      return entries.filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length));
    },
    [map]
  );

  return { isFollowed, toggle, list };
}

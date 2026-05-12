import { Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Returns whether the current user must finish setup (phone verification)
 * before unlocking the rest of their dashboard tabs.
 * Admin role is always unlocked.
 */
export const useProfileGate = () => {
  const { profile, accountType } = useAuth();
  const verified = !!profile?.phone_verified;
  const locked = accountType !== "admin" && !verified;
  return { locked, verified };
};

/**
 * Banner explaining that the dashboard is locked until phone verification.
 * Render right above the dashboard tabs.
 */
export const ProfileSetupBanner = () => {
  const { locked } = useProfileGate();
  if (!locked) return null;
  return (
    <div className="mb-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-4 flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
        <Lock className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          Panel Kilitli — Önce Profil Ayarları
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Cadde'de gezebilmek ve diğer sekmeleri kullanabilmek için <strong>Profil Ayarları</strong> sekmesinde
          telefonunu doğrula. Doğrulama sonrası <span className="inline-flex items-center gap-1 font-semibold text-amber-700"><ShieldCheck className="h-3.5 w-3.5" /> CorteQS / Diaspora Pasaport</span> rozetin aktifleşir.
        </p>
      </div>
    </div>
  );
};

export default ProfileSetupBanner;

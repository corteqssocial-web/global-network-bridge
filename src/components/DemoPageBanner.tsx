import { Sparkles, Crown, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DemoPageBannerProps {
  /** Hangi kategori sayfasındayız ("Danışmanlık" / "İşletmeler" / "Kuruluşlar") */
  categoryLabel: string;
  /** Geri dönüş yapılacak liste sayfası */
  listingHref: string;
}

/**
 * Detay sayfalarının tepesine yerleştirilen ince DEMO bantı.
 * Üstte küçük, az yer kaplayan; tek satırda CTA'lı.
 */
const DemoPageBanner = ({ categoryLabel, listingHref }: DemoPageBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-gold/15 via-orange-50 to-turquoise/10 border-y border-gold/30">
      <div className="container mx-auto px-4 py-3 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold shrink-0" />
          <span className="font-extrabold uppercase tracking-[0.2em] text-sm md:text-base text-foreground">
            DEMO Hesap Görünümü
          </span>
          <Sparkles className="h-4 w-4 text-gold shrink-0" />
        </div>
        <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
          Bu profil örnek içeriktir. {categoryLabel} kategorimize başvurular değerlendirildikçe gerçek profiller yayına alınır.
        </p>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Link to="/founders-1000">
            <Button size="sm" variant="default" className="h-7 text-xs gap-1 bg-gold text-foreground hover:bg-gold/90">
              <Crown className="h-3 w-3" /> Founders 1000
            </Button>
          </Link>
          <Link to={`${listingHref}#kayit-form`}>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-turquoise text-turquoise hover:bg-turquoise/10">
              <UserPlus className="h-3 w-3" /> Kayıt Ol
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DemoPageBanner;

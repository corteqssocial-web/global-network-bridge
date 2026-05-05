import { Globe, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { diasporaOptions } from "@/contexts/DiasporaContext";
import corteqsLogo from "@/assets/corteqs-logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={corteqsLogo} alt="CorteQS" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-secondary-foreground/60 font-body">
              Türk diasporasını birleştiren global platform.
            </p>
            <div className="flex gap-2 mt-4">
              {diasporaOptions.map((opt) => (
                <span key={opt.key} className="text-lg" title={opt.label}>{opt.flag}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60 font-body">
              <li><Link to="/consultants" className="hover:text-primary transition-colors">Danışmanlar</Link></li>
              <li><Link to="/associations" className="hover:text-primary transition-colors">Kuruluşlar</Link></li>
              <li><Link to="/businesses" className="hover:text-primary transition-colors">İşletmeler</Link></li>
              <li><Link to="/bloggers" className="hover:text-primary transition-colors">Blogger / Vlogger / YouTuber</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">Etkinlikler</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Topluluk</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60 font-body">
              <li>
                <Link to="/city-ambassadors" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5" />Şehir Elçisi Ol
                </Link>
              </li>
              <li><Link to="/whatsapp-groups" className="hover:text-primary transition-colors">WhatsApp Grupları</Link></li>
              <li><Link to="/blog-contest" className="hover:text-primary transition-colors">Blog Yarışması</Link></li>
              <li><Link to="/map" className="hover:text-primary transition-colors">Harita</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Kurumsal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60 font-body">
              <li><a href="#" className="hover:text-primary transition-colors">Hakkımızda</a></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link></li>
              <li><Link to="/founders-1000" className="hover:text-primary transition-colors">Founding 1000</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">İletişim</a></li>
              <li><Link to="/kariyer" className="hover:text-primary transition-colors">Kariyer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Yasal</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60 font-body">
              <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/legal/terms" className="hover:text-primary transition-colors">Kullanım Şartları</Link></li>
              <li><Link to="/legal/kvkk" className="hover:text-primary transition-colors">KVKK / GDPR / CCPA</Link></li>
              <li><Link to="/legal/cookies" className="hover:text-primary transition-colors">Çerez Politikası</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-sm text-secondary-foreground/40 font-body">
          © 2026 CorteQS. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

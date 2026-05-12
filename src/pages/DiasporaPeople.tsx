import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Sparkles } from "lucide-react";
import DiasporaPeopleSearch from "@/components/feed/DiasporaPeopleSearch";

const DiasporaPeople = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="h-2 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-rose-500" />
      </div>

      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <header className="mb-6 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Diaspora Topluluğu
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-sky-500" /> Diasporada İnsanları Ara
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Ülke ve şehir bazlı filtreleyerek; iş arayanları, yakında taşınacakları ve aktif olanları (Cadde'de) bul.
            </p>
          </header>

          {/* Search panel */}
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-5 shadow-card">
            <DiasporaPeopleSearch />
          </div>

          {/* Info chips */}
          <div className="max-w-2xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-emerald-600 mb-1">🟢 Cadde'de</div>
              <p className="text-muted-foreground">Yeşil nokta şu an aktif cafelerde olan üyeleri gösterir.</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-turquoise mb-1">💼 İş Arayanlar</div>
              <p className="text-muted-foreground">Profil ayarlarında "İş Arıyorum" toggle'ı açık olan üyeler.</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-amber-600 mb-1">✈️ Taşınacaklar</div>
              <p className="text-muted-foreground">"Yakında Taşınacağım" alanını dolduran üyeler.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiasporaPeople;

import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Users, Sparkles, MapPin, Coffee, Calendar, MessageSquare, ShieldCheck, Plane, Briefcase, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DiasporaPeopleSearch from "@/components/feed/DiasporaPeopleSearch";

interface MockUser {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  worldMessage: string;
  city: string;
  country: string;
  followers: number;
  following: number;
  passport: boolean;
  inCadde: boolean;
  cafeName?: string;
  jobSeeking?: boolean;
  relocating?: { city: string; country: string };
  recentEvents: Array<{ title: string; date: string; type: "joined" | "followed" }>;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    name: "Berk Kural",
    initials: "BK",
    tagline: "Berlin'de fullstack geliştirici, açık kaynağa katkı",
    worldMessage: "Diasporadaki yazılımcılarla bağ kuralım — birlikte daha güçlüyüz.",
    city: "Berlin",
    country: "Almanya",
    followers: 142,
    following: 87,
    passport: true,
    inCadde: true,
    cafeName: "Berlin IT Cafe",
    jobSeeking: false,
    recentEvents: [
      { title: "Berlin Türk Devs Meetup", date: "8 May", type: "joined" },
      { title: "Avrupa Startup Demo Day", date: "22 Nis", type: "followed" },
    ],
  },
  {
    id: "u2",
    name: "Ayşe Demir",
    initials: "AD",
    tagline: "Londra'da pazarlama uzmanı, yeni fırsatlara açık",
    worldMessage: "Kariyer geçişimde mentor arıyorum 💪",
    city: "Londra",
    country: "İngiltere",
    followers: 98,
    following: 132,
    passport: true,
    inCadde: false,
    jobSeeking: true,
    recentEvents: [
      { title: "Londra Diaspora Brunch", date: "29 Nis", type: "joined" },
    ],
  },
  {
    id: "u3",
    name: "Mehmet Yıldız",
    initials: "MY",
    tagline: "Yakında Amsterdam'a taşınıyorum 🇳🇱",
    worldMessage: "Amsterdam'da daire ve okul önerilerine açığım, teşekkürler!",
    city: "İstanbul",
    country: "Türkiye",
    followers: 54,
    following: 67,
    passport: false,
    inCadde: true,
    cafeName: "Relocation Amsterdam",
    relocating: { city: "Amsterdam", country: "Hollanda" },
    recentEvents: [
      { title: "Hollanda Vize Webinar", date: "5 May", type: "joined" },
    ],
  },
  {
    id: "u4",
    name: "Selin Aktaş",
    initials: "SA",
    tagline: "New York'ta sanat tarihçisi & blogger",
    worldMessage: "Galeri açılışı için NY'deki Türklerle buluşmak isterim.",
    city: "New York",
    country: "ABD",
    followers: 312,
    following: 201,
    passport: true,
    inCadde: false,
    recentEvents: [
      { title: "NY Sanat Türk Buluşma", date: "30 Nis", type: "joined" },
      { title: "Diaspora Yayıncıları", date: "18 Nis", type: "followed" },
    ],
  },
];

const UserCard = ({ u }: { u: MockUser }) => (
  <div className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow">
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          {u.initials}
        </div>
        {u.inCadde && (
          <span
            title="Şu an Cadde'de"
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 ring-2 ring-card animate-pulse"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="text-base font-bold truncate">{u.name}</h3>
          {u.passport && (
            <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">
              <ShieldCheck className="h-2.5 w-2.5" /> Pasaport
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground italic line-clamp-2 mt-0.5">"{u.tagline}"</p>
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> <strong className="text-foreground">{u.followers}</strong></span>
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> <strong className="text-foreground">{u.following}</strong></span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {u.city}, {u.country}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-3">
      {u.inCadde && (
        <Badge className="gap-1 bg-gradient-to-r from-orange-500/15 to-rose-500/15 text-rose-600 border-rose-500/30 text-[10px]">
          <Coffee className="h-2.5 w-2.5" /> Cadde'de: {u.cafeName}
        </Badge>
      )}
      {u.jobSeeking && (
        <Badge className="gap-1 bg-turquoise/15 text-turquoise border-turquoise/30 text-[10px]">
          <Briefcase className="h-2.5 w-2.5" /> İş Arıyor
        </Badge>
      )}
      {u.relocating && (
        <Badge className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30 text-[10px]">
          <Plane className="h-2.5 w-2.5" /> {u.relocating.city}'e taşınıyor
        </Badge>
      )}
    </div>

    <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
      <span className="font-semibold text-primary mr-1">Mesajım:</span>
      {u.worldMessage}
    </div>

    <div className="mt-3 border-t border-border pt-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Calendar className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold">Son etkinlikler</span>
      </div>
      <ul className="space-y-1">
        {u.recentEvents.map((e, i) => (
          <li key={i} className="text-[11px] flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] h-4 px-1">{e.type === "joined" ? "Katıldı" : "Takip"}</Badge>
            <span className="truncate">{e.title}</span>
            <span className="text-muted-foreground ml-auto">{e.date}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="flex gap-2 mt-3">
      <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8">
        <MessageSquare className="h-3.5 w-3.5" /> Mesaj
      </Button>
      <Button variant="default" size="sm" className="flex-1 h-8">Profili Gör</Button>
    </div>
  </div>
);

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
          <header className="mb-8 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Diaspora Topluluğu
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-sky-500" /> Diasporada İnsanlar
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Dünyanın her yerindeki diaspora üyelerini keşfet — ülke ve şehir bazlı filtrele,
              <span className="inline-flex items-center gap-1 mx-1">
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 animate-pulse inline-block" />
                Cadde'de gezenleri
              </span>
              anlık gör, mesaj at, takip et.
            </p>
          </header>

          {/* Search panel */}
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-5 shadow-card mb-10">
            <DiasporaPeopleSearch />
          </div>

          {/* Featured mock individual cards */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" /> Öne Çıkan Üyeler
              </h2>
              <Link to="/cadde" className="text-xs text-primary font-semibold hover:underline">
                Cadde akışında gör →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MOCK_USERS.map((u) => <UserCard key={u.id} u={u} />)}
            </div>
          </section>

          {/* Info chips */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-rose-600 mb-1 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-orange-500 to-rose-500" /> Cadde'de Geziyor
              </div>
              <p className="text-muted-foreground">Turuncu-kırmızı nokta şu an aktif cafe'de olan üyeleri gösterir.</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-turquoise mb-1">💼 İş Arayanlar</div>
              <p className="text-muted-foreground">Profil ayarlarında "İş Arıyorum" toggle'ı açık üyeler.</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-amber-600 mb-1">✈️ Taşınacaklar</div>
              <p className="text-muted-foreground">"Yakında Taşınacağım" alanını dolduran üyeler.</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <div className="font-semibold text-amber-700 mb-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> CorteQS Pasaportu
              </div>
              <p className="text-muted-foreground">Yabancı tel. ile kayıt olan diaspora üyelerine özel doğrulama.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiasporaPeople;

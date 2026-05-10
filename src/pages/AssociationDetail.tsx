import { useFollow } from "@/hooks/useFollow";
import { useParams, Link } from "react-router-dom";
import { Users, MapPin, Calendar as CalendarIcon, Globe as GlobeIcon, ArrowLeft, ExternalLink, MessageSquare, Share2, UserPlus, UserCheck, Heart, CreditCard, Ticket, Music, Radio, Landmark, Clock, FileText, Stethoscope, Navigation, Mail, Phone, Instagram, Facebook, Award, Target, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { associations } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";
import DemoPageBanner from "@/components/DemoPageBanner";
import DemoTabPlaceholder from "@/components/DemoTabPlaceholder";
import PublicEventsList from "@/components/PublicEventsList";

const AssociationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const assoc = associations.find((a) => a.id === id);
  const { isFollowed, toggle } = useFollow();
  const isFollowing = assoc ? isFollowed("association", assoc.id) : false;

  if (!assoc) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Kuruluş bulunamadı</h1>
          <Link to="/associations" className="text-primary hover:underline">← Kuruluşlara dön</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleFollow = () => {
    toggle("association", assoc.id, assoc.name);
  };

  const sampleAnnouncements = [
    { id: 1, category: "eğitim" as const, title: "Türkçe Dil Kursu Kayıtları Açıldı", content: "Yetişkinler için A1-B2 seviye Türkçe kurslarımıza kayıt olabilirsiniz. Kurslar Mart ayında başlıyor.", link: assoc.website, date: "03 Mar 2026", author: assoc.name },
    { id: 2, category: "gönüllü" as const, title: "Gönüllü Arayışı — Bahar Festivali", content: "23 Nisan etkinliğimizde gönüllü olarak yer almak ister misiniz? Organizasyon, sahne ve ikram ekiplerine ihtiyacımız var.", date: "01 Mar 2026", author: assoc.name },
    { id: 3, category: "kampanya" as const, title: "Burs Fonu Kampanyası", content: "Diaspora gençlerine yönelik burs fonumuza destek olun. Hedefimiz 50 öğrenciye eğitim bursu sağlamak.", image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=400&h=200&fit=crop", date: "25 Şub 2026", author: assoc.name },
    { id: 4, category: "indirim" as const, title: "Üyelere Özel Etkinlik İndirimi", content: "Dernek üyelerine tüm etkinliklerde %20 indirim. Üyelik kartınızı göstermeniz yeterli.", date: "20 Şub 2026", author: assoc.name },
  ];

  const isDiplomatic = ["Büyükelçilik", "Konsolosluk"].includes(assoc.type);
  const isHospital = assoc.type === "Hastane";

  const consulateServices = [
    { title: "Pasaport İşlemleri", desc: "Yeni pasaport, yenileme ve kayıp pasaport", icon: FileText },
    { title: "Nüfus İşlemleri", desc: "Doğum, evlilik, vefat ve adres kaydı", icon: Users },
    { title: "Noter / Tasdik", desc: "Belge onayı, vekâletname ve apostil", icon: FileText },
    { title: "Askerlik İşlemleri", desc: "Tecil, dövizle askerlik ve bilgi", icon: Landmark },
    { title: "Vize Başvuruları", desc: "Türkiye vizesi ve konsolosluk onayı", icon: GlobeIcon },
    { title: "Seçim / Oy Kullanma", desc: "Yurtdışı seçmen kaydı ve bilgi", icon: CalendarIcon },
  ];

  const consulateEvents = [
    { title: "29 Ekim Cumhuriyet Bayramı Resepsiyonu", date: "29 Eki 2026", type: "Resmi Davet" },
    { title: "23 Nisan Çocuk Bayramı Kutlaması", date: "23 Nis 2026", type: "Etkinlik" },
    { title: "Konsolosluk Günleri - Gezici Hizmet", date: "15 Mar 2026", type: "Hizmet" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <DemoPageBanner categoryLabel="Kuruluşlar" listingHref="/associations" />
      </div>
      <main className="pt-8 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/associations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kuruluşlara dön
          </Link>

          {/* Header */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-2xl md:text-3xl shrink-0">
                {assoc.logo}
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                  {assoc.type}
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{assoc.name}</h1>
                  <Button
                    variant={isFollowing ? "secondary" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={toggleFollow}
                  >
                    {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                    {isFollowing ? "Takipte" : "Takip Et"}
                  </Button>
                </div>
                <p className="text-muted-foreground font-body mt-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {assoc.city}, {assoc.country}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5 bg-muted/60 rounded-full px-2.5 py-1 w-fit">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="h-3.5 w-3.5" />
                  <span className="text-sm font-semibold text-foreground">4.{Math.floor(Math.random() * 3) + 5}</span>
                  <span className="text-xs text-muted-foreground">Google Rating</span>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{assoc.members.toLocaleString()}</span>
                    <span className="text-muted-foreground">üye</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{assoc.events}</span>
                    <span className="text-muted-foreground">etkinlik</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Kuruluş: {assoc.founded}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                {isHospital ? (
                  <>
                    <Link to={`/hospital-appointment/${assoc.id}`}>
                      <Button variant="default" className="gap-2 w-full bg-turquoise hover:bg-turquoise/90 text-primary-foreground">
                        <Stethoscope className="h-4 w-4" /> Randevu Al
                      </Button>
                    </Link>
                    <a href={assoc.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2 w-full">
                        <GlobeIcon className="h-4 w-4" /> Web Sitesi
                      </Button>
                    </a>
                    <Button variant="outline" className="gap-2 w-full">
                      <MessageSquare className="h-4 w-4" /> İletişim
                    </Button>
                  </>
                ) : isDiplomatic ? (
                  <>
                    <Button variant="default" className="gap-2 w-full">
                      <CalendarIcon className="h-4 w-4" /> Randevu Al
                    </Button>
                    <Button variant="outline" className="gap-2 w-full">
                      <FileText className="h-4 w-4" /> E-Konsolosluk
                    </Button>
                    <Button variant="outline" className="gap-2 w-full">
                      <MessageSquare className="h-4 w-4" /> İletişim
                    </Button>
                  </>
                ) : (
                  <>
                    {assoc.type === "Radyo" && (
                      <Link to={`/radio/${assoc.id}/song-request`}>
                        <Button variant="default" className="gap-2 w-full bg-purple-600 hover:bg-purple-700">
                          <Music className="h-4 w-4" /> İstek Parça Gönder
                        </Button>
                      </Link>
                    )}
                    <Button variant={assoc.type === "Radyo" ? "outline" : "default"} className="gap-2 w-full">
                      <Users className="h-4 w-4" /> {assoc.type === "Radyo" ? "Dinle" : "Üye Ol"}
                    </Button>
                    {assoc.type !== "Radyo" && assoc.type !== "TV Kanalı" && (
                      <>
                        <Button variant="outline" className="gap-2 w-full">
                          <CreditCard className="h-4 w-4" /> Aidat Öde
                        </Button>
                        <Button variant="outline" className="gap-2 w-full">
                          <Heart className="h-4 w-4" /> Bağış Yap
                        </Button>
                      </>
                    )}
                    <Button variant="outline" className="gap-2 w-full">
                      <MessageSquare className="h-4 w-4" /> Mesaj Gönder
                    </Button>
                  </>
                )}
                <Button variant="outline" className="gap-2 w-full">
                  <Share2 className="h-4 w-4" /> Paylaş
                </Button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assoc.name + ', ' + assoc.city + ', ' + assoc.country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 w-full">
                    <MapPin className="h-4 w-4" /> Konum
                  </Button>
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(assoc.name + ', ' + assoc.city + ', ' + assoc.country)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 w-full">
                    <Navigation className="h-4 w-4" /> Yol Tarifi
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
              <TabsTrigger value="about">Hakkında</TabsTrigger>
              <TabsTrigger value="events">Etkinlikler</TabsTrigger>
              <TabsTrigger value="members">Üyeler</TabsTrigger>
              <TabsTrigger value="contact">İletişim</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <DemoTabPlaceholder label="Hakkında — Demo" />
            </TabsContent>

            <TabsContent value="events" className="mt-6">
              <PublicEventsList emptyLabel="Bu kuruluşun yaklaşan etkinliği yok." />
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <DemoTabPlaceholder label="Üyeler — Demo" />
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <DemoTabPlaceholder label="İletişim — Demo" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssociationDetail;

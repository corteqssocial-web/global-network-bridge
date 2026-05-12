import { useAuth } from "@/contexts/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import PlatformMessageButton from "@/components/messaging/PlatformMessageButton";
import { useFollow } from "@/hooks/useFollow";
import { Star, Bot, MessageSquare, Calendar, Video, Globe as GlobeIcon, ArrowLeft, ExternalLink, UserPlus, UserCheck, Zap, Info, Clock, Home, MapPin, BedDouble, Bath, Maximize, Crown, Navigation, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { consultants } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import AppointmentBookingDialog from "@/components/booking/AppointmentBookingDialog";
import DemoPageBanner from "@/components/DemoPageBanner";
import DemoTabPlaceholder from "@/components/DemoTabPlaceholder";
import DetailAuthLock from "@/components/DetailAuthLock";
import PublicEventsList from "@/components/PublicEventsList";
import { useConsultantFeatures } from "@/hooks/useProfileFeatures";

const ConsultantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const consultant = consultants.find((c) => c.id === id);
  const { isFollowed, toggle } = useFollow();
  const isFollowing = consultant ? isFollowed("consultant", consultant.id) : false;
  const [bookingOpen, setBookingOpen] = useState(false);
  const navigate = useNavigate();
  const { isEnabled, isComingSoon } = useConsultantFeatures("__demo__");

  // Check if logged-in user is the consultant (mock: match by email or id)
  const isOwner = !!user && !!consultant;

  if (!consultant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Danışman bulunamadı</h1>
          <Link to="/consultants" className="text-primary hover:underline">← Danışmanlara dön</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleFollow = () => {
    toggle("consultant", consultant.id, consultant.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <DemoPageBanner categoryLabel="Danışmanlık" listingHref="/consultants" />
        <div className="container mx-auto px-4">
          <Link to="/consultants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Danışmanlara dön
          <Link to="/consultants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Danışmanlara dön
          </Link>
          <DetailAuthLock category="danışman kartı" />

          {/* Free Banner */}
          <div className="bg-gradient-to-r from-turquoise/10 via-primary/10 to-gold/10 border border-primary/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">İlk 10 dakika ücretsiz! 🎁</p>
              <p className="text-xs text-muted-foreground font-body">Canlı görüşme ve AI Twin seanslarında ilk 10 dakika tamamen ücretsiz.</p>
            </div>
          </div>

          {/* Header */}
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card mb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-2xl md:text-3xl shrink-0">
                {consultant.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{consultant.name}</h1>
                  {isEnabled("message") && (
                    <PlatformMessageButton recipientKind="consultant" recipientSlug={consultant.id} recipientName={consultant.name} fullWidth />
                  )}
                  {isEnabled("follow") && (
                    <Button
                      variant={isFollowing ? "secondary" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={toggleFollow}
                    >
                      {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                      {isFollowing ? "Takipte" : "Takip Et"}
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground font-body mt-1">{consultant.role}</p>
                <p className="text-sm text-muted-foreground font-body mt-1">📍 {consultant.city}, {consultant.country}</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-gold fill-gold" />
                    <span className="font-semibold text-foreground">{consultant.rating}</span>
                    <span className="text-sm text-muted-foreground">({consultant.reviews} değerlendirme)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/60 rounded-full px-2.5 py-1">
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="h-3.5 w-3.5" />
                    <span className="text-sm font-semibold text-foreground">4.{Math.floor(Math.random() * 3) + 7}</span>
                    <span className="text-xs text-muted-foreground">Google</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {consultant.languages.map((l) => (
                    <span key={l} className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1">{l}</span>
                  ))}
                </div>
              </div>

              {/* CTAs with pricing */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                {(isEnabled("live_call") || isEnabled("ai_twin")) && (
                  <div className="bg-muted/50 rounded-xl p-3 mb-1">
                    <p className="text-xs text-muted-foreground font-body text-center mb-2">Görüşme Ücretleri</p>
                    <div className="flex gap-4 justify-center text-center">
                      {isEnabled("live_call") && (
                        <div>
                          <p className="text-lg font-bold text-foreground">€</p>
                          <p className="text-[10px] text-muted-foreground">Canlı / 30dk</p>
                        </div>
                      )}
                      {isEnabled("live_call") && isEnabled("ai_twin") && <div className="w-px bg-border" />}
                      {isEnabled("ai_twin") && (
                        <div>
                          <p className="text-lg font-bold text-success">Ücretsiz</p>
                          <p className="text-[10px] text-muted-foreground">AI Twin / 15dk</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* CTAs with availability badges */}
                <TooltipProvider>
                  {isEnabled("live_call") && (
                    <Button variant="default" className="gap-2 w-full relative">
                      <span className="absolute -top-2 -right-2 bg-[hsl(var(--success))] text-primary-foreground text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Şu an müsait
                      </span>
                      <Video className="h-4 w-4" /> Canlı Görüşme — € / 30dk
                    </Button>
                  )}

                  {isEnabled("ai_twin") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={isComingSoon("ai_twin")}
                          variant="outline"
                          className={`gap-2 w-full relative ${isComingSoon("ai_twin") ? "opacity-80" : ""}`}
                        >
                          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full p-0.5">
                            <Info className="h-3 w-3" />
                          </span>
                          <Bot className="h-4 w-4" /> AI Twin Seans — Ücretsiz / 15dk
                          {isComingSoon("ai_twin") && (
                            <Badge className="ml-1 bg-gold text-foreground hover:bg-gold">Yakında</Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[250px] text-center">
                        <p className="font-semibold mb-1">🤖 24 Saat Danışman Klonu</p>
                        <p className="text-xs text-muted-foreground">Yapay zeka teknolojisiyle danışmanın dijital ikizi ile 7/24 görüşme fırsatı!</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>

                {isEnabled("whatsapp") && (
                  <Button variant="outline" className="gap-2 w-full">
                    <MessageSquare className="h-4 w-4" /> WhatsApp ile Görüş
                  </Button>
                )}
                {isEnabled("appointments") && (
                  <>
                    <Button variant="outline" className="gap-2 w-full" onClick={() => setBookingOpen(true)}>
                      <Calendar className="h-4 w-4" /> Randevu Al
                    </Button>
                    <AppointmentBookingDialog
                      open={bookingOpen}
                      onOpenChange={setBookingOpen}
                      providerId={consultant.id}
                      providerName={consultant.name}
                      providerKind="consultant"
                    />
                  </>
                )}
                {isEnabled("location") && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultant.name + ', ' + consultant.city + ', ' + consultant.country)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 w-full">
                      <MapPin className="h-4 w-4" /> Konum
                    </Button>
                  </a>
                )}
                {isEnabled("directions") && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consultant.name + ', ' + consultant.city + ', ' + consultant.country)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="gap-2 w-full">
                      <Navigation className="h-4 w-4" /> Yol Tarifi
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {(isEnabled("bio_tab") || isEnabled("specialties_tab") || isEnabled("events_tab") || isEnabled("contact_tab")) && (
            <Tabs defaultValue={isEnabled("bio_tab") ? "bio" : isEnabled("specialties_tab") ? "specialties" : isEnabled("events_tab") ? "events" : "contact"} className="w-full">
              <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
                {isEnabled("bio_tab") && <TabsTrigger value="bio">Hakkında</TabsTrigger>}
                {isEnabled("specialties_tab") && <TabsTrigger value="specialties">Uzmanlık Alanları</TabsTrigger>}
                {isEnabled("events_tab") && <TabsTrigger value="events">Etkinlik Takvimi</TabsTrigger>}
                {isEnabled("contact_tab") && <TabsTrigger value="contact">İletişim</TabsTrigger>}
              </TabsList>

              {isEnabled("bio_tab") && (
                <TabsContent value="bio" className="mt-6">
                  <DemoTabPlaceholder label="Biyografi — Demo" />
                </TabsContent>
              )}
              {isEnabled("specialties_tab") && (
                <TabsContent value="specialties" className="mt-6">
                  <DemoTabPlaceholder label="Uzmanlık Alanları — Demo" />
                </TabsContent>
              )}
              {isEnabled("events_tab") && (
                <TabsContent value="events" className="mt-6">
                  <PublicEventsList emptyLabel="Bu danışmanın yaklaşan etkinliği yok." />
                </TabsContent>
              )}
              {isEnabled("contact_tab") && (
                <TabsContent value="contact" className="mt-6">
                  <DemoTabPlaceholder label="İletişim — Demo" />
                </TabsContent>
              )}
            </Tabs>
          )}

          {/* Gayrimenkul İlanları — only visible to logged-in consultant (owner) */}
          {consultant.category === "Gayrimenkul" && isOwner && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" /> Gayrimenkul İlanları
                </h2>
                <span className="text-xs bg-primary/10 text-primary rounded-full px-3 py-1 font-semibold">Freemium: 1 ilan</span>
              </div>

              {/* Single compact row: Active listing + Premium blur section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Active listing - compact */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="h-36 bg-muted relative">
                    <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop" alt="Property" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">Satılık</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-foreground text-sm">Modern 2+1 Daire — {consultant.city}</h3>
                    <p className="text-muted-foreground text-xs font-body mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {consultant.city}, {consultant.country}
                    </p>
                    <p className="text-lg font-bold text-primary mt-1.5">€285.000</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> 2</span>
                      <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> 1</span>
                      <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> 85m²</span>
                    </div>
                    <Button size="sm" className="w-full mt-2.5 gap-1.5 text-xs">
                      <MessageSquare className="h-3 w-3" /> İlanı Sorgula
                    </Button>
                  </div>
                </div>

                {/* Premium locked listings - 2 blurred cards */}
                <div className="lg:col-span-2 relative">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 rounded-xl flex flex-col items-center justify-center gap-2">
                    <div className="bg-gold/10 p-2.5 rounded-full">
                      <Crown className="h-5 w-5 text-gold" />
                    </div>
                    <p className="font-bold text-foreground text-sm text-center">Premium ile 3 ilan yayınlayın</p>
                    <p className="text-xs text-muted-foreground text-center max-w-xs">Premium abonelikle 3'e kadar gayrimenkul ilanı yayınlayabilirsiniz.</p>
                    <Button variant="default" size="sm" className="gap-1.5 bg-gold hover:bg-gold/90 text-primary-foreground text-xs mt-1">
                      <Crown className="h-3.5 w-3.5" /> Premium'a Geç
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 opacity-40">
                    {[
                      { title: "Lüks 3+1 Villa", price: "€520.000", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=200&fit=crop" },
                      { title: "Yatırımlık Studio", price: "€165.000", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop" },
                    ].map((p, i) => (
                      <div key={i} className="border border-border rounded-xl overflow-hidden">
                        <div className="h-36 bg-muted">
                          <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
                          <p className="text-base font-bold text-primary mt-1">{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConsultantDetail;

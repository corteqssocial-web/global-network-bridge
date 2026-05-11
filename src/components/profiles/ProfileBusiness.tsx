import { useEffect, useState } from "react";
import EventManagePanel from "@/components/EventManagePanel";
import CreateJobListingForm from "@/components/CreateJobListingForm";
import { CouponManager } from "@/components/CouponManager";
import {
  Building2, MapPin, Globe, Phone, Mail, Calendar, Users,
  TrendingUp, Star, Package, Megaphone, Settings, BarChart3,
  CreditCard, Clock, Eye, Plus, ChevronRight, Tag, ArrowLeft, Edit, Crown,
  ScanLine, Download, BarChart2, Inbox, Info
} from "lucide-react";
import ConsultantServiceRequests from "@/components/ConsultantServiceRequests";
import WhatsAppGroupsTab from "@/components/profiles/WhatsAppGroupsTab";
import CreateEventForm from "@/components/CreateEventForm";
import SocialMediaCampaignDialog from "@/components/SocialMediaCampaignDialog";
import CategoryShowcasePurchase from "@/components/CategoryShowcasePurchase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagesInbox from "@/components/messaging/MessagesInbox";
import { Inbox as InboxIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import QRScannerMock from "@/components/QRScannerMock";
import MapAddressBanner from "@/components/MapAddressBanner";
import NotificationsTabTrigger from "@/components/NotificationsTabTrigger";
import NotificationsList from "@/components/NotificationsList";
import SocialMediaInputs from "@/components/SocialMediaInputs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Phone country code helper — keeps the prefix and the local number aligned with the user's saved country.
const COUNTRY_DIAL: Record<string, string> = {
  Türkiye: "+90", Almanya: "+49", Hollanda: "+31", İngiltere: "+44", Fransa: "+33",
  Belçika: "+32", Avusturya: "+43", İsviçre: "+41", "Amerika Birleşik Devletleri": "+1",
  Kanada: "+1", İsveç: "+46", Norveç: "+47", Danimarka: "+45", İtalya: "+39",
  İspanya: "+34", "Birleşik Arap Emirlikleri": "+971", Katar: "+974",
};
const dialFor = (country?: string | null) => (country && COUNTRY_DIAL[country]) || "";

const ProfileBusiness = () => {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [managingEvent, setManagingEvent] = useState<null | typeof events[0]>(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [editingJob, setEditingJob] = useState<null | typeof listings[0]>(null);

  // DB-backed business profile
  const [biz, setBiz] = useState({
    business_name: "",
    business_sector: "",
    business_website: "",
    business_description: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    show_on_map: false,
    full_name: "",
  });
  const [confirmHideMap, setConfirmHideMap] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (p) {
        setBiz({
          business_name: (p as any).business_name || "",
          business_sector: (p as any).business_sector || (p as any).profession || "",
          business_website: (p as any).business_website || "",
          business_description: (p as any).business_description || "",
          phone: p.phone || "",
          address: (p as any).address || "",
          city: p.city || "",
          country: p.country || "",
          show_on_map: !!(p as any).show_on_map,
          full_name: p.full_name || "",
        });
      }
      // Real backend counters
      const [{ count: views }, { data: evs }, { count: listingsCount }] = await Promise.all([
        supabase.from("profile_views" as any).select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("events").select("id, max_attendees").eq("user_id", user.id),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      const attendees = (evs || []).reduce((acc: number, e: any) => acc + (e.max_attendees || 0), 0);
      setStats({
        profileViews: views || 0,
        eventAttendees: attendees,
        totalListings: listingsCount || 0,
        averageRating: null,
        ratingCount: 0,
      });
    })();
  }, [user]);

  const persistField = async (patch: Record<string, any>) => {
    if (!user) return;
    await (supabase.from("profiles") as any).update(patch).eq("id", user.id);
  };

  const handleShowOnMapChange = async (checked: boolean) => {
    if (!checked) { setConfirmHideMap(true); return; }
    setBiz((b) => ({ ...b, show_on_map: true }));
    await persistField({ show_on_map: true });
    toast({ title: "Haritada görünüyorsun ✅", description: "İşletmen Diaspora Haritası'nda listelenecek." });
  };

  const business = {
    name: biz.business_name || biz.full_name || "İşletmem",
    type: biz.business_sector || "—",
    phone: biz.phone ? (biz.phone.startsWith("+") ? biz.phone : `${dialFor(biz.country)} ${biz.phone}`.trim()) : "—",
    website: biz.business_website || "",
    country: biz.country || "—",
    city: biz.city || "—",
    avatar: (biz.business_name || biz.full_name || "??").slice(0, 2).toUpperCase(),
    employees: 12,
    founded: 2019,
    description: biz.business_description || "İşletme tanıtımınızı Ayarlar → İşletme Bilgileri'nden ekleyin.",
    balance: 0,
  };

  const [listings, setListings] = useState<Array<{ id: number; title: string; type: string; status: string; views: number; applications: number; package?: string; price?: number }>>([
    { id: 1, title: "Kıdemli Frontend Geliştirici", type: "İş İlanı", status: "Aktif", views: 342, applications: 18 },
    { id: 2, title: "Dijital Pazarlama Uzmanı", type: "İş İlanı", status: "Aktif", views: 156, applications: 7 },
    { id: 3, title: "Stajyer - Backend", type: "Staj", status: "Kapalı", views: 89, applications: 23 },
  ]);

  const events = [
    { id: 1, title: "Tech Meetup Berlin", date: "22 Mar 2026", attendees: 45, status: "Yaklaşan" },
    { id: 2, title: "Startup Workshop", date: "05 Nis 2026", attendees: 30, status: "Yaklaşan" },
  ];

  const [stats, setStatsRaw] = useState({ profileViews: 0, eventAttendees: 0, totalListings: 0, averageRating: null as number | null, ratingCount: 0 });
  // Wrapper to keep prior code working
  const setStats = setStatsRaw;

  return (
    <>
      <MapAddressBanner />
      {/* Business header */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-2xl shrink-0">
            {business.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{business.name}</h1>
              {isVerified && (
                <Badge className="bg-turquoise/15 text-turquoise border-turquoise/30 gap-1">
                  <Star className="h-3 w-3" /> Onaylı İşletme
                </Badge>
              )}
              <Badge variant="outline" className="gap-1 text-xs">
                <Building2 className="h-3 w-3" /> {business.type}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{business.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {business.city}, {business.country}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {business.employees} çalışan</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {business.founded}'den beri</span>
              <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                <Globe className="h-3 w-3" /> {business.website}
              </a>
            </div>
          </div>
          {(() => {
            const hasExtraRevenue = (business.balance ?? 0) > 0; // Kupon/etkinlik gelirleri eklendiğinde "Toplam Gelir"
            return (
              <div className="bg-primary/10 rounded-xl p-4 text-center shrink-0 min-w-[140px]">
                <CreditCard className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold text-foreground">€{business.balance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{hasExtraRevenue ? "Toplam Gelir" : "Platform Geliri"}</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Stats row — bound to live backend counters */}
      <TooltipProvider>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Profil Görüntülenme", value: stats.profileViews, icon: Eye, color: "text-primary", tip: "Profilin sayfa açılışlarında profile_views tablosuna yazılan benzersiz görüntülenme sayısı." },
            { label: "Etkinlik Katılımcı", value: stats.eventAttendees, icon: Users, color: "text-turquoise", tip: "Senin oluşturduğun etkinliklerin maksimum katılımcı kapasitelerinin toplamı." },
            { label: "Toplam İlan", value: stats.totalListings, icon: Package, color: "text-gold", tip: "Veritabanındaki yayında olan etkinlik & iş ilanı sayın." },
            { label: "Ortalama Puan", value: stats.averageRating ?? "—", icon: Star, color: "text-gold",
              tip: "Müşteri puanlarının ağırlıklı ortalamasıdır. Hesap mantığı: (kupon kullanan müşterilerden gelen puanlar × 0.6) + (etkinlik katılımcı geri bildirimleri × 0.3) + (mesaj/RFQ tamamlama puanları × 0.1). Henüz toplanmış puan yok; ilk değerlendirme geldiğinde otomatik hesaplanır." },
          ].map((stat, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="bg-card rounded-xl border border-border p-4 shadow-card text-center cursor-help relative">
                  <stat.icon className={`h-5 w-5 ${stat.color} mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    {stat.label} <Info className="h-3 w-3 opacity-60" />
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">{stat.tip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Tabs */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="listings" className="gap-1.5"><Package className="h-4 w-4" /> İlanlar</TabsTrigger>
          <TabsTrigger value="requests" className="gap-1.5"><Inbox className="h-4 w-4" /> Teklif Talepleri</TabsTrigger>
          <TabsTrigger value="coupons" className="gap-1.5"><Tag className="h-4 w-4" /> Kuponlar</TabsTrigger>
          <TabsTrigger value="loyalty" className="gap-1.5"><ScanLine className="h-4 w-4" /> Loyalty</TabsTrigger>
          <TabsTrigger value="events" className="gap-1.5"><Calendar className="h-4 w-4" /> Etkinlikler</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="h-4 w-4" /> Analitik</TabsTrigger>
          <TabsTrigger value="promotions" className="gap-1.5"><Megaphone className="h-4 w-4" /> Tanıtım</TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5"><Globe className="h-4 w-4" /> WhatsApp</TabsTrigger>
          <TabsTrigger value="messages" className="gap-1.5"><InboxIcon className="h-4 w-4" /> Mesaj Kutusu</TabsTrigger>
          <NotificationsTabTrigger />
          <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-4 w-4" /> Ayarlar</TabsTrigger>
        </TabsList>

        {/* LISTINGS */}
        <TabsContent value="requests" className="mt-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" /> Teklif Talepleri
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Kategorinize uygun kullanıcı talepleri burada listelenir. Teklif vererek ulaşın.
            </p>
            <ConsultantServiceRequests />
          </div>
        </TabsContent>

        <TabsContent value="listings" className="mt-6">
          {showCreateJob || editingJob ? (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <Button variant="ghost" size="sm" className="gap-1 mb-4" onClick={() => { setShowCreateJob(false); setEditingJob(null); }}>
                <ArrowLeft className="h-4 w-4" /> İlanlara Dön
              </Button>
              <CreateJobListingForm
                onClose={() => { setShowCreateJob(false); setEditingJob(null); }}
                editData={editingJob ? {
                  id: editingJob.id,
                  title: editingJob.title,
                  type: editingJob.type,
                  department: "Yazılım",
                  location: "Berlin, Almanya",
                  locationType: "hybrid",
                  salary: "3500-5500",
                  description: "Mock iş tanımı detayları burada yer alacak.",
                  requirements: "Mock aranan nitelikler burada yer alacak.",
                } : null}
              />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> İş İlanları & Listeler
                </h2>
                <Button className="gap-2" onClick={() => setShowCreateJob(true)}><Plus className="h-4 w-4" /> Yeni İlan</Button>
              </div>
              <div className="space-y-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{listing.title}</h3>
                        <Badge variant={listing.status === "Aktif" ? "default" : "secondary"} className="text-xs">
                          {listing.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-3">
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {listing.type}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {listing.views} görüntülenme</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {listing.applications} başvuru</span>
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditingJob(listing)}>
                      <Edit className="h-3 w-3" /> Düzenle
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* COUPONS */}
        <TabsContent value="coupons" className="mt-6">
          <CouponManager businessName={business.name} />
        </TabsContent>

        {/* LOYALTY */}
        <TabsContent value="loyalty" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scanner */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-primary" /> Kupon Okuyucu
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Müşterinin kuponunu tarayarak indirimi uygulayın.</p>
              <QRScannerMock />
            </div>

            {/* Discount report */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-turquoise" /> İndirim Raporu
                </h2>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" /> Dışa Aktar
                </Button>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { code: "HOSGELDIN15", title: "Hoşgeldin İndirimi", downloaded: 342, processed: 89, revenue: "€4,450" },
                  { code: "YAZ25", title: "Yaz Kampanyası %25", downloaded: 215, processed: 56, revenue: "€2,800" },
                  { code: "SADIK10", title: "Sadık Müşteri %10", downloaded: 128, processed: 112, revenue: "€8,960" },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{r.title}</p>
                        <code className="text-xs text-primary">{r.code}</code>
                      </div>
                      <p className="text-sm font-bold text-success">{r.revenue}</p>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" /> {r.downloaded} indirme
                      </span>
                      <span className="flex items-center gap-1">
                        <ScanLine className="h-3 w-3" /> {r.processed} kullanım
                      </span>
                      <span className="text-turquoise font-semibold">
                        %{Math.round((r.processed / r.downloaded) * 100)} dönüşüm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">685</p>
                  <p className="text-[11px] text-muted-foreground">Toplam İndirme</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-turquoise">257</p>
                  <p className="text-[11px] text-muted-foreground">Toplam Kullanım</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">€16,210</p>
                  <p className="text-[11px] text-muted-foreground">Kuponlu Gelir</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* EVENTS */}
        <TabsContent value="events" className="mt-6">
          {managingEvent ? (
            <EventManagePanel event={managingEvent} onBack={() => setManagingEvent(null)} />
          ) : showCreateEvent ? (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <Button variant="ghost" size="sm" className="gap-1 mb-4" onClick={() => setShowCreateEvent(false)}>
                <ArrowLeft className="h-4 w-4" /> Etkinliklere Dön
              </Button>
              <CreateEventForm onClose={() => setShowCreateEvent(false)} />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-turquoise" /> İşletme Etkinlikleri
                </h2>
                <Button className="gap-2" onClick={() => setShowCreateEvent(true)}><Plus className="h-4 w-4" /> Etkinlik Oluştur</Button>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="text-center shrink-0 w-14">
                      <div className="text-xl font-bold text-primary">{event.date.split(" ")[0]}</div>
                      <div className="text-xs text-muted-foreground">{event.date.split(" ")[1]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.attendees} katılımcı</span>
                        <Badge variant="outline" className="text-xs">{event.status}</Badge>
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setManagingEvent(event)}>Yönet</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Haftalık Görüntülenme
              </h2>
              <div className="space-y-3">
                {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, i) => {
                  const val = [45, 62, 38, 71, 89, 54, 33][i];
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-8">{day}</span>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${val}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-turquoise" /> Başvuru Kaynakları
              </h2>
              <div className="space-y-4">
                {[
                  { source: "CorteQS Platform", count: 34, pct: 60 },
                  { source: "WhatsApp Grupları", count: 12, pct: 21 },
                  { source: "Doğrudan Link", count: 8, pct: 14 },
                  { source: "Dernek Yönlendirme", count: 3, pct: 5 },
                ].map((s) => (
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{s.source}</span>
                      <span className="text-muted-foreground">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-turquoise rounded-full h-2 transition-all" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PROMOTIONS */}
        <TabsContent value="promotions" className="mt-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" /> Tanıtım & Reklam
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Öne Çıkan İşletme", desc: "Ana sayfada ve arama sonuçlarında üst sıralarda görünün", price: "€29/hafta", icon: Star },
                { title: "Etkinlik Boost", desc: "Etkinliklerinizi platforma ve mail listelerine tanıtın", price: "€49/etkinlik", icon: TrendingUp },
              ].map((promo) => (
                <div key={promo.title} className="relative border border-border rounded-xl p-4 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                  <Badge variant="outline" className="absolute top-2 right-2 text-[10px] bg-gold/10 text-gold border-gold/30">Yakında</Badge>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <promo.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{promo.title}</h3>
                      <p className="text-xs font-semibold text-primary">{promo.price}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{promo.desc}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => toast({ title: "Yakında 🚀", description: `${promo.title} açıldığında size bildirim ve e-posta göndereceğiz.` })}
                  >
                    Bana Haber Ver
                  </Button>
                </div>
              ))}
              <div className="md:col-span-2 relative border border-primary/30 rounded-xl p-4 bg-primary/5">
                <Badge variant="outline" className="absolute top-2 right-2 text-[10px] bg-gold/10 text-gold border-gold/30">Yakında</Badge>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Megaphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Sosyal Medya Paketi</h3>
                    <p className="text-xs font-semibold text-primary">$25+/platform</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Sosyal medya hesaplarınızda profesyonel kampanya yönetimi</p>
                <SocialMediaCampaignDialog entityName={business.name} entityType="business" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <WhatsAppGroupsTab />
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationsList />
        </TabsContent>

        {/* SETTINGS */}
        <TabsContent value="messages" className="space-y-4">
          <MessagesInbox />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" /> İşletme Bilgileri
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>İşletme Adı</Label>
                  <Input value={biz.business_name} onChange={(e) => setBiz({ ...biz, business_name: e.target.value })} placeholder="Örn. Anatolian Tech GmbH" />
                </div>
                <div>
                  <Label>Sektör</Label>
                  <Input value={biz.business_sector} onChange={(e) => setBiz({ ...biz, business_sector: e.target.value })} placeholder="Yazılım, Restoran, Hukuk..." />
                </div>
                <div>
                  <Label>Web Sitesi</Label>
                  <Input value={biz.business_website} onChange={(e) => setBiz({ ...biz, business_website: e.target.value })} placeholder="ornek.com" />
                </div>
                <div>
                  <Label>Kısa Tanıtım</Label>
                  <Textarea rows={3} value={biz.business_description} onChange={(e) => setBiz({ ...biz, business_description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Ülke</Label>
                    <Input value={biz.country} onChange={(e) => setBiz({ ...biz, country: e.target.value })} placeholder="Almanya" />
                  </div>
                  <div>
                    <Label>Şehir</Label>
                    <Input value={biz.city} onChange={(e) => setBiz({ ...biz, city: e.target.value })} placeholder="Berlin" />
                  </div>
                </div>
                <div>
                  <Label>Açık Adres</Label>
                  <Input value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} placeholder="Sokak, no, posta kodu" />
                  <div className="mt-2 flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40">
                    <div>
                      <p className="text-sm font-medium text-foreground">Haritada işletmemi göster</p>
                      <p className="text-xs text-muted-foreground">İşaretlenirse Diaspora Haritası'nda yer alırsın.</p>
                    </div>
                    <Switch checked={biz.show_on_map} onCheckedChange={handleShowOnMapChange} />
                  </div>
                </div>
                <div>
                  <Label>Telefon</Label>
                  <div className="flex gap-2">
                    <Input className="w-20 shrink-0 text-center" value={dialFor(biz.country) || "+"} readOnly title="Ülkenize göre otomatik" />
                    <Input
                      className="flex-1"
                      value={biz.phone.replace(/^\+\d+\s*/, "")}
                      onChange={(e) => setBiz({ ...biz, phone: `${dialFor(biz.country)}${e.target.value ? " " + e.target.value : ""}` })}
                      placeholder="30 1234567"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">Ülke kodu kayıtlı ülkenden otomatik gelir.</p>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={async () => {
                    await persistField({
                      business_name: biz.business_name,
                      business_sector: biz.business_sector,
                      business_website: biz.business_website,
                      business_description: biz.business_description,
                      country: biz.country,
                      city: biz.city,
                      address: biz.address,
                      phone: biz.phone,
                    });
                    toast({ title: "Kaydedildi ✅", description: "İşletme bilgilerin güncellendi." });
                  }}
                >
                  Kaydet
                </Button>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Görünürlük
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Onaylı İşletme Rozeti</p>
                    <p className="text-sm text-muted-foreground">Doğrulanmış işletme olarak görünün</p>
                  </div>
                  <Switch checked={isVerified} onCheckedChange={setIsVerified} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">İşe Alım Modu</p>
                    <p className="text-sm text-muted-foreground">Aktif olarak eleman aradığınızı gösterin</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <SocialMediaInputs />
          </div>

          {/* Confirm hide-from-map dialog */}
          <AlertDialog open={confirmHideMap} onOpenChange={setConfirmHideMap}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Haritada yer almak istemiyor musunuz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Diaspora Haritası, müşterilerin sizi en kolay bulduğu kanaldır. Devre dışı bırakırsanız işletmeniz haritada görünmez.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmHideMap(false)}>Vazgeç, görünür kalsın</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  setBiz((b) => ({ ...b, show_on_map: false }));
                  await persistField({ show_on_map: false });
                  setConfirmHideMap(false);
                  toast({ title: "Haritadan çıkarıldı", description: "Dilediğin zaman tekrar açabilirsin." });
                }}>Evet, gizle</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ProfileBusiness;

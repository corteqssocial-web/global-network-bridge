export interface MockAuthor {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface MockPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  mini_images?: string[];
  country: string | null;
  city: string | null;
  author_role: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export const mockAuthors: Record<string, MockAuthor> = {
  "user-1": { id: "user-1", full_name: "Ahmet Yılmaz", avatar_url: null },
  "user-2": { id: "user-2", full_name: "Maria Schmidt", avatar_url: null },
  "user-3": { id: "user-3", full_name: "Raj Patel", avatar_url: null },
  "user-4": { id: "user-4", full_name: "Dr. Elif Kaya", avatar_url: null },
  "user-5": { id: "user-5", full_name: "Chen Wei", avatar_url: null },
  "user-6": { id: "user-6", full_name: "Business Berlin GmbH", avatar_url: null },
};

export const mockPosts: MockPost[] = [
  {
    id: "post-1",
    user_id: "user-6",
    content:
      "🇩🇪 Berlin'de yeni şubemizi açtık! Türkçe konuşan personelimizle hafta içi 09:00-18:00 arası hizmetinizdeyiz. İlk 100 müşterimize %20 indirim!",
    image_url: null,
    mini_images: [
      "https://images.unsplash.com/photo-1599946347371-68c8f294a9f5?w=300&q=80",
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&q=80",
    ],
    country: "Almanya",
    city: "Berlin",
    author_role: "business",
    like_count: 24,
    comment_count: 5,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "post-2",
    user_id: "user-4",
    content:
      "📢 Göçmenlik hukuku danışmanlığı için randevularımız Mayıs ayı için açıldı. Özellikle çalışma vizesi ve oturum izni süreçlerinde destek sağlıyorum. Detaylar profilimde!",
    image_url: null,
    country: "Hollanda",
    city: "Amsterdam",
    author_role: "consultant",
    like_count: 56,
    comment_count: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "post-3",
    user_id: "user-1",
    content:
      "Yeni taşındığım Frankfurt'ta kütüphane kartı nasıl alınır biraz karışık geldi. Evraklar: pasaport, ikametgah belgesi ve adres kaydı. 10 dakikada hallettim, tavsiyem sabah erken gidin sıra olmuyor.",
    image_url:
      "https://images.unsplash.com/photo-1568667256549-0942163f7736?w=800&q=80",
    country: "Almanya",
    city: "Frankfurt",
    author_role: "user",
    like_count: 18,
    comment_count: 7,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "post-4",
    user_id: "user-2",
    content:
      "Münih'teki Türk pazarı bu Pazar kurulacak. Ev yapımı baklava, börek ve turşu standları olacak. Herkesi bekleriz! 🥧",
    image_url: null,
    mini_images: [
      "https://images.unsplash.com/photo-1555939594-58d8cb6a9c2e?w=300&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
    ],
    country: "Almanya",
    city: "Münih",
    author_role: "ambassador",
    like_count: 89,
    comment_count: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: "post-5",
    user_id: "user-5",
    content:
      "Singapur'da iş görüşmesi yaptım. İngilizce yeterlilik seviyesi beklediğimden yüksek çıktı. Teknik mülakat 3 saat sürdü. Tavsiyem: LeetCode medium seviyeye kadar çalışın.",
    image_url: null,
    country: "Singapur",
    city: "Singapur",
    author_role: "user",
    like_count: 42,
    comment_count: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "post-6",
    user_id: "user-3",
    content:
      "Londra'da NHS kayıt süreci güncellendi. Artık online başvuru zorunlu. Bölgenizdeki GP practice'i NHS sitesinden bulup kaydolmanız gerekiyor. Adım adım rehber hazırladım, DM ile paylaşabilirim.",
    image_url:
      "https://images.unsplash.com/photo-1584536290625-84e2d2ffab6e?w=800&q=80",
    country: "İngiltere",
    city: "Londra",
    author_role: "consultant",
    like_count: 133,
    comment_count: 31,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
  {
    id: "post-7",
    user_id: "user-1",
    content:
      "Stockholm'de kış hazırlığı başladı. Lastik değişim randevuları dolmaya başladı, bu hafta sonu öncesinde ayırtmanızı öneririm.",
    image_url: null,
    country: "İsveç",
    city: "Stockholm",
    author_role: "user",
    like_count: 7,
    comment_count: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "post-8",
    user_id: "user-6",
    content:
      "🇳🇱 Amsterdam merkezli lojistik firmamız Türkiye-Almanya hattında yeni anlaşmalar yaptı. Taşımacılık sektöründeki arkadaşlar DM atabilir, özel fiyatlar sunuyoruz.",
    image_url:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80",
    country: "Hollanda",
    city: "Amsterdam",
    author_role: "business",
    like_count: 31,
    comment_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "post-9",
    user_id: "user-2",
    content:
      "Zürih'te Türkçe kitap takas etkinliği düzenliyoruz. 15 Mayıs Pazar, Seepark'ta buluşuyoruz. Getirdiğiniz kadar götürürsünüz! 📚",
    image_url: null,
    mini_images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80",
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80",
    ],
    country: "İsviçre",
    city: "Zürih",
    author_role: "ambassador",
    like_count: 64,
    comment_count: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
  },
  {
    id: "post-10",
    user_id: "user-4",
    content:
      "AB vatandaşı olmayanlar için Hollanda'da serbest meslek kurma süreci: 1) KVK kaydı 2) Vergi numarası (BSN zaten olmalı) 3) Sigorta seçimi. Toplam maliyet yaklaşık 150-200 EUR. 1 haftada kuruluyor.",
    image_url: null,
    country: "Hollanda",
    city: "Rotterdam",
    author_role: "consultant",
    like_count: 92,
    comment_count: 14,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
  },
  {
    id: "post-11",
    user_id: "user-3",
    content:
      "Toronto'da kiralık ev arayanlar için tüyolar: Facebook Marketplace yerine Kijiji ve PadMapper daha güncel listeler sunuyor. SCAM uyarısı: hiçbir emlakçı E-transfer ödemesi istemez.",
    image_url: null,
    country: "Kanada",
    city: "Toronto",
    author_role: "user",
    like_count: 77,
    comment_count: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "post-12",
    user_id: "user-5",
    content:
      "Tokyo'da dil okulu kayıtları Nisan dönemi için son 2 hafta. En az 6 aylık kursa kaydolana öğrenci vizesi hızlandırılmış. Detayları paylaşabilirim.",
    image_url:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    country: "Japonya",
    city: "Tokyo",
    author_role: "user",
    like_count: 45,
    comment_count: 9,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
  },
];

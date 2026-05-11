## Hedef
İşletme paneli ve nav bar üzerinde 3 ana iş:
1. İlanlar bölümünde filtreli "Daha fazla" görünümü
2. Yeni kullanıcılar için tüm sekmelerden mock veriyi sıfırlamak (gerçek backend bağlantıları kalır)
3. Ayarlar'dan profil fotoğrafı/profil detayları yönetimi + Nav bar'a "AI Twin · Yakında"

## 1. İş İlanları Filtreleri (`ProfileBusiness.tsx`)
- İlanlar sekmesinin altına "Daha fazla" toggle butonu
- Açılınca üstte 3 input/dropdown: **Ülke**, **Şehir** (ülkeye göre cascade — `countryCities.ts`), **Arama** (başlıkta `ilike`)
- Filtreleme client-side; ilan listesi boşsa "Eşleşen ilan bulunamadı" mesajı
- Mevcut listings state üzerinde çalışır (ileride DB tablosu eklenirse aynı UI kullanılabilir)

## 2. Mock Verileri Sıfırlama (sıfır kullanıcı = boş)
Şu sekmelerdeki hardcoded mock arrayleri kaldırıp gerçek backend / boş-state'e bağla:
- **İlanlar**: `listings` başlangıç değeri `[]` (yeni kullanıcı boş görür)
- **Etkinlikler**: `events` mock array yerine `supabase.from('events').eq('user_id', user.id)` çek
- **Kuponlar**: `CouponManager` zaten kendi state'i varsa boş başlat (kontrol edilecek)
- **Analitik**: Mock grafikler/sayılar yerine "Henüz veri yok" + gerçek `stats`
- **Tanıtım**: Yakında badge'leri kalır, mock metrikleri kaldır
- **WhatsApp / Mesajlar / Bildirimler / Teklif Talepleri**: Zaten DB-backed; doğrula
- **Loyalty**: "Yakında" rozetiyle sade kalır (kullanıcı isteği)
- Üst başlıktaki sahte `employees: 12`, `founded: 2019` değerleri kaldırılıp profil DB'sinden çekilir veya gizlenir

## 3. Ayarlar — Profil & Avatar
`Ayarlar` tab içeriğine ekle:
- Profil fotoğrafı yükleme (Supabase Storage `user-documents` veya yeni `avatars` public bucket — mevcut bucket kullanılacak)
- Profil detayları formu: business_name, business_sector, business_description, business_website, address, phone, country/city
- "Kaydet" → `profiles` tablosuna `update`
- Header avatarı yüklenen foto ile değişir

## 4. Nav Bar — AI Twin
`Navbar.tsx` içine "AI Twin" linki + `Yakında` rozeti (tıklanınca toast ya da disabled).

## Teknik Notlar
- Yeni avatar bucket gerekirse migration ile public `avatars` bucket eklenir + RLS (kullanıcı kendi klasörüne yazar)
- `profiles` tablosuna `avatar_url` zaten var, kullanılacak
- Filtre UI'ı `Select` + `Input` ile shadcn pattern
- Tüm renkler design token üzerinden

## Etkilenen Dosyalar
- `src/components/profiles/ProfileBusiness.tsx` (büyük refactor)
- `src/components/Navbar.tsx` (AI Twin linki)
- Olası yeni: `src/components/profiles/BusinessSettingsForm.tsx`
- Olası migration: `avatars` storage bucket

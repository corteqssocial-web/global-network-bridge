## Görseldeki madde ne anlama geliyor?

Evet — `enforce_daily_cafe_join` trigger'ı **günde 1 yeni cafe'ye katılma** hakkını zorunlu kılar (cafe açma değil; açma günlük sınırsız zaten ama isim unique). Bir kez katıldıktan sonra cafe açık olduğu sürece girip çıkabilirsin. Bunu netleştirip aşağıdaki kuralları ekleyeceğim.

## Yapılacaklar

### 1. DB değişiklikleri (migration)

**`cafes` tablosuna yeni kolonlar:**
- `kind text not null default 'community'` → `'community' | 'relocation' | 'expo'` (sistem cafelerini ayırt etmek için)
- `open_entry boolean not null default true` → false ise sahibinin onayı gerekir
- `entry_question text` → opsiyonel; doluysa katılım formu zorunlu, cevap üzerinden onay
- `capacity integer` → 2h=100, 4h=300 (community); relocation/expo = NULL (sınırsız)

**`cafe_memberships`:**
- `answer text` → entry_question varsa cevap
- `approved boolean default true` → open_entry=false cafelerde false başlar

**`profiles.phone_country_code text`** (varsa atla) — TR kontrolü için. Telefonun başında `+90` veya country code kolonu kullanılacak.

**Trigger güncellemeleri:**
- `enforce_daily_cafe_join` → relocation/expo cafe'ler için sınırı bypass et (`kind in ('relocation','expo')` ise muaf)
- Yeni trigger `enforce_cafe_capacity` → community cafelerde `capacity` dolduysa INSERT reddedilir (`raise exception 'cafe_full'`)
- Yeni trigger `enforce_tr_phone_restriction` → kullanıcının telefonu TR (+90) ise ve cafe `kind='community'` ise INSERT reddedilir (`raise exception 'tr_phone_restricted'`)

**Seed:**
- Her popüler ülke için 2 sistem cafe: `Relocation Cafe – {Ülke}` ve `Expo Cafe – {Ülke}` (kind=relocation/expo, closes_at = '2099-01-01', open_entry=true, capacity=null, created_by=admin user). İlk migration'da TR, DE, NL, US, UK için seed yeterli; diğerleri sonra.

**Capacity helper:** `cafe_member_count` view veya `cafes.member_count` kolonu + trigger ile sayı tutulur. Tercih: trigger ile `cafes.member_count` kolonu güncellenir (her INSERT/DELETE'te).

### 2. CreateCafeForm değişiklikleri

- "Serbest giriş mi, soru ile mi?" toggle (default: serbest)
- `entry_question` textarea (toggle açıksa)
- Süre seçimi tablosu güncellenir: 2h → kapasite 100, 4h → kapasite 300 (UI'de gösterilir)
- Sistem cafe (relocation/expo) açma butonu UI'de yok — sadece arka uçta seed/admin

### 3. Cafe listesi UI (Feed.tsx sol panel)

Sol kolondaki cafe satırı:
- İsim · 👥 N/Cap (örn. `Berlin Devs · 👥 42/100`)
- Sistem cafe ise `🌐 Sınırsız` rozeti
- Serbest giriş cafe ise `🟢 Açık` küçük etiket; soru-onay cafe ise `🔒 Onaylı` etiketi
- Üstte 2 sabit grup: "Sistem Cafeleri" (Relocation/Expo) ve "Topluluk Cafeleri"

### 4. Cafe sayfası (Feed.tsx cafeId mode)

- Header'da `kind` badge + member count + kapasite
- "Cafe'ye Gir" butonuna basınca:
  - `open_entry=true` → direkt katıl
  - `open_entry=false` → soru-cevap dialog açılır, cevap `cafe_memberships.answer`'a yazılır, `approved=false`. Sahibi onaylayana kadar feed read-only.
- Hatalar: `cafe_full` → "Cafe dolu, başka bir cafe dene", `tr_phone_restricted` → "TR numaralı kullanıcılar yalnızca Relocation/Expo cafelerine katılabilir."
- Sahibinin onay paneli (küçük): `approved=false` üyeleri listeleyip onayla/reddet (UPDATE/DELETE).

### 5. useCafes.ts

- `useActiveCafes` → `member_count`, `kind`, `open_entry`, `capacity` döner; sistem cafe'leri her zaman dahil (closes_at filtresi `kind in ('relocation','expo') OR closes_at > now()`)
- `useCafe.join(answer?)` → answer parametre alır, error code'larını parse eder (cafe_full, tr_phone_restricted, daily_cafe_limit)

### 6. CreatePostForm

Cafe içindeysek ve kullanıcı `approved=false` ise paylaşım butonu disabled + "Onay bekliyor" mesajı.

## Dosya değişiklikleri

- migration: kolonlar, trigger'lar, seed, member_count trigger
- düzenle: `src/components/feed/CreateCafeForm.tsx` (open_entry toggle, kapasite UI)
- düzenle: `src/hooks/useCafes.ts` (yeni alanlar, hata kodları)
- düzenle: `src/pages/Feed.tsx` (badges, member count, gir-dialog, onay paneli)

Onaylarsan migration'ı çalıştırıp UI tarafını implement ediyorum.

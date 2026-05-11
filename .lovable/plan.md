## 1. "Kategori hesabı aç" linkini auth'a bağla

`Feed.tsx` içindeki link `/onboarding` yerine: kullanıcı yoksa `/auth`, varsa ve onboarding tamamlanmadıysa `/onboarding`, tamamlandıysa `/profile` yönlendirsin.

## 2. Veritabanı (migration)

Yeni tablolar:

- **`cafes`** — `id`, `name` (UNIQUE, lower-case kontrolü), `theme`, `country`, `city`, `linkedin_url`, `extra_links` (jsonb), `created_by` (uuid), `opens_at` (timestamptz), `closes_at` (timestamptz), `duration_hours` (int 2/4), `created_at`.
  - RLS: herkese SELECT açık; INSERT sadece kendi kullanıcısı; UPDATE/DELETE sahibi.
  - UNIQUE INDEX `lower(name)` üzerinde — aynı isimde cafe açılamaz.

- **`cafe_memberships`** — `id`, `cafe_id`, `user_id`, `joined_at`. Bir kullanıcının bir cafe'ye girişi kalıcı izindir; tekrar girip çıkabilir.
  - UNIQUE (`cafe_id`, `user_id`).
  - RLS: herkese SELECT; INSERT sadece kendi kullanıcısı (günlük 1 hak trigger ile).
  - Trigger `enforce_daily_cafe_join`: aynı kullanıcının son 24 saat içinde başka cafe'ye katılım kaydı varsa INSERT reddedilir (raise exception). Mevcut üyelikte (zaten `cafe_memberships` satırı varsa) tekrar giriş için blok yok — sadece YENİ cafe katılımı günde 1.

- **`feed_posts.cafe_id`** kolonu eklenir (nullable). Cafe-içi postlar `cafe_id` ile etiketlenir; genel feed `cafe_id IS NULL` filtresi kullanır.

## 3. Cafe oluşturma formu

Yeni dosya `src/components/feed/CreateCafeForm.tsx` (Dialog):
- Alanlar: Cafe adı, Tema (select: IT/Hekimler/Profesyoneller/İşletmeler/Kuruluşlar/Blogger + serbest), Ülke + Şehir (mevcut `CountryCitySelector` mantığıyla), LinkedIn URL (zorunlu, zod url validation), opsiyonel ek link.
- Süre: free user → 2 saat, premium → 4 saat (`useIsPremium`). UI'de gösterilir.
- Submit: `opens_at = now()`, `closes_at = now() + duration`. Aynı isim varsa Postgres unique hatasını yakalayıp toast.
- Başarılıysa otomatik `cafe_memberships` insert + cafe sayfasına yönlendir.

## 4. Cafe listesi & filtreleme

`Feed.tsx` sol panelindeki "Cafe'ler" bölümü mock yerine `cafes` tablosundan `closes_at > now()` olan aktif cafe'leri çeker. Üstte:
- "+ Cafe Aç" butonu (CreateCafeForm dialog tetikleyici).
- Mevcut konum filtresi (selectedCountries / selectedCities) cafe listesini de daraltır.
- Her cafe satırı: ad, tema ikonu, şehir, kalan süre rozeti, click → `/cadde/:cafeId`.

## 5. Cafe sayfası (cafe-içi feed)

Aynı `Feed.tsx` route parametresi ile çalışacak: `/cadde/:cafeId?` ekleyelim.
- `cafeId` varsa:
  - Üstte "← Genel Cadde'ye dön" link (büyük, dikkat çekici).
  - Cafe başlığı + açılış/kapanış saatleri (örn. "Açılış 14:30 · Kapanış 16:30 · Kalan 1s 47dk").
  - `fetchPosts` query'si `eq("cafe_id", cafeId)`. CreatePostForm da `cafe_id` ekler.
  - Giriş kontrolü: kullanıcı `cafe_memberships`'da yoksa, "Cafe'ye gir" butonu (günlük hak kontrolü trigger ile sunucuda). Hata `daily_cafe_limit` → toast.
  - Cafe kapandıysa (`closes_at < now`): salt-okunur banner.
- `cafeId` yoksa: mevcut genel feed (`cafe_id IS NULL`).

## 6. CreatePostForm

`cafeId` prop ekle; insert sırasında `cafe_id` doldur.

## Teknik notlar

- Trigger SQL:
  ```sql
  create function enforce_daily_cafe_join() returns trigger ...
    if exists (select 1 from cafe_memberships
               where user_id = NEW.user_id
                 and joined_at > now() - interval '24 hours'
                 and cafe_id <> NEW.cafe_id) then
       raise exception 'daily_cafe_limit';
    end if;
  ```
- Premium tespiti: mevcut `useIsPremium` hook (admin = premium).
- Routing: `App.tsx`'de `/cadde/:cafeId` rotası eklenir (lazy Feed).

## Dosya değişiklikleri

- yeni: `src/components/feed/CreateCafeForm.tsx`
- yeni: `src/hooks/useCafes.ts` (liste + üyelik helperları)
- migration: cafes, cafe_memberships, feed_posts.cafe_id, trigger
- düzenle: `src/pages/Feed.tsx`, `src/components/feed/CreatePostForm.tsx`, `src/App.tsx`

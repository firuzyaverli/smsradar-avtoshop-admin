# SMSRadar — Avto Market Admin

Avto Market admin paneli: React + Vite + Tailwind CSS, bütün fayllar `.js`.

## İşə salmaq

```bash
npm install
npm start        # və ya: npm run dev
```

Brauzerdə: http://localhost:5173

## Digər əmrlər

- `npm run build` — production build (`dist/`)
- `npm run preview` — build-i lokal yoxlamaq
- `npm run lint` — oxlint yoxlaması

## Səhifələr

| Ünvan | Səhifə |
|---|---|
| `/` | Panel — statistika, qrafiklər |
| `/products` | Məhsullar |
| `/products/new` | Məhsul əlavə et (Ümumi, Fayllar) |
| `/products/:id?tab=view\|general\|files` | Məhsula baxış / redaktə / şəkillər |
| `/orders` | Sifarişlər |
| `/orders/:id?tab=view\|status\|items` | Sifariş məlumatı / statusu / məhsulları |
| `/categories` | Kateqoriyalar (modal ilə əlavə/redaktə) |
| `/compatibilities` | Uyğunluqlar (modal ilə əlavə/redaktə) |
| `/deliveries` | Çatdırılmalar |
| `/deliveries/:id` | Çatdırılma məlumatı və tarixçəsi |

## Struktur

- `src/components/layout` — header, sidebar, detal səhifə şablonu
- `src/components/ui` — cədvəl, form sahələri, tablar, modal, qalereya və s.
- `src/pages` — səhifələr
- `src/data` — mock data, store və panel statistikası (backend qoşulanda yalnız bu qovluq dəyişəcək)
- `src/lib` — formatlama, statuslar, köməkçi funksiyalar

## Qeydlər

- Komponentlər `.js` faylındadır. `vite.config.js`-dəki `jsxInJs` plugin-i `src/` içindəki `.js` fayllarında JSX-i çevirir.
- Hazırda data yaddaşda saxlanılır — səhifəni yeniləyəndə ilkin vəziyyətə qayıdır.

Dizayn: Figma — "Avto Market" faylı, "Avto Market Admin" səhifəsi.

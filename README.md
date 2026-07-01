# Pop Series — Frontend (Next.js 16)

เว็บข่าว/ซีรีส์ [popseries.co](https://www.popseries.co) — Next.js App Router (RSC + ISR)
ที่ดึงข้อมูลจาก WordPress ผ่านปลั๊กอินของเราเอง (`popseries/v1`) แทน REST มาตรฐาน

## สถาปัตยกรรม

```
┌─────────────────┐   REST (popseries/v1)   ┌──────────────────────────┐
│  Next.js 16     │ ──────────────────────► │  WordPress (popseries.co)│
│  App Router     │   posts / users / tags  │  ปลั๊กอิน "Pop Series API"│
│  RSC + ISR 10m  │   slider / on-air       │  - WP_Query              │
│                 │   popular-posts         │  - WP Popular Posts       │
│  /api/revalidate│ ◄────────────────────── │  - Yoast SEO              │
└─────────────────┘   webhook (on change)   └──────────────────────────┘
```

- **ข้อมูลทั้งหมด** มาจากปลั๊กอิน WordPress ที่ `wp-json/popseries/v1` (โค้ดอยู่ใน
  [`wordpress-plugin/popseries-api/`](wordpress-plugin/popseries-api/) — ดู
  [README ของปลั๊กอิน](wordpress-plugin/popseries-api/README.md))
- **แคช**: ISR 10 นาที + cache tags → clear ทันทีผ่าน webhook เมื่อมีการแก้ข้อมูล
- Layer เรียก API ทั้งหมดรวมอยู่ใน [`src/lib/api.ts`](src/lib/api.ts)

## เริ่มพัฒนา

```bash
npm install
cp .env.example .env      # แล้วใส่ REVALIDATE_SECRET
npm run dev               # http://localhost:3000
```

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm run start` | รัน production |
| `npm run lint` | eslint |

## Environment

| ตัวแปร | จำเป็น | ใช้ทำอะไร |
|---|---|---|
| `REVALIDATE_SECRET` | สำหรับ auto clear cache | secret ของ webhook `/api/revalidate` ต้องตรงกับที่ตั้งฝั่ง WordPress |

> ถ้าไม่ตั้ง `REVALIDATE_SECRET` เว็บยังทำงานปกติ แค่แคชจะรีเฟรชตามรอบ ISR (10 นาที) แทนการ clear ทันที

## โครงสร้างโปรเจกต์

```
src/
├─ app/
│  ├─ page.tsx                 หน้าแรก (hero slider, trending, หมวดต่างๆ)
│  ├─ [slug]/                  บทความ + หน้าหมวดหมู่ (แยกด้วย CATEGORY_BY_SLUG)
│  │  ├─ CategoryView.tsx      layout แต่ละหมวด (Series มี section "กำลังออนแอร์")
│  │  ├─ ArticleView.tsx       หน้าบทความ
│  │  └─ loadCategory.ts       โหลด+แบ่งหน้า category
│  ├─ tag/[slug]/              หน้าแท็ก
│  ├─ author/[slug]/           หน้าผู้เขียน
│  ├─ search/                  หน้าค้นหา
│  └─ api/revalidate/route.ts  webhook รับคำสั่ง clear cache จาก WordPress
├─ components/                 UI (ArticleCard, HeroSlider, ฯลฯ)
└─ lib/
   ├─ api.ts                   ตัวเรียก WordPress ทั้งหมด + cache tags + normalize
   └─ categories.ts            แม็ปหมวดหมู่ (id ↔ slug ↔ ป้ายไทย/อังกฤษ)

wordpress-plugin/popseries-api/  ปลั๊กอิน WordPress (ติดตั้งบนเซิร์ฟเวอร์ WP)
```

## ฟีเจอร์หลัก

### 1. ข้อมูลจากปลั๊กอิน `popseries/v1`
รูปแบบ JSON เหมือน `/wp/v2` เดิม (รวม `_embedded`) แต่ **อัด thumbnail/author/tags มาให้เลย**
ไม่ต้องใช้ `_embed` และตัด field ที่ไม่ได้ใช้ออก — `content` ส่งเฉพาะตอนดึงบทความรายตัว

### 2. Slider หน้าแรก + "กำลังออนแอร์" (เลือกเองได้)
บรรณาธิการเลือกใน **WP Admin → Pop Series**:
- **Slider หน้าแรก** — ค้นหา+เลือกโพสต์ จัดลำดับได้ (ว่าง → ใช้ 5 โพสต์ล่าสุด)
- **กำลังออนแอร์** — เลือกซีรีส์ที่จะเด่นบนหน้า `/series`

frontend ดึงผ่าน `getSliderPosts()` / `getOnAirPosts()`

### 3. Trending จาก WordPress Popular Posts
section "กำลังเป็นที่พูดถึง" ใช้ยอดวิวจริง (รอบ 7 วัน) ผ่าน `getMostViewedPosts()`
→ ปลั๊กอินดึงอันดับจาก WPP มาให้ในรูปแบบเดียวกัน

### 4. SEO / OG จาก Yoast
บทความรายตัวได้ `title`, `description`, `og:*`, `twitter:*`, `canonical` จาก Yoast โดยตรง
(`generateMetadata` ใน [`src/app/[slug]/page.tsx`](src/app/[slug]/page.tsx)) — ไม่ต้องทำ field เอง

### 5. Auto clear cache (On-demand Revalidation)
ทุก fetch ติด cache tag (`wp`, `wp:posts`, `wp:slider`, `wp:on-air`, …)
เมื่อ WordPress มีการเปลี่ยนแปลง (แก้โพสต์ / บันทึก slider/ออนแอร์) ปลั๊กอินยิง webhook
มาที่ `/api/revalidate` เพื่อ clear เฉพาะ tag/path ที่เกี่ยว — ไม่ต้องรอรอบ ISR

## Deploy checklist

**Frontend (Next.js)**
1. ตั้ง env `REVALIDATE_SECRET` (`openssl rand -hex 32`)
2. `npm run build && npm run start` (หรือ deploy Vercel)

**WordPress (popseries.co)**
1. อัปโหลดโฟลเดอร์ `wordpress-plugin/popseries-api/` ไป `wp-content/plugins/` แล้ว Activate
2. เมนู **Pop Series → การเชื่อมต่อ Next.js**: กรอก Webhook URL (`https://<frontend>/api/revalidate`)
   + Shared secret (ค่าเดียวกับ `REVALIDATE_SECRET`)
   — หรือกำหนดผ่าน constant ใน `wp-config.php` (ดู README ปลั๊กอิน)

## เอกสารเพิ่มเติม

- [ปลั๊กอิน Pop Series API](wordpress-plugin/popseries-api/README.md) — endpoints, hooks, การตั้งค่า revalidation แบบละเอียด
- โน้ตสำหรับ AI/ผู้ช่วย: [`AGENTS.md`](AGENTS.md)

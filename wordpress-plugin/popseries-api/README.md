# Pop Series API (WordPress plugin)

ปลั๊กอิน REST endpoint แบบเบา ใช้ **`WP_Query`** เป็นแกนหลัก คืนข้อมูล **รูปแบบเดียวกับ WP REST `/wp/v2` เดิม** ที่ frontend (`src/lib/api.ts`) ใช้อยู่ แต่:

- **อัด Thumbnail / author / tags มาให้เลย** ไม่ต้องส่ง `_embed` (ลด query + ลด payload)
- ตัด field ที่ frontend ไม่ได้ใช้ออก เหลือเฉพาะที่ `normalizePost()` อ่านจริง
- ส่ง `content` หนักๆ เฉพาะตอนดึงบทความรายตัว (`?slug=`) — list ไม่ส่ง content

## ติดตั้ง

1. คัดลอกโฟลเดอร์ `popseries-api/` ไปไว้ที่ `wp-content/plugins/` บนเซิร์ฟเวอร์ WordPress (popseries.co)
2. เข้า **WordPress Admin → Plugins → Activate** ปลั๊กอิน "Pop Series API"
3. ทดสอบ: เปิด `https://www.popseries.co/wp-json/popseries/v1/posts?per_page=2`

> ไม่ต้องตั้งค่า permalink พิเศษ REST route ทำงานได้ทันทีหลัง activate

## Endpoints (GET, public ทั้งหมด)

| Endpoint | ใช้แทน API เดิม | Query params (เหมือนเดิม) |
|---|---|---|
| `/popseries/v1/posts` | `/wp/v2/posts` | `per_page`, `page`, `offset`, `categories`, `tags`, `author`, `exclude`, `search`, `slug` |
| `/popseries/v1/users` | `/wp/v2/users` | `slug`, `per_page` |
| `/popseries/v1/tags` | `/wp/v2/tags` | `per_page`, `orderby`, `order`, `slug` |
| `/popseries/v1/popular-posts` | `wordpress-popular-posts/v1/popular-posts` | `limit`, `range`, `exclude` |

ชื่อ param ตั้งใจให้ **ตรงกับของเดิมเป๊ะ** และ `/posts` ยังส่ง header `X-WP-Total` / `X-WP-TotalPages` เหมือนเดิม → ฝั่ง frontend แทบไม่ต้องแก้ logic

## วิธีสลับ frontend มาใช้ปลั๊กอินนี้

แก้แค่ 2 บรรทัดบนสุดของ [`src/lib/api.ts`](../../src/lib/api.ts):

```diff
- const API_BASE = "https://www.popseries.co/wp-json/wp/v2";
- const WPP_BASE = "https://www.popseries.co/wp-json/wordpress-popular-posts/v1";
+ const API_BASE = "https://www.popseries.co/wp-json/popseries/v1";
+ const WPP_BASE = "https://www.popseries.co/wp-json/popseries/v1";
```

พารามิเตอร์ `_embed=1` ที่ frontend ส่งมาจะถูกเพิกเฉย (ปลั๊กอิน embed ให้เสมออยู่แล้ว) — ไม่กระทบอะไร

## Popular posts — แหล่งข้อมูลยอดวิว

ปลั๊กอินจัดอันดับด้วย `WP_Query` ตามลำดับนี้:

1. **filter `popseries_popular_post_ids`** — ถ้าต้องการดึงจากแหล่งภายนอก (เช่นตาราง WordPress Popular Posts เดิม) ให้ return เป็น array ของ post ID ที่เรียงแล้ว
2. **views meta key** (ค่า default `wpp_total_views`, เปลี่ยนได้ด้วย filter `popseries_views_meta_key`) — เรียงด้วย `meta_value_num`
3. **fallback** เรียงตาม `comment_count` แล้วตามด้วยวันที่ ถ้ายังไม่มี meta ยอดวิว

ตัวอย่างต่อกับ WPP เดิม (วางใน `functions.php` ของธีม):

```php
add_filter( 'popseries_popular_post_ids', function ( $ids, $range, $limit, $exclude ) {
    if ( ! function_exists( 'wpp_get_views' ) ) {
        return $ids; // WPP ไม่ได้ติดตั้ง — ใช้ logic default
    }
    $args = array( 'range' => $range, 'limit' => $limit, 'post_type' => 'post' );
    // ดึง ID เรียงตามยอดวิวจริงจาก WordPress Popular Posts...
    // return array( 123, 456, ... );
    return $ids;
}, 10, 4 );
```

## จัดหน้าเว็บ (Slider / กำลังออนแอร์)

หลัง activate จะมีเมนู **Pop Series** ใน WP Admin:

- **สไลด์หน้าแรก** — ค้นหาโพสต์แล้วกด “เพิ่ม” จัดลำดับด้วย ▲▼ (เว้นว่าง = ใช้ 5 โพสต์ล่าสุด)
- **กำลังออนแอร์** — เลือกซีรีส์ที่จะเด่นในหัวข้อ “กำลังออนแอร์” บนหน้า `/series`

Endpoint ที่เพิ่ม: `GET /popseries/v1/slider` และ `GET /popseries/v1/on-air`
(frontend เรียกผ่าน `getSliderPosts()` / `getOnAirPosts()`)

## Clear cache Next.js อัตโนมัติ (On-demand Revalidation)

frontend cache แบบ ISR (10 นาที) — เพื่อให้เห็นผลทันทีเมื่อแก้ข้อมูล ปลั๊กอินจะยิง webhook
ไปที่ `/api/revalidate` ของ Next เพื่อเคลียร์แคชเฉพาะส่วนที่เปลี่ยน

**ตั้งค่า (2 ฝั่งต้องตรงกัน):**

1. ฝั่ง Next.js — ตั้ง env `REVALIDATE_SECRET` (ดู `.env.example`)
   ```
   REVALIDATE_SECRET=$(openssl rand -hex 32)
   ```
2. ฝั่ง WordPress — เมนู Pop Series → “การเชื่อมต่อ Next.js” กรอก
   - **Webhook URL**: `https://<frontend>/api/revalidate`
   - **Shared secret**: ค่าเดียวกับ `REVALIDATE_SECRET`

   หรือกำหนดใน `wp-config.php` (ปลอดภัยกว่า จะ lock ช่องในหน้า admin):
   ```php
   define( 'POPSERIES_REVALIDATE_URL', 'https://popseries.co/api/revalidate' );
   define( 'POPSERIES_REVALIDATE_SECRET', '…ค่าเดียวกับฝั่ง Next…' );
   ```

**ทริกเกอร์อัตโนมัติ:**

| เหตุการณ์ | เคลียร์ tag | เคลียร์ path |
|---|---|---|
| บันทึก/แก้ไข/ลบโพสต์ | `wp:posts`, `wp:post:<slug>` | `/`, `/<slug>` |
| เปลี่ยนสถานะ publish | `wp:posts` | `/` |
| บันทึกสไลด์หน้าแรก | `wp:slider` | `/` |
| บันทึกกำลังออนแอร์ | `wp:on-air` | `/series` |

ทุก fetch ฝั่ง frontend ติด tag `wp` (master) เสมอ — ยิง webhook body `{"tags":["wp"]}` เพื่อล้างทั้งหมดได้

## Hooks ที่ปรับแต่งได้

| Filter | ใช้ทำอะไร |
|---|---|
| `popseries_image_sizes` | กำหนดว่าจะส่งรูปขนาดไหนบ้างใน `media_details.sizes` |
| `popseries_views_meta_key` | เปลี่ยน meta key ที่เก็บยอดวิวสำหรับ popular-posts |
| `popseries_popular_post_ids` | ป้อนลำดับ post ID ของ popular-posts จากแหล่งภายนอก |
| `popseries_series_category_id` | เปลี่ยน category id ของ Series (default 4) |

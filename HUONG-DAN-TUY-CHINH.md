# Hướng dẫn tự tuỳ chỉnh site

Viết bài mới → xem `templates/HUONG-DAN.md`. File này nói về **giao diện và nội dung cố định**.

## Quy trình chung

```bash
npm run dev     # xem thử, tự động load lại khi lưu file
npm run build   # build thật + sinh lại index tìm kiếm
```

Mở http://localhost:4321. Sửa file → lưu → trình duyệt tự cập nhật.

Riêng khi đổi file font hoặc CSS, nếu không thấy đổi thì nhấn **Ctrl + Shift + R** (hard
refresh) vì trình duyệt cache font khá lâu.

---

## 1. Sửa nội dung

Không có trang quản trị — mọi thứ nằm trong file. Bảng tra cứu:

| Muốn đổi | Sửa file | Tìm chuỗi này |
|---|---|---|
| Tên ở góc trái header | `src/components/Layout.astro` | `class="brand"` |
| Menu Home / Blog / About | `src/components/Layout.astro` | `class="nav-links"` |
| Link GitHub | `src/components/Layout.astro` | `href="https://github.com/` |
| Link LinkedIn | `src/components/Layout.astro` | `href="https://www.linkedin.com/in/` |
| Địa chỉ email | `src/components/Layout.astro` | `href="mailto:` |
| Dòng bản quyền cuối trang | `src/components/Layout.astro` | `<footer class="footer">` |
| Câu giới thiệu ở trang chủ | `src/pages/index.astro` | `<TypedLede text=` |
| Thông tin cá nhân cho Google | `src/pages/index.astro` | `personSchema` |
| Nội dung trang About | `src/pages/about.astro` | `about-prose` |
| Mục học vấn | `src/pages/about.astro` | `<h3>Education</h3>` |
| Dải kỹ năng chạy ngang | `src/components/SkillsMarquee.astro` | `const skills = [` |
| Tiêu đề trang Blog | `src/pages/blog/index.astro` | `title=` |
| Trang 404 | `src/pages/404.astro` | `hero-lede` |
| Tên + mô tả RSS | `src/pages/rss.xml.ts` | `title:` |
| **Tên miền của site** | `astro.config.mjs` | `site:` |

### Lưu ý về tên miền

Tên miền nằm ở **hai chỗ** và phải giống nhau:

- `astro.config.mjs` → `site:` — Astro dùng cái này để sinh sitemap và RSS
- `src/components/Layout.astro` → `const site =` — dùng cho canonical URL và thẻ chia sẻ

Ngoài ra còn `public/robots.txt` và `public/.well-known/security.txt` cũng ghi tên miền.

### Đổi ảnh

- **Favicon**: thay `public/favicon.svg`
- **Ảnh khi chia sẻ link** (Facebook, Zalo…): thay `public/assets/og.png`, kích thước 1200×630
- **Ảnh trong bài viết**: bỏ vào `public/assets/`, chèn bằng `![mô tả](/assets/ten-anh.png)`

---

## 2. Đổi font

Font khai báo trong `public/css/style.css`. Có hai biến điều khiển toàn bộ site:

```css
:root {
    --mono: "JetBrains Mono", "Be Vietnam Pro", ui-monospace, ..., monospace;
    --body: "Literata", Georgia, "Times New Roman", ui-serif, serif;
}
```

- `--body` → chữ trong đoạn văn, phần thân bài. **Đổi cái này nếu thấy đọc bài dài mỏi mắt.**
- `--mono` → tên ở header, các heading `##`, code block, ngày tháng, nút bấm.

Trình duyệt đọc danh sách từ trái sang phải: font đầu tiên có sẵn và **có chứa ký tự cần
hiển thị** sẽ được dùng.

### Cách nhanh nhất: dùng font có sẵn trong máy

Không cần tải gì, chỉ sửa một dòng:

```css
--body: Georgia, "Times New Roman", serif;          /* serif, cổ điển */
--body: "Segoe UI", system-ui, sans-serif;          /* sans, giống Windows */
```

Nhược điểm: mỗi máy hiển thị mỗi khác, và không phải font hệ thống nào cũng đủ dấu tiếng Việt.

### Cách chuẩn: tải font Google về tự host

Ví dụ đổi font body sang **Nunito Sans**.

**Bước 1 — lấy link file font.** Chú ý phải có `User-Agent` của trình duyệt hiện đại,
không thì Google trả về file TTF cũ và nặng thay vì WOFF2:

```bash
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0" \
  "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;700&display=swap"
```

Kết quả có nhiều khối, mỗi khối mở đầu bằng comment tên bộ ký tự. **Chỉ cần hai khối:
`/* vietnamese */` và `/* latin */`.** Copy đường dẫn `.woff2` trong đó.

**Bước 2 — tải về `public/assets/`:**

```bash
curl -o public/assets/nunito-vietnamese.woff2 "https://fonts.gstatic.com/s/..."
curl -o public/assets/nunito-latin.woff2      "https://fonts.gstatic.com/s/..."
```

**Bước 3 — khai báo trong `public/css/style.css`**, đặt cạnh các khối `@font-face` có sẵn
ở đầu file. Copy nguyên `unicode-range` từ CSS của Google, đừng tự gõ lại:

```css
@font-face {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url("/assets/nunito-vietnamese.woff2") format("woff2");
    unicode-range: U+0102-0103, U+0110-0111, ...;   /* dán từ Google */
}
/* lặp lại khối trên cho file latin, với unicode-range của latin */
```

**Bước 4 — trỏ biến vào font mới:**

```css
--body: "Nunito Sans", system-ui, sans-serif;
```

**Bước 5 — nếu đây là font chính của thân bài**, sửa thẻ preload trong
`src/components/Layout.astro` (tìm `rel="preload"`) để trình duyệt tải sớm:

```html
<link rel="preload" href="/assets/nunito-latin.woff2" as="font" type="font/woff2" crossorigin />
```

Preload tối đa 2–3 file thôi. Preload nhiều quá thì phản tác dụng, trang load chậm hơn.

### Cạm bẫy quan trọng: font thiếu dấu tiếng Việt

Rất nhiều font đẹp **không có glyph tiếng Việt**. Khi đó chữ có dấu sẽ nhảy sang font khác,
nhìn lệch hẳn giữa chừng một từ.

Site này đang dính đúng lỗi đó và đã được vá: JetBrains Mono không có ký tự `ễ ũ ả`, nên
tên "Nguyễn Vũ Bảo" ở header từng hiển thị hai font lẫn lộn. Cách vá là thêm một font có
dấu **ngay phía sau** trong danh sách:

```css
--mono: "JetBrains Mono", "Be Vietnam Pro", ui-monospace, ..., monospace;
/*       ^ chữ không dấu   ^ hứng chữ có dấu                              */
```

**Cách kiểm tra một font có đủ dấu không:** vào trang font trên Google Fonts, mục
"Glyphs" / "Language support" xem có `Vietnamese` không. Hoặc thử gõ "Nguyễn Vũ Bảo" vào
ô preview — nếu các chữ có dấu nhìn khác kiểu với chữ thường thì font đó thiếu.

Ba font đang có sẵn trong `public/assets/` đều đủ dấu: **Literata** (serif),
**Be Vietnam Pro** (sans), JetBrains Mono (chỉ latin, dùng cho code).

---

## 3. Đổi màu

Bảng màu định nghĩa trong `public/css/style.css`, mỗi theme một khối `[data-palette="..."]`
(bắt đầu khoảng dòng 145). Ví dụ:

```css
[data-palette="catppuccin"] {
  --bg: #11111b;        /* nền */
  --ink: #f5e0dc;       /* chữ chính */
  --muted: #9399b2;     /* chữ phụ, ngày tháng */
  --accent: #89b4fa;    /* link, điểm nhấn */
  --line: #313244;      /* đường kẻ, viền */
  ...
}
```

- **Sửa một theme có sẵn**: đổi mã màu trong khối tương ứng.
- **Thêm theme mới**: copy một khối, đổi tên trong `[data-palette="ten-moi"]`, rồi thêm nút
  vào `src/components/Layout.astro` — tìm `theme-overlay-list`:
  ```html
  <button type="button" role="option" data-value="ten-moi">Tên Hiển Thị</button>
  ```
- **Đổi theme mặc định**: trong `Layout.astro`, tìm `defaultPalette` — hiện đang là `vesper`
  cho chế độ tối và `rose-pine-dawn` cho chế độ sáng.

Người đọc tự đổi theme bằng nút góc dưới màn hình; lựa chọn lưu trong `localStorage`.

---

## 4. Sau khi sửa xong

```bash
npm run build
```

Nếu build báo lỗi thì đọc dòng lỗi — thường là thiếu dấu ngoặc, thiếu trường frontmatter,
hoặc sai đường dẫn file font. Sửa xong chạy lại.

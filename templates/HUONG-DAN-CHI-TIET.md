# 📚 CẨM NANG HƯỚNG DẪN QUẢN TRỊ & HOÀN THIỆN BLOG CÁ NHÂN

Chào bạn! Đây là cẩm nang hướng dẫn đầy đủ từ A-Z để bạn tự do viết bài, thêm dự án, chèn hình ảnh và cá nhân hóa toàn bộ website mang dấu ấn của riêng bạn.

---

## 📑 MỤC LỤC
1. [Cách thêm Bài viết Blog mới (Kèm ảnh)](#1-cách-thêm-bài-viết-blog-mới)
2. [Cách thêm Dự án (Project) mới](#2-cách-thêm-dự-án-project-mới)
3. [Cách quản lý và chèn Hình ảnh vào bài viết](#3-cách-quản-lý-và-chèn-hình-ảnh)
4. [Tùy chỉnh Thông tin cá nhân (Tên, Giới thiệu, Mạng xã hội)](#4-tùy-chỉnh-thông-tin-cá-nhân)
5. [Chỉnh sửa Trang Giới thiệu (About) & Học vấn (Education)](#5-chỉnh-sửa-trang-about)
6. [Chỉnh sửa Dải kỹ năng chạy ngang (Skills Marquee)](#6-chỉnh-sửa-dải-kỹ-năng)
7. [Quy trình Viết bài & Đưa lên mạng (Deploy)](#7-quy-trình-viết-bài--deploy)

---

## 1. Cách thêm Bài viết Blog mới

Mỗi bài viết là một thư mục riêng nằm trong: `src/content/blog/`

### 🔹 Bước 1: Tạo thư mục bài viết
Tạo một thư mục mới theo tên viết liền không dấu (dùng dấu gạch ngang `-`), ví dụ:
```
src/content/blog/bai-hoc-lap-trinh-dau-tien/
```

### 🔹 Bước 2: Tạo file `index.md` và bỏ ảnh cover vào thư mục đó
Cấu trúc thư mục bài viết sẽ như sau:
```text
src/content/blog/bai-hoc-lap-trinh-dau-tien/
  ├── index.md           <-- File nội dung bài viết
  └── cover.png          <-- Ảnh đại diện bài viết
```

### 🔹 Bước 3: Điền thông tin đầu bài (Frontmatter)
Mở file `index.md` và điền cấu trúc mẫu:

```markdown
---
title: "Bài học lập trình đầu tiên của tôi"
description: "Chia sẻ về những khó khăn và kinh nghiệm quý báu khi mới bắt đầu học lập trình."
date: 2026-08-14
draft: false
tags:
  - "LapTrinh"
  - "KinhNghiem"
coverImage: "./cover.png"
---

Nội dung bài viết của bạn bắt đầu từ đây...
```

> 💡 **Mẹo:** Bạn có thể sao chép nhanh mẫu có sẵn từ file: `templates/blog-mau/index.md`

---

## 2. Cách thêm Dự án (Project) mới

Mỗi dự án là một thư mục riêng nằm trong: `src/content/projects/`

### 🔹 Bước 1: Tạo thư mục cho dự án
Ví dụ: `src/content/projects/website-ban-hang/`

### 🔹 Bước 2: Tạo file `index.md` và thêm ảnh thumbnail
```text
src/content/projects/website-ban-hang/
  ├── index.md           <-- File thông tin dự án
  └── cover.png          <-- Ảnh đại diện dự án
```

### 🔹 Bước 3: Cấu hình thông tin dự án
Nội dung file `index.md`:

```markdown
---
title: "Hệ Thống Website Bán Hàng E-Commerce"
description: "Nền tảng thương mại điện tử tối ưu tốc độ, tích hợp cổng thanh toán VNPay."
date: 2026-08-14
draft: false
techStack:
  - "React"
  - "NodeJS"
  - "PostgreSQL"
coverImage: "./cover.png"
demoUrl: "https://demo-website.com"       # Để trống hoặc xóa dòng này nếu chưa có link demo
repoUrl: "https://github.com/vubao/shop"  # Link GitHub của bạn
---

## 🎯 Giới thiệu Dự án
Mô tả chi tiết các tính năng, công nghệ bạn sử dụng trong dự án...
```

> 💡 **Mẹo:** Bạn có thể sao chép nhanh mẫu có sẵn từ file: `templates/project-mau/index.md`

---

## 3. Cách quản lý và chèn Hình ảnh

Có 2 cách linh hoạt để bạn chèn ảnh:

### 🌟 Cách 1: Ảnh nằm ngay trong thư mục bài viết (Khuyên dùng nhất)
- Đặt file ảnh cùng thư mục với `index.md` (ví dụ `screenshot1.png`).
- Trong nội dung bài viết chỉ cần viết:
  ```markdown
  ![Giao diện chi tiết](./screenshot1.png)
  ```

### 🌟 Cách 2: Ảnh dùng chung trong `public/assets/`
- Chép ảnh vào thư mục `public/assets/my-photo.jpg`.
- Trong bài viết hoặc trang bất kỳ gọi:
  ```markdown
  ![Ảnh của tôi](/assets/my-photo.jpg)
  ```

---

## 4. Tùy chỉnh Thông tin cá nhân

| Nội dung cần đổi | File cần mở | Dòng / Vị trí |
| :--- | :--- | :--- |
| **Tên Logo góc trái Header** | `src/components/Layout.astro` | Tìm `<span>Nguyễn Vũ Bảo</span>` |
| **Câu giới thiệu gõ phím ở Trang chủ** | `src/pages/index.astro` | Tìm `<TypedLede text="..." />` |
| **Link Mạng xã hội (GitHub, LinkedIn, Email)** | `src/components/Footer.astro` | Tìm các thẻ `<a href="https://github.com/..."` |
| **Dòng bản quyền cuối Footer** | `src/components/Footer.astro` | Tìm `© 2026 Nguyễn Vũ Bảo` |
| **Ảnh đại diện khi gửi link lên Zalo/Facebook** | `public/assets/og.png` | Thay thế bằng file ảnh 1200×630px của bạn |

---

## 5. Chỉnh sửa Trang About

Mở file: `src/pages/about.astro`

1. **Tiểu sử & Câu chuyện bản thân**: Chỉnh sửa các đoạn văn bản `<p>` trong phần `<div class="about-prose">`.
2. **Quá trình học vấn / Bằng cấp**: Chỉnh sửa trong thẻ `<div class="sidebar-card">` mục `<h3>Education</h3>`:
   ```html
   <div class="edu-entry">
     <div class="edu-degree">Kỹ Sư Công Nghệ Thông Tin</div>
     <div class="edu-school">Đại học Bách Khoa — 2022 - 2026</div>
   </div>
   ```

---

## 6. Chỉnh sửa Dải kỹ năng chạy ngang

Mở file: `src/components/SkillsMarquee.astro`

Tìm mảng `skills` ở đầu file và thay bằng các kỹ năng / công nghệ của bạn:
```javascript
const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Astro",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "Git & GitHub",
  "TailwindCSS"
];
```

---

## 7. Quy trình Viết bài & Deploy

### Khi đang viết bài trên máy:
```bash
npm run dev
```
Mở trình duyệt: `http://localhost:4321` — Bạn chỉ cần nhấn `Ctrl + S` khi sửa file, trình duyệt sẽ tự động cập nhật ngay lập tức!

### Khi muốn xuất bản (Deploy lên mạng):
1. **Lưu lại toàn bộ bài viết mới**:
   ```bash
   git add .
   git commit -m "Thêm bài viết mới"
   git push origin main
   ```
2. Nếu bạn đã kết nối **Vercel** hoặc **GitHub Actions**, website sẽ tự động build và cập nhật bài viết mới lên mạng trong vòng 1 phút!

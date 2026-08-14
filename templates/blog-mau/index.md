---
title: "Tiêu đề bài viết mẫu của bạn"
description: "Mô tả ngắn gọn nội dung bài viết này trong 1-2 câu để hiển thị trên danh sách và thẻ xem trước mạng xã hội."
date: 2026-08-14
draft: false
tags:
  - "LapTrinh"
  - "HuongDan"
  - "Astro"
coverImage: "./cover.png" # Đường dẫn ảnh thumbnail cùng thư mục (hoặc xóa dòng này nếu không dùng ảnh đại diện)
---

Đây là đoạn mở đầu của bài viết (phần dẫn nhập). Hãy viết một đoạn ngắn giới thiệu vấn đề hoặc nội dung bạn sẽ chia sẻ trong bài này.

<!-- Bảng mục lục bên trái sẽ tự động tạo dựa trên các thẻ ## Heading 2 bên dưới -->

## 1. Giới thiệu tổng quan

Nội dung phần 1 của bạn. Bạn có thể định dạng văn bản thoải mái:
- **Chữ in đậm** để nhấn mạnh
- *Chữ in nghiêng*
- `Chữ dạng code` cho các câu lệnh ngắn
- [Liên kết ngoài](https://google.com)

> [!NOTE]
> Đây là một khối ghi chú (Callout/Blockquote) giúp làm nổi bật các lưu ý quan trọng cho người đọc.

---

## 2. Cách chèn hình ảnh minh họa

Có 2 cách chèn hình ảnh vào bài viết:

### Cách 1: Để ảnh cùng thư mục với bài viết (Khuyên dùng)
Bạn đặt file ảnh `hinh-minh-hoa.png` ngay cạnh file `index.md` này:
```markdown
![Mô tả ảnh](./hinh-minh-hoa.png)
```

### Cách 2: Để ảnh trong thư mục `public/assets/`
Bạn chép ảnh vào `public/assets/ten-anh.png` và gọi:
```markdown
![Mô tả ảnh](/assets/ten-anh.png)
```

---

## 3. Cách chèn đoạn mã (Code Block)

Bạn có thể chèn code với cú pháp 3 dấu nháy kèm tên ngôn ngữ (javascript, python, html, css, bash...):

```javascript
// Ví dụ mã Javascript
function xinChao(ten) {
  console.log(`Xin chào ${ten} đến với blog cá nhân của tôi!`);
}

xinChao('Vũ Bảo');
```

Hoặc lệnh Terminal / Bash:

```bash
# Cài đặt thư viện
npm install
npm run dev
```

---

## 4. Bảng biểu (Table)

| Cột 1 | Cột 2 | Cột 3 |
| :--- | :---: | ---: |
| Dữ liệu căn trái | Căn giữa | Căn phải |
| Dòng 2 | Hoàn thành | 100% |

---

## 5. Tổng kết

Tóm tắt lại những điều cốt lõi của bài viết và lời chào kết hoặc kêu gọi chia sẻ.

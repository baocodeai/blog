---
title: "Tiêu đề bài viết, có dấu bình thường"
description: "Một câu tóm tắt bài viết. Câu này hiện ở trang /blog/, trong kết quả tìm kiếm và khi chia sẻ link."
date: 2026-08-08
draft: false
tags: ["Astro", "Blog"]
coverImage: "./og.png"
---

Đoạn mở đầu, viết trước heading đầu tiên. Đây là phần người đọc thấy ngay sau tiêu đề,
nên hãy nói rõ bài này giải quyết chuyện gì và tại sao đáng đọc tiếp. Hai đến ba câu là đủ.

## Heading cấp 2 trở thành mục lục

Mọi heading `##` được tự động gom thành mục lục ở cột bên cạnh (trên màn hình rộng).
Vì vậy hãy đặt heading ngắn, rõ nghĩa — chúng vừa là tiêu đề vừa là thanh điều hướng.

Đoạn văn thường, **chữ đậm**, *chữ nghiêng*, và [link](https://astro.build) dùng đúng
cú pháp markdown quen thuộc.

### Heading cấp 3 dùng để chia nhỏ trong một mục

Heading `###` không xuất hiện trong mục lục, dùng để tách ý bên trong một phần lớn.

## Chèn code

Code block có tô màu cú pháp và tự đổi màu theo palette người đọc đang chọn:

```js
function chao(ten) {
  return `Xin chào, ${ten}!`;
}

console.log(chao('thế giới'));
```

Code ngắn viết xen trong câu thì dùng dấu backtick, ví dụ `npm run build`.

## Danh sách và trích dẫn

Danh sách không thứ tự:

- Ý thứ nhất
- Ý thứ hai
- Ý thứ ba

Danh sách có thứ tự:

1. Viết bài
2. Xem thử ở máy local
3. Xuất bản

> Blockquote dùng cho ghi chú, cảnh báo, hoặc trích lời người khác.

## Kết

Chốt lại ý chính và, nếu có, dẫn người đọc sang bài kế tiếp.

Khi bài đã sẵn sàng, đổi `draft: true` thành `draft: false` ở phần frontmatter phía trên.

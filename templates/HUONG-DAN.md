# Hướng dẫn viết bài

## 1. Tạo file mới

Copy `templates/bai-viet.md` vào `src/content/blog/`, đặt tên file là **slug không dấu**:

```bash
cp templates/bai-viet.md src/content/blog/cach-toi-viet-blog.md
```

Tên file chính là URL. File `cach-toi-viet-blog.md` sẽ ra `/blog/cach-toi-viet-blog/`.

### Quy tắc đặt slug

Bỏ dấu, `đ` → `d`, chữ thường, khoảng trắng → gạch ngang, bỏ hết ký tự đặc biệt.

| Tiêu đề | Tên file |
|---|---|
| Cách tôi viết blog | `cach-toi-viet-blog.md` |
| Đọc hiểu mã nguồn Astro | `doc-hieu-ma-nguon-astro.md` |
| 5 mẹo dùng Git hằng ngày | `5-meo-dung-git-hang-ngay.md` |

Tiêu đề trong frontmatter thì **vẫn giữ nguyên dấu** — chỉ tên file mới bỏ dấu.

## 2. Điền frontmatter

Bốn trường ở đầu file, nằm giữa hai dòng `---`:

| Trường | Bắt buộc | Ý nghĩa |
|---|---|---|
| `title` | có | Tiêu đề, có dấu. Hiện ở thẻ `<title>`, trang blog, và khi share link. |
| `description` | có | Một câu tóm tắt. Hiện ở danh sách bài, kết quả tìm kiếm, và thẻ Open Graph. |
| `date` | có | Định dạng `YYYY-MM-DD`. Bài mới nhất tự động được gắn nhãn `latest`. |
| `draft` | không | `true` = chưa xuất bản, không lên site. Mặc định `false`. |

Thiếu `title`, `description`, hoặc `date` thì build sẽ báo lỗi ngay — đó là chủ ý, để không
bao giờ có bài lên site mà thiếu metadata.

## 3. Viết nội dung

- Đoạn đầu tiên (trước heading đầu) là phần mở bài, nên viết cho gọn và rõ.
- Mỗi heading `##` tự động thành một mục trong **mục lục** ở cột bên cạnh. Heading `###` thì không.
- Code block dùng ba dấu backtick kèm tên ngôn ngữ (` ```js `) để có tô màu cú pháp.
- Ảnh đặt trong `public/assets/`, chèn bằng `![mô tả](/assets/ten-anh.png)`.

## 4. Xem thử ở máy

```bash
npm run dev
```

Mở http://localhost:4321. Bài `draft: true` sẽ **không** hiện — muốn xem thử thì tạm để
`draft: false`, xem xong đổi lại.

## 5. Xuất bản

Đổi `draft: true` thành `draft: false`, rồi build:

```bash
npm run build
```

Lệnh này chạy `astro build` và sinh lại index tìm kiếm (Pagefind). Bài mới sẽ tự động
xuất hiện ở trang chủ (3 bài gần nhất), trang `/blog/`, RSS feed, và sitemap — không
phải sửa tay ở đâu cả.

## Ghi chú

- Tìm kiếm (Ctrl+K) chỉ chạy sau khi đã `npm run build` ít nhất một lần, vì index nằm trong `dist/`.
- Pagefind chưa hỗ trợ tách từ (stemming) cho tiếng Việt, nên tìm kiếm khớp theo từ nguyên
  dạng chứ không khớp các biến thể của cùng một từ gốc.
- File `src/content/blog/example-post.md` là bài mẫu tiếng Anh của theme. Xoá khi không cần nữa.

# Hướng dẫn Quản trị & Phát triển Website — BaoNV Portfolio & Blog

Tài liệu hướng dẫn toàn diện cách viết bài, thêm dự án, tùy chỉnh giao diện và xuất bản trang cá nhân **BaoNV (Computer Vision Engineer)**.

---

## 1. Cấu trúc Nội dung Website

Website được xây dựng chuyên biệt cho Computer Vision Engineer với hệ thống phân cấp rõ ràng:

1. **3 Trục Bài viết (Tracks)**:
   - `Paper Reproductions`: Tái tạo kiến trúc các bài báo khoa học đỉnh cao (SAM 2, ControlNet, ViT).
   - `Deep Dives`: Phân tích sâu thuật toán, toán học và kỹ thuật tối ưu (3D Gaussian Splatting, Visual RAG).
   - `Deployment Logs`: Nhật ký tối ưu hóa và triển khai phần cứng/trình duyệt (WebGPU, ONNX Runtime, TensorRT).

2. **6 Lĩnh vực Chuyên môn (Technical Domains)**:
   - `Detection`: Phát hiện và bám vết đối tượng thời gian thực (YOLOv11, ByteTrack, RT-DETR).
   - `3D Vision`: Tái tạo không gian 3D, 3DGS, NeRF, Depth Estimation.
   - `Deployment`: Edge AI, WebGPU, TensorRT FP16/INT8, C++ Runtimes.
   - `VLM`: Multimodal, Vision-Language Models (Florence-2, CLIP, LLaVA).
   - `Diffusion`: Generative AI, ControlNet, LoRA Fine-tuning.
   - `Segmentation`: Phân vùng ảnh và video tương tác (SAM 2, Mask2Former).

---

## 2. Hướng dẫn Viết bài Blog Mới (`/blog/`)

### Bước 1: Tạo file bài viết
Copy file mẫu từ [`templates/bai-viet.md`](file:///d:/projects/blog/templates/bai-viet.md) vào thư mục `src/content/blog/`, đặt tên file dạng slug không dấu:

```bash
cp templates/bai-viet.md src/content/blog/ten-bai-viet-moi.md
```

### Bước 2: Điền Frontmatter chuẩn
Mỗi bài viết bắt đầu bằng khối metadata giữa hai cặp dấu `---`:

```yaml
---
title: "Tối ưu hóa YOLOv11 với TensorRT FP16"
description: "Pipeline phát hiện và bám vết đa đối tượng đạt 120 FPS với độ trễ 3.8ms."
date: 2026-08-14
draft: false
featured: true                        # true = Đặt làm bài nổi bật to ở đầu trang blog
category: "Deployment Logs"           # "Paper Reproductions" | "Deep Dives" | "Deployment Logs"
domain: "Detection"                   # "Detection" | "3D Vision" | "VLM" | "Deployment" | "Diffusion"
coverImage: "/covers/yolo-detection.svg"  # Ảnh kết quả CV tỉ lệ 16:9 (đặt trong public/covers/)
readingTime: "8 min read"
tags: ["Detection", "YOLOv11", "TensorRT", "ByteTrack", "Edge AI"]
---
```

### Bước 3: Nguyên tắc hình ảnh Cover (9 Nguyên tắc CV)
- **Tỉ lệ cố định**: Luôn dùng ảnh tỉ lệ **16:9** hoặc **16:10**.
- **Dùng ảnh kết quả thực tế**: Nên dùng ảnh có bounding box, mask màu, depth map hoặc sơ đồ latency pipeline làm thumbnail để tăng độ uy tín và đẹp mắt.
- **Thư mục lưu ảnh**: Đặt ảnh trong thư mục [`public/covers/`](file:///d:/projects/blog/public/covers/) hoặc [`public/assets/`](file:///d:/projects/blog/public/assets/).

---

## 3. Hướng dẫn Thêm Dự án Mới (`/projects/`)

### Bước 1: Tạo file dự án
Copy [`templates/du-an.md`](file:///d:/projects/blog/templates/du-an.md) vào `src/content/projects/`:

```bash
cp templates/du-an.md src/content/projects/webgpu-yolo-tracker.md
```

### Bước 2: Điền Frontmatter dự án
```yaml
---
title: "WebGPU Real-time YOLOv11 & ByteTrack"
description: "Zero-server, client-side object detection running at 60 FPS in browser."
date: 2026-08-01
draft: false
featured: true                        # Hiển thị ở phần Featured Projects trang chủ
badge: "Live Demo"                    # Badge nổi bật trên card
domain: "Edge AI"
techStack: ["WebGPU", "ONNX Web", "TypeScript", "YOLOv11"]
coverImage: "/covers/webgpu-runtime.svg"
demoUrl: "https://your-demo.link"
repoUrl: "https://github.com/baocodeai/your-repo"
---
```

---

## 4. Logo, Favicon & Hệ thống Dark Mode

1. **Dark Mode mặc định**: Website tự động khởi chạy ở chế độ Dark Mode (`tokyo-night`) sang trọng.
2. **Logo thông minh (Adaptive Logo)**:
   - File gốc: [`public/logo.png`](file:///d:/projects/blog/public/logo.png) (xanh đậm cho Light mode).
   - File Dark mode: [`public/logo-dark.png`](file:///d:/projects/blog/public/logo-dark.png) (Electric Cyan rực rỡ có hiệu ứng phát sáng nhẹ trên nền tối).
   - Favicon: Tự động tối ưu zero-margin cho tab trình duyệt tại [`public/favicon.svg`](file:///d:/projects/blog/public/favicon.svg) và [`public/favicon.ico`](file:///d:/projects/blog/public/favicon.ico).

---

## 5. Các Lệnh Thao tác Thường dùng

| Lệnh Terminal | Mục đích |
|---|---|
| `npm run dev` | Chạy dev server tại `http://localhost:4321` để xem trước thay đổi |
| `npm run build` | Build bản tĩnh (Static HTML/CSS/JS) và tạo index tìm kiếm Pagefind |
| `npm run preview` | Chạy thử bản build production hoàn chỉnh |
| `npm run check` | Kiểm tra lỗi cú pháp TypeScript và Content Collections |

---

## 6. Triển khai (Deployment)

Website là **100% Static HTML/CSS/JS** nên có thể host miễn phí trên:
- **Cloudflare Pages**: Kết nối repo GitHub ➔ Build command: `npm run build` ➔ Output directory: `dist`.
- **Vercel**: Framework Preset: `Astro` ➔ Output directory: `dist`.
- **GitHub Pages**: Dùng GitHub Actions có sẵn trong repo.

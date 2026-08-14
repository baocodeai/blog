---
title: "Interactive 3D Gaussian Splatting Web Viewer"
description: "High-fidelity real-time 3D reconstruction and neural rendering engine built with WebGPU/WebGL, progressive LoD streaming, and custom spherical harmonics shaders."
date: 2026-07-25
draft: false
featured: true
badge: "Live Demo"
domain: "3D Vision & NeRF"
techStack: ["3DGS", "WebGPU", "Three.js", "CUDA", "C++"]
demoUrl: "https://baocodeai.github.io/projects/gaussian-splatting-viewer/"
repoUrl: "https://github.com/baocodeai/3dgs-web-viewer"
---

## Tổng quan dự án

Trình render 3D Gaussian Splatting (3DGS) thời gian thực trên nền web cho phép hiển thị các khung cảnh tái tạo 3D chân thực ở tốc độ **60 FPS**.

### Đặc điểm kỹ thuật

- **Rasterization GPU**: Triển khai thuật toán sorting Radix và Alpha-blending trực tiếp qua compute shaders của WebGPU.
- **Progressive Streaming**: Nén dữ liệu Splat (.ply, .splat) với định dạng nhị phân tối ưu, cho phép tải cảnh 3D hàng triệu điểm ảnh trong vài giây.
- **Spherical Harmonics**: Hỗ trợ bậc 0 đến bậc 3 để tái hiện hiệu ứng ánh sáng thay đổi theo góc nhìn (view-dependent specularities).

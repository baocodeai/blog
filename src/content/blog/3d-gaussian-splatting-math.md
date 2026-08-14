---
title: "3D Gaussian Splatting from First Principles: Ellipsoid Math, Tile Rasterization & CUDA"
description: "Demystifying the covariance matrix projection, spherical harmonic view dependency, and sorting-based tile rasterization that power real-time radiance fields."
date: 2026-07-28
draft: false
category: "Deep Dives"
domain: "3D Vision"
stage: "Math & Architecture"
specs: ["🔬 1.48M Splats", "⚡ CUDA Tile Rasterizer", "📐 Covariance Math"]
coverImage: "/covers/3dgs-render.svg"
tags: ["3D Vision", "Gaussian Splatting", "CUDA", "Math", "Deep Dives", "Rasterization"]
readingTime: "14 min read"
---

## Nguồn gốc của 3D Gaussian Splatting

Khác với NeRF (Neural Radiance Fields) biểu diễn trường bức xạ liên tục thông qua mạng nơ-ron MLP dày đặc đòi hỏi lấy mẫu hàng trăm điểm trên mỗi tia ray, **3D Gaussian Splatting (3DGS)** biểu diễn khung cảnh bằng một tập hợp hàng triệu hình ellipsoid 3D rời rạc.

Mỗi Gaussian 3D được xác định bởi:
1. Vị trí trung tâm $\mu \in \mathbb{R}^3$
2. Ma trận hiệp phương sai $\Sigma \in \mathbb{R}^{3 \times 3}$
3. Độ mờ (opacity) $\alpha \in [0, 1]$
4. Màu sắc phụ thuộc góc nhìn biểu diễn qua hàm sóng hình cầu (Spherical Harmonics - SH).

## Phép chiếu từ Không gian 3D sang 2D Camera Screen

Để chiếu ma trận hiệp phương sai 3D $\Sigma$ lên mặt phẳng ảnh 2D, ta dùng phép biến đổi affine cục bộ với ma trận Jacobian $J$ và ma trận xoay góc nhìn $W$:

$$\Sigma' = J W \Sigma W^T J^T$$

Trong đó $\Sigma'$ là ma trận $2 \times 2$ biểu diễn elip 2D trên màn hình.

## Tile-based Differentiable Rasterizer

Quy trình render đạt tốc độ > 100 FPS nhờ cơ chế chia nhỏ màn hình thành các tile $16 \times 16$ pixels:
1. **Culling**: Loại bỏ các Gaussian nằm ngoài frustum camera.
2. **Key-Sorting**: Sắp xếp các Gaussian theo độ sâu depth bằng Radix Sort trên GPU song song.
3. **Alpha Blending**: Từng thread trong CUDA block xử lý từng pixel, tính toán đóng góp màu từ trước ra sau (front-to-back) và ngắt sớm khi độ mờ tích lũy $\alpha_{acc} > 0.999$.

## Kết luận

3D Gaussian Splatting đã tạo ra cuộc cách mạng trong thị giác 3D khi kết hợp được cả 3 yếu tố: chất lượng tái tạo quang học cao (SOTA visual fidelity), tốc độ huấn luyện nhanh gấp 10x và tốc độ render thời gian thực (60+ FPS).

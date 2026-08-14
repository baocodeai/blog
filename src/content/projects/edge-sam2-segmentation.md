---
title: "Edge SAM 2: Low-Latency Video Mask Propagation"
description: "Lightweight Segment Anything Model 2 distillation running under 15ms per frame on edge devices with TensorRT FP16 acceleration and interactive point prompting."
date: 2026-06-18
draft: false
featured: true
badge: "Benchmark + Demo"
domain: "Foundation Models"
techStack: ["SAM 2", "TensorRT", "PyTorch", "C++20", "OpenCV"]
demoUrl: "https://baocodeai.github.io/projects/edge-sam2-segmentation/"
repoUrl: "https://github.com/baocodeai/edge-sam2"
---

## Tổng quan dự án

Tối ưu hóa và chuyển đổi kiến trúc Segment Anything 2 (SAM 2) từ Meta sang pipeline suy luận C++ với TensorRT, phục vụ phân đoạn video thời gian thực trên các thiết bị nhúng (Nvidia Jetson Orin Nano, AGX).

### Các tối ưu chính

1. **Image & Memory Encoder Splitting**: Tách biệt luồng xử lý embedding hình ảnh và memory attention để tránh lặp lại tính toán trên các khung hình tĩnh.
2. **Engine TensorRT FP16**: Tăng tốc gấp 4.2x so với PyTorch ban đầu.
3. **Interactive Prompt API**: Hỗ trợ nhận điểm click và bounding box qua giao diện C++ IPC với độ trễ phản hồi < 8ms.

---
title: "Tiêu đề bài viết kỹ thuật (Ví dụ: Tối ưu hóa YOLOv11 với TensorRT FP16)"
description: "Một câu tóm tắt kỹ thuật nêu rõ phương pháp, model và kết quả đạt được (latency, FPS, mAP)."
date: 2026-08-14
draft: false
featured: false
category: "Deployment Logs"
domain: "Detection"
coverImage: "/covers/yolo-detection.svg"
readingTime: "8 min read"
tags: ["Detection", "Object Detection", "Tracking", "YOLOv11", "TensorRT", "Edge AI"]
---

Đoạn mở đầu nêu trực tiếp bài toán cốt lõi: Bạn đang giải quyết vấn đề gì, model/kiến trúc nào được sử dụng, và kết quả thực nghiệm nổi bật nhất (ví dụ: tăng tốc 3.5x trên RTX 4090, giảm 60% VRAM hoặc đạt 120 FPS).

## 1. Kiến trúc & Nguyên lý hoạt động

Mọi heading cấp 2 (`##`) sẽ tự động xuất hiện ở thanh **Mục lục (Table of Contents)** bên cạnh.

- Giải thích trực quan luồng dữ liệu (Pipeline Data Flow).
- Sử dụng các biểu thức toán học LaTeX nếu cần:
  Ví dụ hàm Gaussian:
  $$G(x) = \exp\left(-\frac{1}{2} x^T \Sigma^{-1} x\right)$$

## 2. Triển khai mã nguồn (Implementation)

Chèn code block với syntax highlighting tự động đổi màu theo Theme:

```python
import torch
import tensorrt as trt

def export_engine(onnx_path: str, engine_path: str, fp16: bool = True):
    """Compile ONNX graph to high-performance TensorRT engine."""
    logger = trt.Logger(trt.Logger.INFO)
    builder = trt.Builder(logger)
    config = builder.create_builder_config()
    if fp16 and builder.platform_has_fast_fp16:
        config.set_flag(trt.BuilderFlag.FP16)
    # Build & serialize engine...
    print(f"Engine compiled successfully to {engine_path}")
```

## 3. Kết quả thực nghiệm & Benchmark

Bảng so sánh hiệu năng trực quan:

| Model Backbone | Precision | Latency (ms) | Throughput (FPS) | VRAM (MB) |
|---|---|---|---|---|
| YOLOv11-Nano | FP32 (PyTorch) | 12.4 ms | 80 FPS | 420 MB |
| YOLOv11-Nano | FP16 (TensorRT) | **3.8 ms** | **263 FPS** | **180 MB** |
| YOLOv11-Nano | INT8 (Quantized) | **2.1 ms** | **476 FPS** | **95 MB** |

## 4. Kết luận & Hướng phát triển

Tóm lược lại bài học rút ra, các góc khuất kỹ thuật (gotchas) và liên kết đến mã nguồn GitHub hoặc Live Demo.

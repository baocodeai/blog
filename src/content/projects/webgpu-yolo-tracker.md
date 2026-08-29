---
title: "WebGPU Real-time YOLOv11 & ByteTrack"
description: "Zero-server, 100% in-browser multi-object detection and tracking executing via WebGPU compute shaders and ONNX Runtime Web at 50+ FPS."
date: 2026-08-10
draft: false
featured: true
badge: "Live Demo"
domain: "MLOps"
techStack: ["WebGPU", "ONNX Runtime", "YOLOv11", "ByteTrack", "TypeScript"]
demoUrl: "https://baocodeai.github.io/projects/webgpu-yolo-tracker/"
repoUrl: "https://github.com/baocodeai/webgpu-yolo-tracker"
---

## Tổng quan dự án

Dự án này triển khai toàn bộ pipeline nhận diện và theo dõi đa đối tượng (Multi-Object Tracking - MOT) chạy hoàn toàn trên trình duyệt người dùng bằng **WebGPU** và **ONNX Runtime Web**.

Không cần server GPU đắt đỏ, dữ liệu webcam hoặc video không bao giờ rời khỏi thiết bị người dùng — đảm bảo quyền riêng tư 100% với độ trễ cực thấp (<20ms).

### Kiến trúc & Kỹ thuật cốt lõi

1. **Model Optimization**:
   - Chuyển đổi mô hình YOLOv11 nano/small sang định dạng ONNX với dynamic input dimensions.
   - Lượng tử hóa FP16 và INT8 tối ưu riêng cho WebGPU execution provider.
   - Non-Maximum Suppression (NMS) tùy biến viết bằng WGSL compute shaders.

2. **ByteTrack Client-Side**:
   - Thuật toán liên kết vết ByteTrack kết hợp Kalman Filter viết thuần bằng TypeScript/WASM.
   - Duy trì ID mượt mà ngay cả khi đối tượng bị che khuất (occlusion).

3. **Hiệu năng thực tế**:
   - Apple M-series / RTX 3060: **55 - 60 FPS** ở độ phân giải 640x640.
   - Khởi động < 2.5 giây khi tải trọng số từ CDN có cache.

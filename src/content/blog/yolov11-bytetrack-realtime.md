---
title: "Real-time Object Detection & Tracking with YOLOv11 and ByteTrack"
description: "Pipeline architecture for high-speed multi-object detection and occlusion-resistant tracking at 120 FPS using TensorRT FP16."
date: 2026-08-01
draft: false
category: "Deployment Logs"
domain: "Detection"
stage: "Deployment & Benchmark"
specs: ["⚡ 120 FPS", "📦 TensorRT FP16", "🎯 ByteTrack"]
featured: true
coverImage: "/covers/yolo-detection.svg"
tags: ["Detection", "Object Detection", "Tracking", "ByteTrack", "YOLOv11", "TensorRT", "Edge AI", "Deployment"]
readingTime: "8 min read"
---

## Tổng quan

Trong các bài toán giám sát thông minh và xe tự hành, việc phát hiện đối tượng đơn lẻ là chưa đủ. Hệ thống cần liên kết các bounding box qua từng frame để tạo thành quỹ đạo chuyển động liên tục (trajectory).

## Thuật toán ByteTrack

ByteTrack giải quyết triệt để vấn đề mất dấu khi đối tượng bị che khuất bằng cách tận dụng cả các bounding box có độ tin cậy thấp (low-score detection boxes):

1. **Giai đoạn 1**: Ghép nối các detection có score cao ($> 0.6$) với các track hiện có qua Kalman Filter và IoU distance.
2. **Giai đoạn 2**: Ghép nối các track chưa được match với các detection có score thấp ($0.1 < score \le 0.6$) để cứu các đối tượng bị mờ nhòe do chuyển động hoặc che khuất một phần.

```python
# Pseudo-code ByteTrack Association
matches_first = match_iou(high_score_dets, active_tracks, thresh=0.8)
unmatched_tracks = get_unmatched(active_tracks, matches_first)
matches_second = match_iou(low_score_dets, unmatched_tracks, thresh=0.5)
```

## Kết quả Benchmark

Khi triển khai trên Nvidia Jetson Orin Nano với TensorRT FP16, pipeline xử lý luồng 1080p ở tốc độ ổn định **85 FPS** với MOTA score đạt **79.4%**.

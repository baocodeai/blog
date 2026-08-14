---
title: "Deploying Vision Models to WebGPU: From PyTorch to 60 FPS in Browser"
description: "How to export modern CNN and Vision Transformer backbones to ONNX, resolve WebGPU operator compatibility, and achieve silky smooth 60 FPS client-side inference."
date: 2026-08-04
draft: false
category: "Deployment Logs"
domain: "Deployment"
stage: "Edge Deployment"
specs: ["🌐 WebGPU WGSL", "📦 ONNX INT8", "⚡ 60 FPS Browser"]
coverImage: "/covers/webgpu-runtime.svg"
tags: ["Deployment", "WebGPU", "ONNX", "Quantization", "Deployment Logs", "Edge AI", "C++"]
readingTime: "11 min read"
---

## Tại sao lại là WebGPU?

WebGPU là API đồ họa và tính toán thế hệ mới trên nền web, cho phép truy cập trực tiếp vào phần cứng GPU máy khách tương tự Vulkan hay Metal, giải phóng băng thông tính toán vượt trội gấp 3-5x so với WebGL thông thường.

## Quy trình chuyển đổi từ PyTorch sang WebGPU

### 1. Xuất mô hình sang ONNX chuẩn hóa

Cần đảm bảo tất cả các toán tử (operators) đều tương thích với ONNX Opset 18+ và không chứa các cấu trúc điều khiển động (dynamic control flow) không hỗ trợ trên Web:

```python
import torch
import torchvision.models as models

model = models.mobilenet_v3_small(weights="DEFAULT").eval()
dummy_input = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy_input,
    "mobilenet_v3.onnx",
    export_params=True,
    opset_version=18,
    do_constant_folding=True,
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
)
```

### 2. Tải và chạy với ONNX Runtime Web

```typescript
import * as ort from 'onnxruntime-web/webgpu';

async function initModel() {
  ort.env.wasm.numThreads = 4;
  const session = await ort.InferenceSession.create('/models/mobilenet_v3.onnx', {
    executionProviders: ['webgpu'],
    graphOptimizationLevel: 'all'
  });
  return session;
}
```

## Tối ưu hóa bộ nhớ & Texture Copy

Điểm nghẽn lớn nhất trong Web inference không phải là thời gian tính toán của GPU, mà là thời gian copy dữ liệu từ thẻ HTML `<video>` / `<canvas>` vào buffer WebGPU. Bằng cách sử dụng WebCodecs API và direct texture binding, ta có thể triệt tiêu hoàn toàn chi phí CPU overhead.

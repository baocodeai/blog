---
title: "Reproducing SAM 2: Video Memory Attention & Real-time Mask Propagation"
description: "A deep architectural breakdown and PyTorch reproduction of SAM 2's streaming memory bank, cross-attention mechanism, and ambiguity resolution."
date: 2026-08-12
draft: false
category: "Paper Reproductions"
domain: "VLM"
stage: "Data & Preprocessing"
specs: ["🎬 Streaming Memory", "🎯 Interactive Masks", "🔄 Video Propagate"]
coverImage: "../../assets/covers/sam2-masks.svg"
tags: ["VLM", "SAM 2", "Video Segmentation", "Data & Preprocessing", "PyTorch", "Paper Reproduction"]
readingTime: "9 min read"
---

## Giới thiệu & Động lực

Segment Anything Model 2 (SAM 2) mở rộng khả năng phân đoạn từ hình ảnh tĩnh sang luồng video thời gian thực. Thách thức lớn nhất trong xử lý video là việc theo dõi đối tượng khi bị che khuất, biến dạng hình học hoặc di chuyển ra/vào khung hình.

Trong bài viết này, chúng ta sẽ mổ xẻ kiến trúc **Streaming Memory Bank** và tái tạo lại module bộ nhớ không gian - thời gian (Spatio-Temporal Memory Attention) bằng PyTorch thuần.

## Kiến trúc Streaming Memory Bank

SAM 2 lưu trữ các embedding của các khung hình quá khứ vào một bộ nhớ đệm có kích thước cố định $N$:

1. **Spatial Memory**: Trích xuất đặc trưng không gian từ Hiera backbone.
2. **Temporal Attention**: Cơ chế cross-attention giữa khung hình hiện tại và $N$ khung hình gần nhất cùng $M$ khung hình có prompt người dùng.

```python
import torch
import torch.nn as nn

class MemoryAttentionBlock(nn.Module):
    def __init__(self, dim=256, num_heads=8):
        super().__init__()
        self.cross_attn = nn.MultiheadAttention(embed_dim=dim, num_heads=num_heads, batch_first=True)
        self.norm1 = nn.LayerNorm(dim)
        self.mlp = nn.Sequential(
            nn.Linear(dim, dim * 4),
            nn.GELU(),
            nn.Linear(dim * 4, dim)
        )
        self.norm2 = nn.LayerNorm(dim)

    def forward(self, curr_feat, memory_bank):
        # curr_feat: (B, HW, C)
        # memory_bank: (B, N*HW, C)
        attn_out, _ = self.cross_attn(
            query=curr_feat,
            key=memory_bank,
            value=memory_bank
        )
        x = self.norm1(curr_feat + attn_out)
        return self.norm2(x + self.mlp(x))
```

## Giải quyết tính mập mờ (Ambiguity Resolution)

Khi người dùng chỉ click vào 1 điểm duy nhất trên cánh tay người, mô hình không biết ý định là chọn cánh tay, cái áo hay toàn bộ con người. SAM 2 giải quyết bằng cách dự đoán 3 mặt nạ phân đoạn ứng với 3 cấp độ phân cấp (whole, part, subpart) cùng điểm IoU score tương ứng.

## Kết luận

Việc chia tách rõ ràng giữa bộ nhớ ngắn hạn (các frame kế cận) và bộ nhớ dài hạn (các frame có can thiệp của con người) giúp SAM 2 vừa đảm bảo tốc độ streaming vừa tránh bị trôi dấu vết (tracking drift).

---
title: "Building High-Throughput Visual RAG with Florence-2 and CLIP Embeddings"
description: "Architecture and indexing strategies for visual question answering, spatial grounding, and zero-shot open-vocabulary retrieval."
date: 2026-07-15
draft: false
category: "Deep Dives"
domain: "VLM"
stage: "Data & Preprocessing"
specs: ["🔍 Visual Grounding", "🏷️ <OD_BOX> Prompts", "📚 RAG Vector Index"]
coverImage: "/covers/florence-vlm.svg"
tags: ["VLM", "Multimodal", "Vision-Language", "Florence-2", "Data & Preprocessing", "CLIP", "Visual RAG", "Deep Dives"]
readingTime: "10 min read"
---

## Visual RAG là gì?

Khác với văn bản thuần túy, tài liệu kỹ thuật, sơ đồ kiến trúc và video chứa lượng thông tin thị giác khổng lồ mà các mô hình OCR thông thường không thể nắm bắt trọn vẹn ngữ cảnh.

**Visual RAG** kết hợp biểu diễn đa phương thức (Multimodal Embeddings) từ CLIP / SigLIP cùng khả năng suy luận không gian định vị (Spatial Grounding) từ mô hình nền tảng Florence-2.

## Kiến trúc Pipeline

1. **Document Chunking & Visual Encoding**: Tách trang tài liệu thành các vùng hình ảnh, trích xuất embedding đa chiều.
2. **Dense Vector Search**: Tìm kiếm đoạn tài liệu hoặc khung hình video phù hợp với truy vấn người dùng.
3. **Florence-2 Grounded Reasoning**: Xác định tọa độ bounding box chính xác của câu trả lời trực tiếp trên hình ảnh nguồn.

```python
def query_visual_rag(query_text, image_tensor):
    prompt = f"<CAPTION_TO_PHRASE_GROUNDING> {query_text}"
    results = florence_model.generate(
        inputs=image_tensor,
        prompt=prompt,
        max_new_tokens=256
    )
    return results
```

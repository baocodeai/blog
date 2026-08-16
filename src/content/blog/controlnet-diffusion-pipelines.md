---
title: "Controllable Image Generation: Deep Dive into ControlNet and LoRA Fine-Tuning"
description: "Controlling latent diffusion trajectories using spatial conditionings, Canny edges, depth maps, and efficient Low-Rank Adaptation (LoRA)."
date: 2026-07-08
draft: false
category: "Paper Reproductions"
domain: "Diffusion"
stage: "Training & LoRA"
specs: ["🎨 Canny Condition", "⚙️ LoRA Rank-16", "🧪 CFG Scale 7.5"]
coverImage: "../../assets/covers/controlnet-diffusion.svg"
tags: ["Diffusion", "Generative AI", "ControlNet", "LoRA", "Training & LoRA", "Stable Diffusion", "Paper Reproduction"]
readingTime: "12 min read"
---

## Bài toán điều khiển trong Diffusion Models

Các mô hình khuếch tán tiềm ẩn (Latent Diffusion Models) tạo ảnh cực kỳ chân thực từ prompt văn bản, nhưng lại khó kiểm soát bố cục hình học, tư thế nhân vật và vị trí không gian chính xác.

## Cấu trúc ControlNet

ControlNet nhân bản cấu trúc khối nơ-ron huấn luyện trước (trainable copy) và kết nối với mạng chính (locked copy) thông qua lớp tích chập không khởi tạo trọng số zero (zero convolutions):

$$\mathcal{Z} = \mathcal{F}(x + \mathcal{Z}_{conv}(c; \Theta_{z1}))$$

Nhờ đó, mô hình giữ nguyên năng lực tạo ảnh gốc trong khi học được cách áp đặt điều kiện từ bản đồ độ sâu (depth map), nét vẽ (Canny edge) hoặc dáng người (OpenPose).

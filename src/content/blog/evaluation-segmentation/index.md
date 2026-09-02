---
title: "Các độ đo đánh giá cho bài toán Segmentation trong Computer Vision"
description: "độ đo đánh giá cơ bản cho bài toán segmentation"
date: 2026-08-25
draft: false
featured: false
category: "Evaluation"
domain: ["Detection", "Deep Learning"]
stage: "Deep Dives"
specs:
  - "IoU"
  - "Dice"
  - "Evaluation"
tags:
  - "Evaluation"
  - "Deep Learning"
readingTime: "5 min read"
---

## 1. Nền tảng phân loại nhị phân

Phần lớn các độ đo phân vùng dựa trên việc so sánh từng pixel giữa mặt nạ dự đoán và nhãn chuẩn (ground truth):

- TP: pixel thuộc vùng quan tâm và được mô hình dự đoán chính xác
- FP: pixel thuộc nền nhưng mô hình dự đoán nhầm thành vùng quan tâm
- FN: pixel thuộc vùng quan tâm nhưng được mô hình dự đoán nhầm thành nền
- TN: pixel thuộc nền và mô hình cũng dự đoán là nền

## **2. Các nhóm độ đo phân vùng phổ biến**

### 2.1. Intersection over Union (IoU / Jaccard Index)

IoUI là dùng để đánh giá mức độ trùng lặp giữa hai tập hợp pixel của mask và ground truth. 

$$
IoU = \frac{\vert{}P \cap G\vert{}}{\vert{}P \cup G\vert{}} = \frac{TP}{TP + FP + FN}
$$

Phạt rất nặng các lỗi phát hiện sai và bỏ sót. Thang đo từ 0 đến 1 

**Biến thể đa lớp:** mIoU (mean IoU): tính trung bình IoU của từng lớp:

$$
mIoU = \frac{1}{C} \sum_{c=1}^C IoU_c
$$

### 2.2. Dice Similarity Coefficient

Dice được sử dụng phổ biến trong phân vùng ảnh y tế 

$$
Dice = \frac{2 \vert{}P \cap G\vert{}}{\vert{}P\vert{} + \vert{}G\vert{}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}
$$

Mối quan hệ với IoU:

$$
Dice = \frac{2 \cdot IoU}{1 + IoU}, \quad IoU = \frac{Dice}{2 - Dice}
$$

Dice Score luôn có giá trị số học lớn hơn hoặc bằng IoU. Do có hệ số nhân 2 ở TP, Dice bớt nhạy cảm với lỗi ở vùng biên hơn so với IoU. 

### 2.3. Độ đo thống kê cổ điển

| **Độ đo** | **Công thức** | **Ứng dụng & Hạn chế** |
| --- | --- | --- |
| **Pixel Accuracy (PA)** | $\frac{TP + TN}{TP + FP + FN + TN}$ | Đo tỷ lệ pixel phân loại đúng toàn ảnh. **Hạn chế:** Bị thiên lệch nghiêm trọng khi nền chiếm phần lớn diện tích. |
| **Mean Pixel Accuracy (mPA)** | $\frac{1}{C} \sum_{c=1}^C \frac{TP_c}{TP_c + FN_c}$ | Trung bình Recall của tất cả các lớp, giảm bớt sự thiên lệch về các lớp diện tích lớn. |
| **Precision** | $\frac{TP}{TP + FP}$ | Đo độ tin cậy khi mô hình dự đoán một pixel thuộc về đối tượng (ít báo động giả). |
| **Recall / Sensitivity** | $\frac{TP}{TP + FN}$ | Đo khả năng quét sạch, không bỏ sót pixel mục tiêu (đặc biệt quan trọng trong chẩn đoán khối u/tổn thương). |
| **Specificity** | $\frac{TN}{TN + FP}$ | Đo khả năng nhận diện chính xác vùng nền. |
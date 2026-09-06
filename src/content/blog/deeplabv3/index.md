---
title: "DeepLabV3: Cải tiến ASPP và Multi-Grid trong Semantic Segmentation"
description: "Khám phá kiến trúc DeepLabv3 với chiến lược Multi-Grid loại bỏ hiện tượng gridding artifacts và module ASPP nâng cấp tích hợp Image Pooling."
date: 2026-08-31
draft: false
featured: false
category: "Deep Learning"
domain: ["Deep Learning", "Detection"]
stage: "Deep Dives"
specs:
  - "Multi-Grid Method"
  - "Augmented ASPP & Image Pooling"
  - "ResNet with Atrous Conv"
coverImage: "./image.png"
tags:
  - "Semantic Segmentation"
  - "Deep Learning"
  - "Computer Vision"
readingTime: "12 min read"
---

DeepLabv3 tập trung giải quyết hai thách thức của semantic segmentation: mất chi tiết do downsampling và sự đa dạng kích thước của vật thể. Để giải quyết thách thức đầu tiên, tác giả sử dụng atrous convolution, cho phép giữ độ phân giải cao mà không tăng tham số. Đối với thách thức thứ hai, họ khảo sát bốn cách tiếp cận multi-scale và chọn hai thiết kế chính: một là cascade các block với Multi-Grid để tránh hiện tượng lưới thưa, hai là cải tiến ASPP bằng cách thêm nhánh global pooling để khắc phục sự thoái hóa của kernel khi rate quá lớn.

## 1. Vấn đề cốt lõi của semantic segmentation

Bài toán Semantic Segmentation yêu cầu gán nhãn chính xác cho từng pixel trong ảnh. Khác với phân loại ảnh chỉ cần biết ảnh đó có vật gì, phân đoạn ngữ nghĩa yêu cầu trả lời câu hỏi: "Pixel tại tọa độ (x,y) thuộc về đối tượng nào?".

**Vấn đề từ DCNN truyền thống:** Trong phân loại ảnh, mạng DCNN cố tình xóa bỏ thông tin vị trí chính xác để đạt được tính bất biến với biến dạng, xoay, dịch chuyển,…. Điều này giúp nhận diện vật thể ở bất kỳ đâu trong khung hình. Tuy nhiên, trong phân đoạn, việc lược bỏ chi tiết vị trí khiến bản đồ xác suất đầu ra bị mờ và ranh giới của vật thể bị nhòe, biến dạng. Ví dụ như phân đoạn xe hơi và nền, mạng biết *"vùng này có xe hơi"* nhưng không thể xác định chính xác đường viền của kính xe hay bánh xe.

Từ hạn chế trên, có thể chỉ ra 3 thách thức lớn khi áp dụng DCNN vào phân đoạn ngữ nghĩa:

1. Độ phân giải đặc trưng bị suy giảm: qua nhiều tầng pooling, kích thước ảnh bị thu nhỏ nhiều lần, làm mất thông tin biên chi tiết.
2. Sự tồn tại của đối tượng ở nhiều thang tỉ lệ: trong cùng một bức ảnh, có thể có chiếc xe tải lớn cần trường quan sát rộng và người đi bộ nhỏ sẽ cần trường quan sát hẹp.
3. Khả năng xác định chính xác vị trí không gian của đường biên, mép, ranh giới của các đối tượng bị suy giảm: do hậu quả của tính bất biến không gian từ các tầng pooling,stride.

## 2. Atrous Convolution

**Atrous Convolution, giải quyết suy giảm độ phân giải và mở rộng trường quan sát**

**Vấn đề của CNN cũ:** Trong các mạng DCNN như ResNet, việc sử dụng liên tục các tầng pooling hoặc tích chập với stride lớn hơn 1 giúp mạng học được các đặc trưng trừu tượng, bất biến với phép biến đổi cục bộ. Tuy nhiên, hệ quả là kích thước không gian của feature map bị co nhỏ dần – thường xuống còn 1/32 so với ảnh đầu vào. Trong bài toán phân đoạn ngữ nghĩa, nơi cần dự đoán từng pixel, việc mất chi tiết về ranh giới, biên vật thể là rất tai hại.

Một số phương pháp trước đây dùng deconvolution để phóng to feature map, nhưng cách này làm tăng số lượng tham số đáng kể và chi phí tính toán cao, lại có thể tạo ra hiệu ứng bàn cờ.

**Giải pháp của DeepLab: Atrous Convolution**

**Bản chất của Atrous Conv:**  Chèn thêm $r−1$ số 0 vào giữa các trọng số của kernel, với $r$ là **atrous rate**. Khi đó, kernel vẫn giữ nguyên số lượng trọng số, nhưng vùng quan sát được mở rộng.

**Lợi ích:**  nhờ atrous convolution, ta có thể kiểm soát Output Stride-OS là tỉ lệ giữa ảnhd dầu vào và feature map đầu ra. Ví dụ, nếu để output stride = 16 thay vì 32, feature map sẽ dày đặc gấp đôi. Điều quan trọng là không cần học thêm tham số mới nào - vẫn dùng đúng kernel đó, chỉ việc giãn ra.

**Ví dụ trực quan:** 

Giả sử ta có ma trận đặc trưng đầu vào $5 \times 5$ và một kernel $3 \times 3$:  

$$
\text{Kernel } W = \begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}
$$

**Trường hợp 1: Tích chập thông thường (**$r = 1$**)**

Kernel quét qua **3 ô liền kề nhau**:  $\begin{bmatrix} 1 & 1 & 1 \\ 1 & 1 & 1 \\ 1 & 1 & 1 \end{bmatrix}$

- Vùng bao phủ (Field-of-View): $3 \times 3$.
- Số tham số: $3 \times 3 = 9$.
- Số phép nhân cần tính: 9.

**Trường hợp 2: Atrous Convolution với** $r = 2$

Chèn thêm $r - 1 = 1$ số 0 xen giữa các phần tử của kernel: 

$$
 \begin{bmatrix}  1 & 0 & 1 & 0 & 1 \\  0 & 0 & 0 & 0 & 0 \\  1 & 0 & 1 & 0 & 1 \\  0 & 0 & 0 & 0 & 0 \\  1 & 0 & 1 & 0 & 1  \end{bmatrix}
$$

- Vùng bao phủ hiệu dụng: dãn rộng thành $5 \times 5$ theo công thức $k_e = k + (k-1)(r-1) =3 + (3 - 1)(2 - 1) = 5$.
- Các vị trí số $0$ bỏ qua không nhân, mạng chỉ lấy giá trị ở các điểm có số $1$.
- Số tham số thực tế: **vẫn là 9**.
- Số phép nhân cần tính: **vẫn là 9**.

**Ý nghĩa thực tế trên ảnh**

- **Với** $r=1$**:** Một pixel ở giữa chỉ nhìn thấy các pixel hàng xóm sát vách nó.
- **Với** $r=6$ **hoặc** $r=12$**:**  pixel có thể nhìn với tới các vật thể ở xa mà vẫn giữ nguyên được độ phân giải của đặc trưng. Nhờ vậy, DeepLabv2 có thể giữ đặc trưng ở tỉ lệ giảm 8 lần, giúp bản đồ đặc trưng chi tiết và sắc nét hơn, cuối cùng chỉ cần phóng to bằng phép nội suy song tuyến tính cực nhẹ.

![image.png](image.png)

**Nhận xét:** 

- Bản đồ đặc thu được ở phía trên xuất hiện dưới dạng lưới rời rạc, giữa các ô lưới là khoảng trống không có giá trị. Làm cho bản đồ đặc trưng mất thông tin chi tiết đặc biệt ở các vùng biên và chi tiết nhỏ, các cạnh bị nhoè, ranh giới vật thể không rõ ràng.
- Bản đồ đặc trưng ở phía dưới vừa giàu ngữ nghĩa vừa có độ phân giải cao

## 3. Bốn cách tiếp cận phổ biến cho multi-scale

![image.png](image%201.png)

Hình a: đưa ảnh ở nhiều kích thước khác nhau qua mạng rồi gom đặc trưng lại. Phương pháp này tốn bộ nhớ và thời gian tính toán. 

Hình b: Phần encoder nén ngữ cảnh, decoder dần khôi phục độ phân giải như UNet. Nhược điểm là kiến trúc phức tạp, có thể gây hiện tượng mất mát thông tin ở các tầng trung tâm.

Hình c - Context Module: Đặt thêm các khối xử lý **nối tiếp** ở phía sau mạng chính. Các khối này có nhiệm vụ mở rộng dần vùng quan sát, giúp mã hóa thông tin tầm xa.  Nếu xếp chồng quá nhiều khối mà không có cơ chế điều chỉnh hợp lý, có thể gây ra hiện tượng **gridding artifacts** tức các điểm lấy mẫu bị rời rạc, bỏ sót thông tin quan trọng. 

Hình d: Trên cùng một feature map đầu vào, ta áp dụng song song nhiều bộ lọc hoặc phép pooling với các tỉ lệ khác nhau. Điều này cho phép cùng một lúc trích xuất các đặc trưng ở nhiều thang đo, sau đó ghép chúng lại để tạo thành biểu diễn đa tỉ lệ. Nhược điểm khi atrous rate quá lớn so với kích thước feature map, kernel sẽ chỉ còn trọng số trung tâm hoạt động. 

## 4. Phương pháp đề xuất của DeepLabV3

### 4.1 Multi-Grid

Khi xếp chồng nhiều block với atrous rate lớn cho tất cả các lớp trong block, các điểm lấy mẫu sẽ cách đều nhau, tạo ra một lướt thưa và bỏ sót các pixel quan trọng ở giữa. Đây là hiện tượng gridding artifacts đã nói ở trên. 

![image.png](image%202.png)

**Cơ chế Multi-Grid:**

Tác giả gán cho mỗi block một bộ ba tỉ lệ đơn vị:

$$
\text{Multi\_Grid} = (r_1, r_2, r_3)
$$

với $r_1, r_2, r_3$ dành cho ba lớp tích chập bên trong block.

**Quy tắc tính rate thực tế:** Rate thực sự gán cho mỗi lớp conv bằng **tỉ lệ đơn vị nhân với tỉ lệ gốc của block đó**:

$$
\text{Rate thực tế} = \text{Rate cơ sở của Block} \times r_i
$$

**Ví dụ cụ thể từ bài báo:**

- Đặt $\text{Multi\_Grid} = (1, 2, 4)$.
- Tại `Block4`, rate cơ sở của block là 2.
- Rate của 3 lớp conv bên trong `Block4` sẽ lần lượt là:
    
    $\text{Rates} = 2 \cdot (1, 2, 4) = (2, 4, 8)$
    
    Lớp thứ nhất nhảy bước 2, lớp thứ hai nhảy bước 4, lớp thứ ba nhảy bước 8.
    

**Tác dụng của Multi-Grid:**

1. Việc xen kẽ các bước nhảy từ dày đến thưa $(1, 2, 4)$ giúp các lớp bù trừ cho nhau, bao phủ đều các vùng lân cận và xa. 
2. Mỗi block tự thân đã học được đa tỉ lệ, giảm nguy cơ mất thông tin. 
3. Trong Bảng 3 của paper, cấu hình Multi-Grid $(1, 2, 1)$ hoặc $(1, 2, 4)$ luôn mang lại mIOU vượt trội so với cấu hình mặc định $(1, 1, 1)$.  

### 4.2 Atrous Spatial Pyramid Pooling (ASPP)

**Kế thừa từ DeepLabv2:**

- **Ý tưởng nền tảng:** ASPP lấy cảm hứng từ kỹ thuật Spatial Pyramid Pooling, đưa cùng một bản đồ đặc trưng qua nhiều nhánh tích chập atrous chạy song song với các rate khác nhau nhằm nắm bắt vật thể ở nhiều kích thước tùy ý.
- **Điểm mới đầu tiên so với DeepLabv2:** Toàn bộ các nhánh tích chập bên trong khối ASPP của DeepLabv3 đều được tích hợp thêm các lớp **Batch Normalization (BN)** và được huấn luyện trực tiếp, điều mà phiên bản v2 trước đó chưa làm.

**Phát hiện lỗi: Sự thoái hóa của Atrous Kernel khi Rate quá lớn (Degeneration)**

![image.png](image%203.png)

Tác giả đã chỉ ra một hạn chế thực tế rất lớn của Atrous Conv (được minh họa bằng biểu đồ ở Hình 4): 

- Khi kích thước feature map là cố định (ví dụ $65 \times 65$), nếu ta liên tục đẩy atrous rate $r$ lên cao để cố nhìn xa hơn, khoảng cách giữa các điểm lấy mẫu của bộ lọc $3 \times 3$ sẽ bị kéo giãn ra rất rộng.
- Vì bước nhảy quá rộng, phần lớn các điểm lấy mẫu sẽ rơi ra khỏi biên của feature map và rơi vào phần đệm số 0 (**padded zeros**).
- **Hậu quả thoái hóa:**
    - Khi rate nhỏ, cả 9 trọng số của kernel $3 \times 3$ đều nằm gọn trong vùng dữ liệu hợp lệ.
    - Khi rate tiến sát đến kích thước của feature map (ví dụ $r \approx 65$), 8 trọng số ở rìa rơi sạch ra ngoài vùng đệm 0 và bị vô hiệu hóa. Lúc này, chỉ có duy nhất **trọng số ở tâm** là nhân với dữ liệu ảnh thực tế.
    - Một bộ lọc $3 \times 3$ cồng kềnh lúc này **bị thoái hóa thành một bộ lọc $1 \times 1$ đơn thuần**. Thay vì bắt được ngữ cảnh toàn ảnh như kỳ vọng, nó hoàn toàn mất khả năng học ngữ cảnh đường dài.

⇒ Giải pháp: đưa vào image-level features:

Để giải quyết triệt để lỗi thoái hóa này mà vẫn nắm bắt trọn vẹn bối cảnh của toàn bộ bức ảnh, tác giả bổ sung thêm một nhánh lấy đặc trưng cấp toàn ảnh. Thêm nhánh Image‑level features – sử dụng Global Average Pooling để nén toàn bộ feature map thành vector 1×1, sau đó qua Conv 1×1 + BN, rồi bilinear upsample về đúng kích thước ban đầu. Nhánh này cung cấp ngữ cảnh toàn cục một cách trực tiếp, bù đắp cho sự thoái hóa của các nhánh atrous rate lớn.

![image.png](image%204.png)

Khối ASPP hoàn chỉnh trong DeepLabv3 bao gồm **5 nhánh song song** nhận cùng một feature map đầu vào:  

Khi $\text{Output Stride} = 16$:  

1. Conv 1×1 (256 filters, BN)
2. Conv 3×3, rate = 6 (256 filters, BN)
3. Conv 3×3, rate = 12 (256 filters, BN)
4. Conv 3×3, rate = 18 (256 filters, BN)
5. Image Pooling: GAP → Conv 1×1 → Upsample (256 filters, BN)

*(Nếu output stride = 8, các rate sẽ nhân đôi: 12, 24, 36)*

**Giai đoạn hợp nhất đặc trưng (Fusion & Output):**

- Đầu ra của cả 5 nhánh được ghép nối lại với nhau theo chiều kênh.
- Khối đặc trưng ghép này đi qua một lớp tích chập $1 \times 1$ (256 filters, có BN) để trộn và nén thông tin từ các thang đo.
- Cuối cùng, dữ liệu đi qua một lớp tích chập $1 \times 1$ cuối để xuất ra **logits** tương ứng với số lượng lớp phân loại cần dự đoán.

Nhờ vậy, ASPP vừa bắt được chi tiết vi mô (nhánh 1, rate 6) vừa vươn xa (rate 12, 18) và đồng thời hiểu bố cục tổng thể (image pooling) – một giải pháp toàn diện cho đa tỉ lệ.

## Code triển khai

```python
class ASPPConv(nn.Sequential):
    """Một nhánh tích chập Atrous 3x3 với dilation, padding và Batch Normalization + ReLU."""
    def __init__(self, in_channels: int, out_channels: int, dilation: int):
        super().__init__(
            nn.Conv2d(
                in_channels,
                out_channels,
                kernel_size=3,
                padding=dilation,
                dilation=dilation,
                bias=False
            ),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )
        
class ASPPPooling(nn.Module):
    """
    Nhánh Image-Level Features (Global Average Pooling):
    Nén toàn bộ không gian về 1x1, biến đổi đặc trưng qua Conv 1x1 + BN + ReLU,
    sau đó Bilinear Upsampling trở lại kích thước của feature map.
    Khắc phục triệt để lỗi thoái hóa kernel khi atrous rate tiến gần kích thước feature map.
    """
    def __init__(self, in_channels: int, out_channels: int):
        super().__init__()
        self.gap = nn.AdaptiveAvgPool2d((1, 1))
        self.conv = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        size = x.shape[2:]
        feat = self.gap(x)
        feat = self.conv(feat)
        return F.interpolate(feat, size=size, mode='bilinear', align_corners=False)

class ASPP(nn.Module):
    """
    Module ASPP hoàn chỉnh của DeepLabv3 gồm 5 nhánh song song (với OS=16: rates = 6, 12, 18):
    1. Conv 1x1
    2. Atrous Conv 3x3 (rate=6)
    3. Atrous Conv 3x3 (rate=12)
    4. Atrous Conv 3x3 (rate=18)
    5. Image-level pooling (GAP + Conv 1x1 + Bilinear Upsampling)
    Sau đó Concatenate -> Conv 1x1 (256) -> BN -> ReLU -> Dropout(0.5).
    """
    def __init__(self, in_channels: int, atrous_rates: list = [6, 12, 18], out_channels: int = 256):
        super().__init__()
        modules = []

        # Nhánh 1: Conv 1x1
        modules.append(
            nn.Sequential(
                nn.Conv2d(in_channels, out_channels, kernel_size=1, bias=False),
                nn.BatchNorm2d(out_channels),
                nn.ReLU(inplace=True)
            )
        )

        # Nhánh 2, 3, 4: Atrous Convolutions với rates = [6, 12, 18]
        for rate in atrous_rates:
            modules.append(ASPPConv(in_channels, out_channels, dilation=rate))

        # Nhánh 5: Image-level pooling
        modules.append(ASPPPooling(in_channels, out_channels))

        self.branches = nn.ModuleList(modules)

        # Trộn đặc trưng (Feature Fusion) từ 5 nhánh: 256 * 5 = 1280 channels -> 256 channels
        self.project = nn.Sequential(
            nn.Conv2d(len(self.branches) * out_channels, out_channels, kernel_size=1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5)
        )

        self._init_weights()

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Conv2d):
                nn.init.kaiming_normal_(m.weight, mode='fan_out', nonlinearity='relu')
            elif isinstance(m, nn.BatchNorm2d):
                nn.init.constant_(m.weight, 1.0)
                nn.init.constant_(m.bias, 0.0)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        res = [branch(x) for branch in self.branches]
        res = torch.cat(res, dim=1)
        return self.project(res)
```

```python
class DeepLabv3(nn.Module):
    """
    DeepLabv3 hoàn chỉnh kết hợp ResNet Backbone (Multi-Grid) và ASPP Head.
    
    Tham số:
    - backbone_name: 'resnet50' (mặc định) hoặc 'resnet101'
    - pretrained: True để tải trọng số ImageNet
    - num_classes: 1 (phân đoạn nhị phân tổn thương da)
    - output_stride: 16 (chuẩn của paper) hoặc 8
    - multi_grid: tuple (r1, r2, r3) cấu hình rate bên trong block4 (mặc định (1, 2, 4))
    """
    def __init__(
        self,
        backbone_name: str = "resnet50",
        pretrained: bool = True,
        num_classes: int = 1,
        output_stride: int = 16,
        multi_grid: tuple = (1, 2, 4)
    ):
        super().__init__()
        self.backbone_name = backbone_name
        self.output_stride = output_stride
        self.multi_grid = multi_grid

        # 1. Khởi tạo ResNet backbone
        if backbone_name == "resnet50":
            weights = models.ResNet50_Weights.DEFAULT if pretrained else None
            resnet = models.resnet50(weights=weights)
            in_channels = 2048
        elif backbone_name == "resnet101":
            weights = models.ResNet101_Weights.DEFAULT if pretrained else None
            resnet = models.resnet101(weights=weights)
            in_channels = 2048
        elif backbone_name == "resnet34":
            weights = models.ResNet34_Weights.DEFAULT if pretrained else None
            resnet = models.resnet34(weights=weights)
            in_channels = 512
        else:
            raise ValueError(f"Không hỗ trợ backbone: {backbone_name}")

        self.conv1 = resnet.conv1
        self.bn1 = resnet.bn1
        self.relu = resnet.relu
        self.maxpool = resnet.maxpool

        self.layer1 = resnet.layer1
        self.layer2 = resnet.layer2
        self.layer3 = resnet.layer3
        self.layer4 = resnet.layer4

        # 2. Cấu hình Output Stride & Multi-Grid trong Backbone
        if output_stride == 16:
            # layer3: stride=2, dilation=1 (output_stride tích lũy = 16)
            # layer4: đổi stride=1, base_dilation=2, áp dụng Multi-Grid
            self._apply_multi_grid_to_layer4(base_dilation=2, multi_grid=multi_grid)
            aspp_rates = [6, 12, 18]
        elif output_stride == 8:
            # layer3: đổi stride=1, dilation=2
            self._modify_layer_dilation(self.layer3, dilation=2)
            # layer4: đổi stride=1, base_dilation=4, áp dụng Multi-Grid
            self._apply_multi_grid_to_layer4(base_dilation=4, multi_grid=multi_grid)
            aspp_rates = [12, 24, 36]
        else:
            raise ValueError(f"Output stride phải là 8 hoặc 16, nhận được: {output_stride}")

        # 3. Khởi tạo ASPP Module
        self.aspp = ASPP(in_channels=in_channels, atrous_rates=aspp_rates, out_channels=256)

        # 4. Phân lớp dự đoán (Classifier Head)
        self.classifier = nn.Conv2d(256, num_classes, kernel_size=1)

    def _modify_layer_dilation(self, layer, dilation: int):
        """Chuyển một layer sang dilated conv với stride=1."""
        for m in layer.modules():
            if isinstance(m, nn.Conv2d):
                if m.stride == (2, 2):
                    m.stride = (1, 1)
                if m.kernel_size == (3, 3):
                    m.dilation = (dilation, dilation)
                    m.padding = (dilation, dilation)

    def _apply_multi_grid_to_layer4(self, base_dilation: int, multi_grid: tuple):
        """
        Áp dụng phương pháp Multi-Grid vào Block 4 (layer4):
        Với mỗi Bottleneck unit i trong layer4, lớp conv 3x3 sẽ có:
            dilation = base_dilation * multi_grid[i]
            padding = dilation
        Stride của unit đầu tiên được đặt về (1, 1) để giữ nguyên độ phân giải OS=16.
        """
        for i, block in enumerate(self.layer4):
            # Với unit đầu tiên của layer4, chuyển stride về 1
            if i == 0:
                if hasattr(block, 'conv2') and block.conv2.stride == (2, 2):
                    block.conv2.stride = (1, 1)
                if hasattr(block, 'downsample') and block.downsample is not None:
                    if isinstance(block.downsample[0], nn.Conv2d) and block.downsample[0].stride == (2, 2):
                        block.downsample[0].stride = (1, 1)

            # Tính rate thực tế: Rate = base_dilation * r_i
            r_i = multi_grid[min(i, len(multi_grid) - 1)]
            eff_dilation = base_dilation * r_i

            if hasattr(block, 'conv2'):  # Bottleneck block (ResNet50 / 101)
                block.conv2.dilation = (eff_dilation, eff_dilation)
                block.conv2.padding = (eff_dilation, eff_dilation)
            elif hasattr(block, 'conv1'):  # BasicBlock (ResNet34)
                block.conv1.dilation = (eff_dilation, eff_dilation)
                block.conv1.padding = (eff_dilation, eff_dilation)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        input_size = x.shape[2:]

        # Backbone Feature Extraction
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)  # (B, 2048, H/16, W/16)

        # ASPP Module
        feat = self.aspp(x)  # (B, 256, H/16, W/16)

        # Classification Logits
        logits_low = self.classifier(feat)  # (B, num_classes, H/16, W/16)

        # Bilinear Upsampling lên kích thước ảnh ban đầu
        logits = F.interpolate(logits_low, size=input_size, mode='bilinear', align_corners=False)
        return logits

```

### Kết quả

| Chỉ số Đánh Giá | DeepLabV3 |
| --- | --- |
| DICE                  | 0.8852 |
| IOU                   | 0.8092 |
| PRECISION | 0.9072 |
| RECALL | 0.8938  |
| SPECIFICITY | 0.9665 |

### File notebook:

> **Tải về Jupyter Notebook:** <a href="/blog/deeplabv3/deeplabv3_case_study.ipynb" download="deeplabv3_case_study.ipynb">**`deeplabv3_case_study.ipynb`**</a> (hoặc nhấp chuột phải chọn *Save Link As...*)

## Tài liệu tham khảo

**Paper: Rethinking Atrous Convolution for Semantic Image Segmentation** ([**Link**](https://arxiv.org/abs/1706.05587))
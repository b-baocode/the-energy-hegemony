# 🎤 KỊCH BẢN GIỚI THIỆU GAME — THE ENERGY HEGEMONY

> **Dành cho người thuyết trình (MC)**  
> Đọc theo thứ tự từ trên xuống. Mỗi phần có ghi chú thời gian gợi ý.  
> Các con số đã được kiểm tra chính xác theo engine game phiên bản mới nhất.

---

## 📌 PHẦN 0 — MỞ ĐẦU (~1 phút)

**[MC nói]:**

> Chào các bạn! Hôm nay chúng ta sẽ chơi một trò chơi mô phỏng mang tên **"The Energy Hegemony"** — **Bá Quyền Năng Lượng**.
>
> Đây là một game chiến lược theo lượt, mô phỏng thị trường điện lực Việt Nam. Các bạn sẽ đóng vai các nhóm lợi ích khác nhau trong ngành điện và đưa ra quyết định kinh tế mỗi vòng.
>
> Mục tiêu: **kiếm được nhiều điểm nhất** khi game kết thúc — nhưng phải cân bằng giữa lợi ích cá nhân và sự ổn định chung của hệ thống. Nếu hệ thống sụp đổ, **tất cả đều bị phạt nặng**.

---

## 📌 PHẦN 1 — CẤU TRÚC GAME (~3 phút)

**[MC nói]:**

> Game có **7 nhóm**, chia thành **3 vai trò** (role):

### 🔶 Bảng phân nhóm

| Nhóm | Vai trò | Ý nghĩa | Số tiền ban đầu | GDP ban đầu | Green Points |
|------|---------|----------|-----------------|-------------|--------------|
| G1 | ⚡ GENCO | Nhà sản xuất điện tư nhân | **$2,000** | 0 | 0 |
| G2 | ⚡ GENCO | Nhà sản xuất điện tư nhân | **$2,000** | 0 | 0 |
| G3 | ⚡ GENCO | Nhà sản xuất điện tư nhân | **$2,000** | 0 | 0 |
| G4 | 🏭 CONSUMER | Doanh nghiệp tiêu thụ điện | **$1,500** | 500 | 0 |
| G5 | 🏭 CONSUMER | Doanh nghiệp tiêu thụ điện | **$1,500** | 500 | 0 |
| G6 | 🏭 CONSUMER | Doanh nghiệp tiêu thụ điện | **$1,500** | 500 | 0 |
| G7 | 🏛️ EVN | Tập đoàn Điện lực (Nhà nước) | **$4,000** | 0 | 0 |

**[MC giải thích]:**

> - **GENCO** (3 nhóm): Là các nhà máy điện tư nhân. Cạnh tranh nhau để bán điện qua lưới của EVN. Mục tiêu là **kiếm tiền** và **tích điểm xanh**.
> - **CONSUMER** (3 nhóm): Là các doanh nghiệp, nhà máy sử dụng điện. Mục tiêu là **tăng GDP** (năng suất kinh tế).
> - **EVN** (1 nhóm): Là Nhà nước, sở hữu lưới điện. Kiểm soát hạ tầng truyền tải. Mục tiêu là **duy trì hệ thống ổn định** và **kiếm lời**.

---

## 📌 PHẦN 2 — CHỈ SỐ HỆ THỐNG (~2 phút)

**[MC nói]:**

> Trên màn hình sẽ luôn hiển thị **3 chỉ số toàn cục** — đây là "sức khỏe" của cả hệ thống:

| Chỉ số | Tên đầy đủ | Giá trị ban đầu | Ý nghĩa |
|--------|-----------|-----------------|---------|
| **EH** | Economy Health | 100 | Sức khỏe kinh tế — cung cầu điện cân bằng hay không |
| **SS** | Social Stability | 100 | Ổn định xã hội — dân có hài lòng không |
| **Grid** | Grid Limit | 1,000 MW | Công suất tối đa lưới điện — nút thắt cổ chai |

**[MC nhấn mạnh]:**

> ⚠️ **QUAN TRỌNG:** Nếu **EH < 20** hoặc **SS < 20**, hệ thống **sụp đổ** và game **kết thúc ngay lập tức**!
>
> Khi sụp đổ sớm (trước vòng 20):
> - GENCO & CONSUMER: điểm cuối × **0.3** (mất 70% điểm!)
> - EVN: điểm cuối × **0.5** (mất 50% điểm!)
>
> Nên dù bạn kiếm nhiều tiền, nếu hệ thống sụp → hầu như mất hết.

---

## 📌 PHẦN 3 — CÁCH CHƠI MỖI VÒNG (~2 phút)

**[MC nói]:**

> Game diễn ra tối đa **20 vòng**. Mỗi vòng theo trình tự:

### Quy trình 1 vòng:

```
1️⃣  Admin công bố Kịch Bản kinh tế của vòng này
2️⃣  Các nhóm có 30 GIÂY để chọn 1 trong 4 hành động
3️⃣  Bấm "Sẵn sàng" để khóa lựa chọn
4️⃣  Khi tất cả nhóm sẵn sàng → Admin xử lý vòng
5️⃣  Hệ thống tính toán: cập nhật tiền, GDP, EH, SS, Grid
6️⃣  Admin xác nhận → chuyển sang vòng tiếp theo
```

> Mỗi vòng có một **Kịch Bản kinh tế** (Scenario) khác nhau — ví dụ: "Tăng trưởng nóng" (nhu cầu điện ×1.2), "Đại dịch" (mọi thứ ×0.5), v.v. Kịch bản ảnh hưởng đến doanh thu và chi phí.
>
> Cứ mỗi **3 vòng**, sẽ có một **Sự kiện ngẫu nhiên** xảy ra — ví dụ: bão lũ làm giảm 30% Grid, hoặc cách mạng xanh tăng SS +10.

---

## 📌 PHẦN 4 — HÀNH ĐỘNG CỦA TỪNG NHÓM (~3 phút)

> **Mỗi nhóm có 4 lựa chọn mỗi vòng. Đọc kỹ bảng của nhóm mình.**

---

### ⚡ GENCO (G1, G2, G3) — Mục tiêu: **Balance + GP × 20**

| # | Hành động | Cá nhân | Hệ thống |
|---|-----------|---------|----------|
| **OP-01** | Tăng công suất | +$350 + doanh thu cao hơn | SS **-5** |
| **OP-02** | Bảo trì máy | Chi phí -50% + thưởng +$150 | SS **+3** |
| **OP-03** | Lobby EVN | **60% doanh thu** + 3 GP. Phí $150 | Các GENCO khác chỉ còn 40% |
| **OP-04** | Chuyển đổi Xanh | **+15 GP** + $250 | SS **+5** |

> 💡 OP-04 cộng nhiều nhất vào điểm cuối: 15 GP × 20 = **300 điểm/vòng**.

---

### 🏭 CONSUMER (G4, G5, G6) — Mục tiêu: **GDP × 2 + Balance**

| # | Hành động | Cá nhân | Hệ thống |
|---|-----------|---------|----------|
| **OP-01** | Mở rộng xưởng | GDP cao nhất, Tiền **-$100** | Cầu điện +20% |
| **OP-02** | Tiết kiệm điện | Tiền **+$180**, GDP +20 | SS **+8** |
| **OP-03** | Bãi công đòi giá | GDP +60, Tiền **-$50** | SS **-8** |
| **OP-04** | Hỗ trợ hạ tầng | Tiền **-$200**, GDP +70 | Grid **+100 MW**, EH +4 |

> 💡 CONSUMER còn bị ảnh hưởng bởi EVN: áp trần → +$80 & +25 GDP; tăng phí → -$150 & -15 GDP.

---

### 🏛️ EVN (G7) — Mục tiêu: **Balance + (EH + SS) × 10**

| # | Hành động | Cá nhân | Hệ thống |
|---|-----------|---------|----------|
| **OP-01** | Nâng cấp lưới | Tiền **-$900** | Grid **×1.2** |
| **OP-02** | Áp trần giá bán | Tiền **-$700** | SS **+15**, CONSUMER +$80 & +25 GDP |
| **OP-03** | Tăng phí vận chuyển | Tiền **+$350** | SS **-8**, CONSUMER -$150 & -15 GDP |
| **OP-04** | Cắt điện luân phiên | Tiền ±0 | Grid **+200 MW**, EH -4, SS -10 |

> 💡 EVN còn nhận tự động: phí truyền tải `realEnergy × 0.15` + trợ cấp nhà nước **+$350/vòng**.

---

## 📌 PHẦN 5 — CÁCH TÍNH ĐIỂM CUỐI CÙNG (~2 phút)

**[MC nói]:**

> Khi game kết thúc (hết 20 vòng hoặc sụp đổ), điểm được tính như sau:

### 🏆 Công thức tính điểm

| Vai trò | Công thức | Giải thích |
|---------|----------|-----------|
| ⚡ GENCO | **Balance + Green Points × 20** | Tiền mặt + thưởng xanh. GP rất giá trị! |
| 🏭 CONSUMER | **GDP × 2 + Balance** | GDP quan trọng gấp đôi tiền. Tập trung GDP! |
| 🏛️ EVN | **Balance + (EH + SS) × 10** | Tiền + sự ổn định hệ thống. EH=100, SS=100 → +2,000 điểm! |

### 💀 Án phạt sụp đổ sớm

> Nếu game kết thúc VÌ EH < 20 hoặc SS < 20 (sụp đổ), **tất cả đều bị phạt**:

| Vai trò | Hệ số phạt | Ý nghĩa |
|---------|-----------|---------|
| GENCO | × 0.3 | Mất **70%** tổng điểm |
| CONSUMER | × 0.3 | Mất **70%** tổng điểm |
| EVN | × 0.5 | Mất **50%** tổng điểm |

> → Dù kiếm 10,000 điểm, sụp đổ sớm → GENCO chỉ còn 3,000. **Không ai muốn hệ thống sụp!**

---

## 📌 PHẦN 6 — CƠ CHẾ ẨN CẦN BIẾT (~2 phút)

**[MC nói]:**

> Có một số cơ chế quan trọng hoạt động ngầm:

### 1. Cơ chế Cung — Cầu — Grid

```
Tổng Điện Thực Tế = min(Tổng Phát Điện, Tổng Cầu Điện, Grid Limit)
```

> Dù GENCO phát bao nhiêu, nếu **Grid Limit** thấp → điện không truyền tải đủ → doanh thu giảm, EH giảm.
>
> Đây là lý do EVN rất quan trọng — EVN kiểm soát Grid!

### 2. Cơ chế thiếu điện

> Nếu điện thực tế < 85% tổng cầu → **SS -8** (bất ổn xã hội do thiếu điện).

### 3. Kịch bản kinh tế (Scenario)

> Mỗi vòng có 1 kịch bản với **hệ số nhân** (multiplier). Ví dụ:
> - "Tăng trưởng nóng" → ×1.2 (doanh thu và chi phí đều tăng 20%)
> - "Đại dịch" → ×0.5 (mọi thứ giảm 50%)
> - "Ngày tận thế" → ×0.1 (chỉ 10% hoạt động!)

### 4. Sự kiện ngẫu nhiên (cứ 3 vòng/lần)

> Mỗi 3 vòng, 1 sự kiện ngẫu nhiên sẽ xảy ra. Có thể là:
> - 🌊 **Bão lũ**: Grid -30%
> - ⛽ **Khủng hoảng nhiên liệu**: EH -10
> - 🌿 **Cách mạng xanh**: SS +10
> - ✊ **Biểu tình**: SS -15
> - 💰 **FDI**: EH +8

### 5. Lobby — Ai nhận được gì?

> Bình thường, doanh thu GENCO chia đều 3 nhóm.
> Nếu 1 GENCO chọn **Lobby EVN** (OP-03): nhóm đó chiếm **60%** tổng doanh thu, 2 nhóm còn lại chỉ chia nhau **40%**.
> → Lobby rất mạnh nhưng tạo bất công — phản ánh Đặc trưng 1 của Lenin (kết hợp nhân sự).

---

## 📌 PHẦN 7 — HƯỚNG DẪN THỰC TẾ — CÁCH CHƠI TRÊN MÀN HÌNH (~2 phút)

**[MC nói]:**

> Bây giờ hướng dẫn cách thao tác:

### Bước 1: Vào game
> Truy cập link game trên điện thoại hoặc máy tính. Chọn nhóm của mình (G1–G7).

### Bước 2: Mỗi vòng
> 1. Nhìn phía trên: xem **Kịch Bản** vòng này (tên + hệ số nhân)
> 2. Nhìn các chỉ số: **EH**, **SS**, **Grid**, **Balance/GDP** của nhóm mình
> 3. Chọn **1 trong 4 hành động** → đọc kỹ tác động trước khi chọn
> 4. Bấm **"Sẵn sàng"** → lúc này bạn không đổi được nữa
> 5. Đợi tất cả nhóm sẵn sàng → Admin xử lý → xem kết quả

### Bước 3: Timer
> Các bạn có **30 giây** mỗi vòng. Khi còn 10 giây, đồng hồ sẽ **nhấp nháy đỏ**. Hết giờ mà chưa chọn → mặc định không hành động (mất lợi thế).

### Bước 4: Kết thúc
> Game kết thúc khi hết 20 vòng hoặc EH/SS < 20. Màn hình sẽ hiện **bảng xếp hạng** — nhóm điểm cao nhất thắng!

---

## 📌 PHẦN 8 — MẸO CHIẾN LƯỢC (~1 phút)

**[MC nói]:**

> Vài mẹo cho từng nhóm:

### ⚡ GENCO Tips:
> - **Đừng spam OP-01**: Tiền nhanh nhưng SS giảm → sụp đổ → mất 70% điểm.
> - **OP-04 rất mạnh**: 15 GP × 20 = 300 điểm/vòng → 5 vòng chọn OP-04 = 1,500 điểm từ GP!
> - **Lobby** cần nghĩ kỹ: mạnh nhưng hại đồng đội GENCO.

### 🏭 CONSUMER Tips:
> - **GDP là vua**: GDP × 2 trong công thức → OP-01 cho GDP cao nhất.
> - **Theo dõi EVN**: Nếu EVN tăng phí → bạn mất $150 & 15 GDP rất đau.
> - **OP-04**: Khi Grid sắp đầy, 1 CONSUMER hy sinh nâng Grid cứu cả hệ thống.

### 🏛️ EVN Tips:
> - **(EH + SS) × 10**: Nếu giữ EH=100, SS=100 → +2,000 điểm. Đừng đánh đổi hệ thống lấy tiền mặt!
> - **OP-02** tốn $700 nhưng SS +15 → trực tiếp tăng điểm cuối (+150 điểm từ SS).
> - **OP-03** kiếm $350 nhưng SS -8 → mất 80 điểm. Tính kỹ trước khi tăng phí!

---

## 📌 PHẦN 9 — LÝ THUYẾT LÊNIN TRONG GAME (~2 phút, tuỳ chọn)

**[MC nói]:**

> Game này dựa trên **3 Đặc trưng của Chủ nghĩa Tư bản Độc quyền Nhà nước** (theo V.I. Lenin):

| Đặc trưng | Trong game | Ý nghĩa |
|-----------|-----------|---------|
| **1. Kết hợp nhân sự** | GENCO Lobby EVN → chiếm 60% doanh thu | Doanh nghiệp tư nhân cấu kết với nhà nước để chiếm lợi thế |
| **2. Nhà nước sở hữu hạ tầng** | EVN kiểm soát Grid Limit → cổ chai toàn hệ thống | Nhà nước nắm tư liệu sản xuất then chốt |
| **3. Nhà nước điều tiết qua chính sách** | EVN áp trần giá / tăng phí → ảnh hưởng trực tiếp CONSUMER | Công cụ chính sách phục vụ tư bản hoặc xã hội |

> Khi chơi, các bạn sẽ tự trải nghiệm: GENCO muốn lobby, EVN muốn tăng phí, CONSUMER phải gánh chịu. Đó chính là mâu thuẫn giai cấp trong nền kinh tế thị trường!

---

## 📌 PHẦN 10 — BẮT ĐẦU CHƠI!

**[MC nói]:**

> OK! Tóm tắt lần cuối:
>
> ✅ **7 nhóm, 3 vai trò, 20 vòng, 30 giây/vòng**  
> ✅ **Mỗi vòng chọn 1 trong 4 hành động**  
> ✅ **EH hoặc SS < 20 → tất cả bị phạt nặng**  
> ✅ **Nhóm điểm cao nhất thắng**  
>
> Mọi người đã hiểu chưa? Có câu hỏi gì không?
>
> *[Trả lời câu hỏi nếu có]*
>
> **Bắt đầu thôi! 🎮**

---

## 📎 PHỤ LỤC — BẢNG THAM CHIẾU NHANH

### Thông số ban đầu

| Chỉ số | Giá trị |
|--------|---------|
| EH (Economy Health) | 100 |
| SS (Social Stability) | 100 |
| Grid Limit | 1,000 MW |
| Số vòng tối đa | 20 |
| Timer mỗi vòng | 30 giây |
| Sụp đổ khi | EH < 20 hoặc SS < 20 |

### Tiền ban đầu

| Nhóm | Vai trò | Balance | GDP | GP |
|------|---------|---------|-----|-----|
| G1, G2, G3 | GENCO | $2,000 | 0 | 0 |
| G4, G5, G6 | CONSUMER | $1,500 | 500 | 0 |
| G7 | EVN | $4,000 | 0 | 0 |

### Công thức điểm

| Vai trò | Công thức |
|---------|----------|
| GENCO | `Balance + GP × 20` |
| CONSUMER | `GDP × 2 + Balance` |
| EVN | `Balance + (EH + SS) × 10` |

### Phạt sụp đổ sớm

| Vai trò | Hệ số nhân |
|---------|-----------|
| GENCO & CONSUMER | × 0.3 |
| EVN | × 0.5 |

### Danh sách Kịch Bản (20 vòng)

| Vòng | Kịch bản | Hệ số |
|------|---------|-------|
| 1 | Khởi đầu bình ổn | ×1.0 |
| 2 | Tăng trưởng nóng | ×1.2 |
| 3 | Khủng hoảng nhẹ | ×0.8 |
| 4 | Đại dịch | ×0.5 |
| 5 | Cách mạng công nghiệp | ×1.5 |
| 6 | Cấm vận kinh tế | ×0.7 |
| 7 | Mùa hè rực lửa | ×1.3 |
| 8 | Mùa đông băng giá | ×0.9 |
| 9 | Đình trệ | ×0.6 |
| 10 | Phục hồi | ×1.1 |
| 11 | Đỉnh cao hegemony | ×2.0 |
| 12 | Thoái trào | ×0.4 |
| 13 | Tái cấu trúc | ×1.0 |
| 14 | Bùng nổ dân số | ×1.4 |
| 15 | Thiên tai liên miên | ×0.3 |
| 16 | Hòa bình xanh | ×1.0 |
| 17 | Chiến tranh thương mại | ×0.75 |
| 18 | Kỷ nguyên số | ×1.6 |
| 19 | Cạn kiệt tài nguyên | ×0.5 |
| 20 | Ngày tận thế | ×0.1 |

### Sự kiện ngẫu nhiên (mỗi 3 vòng)

| Sự kiện | Tác động |
|---------|---------|
| 🌊 Bão lũ | Grid -30% |
| ⛽ Khủng hoảng nhiên liệu | EH -10 |
| 🌿 Cách mạng xanh | SS +10 |
| ✊ Biểu tình | SS -15 |
| 💰 Đầu tư FDI | EH +8 |

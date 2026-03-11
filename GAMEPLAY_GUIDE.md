# 🏭 THE ENERGY HEGEMONY — Hướng Dẫn Chơi

> **Thể loại:** Mô phỏng chiến lược nhóm | **Số người chơi:** 7 nhóm (G1–G7) | **Số vòng:** 20 vòng

---

## 🎯 Mục Tiêu Trò Chơi

**The Energy Hegemony** là một trò chơi mô phỏng vị trí độc quyền năng lượng và hạ tầng nhà nước. Mỗi nhóm đại diện cho một nhân tố trong hệ thống điện lực quốc gia — từ nhà sản xuất điện, người tiêu dùng, đến đơn vị vận hành lưới điện.

Người chơi phải **đưa ra quyết định mỗi vòng** nhằm:
- Tối đa hóa lợi nhuận và điểm số cá nhân
- Giữ cho hai chỉ số hệ thống **không rơi xuống dưới 20%**:
  - 🔴 **Economy Health (EH)** — Sức khỏe kinh tế
  - 🔵 **Social Stability (SS)** — Ổn định xã hội

**Trò chơi kết thúc sớm** nếu EH < 20 hoặc SS < 20, hoặc sau **vòng 20**.

---

## 👥 Các Vai Trò (Roles) & Các Lựa Chọn (Options)

### ⚡ GENCO — Nhà Sản Xuất Điện (G1, G2, G3)
- **Tài sản ban đầu:** $2,000
- Đại diện cho các tập đoàn phát điện tư nhân hoặc nhà nước.
- **Mục tiêu:** Tối đa hóa **lợi nhuận (Balance)**. Cạnh tranh giành doanh thu điện từ lưới.

| Tùy Chọn | Tác động Cá Nhân (Riêng) | Tác động Hệ Thống (Chung) |
|---|---|---|
| **OP-01: Tăng công suất** | Lãi gộp +$700 (tiền mặt). | Hệ thống +40% sản lượng điện. SS giảm 3% (ô nhiễm). |
| **OP-02: Bảo trì máy** | Giảm 50% chi phí vận hành ở vòng hiện tại (chỉ tốn $125 thay vì $250). | Giữ vững sức khỏe kinh tế (EH) ổn định. |
| **OP-03: Lobby EVN** | Chiếm trọn 60% tổng doanh thu điện toàn quốc (các nhóm khác chia nhau 40%). | Bất bình đẳng gia tăng, thể hiện lợi ích nhóm. EH không đổi. |
| **OP-04: Chuyển đổi Xanh** | Nhận +15 Điểm Xanh (Green Points) và thưởng quỹ +$200. | SS tăng 3% (giảm phát thải). Nòng cốt để Game kéo dài. |

---

### 🏭 CONSUMER — Người Tiêu Dùng (G4, G5, G6)
- **Tài sản ban đầu:** $1,000 | **GDP ban đầu:** 500
- Đại diện cho các khu công nghiệp, doanh nghiệp sử dụng điện.
- **Mục tiêu:** Tối đa hóa điểm **GDP Score**.

| Tùy Chọn | Tác động Cá Nhân (Riêng) | Tác động Hệ Thống (Chung) |
|---|---|---|
| **OP-01: Mở rộng xưởng** | GDP tăng nhanh +120 điểm, nhưng tiêu vốn đầu tư -$150. | Tăng nhu cầu điện +20%. Dễ làm sập EH nếu thiếu điện cung cấp. |
| **OP-02: Tiết kiệm điện** | Tiết kiệm chi phí (+$250), hiệu quả tăng (+20 GDP). | Giảm 15% áp lực lên lưới điện, SS tăng +5%. |
| **OP-03: Bãi công đòi giá** | Đòi được quyền lợi (+60 GDP), nhưng hao hụt do đình trệ (-$100). | Gây mâu thuẫn giai cấp, SS lao dốc -8%. |
| **OP-04: Hỗ trợ hạ tầng** | Chủ động đóng tiền túi (-$400), đổi lấy +40 GDP. | Lưới điện quốc gia Grid Limit đột phá +80 MW. Cả game hưởng lợi. |

---

### 🏛️ EVN — Đơn Vị Vận Hành Lưới (G7)
- **Tài sản ban đầu:** $5,000
- Đại diện cho Nhà nước — kiểm soát lưới truyền tải (cổ chai của hệ thống).
- **Mục tiêu:** Cân bằng Game, không để sập hệ thống (giữ EH/SS), và tối đa hóa lợi nhuận.

| Tùy Chọn | Tác động Cá Nhân (Riêng) | Tác động Hệ Thống (Chung) |
|---|---|---|
| **OP-01: Nâng cấp lưới** | Tiêu tốn -$1,200 từ ngân sách nhà nước. | Nâng dung lượng lưới (Grid Limit) thêm +25%. Gỡ cổ chai cho toàn game. |
| **OP-02: Áp trần giá bán** | Chịu lỗ -$800 để trợ giá. | SS tăng phi mã +25%. Mọi CONSUMER nhận được +$100 và +30 GDP. |
| **OP-03: Tăng phí truyền tải** | Thu lời đậm bù ngân sách (+$600). | Bóp nghẹt kinh tế: Mọi CONSUMER bị trừ -$200 và -20 GDP. SS giảm -12%. |
| **OP-04: Cắt điện luân phiên** | Không tốn tiền. | Bảo vệ lưới điện dài hạn (Grid Limit +150 MW), nhưng EH cắm đầu -5%, SS giảm -15%. |

---

## 🔄 Tiến Trình 4 Bước: Cách Tiền & Điểm Được Tính Toán

Game Engine xử lý kết quả ẩn dưới nền thông qua 4 bước cực kỳ quan trọng sau khi tất cả bấm Ready:

1. **Thu thập Quyết định & Trừ Chi phí:** Đầu tiên, các khoản tác động "Riêng" (như Mở rộng xưởng trừ $150, hay Lobby cướp 60% doanh thu) sẽ được áp dụng trực tiếp.
2. **Cuộc chiến Cung - Cầu & Grid Limit:** Hệ thống đối chiếu Tổng Cầu (của G4-G6) và Tổng Cung (của G1-G3). Lượng điện được lưu thông thực tế (`Real Energy`) không bao giờ được phép vượt quá giới hạn **Grid Limit** của EVN. Điện dư thừa sẽ bị vứt bỏ.
3. **Phân bổ Lợi Nhuận (Dựa trên Real Energy):** 
   - **GENCO:** Bán `Real Energy` lấy tiền (1.2$/MW). Lợi nhuận = Doanh thu - Chi phí vận hành cơ bản ($250). *Lưu ý: Nếu một GENCO chọn "Bảo trì máy", chi phí này giảm một nửa.*
   - **CONSUMER:** Chỉ khi `Real Energy` đáp ứng đủ 100% Nhu cầu (`Total Demand`), GDP mới tăng tối đa (+80/vòng). Thiếu điện, GDP sẽ đình trệ.
   - **EVN:** Thu phí BOT (~$0.15/MW) cho mọi dòng điện chạy qua lưới.
4. **Tác động Ngoại cảnh (Thiên tai & Nhà nước):** Cuối cùng, game áp dụng sức mạnh từ tùy chọn của EVN (như Áp trần giá tặng tiền cho CONSUMER) và các Sự kiện Thiên tai dự báo trước (như Bão lũ trừ 30% Grid Limit). Tác động này có thể lật ngược hoàn toàn kết quả của 3 bước trước.

---

## 📊 Chỉ Số Hệ Thống

| Chỉ Số | Ký Hiệu | Ý Nghĩa | Nguy Hiểm Khi |
|---|---|---|---|
| Economy Health | EH | Tỉ lệ năng lượng cung cấp / nhu cầu | < 20% → Game Over |
| Social Stability | SS | Ổn định xã hội tổng thể | < 20% → Game Over |
| Grid Capacity | L_grid | Giới hạn truyền tải điện (MW) | Càng cao càng tốt |

**Công thức EH:**
```
EH = (Năng lượng cung cấp thực tế / Tổng cầu điện) × 100
```
Năng lượng thực tế = `min(Tổng phát điện, Tổng cầu, L_grid)`

---

## 🌦️ Kịch Bản Theo Vòng (Scenarios)

Mỗi vòng chơi có một kịch bản kinh tế khác nhau ảnh hưởng đến cung/cầu điện:

| Vòng | Kịch Bản | Hệ Số |
|---|---|---|
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

> 💡 **Lưu ý:** Hệ số nhân ảnh hưởng đến cả phát điện cơ bản (400 MW/GENCO) và cầu điện cơ bản (300 MW/CONSUMER).

---

## ⚡ Sự Kiện Ngẫu Nhiên

Mỗi **3 vòng**, một sự kiện bất ngờ xảy ra:

| Sự Kiện | Tác Động |
|---|---|
| 🌊 Bão lũ | L_grid giảm mạnh (còn 30% hiện tại) |
| ⛽ Khủng hoảng nhiên liệu | Ảnh hưởng chi phí |
| 🌿 Cách mạng xanh | Cơ hội chuyển đổi |

---

## 🏆 Xếp Hạng & Thắng Chơi

**Bảng xếp hạng** theo công thức:
```
Tổng điểm = Balance ($) + GDP Score
```

**Điều kiện thắng:**
- Nhóm có **tổng điểm cao nhất** khi game kết thúc (vòng 20 hoặc sớm)
- Các nhóm GENCO: ưu tiên **Balance**
- Các nhóm CONSUMER: ưu tiên **GDP Score**
- EVN (G7): ưu tiên **giữ hệ thống sống sót** + **Balance**

**Bonus Điểm Xanh 🌿:**
- GENCO tích lũy **Green Points** khi chọn "Chuyển đổi Xanh"
- Có thể dùng làm tiebreaker hoặc thưởng ngoài

---

## 🖥️ Hướng Dẫn Sử Dụng Giao Diện

### Màn Hình Chọn Nhóm
1. Truy cập URL ứng dụng trên thiết bị của bạn
2. Chọn nhóm của mình (G1–G7) để vào giao diện người chơi
3. Hoặc chọn **Admin Dashboard** để giám sát toàn hệ thống

### Màn Hình Người Chơi
- Xem **Balance, GDP, Green Points, Grid Load** của mình
- Chọn **1 trong 4 chiến lược** mỗi vòng
- Sau khi chọn → trạng thái "Decision Locked!" — chờ các nhóm khác

### Admin Dashboard
- Theo dõi **EH, SS, L_grid** theo thời gian thực
- Xem **biểu đồ Live Telemetry** lịch sử EH/SS
- Xem **Leaderboard** xếp hạng tức thì
- Nhấn **"Execute Round"** khi tất cả đã sẵn sàng
- Nút **"Debug: Force Execute"** — bỏ qua điều kiện sẵn sàng (dùng khi test)
- Nhấn **"Reset"** để bắt đầu lại từ đầu

---

## ⚙️ Yêu Cầu Kỹ Thuật (Dành Cho Admin)

### Cần Thiết Lập Supabase
Tạo 2 bảng trong Supabase:
```sql
CREATE TABLE game_state (
  id TEXT PRIMARY KEY,
  round INTEGER,
  eh INTEGER,
  ss INTEGER,
  grid_limit INTEGER,
  current_event TEXT,
  is_game_over BOOLEAN,
  history JSONB
);

CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT,
  role TEXT,
  balance FLOAT,
  gdp_score FLOAT,
  green_points INTEGER DEFAULT 0,
  last_option INTEGER,
  is_ready BOOLEAN DEFAULT false
);

-- Tắt RLS để test
ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
```

### File `.env.local`
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Chạy Local
```bash
npm install
npm run dev
```

---

*The Energy Hegemony — A Simulation of State Monopoly & Infrastructure*

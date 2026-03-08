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

## 👥 Các Vai Trò (Roles)

### ⚡ GENCO — Nhà Sản Xuất Điện (G1, G2, G3)
- **Tài sản ban đầu:** $2,000
- Đại diện cho các tập đoàn phát điện tư nhân hoặc nhà nước
- Mục tiêu: tối đa hóa **lợi nhuận (Balance)**

| Tùy Chọn | Tên | Ảnh Hưởng Cá Nhân | Ảnh Hưởng Hệ Thống |
|---|---|---|---|
| OP-01 | Tăng công suất | Tiền +30% | EH +5, SS -5 |
| OP-02 | Bảo trì máy | Tiền -500 | EH ổn định |
| OP-03 | Lobby truyền tải | Chiếm slot ưu tiên | EH ổn định, hại G khác |
| OP-04 | Chuyển đổi Xanh | Điểm "Xanh" +10 | EH bền vững, SS +5 |

---

### 🏭 CONSUMER — Người Tiêu Dùng (G4, G5, G6)
- **Tài sản ban đầu:** $1,000 | **GDP ban đầu:** 500
- Đại diện cho các khu công nghiệp, doanh nghiệp sử dụng điện
- Mục tiêu: tối đa hóa **GDP Score**

| Tùy Chọn | Tên | Ảnh Hưởng Cá Nhân | Ảnh Hưởng Hệ Thống |
|---|---|---|---|
| OP-01 | Mở rộng xưởng | GDP +50 | Cầu điện +20% |
| OP-02 | Tiết kiệm điện | Tiền -400 | Cầu điện -10% |
| OP-03 | Bãi công đòi giá | GDP dừng tăng | SS -15 |
| OP-04 | Hỗ trợ hạ tầng | Tiền -600 | L_grid +10% |

---

### 🏛️ EVN — Đơn Vị Vận Hành Lưới (G7)
- **Tài sản ban đầu:** $5,000
- Đại diện cho EVN (Tập đoàn Điện lực Việt Nam) — kiểm soát lưới truyền tải
- Mục tiêu: **duy trì hệ thống ổn định** và tối đa hóa lợi nhuận

| Tùy Chọn | Tên | Ảnh Hưởng Cá Nhân | Ảnh Hưởng Hệ Thống |
|---|---|---|---|
| OP-01 | Nâng cấp lưới | Tiền -1500 | L_grid +30% |
| OP-02 | Áp trần giá bán | Tiền -20% | SS +20, EH ổn định |
| OP-03 | Tăng phí vận chuyển | Tiền +20% | SS -10, GDP nhóm B giảm |
| OP-04 | Cắt điện luân phiên | Không đổi | SS -20, Bảo vệ Grid |

---

## 🔄 Luồng Chơi Từng Vòng

```
1. [Mỗi nhóm] Chọn 1 trong 4 tùy chọn chiến lược  
        ↓
2. [Tất cả nhóm sẵn sàng] Admin nhấn "Execute Round"  
        ↓
3. [Hệ thống] Tính toán cung/cầu điện, cập nhật EH & SS  
        ↓
4. [Mỗi 3 vòng] Sự kiện ngẫu nhiên xảy ra  
        ↓
5. Vòng tiếp theo bắt đầu
```

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

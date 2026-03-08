
TÀI LIỆU ĐẶC TẢ HỆ THỐNG: GAME "THE ENERGY HEGEMONY"
Chủ đề: Độc quyền nhà nước (Mô phỏng hạ tầng EVN) dựa trên lý luận Lênin.
Mô hình: Web tĩnh (Jamstack) + Real-time Serverless.

1. CẤU TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
Frontend: React.js / Next.js (Static Export).
Styling: Tailwind CSS.
Real-time/Database: Supabase (PostgreSQL + Realtime Channel).
Deployment: Vercel / GitHub Pages.
Logic: Xử lý hoàn toàn tại Client (Client-side Logic) và đồng bộ qua Supabase.

2. LUẬT CHƠI CHUNG (GLOBAL RULES)
2.1. Thực thể tham gia (7 Nhóm)
Khối Phát điện (GenCos - G1, G2, G3): Tư nhân sản xuất điện.
Khối Tiêu thụ (Consumers - G4, G5, G6): Doanh nghiệp sản xuất công nghiệp.
Khối Điều tiết (State/EVN - G7): Độc quyền truyền tải (vận chuyển) điện.
2.2. Các chỉ số sinh tồn (Global Indices)
$EH$ (Economy Health): Sức khỏe kinh tế. $EH = \frac{E_{real}}{D_{total}} \times 100$.
$SS$ (Social Stability): Ổn định xã hội. Giảm khi giá điện cao hoặc mất điện.
$L_{grid}$ (Grid Capacity): Giới hạn vận chuyển của EVN.
Điều kiện Game Over: $EH < 20\%$ hoặc $SS < 20\%$ trong 2 vòng liên tiếp.

3. LOGIC GAME & CÔNG THỨC TÍNH TOÁN (THE CORE ENGINE)
Mỗi vòng (Round), hệ thống thực hiện các bước sau:
Tổng hợp:
$P_{gen} = \sum P_{G1,G2,G3}$ (Tổng cung).
$D_{total} = \sum D_{G4,G5,G6}$ (Tổng cầu).
Khớp lệnh luồng điện:
$E_{real} = \min(P_{gen}, D_{total}, L_{grid})$.
Tài chính cá nhân:
GenCos: $Profit = (E_{allocated} \times Price_{gen}) - Cost_{op}$.
Consumers: $GDP = (E_{allocated} \times Profit_{margin}) - (E_{allocated} \times Price_{retail})$.
EVN: $Budget = (E_{real} \times Fee_{trans}) + Taxes - Cost_{main}$.

4. HỆ THỐNG 4 OPTIONS CHO MỖI NHÓM
Mỗi nhóm chỉ có 4 nút bấm cố định. Tác động của các nút này sẽ thay đổi tùy theo Màn chơi (Scenario).
Khối GenCos (G1-G3)
Option
Tên
Tác động cá nhân
Tác động hệ thống
Op 1
Tăng công suất
Tiền +30%
$EH$ +5, $SS$ -5
Op 2
Bảo trì máy
Tiền -500
$EH$ ổn định
Op 3
Lobby truyền tải
Chiếm slot ưu tiên
$EH$ ổn định, hại nhóm G khác
Op 4
Chuyển đổi Xanh
Điểm "Xanh" +10
$EH$ bền vững, $SS$ +5

Khối Consumers (G4-G6)
Option
Tên
Tác động cá nhân
Tác động hệ thống
Op 1
Mở rộng xưởng
GDP +50
Cầu điện +20%
Op 2
Tiết kiệm điện
Tiền -400
Cầu điện -10%
Op 3
Bãi công đòi giá
GDP dừng tăng
$SS$ -15
Op 4
Hỗ trợ hạ tầng
Tiền -600
$L_{grid}$ +10%

Khối EVN (G7)
Option
Tên
Tác động cá nhân
Tác động hệ thống
Op 1
Nâng cấp lưới
Tiền -1500
$L_{grid}$ +30%
Op 2
Áp trần giá bán
Tiền -20%
$SS$ +20, $EH$ ổn định
Op 3
Tăng phí vận chuyển
Tiền +20%
$SS$ -10, GDP nhóm B giảm
Op 4
Cắt điện luân phiên
Tiền 0
$SS$ -20, Bảo vệ Grid


5. CƠ CHẾ SỰ KIỆN NGOẠI CẢNH (EXTERNAL SHOCKS)
AI Agent cần lập trình một hàm triggerEvent() chạy ngẫu nhiên mỗi 3 vòng:
Bão lũ: $L_{grid}$ giảm 70% ngay lập tức.
Khủng hoảng nhiên liệu: $Cost_{op}$ của GenCos x3.
Cách mạng xanh: Thuế carbon đánh vào Consumers nếu $EH$ không đạt chuẩn "Xanh".

6. HƯỚNG DẪN TRIỂN KHAI CHO AI AGENT
Bước 1: Cấu trúc Database (Supabase)
Yêu cầu AI tạo các bảng:
game_state: { id, round, eh, ss, grid_limit, current_event }
players: { id, group_name, role, balance, gdp_score, last_option }
Bước 2: Logic xử lý Real-time
Sử dụng Supabase Realtime để lắng nghe sự thay đổi của bảng players.
Khi đủ 7 nhóm đã chọn Option: Trigger hàm processRound().
Hàm này tính toán theo các công thức tại mục 3 và cập nhật lại bảng game_state.
Bước 3: Giao diện (UI)
Admin Screen (Máy chiếu): Hiển thị Dashboard với biểu đồ Line Chart (Recharts) cho $EH, SS$ và $L_{grid}$. Hiển thị bảng Ranking.
Player Screen (Mobile/Laptop): Hiển thị 4 nút bấm lớn, số dư tiền và điểm GDP hiện tại.

7. RANKING & CHIẾN THẮNG
GenCos: Xếp hạng theo $Tiền \times (EH/100)$.
Consumers: Xếp hạng theo $GDP \times (SS/100)$.
EVN: Thắng nếu duy trì $SS > 60$ sau 20 vòng.

Ghi chú đặc biệt dành cho Dev:
Web tĩnh: Không được dùng Node.js Backend. Mọi tính toán logic nằm trong một file gameEngine.ts ở Frontend. Supabase chỉ đóng vai trò là "bảng tin" chung.
Độc quyền Nhà nước: Hãy code sao cho nhóm G7 (EVN) là nhóm duy nhất có thể thay đổi biến grid_limit.
20 Màn chơi: Tạo một mảng scenarios[] chứa các hệ số nhân (multipliers) cho mỗi vòng để thay đổi độ khó.
Bảo hãy copy toàn bộ tài liệu này và gửi cho AI với câu lệnh: "Dựa trên SRS này, hãy khởi tạo một dự án Next.js và thiết lập cấu trúc Database trên Supabase cho tôi."


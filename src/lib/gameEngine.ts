
import { Player, GameState } from '../types/game';

export const INITIAL_GAME_STATE: GameState = {
  id: 'global',
  round: 1,
  eh: 100,
  ss: 100,
  grid_limit: 1000,
  current_event: null,
  is_game_over: false,
  history: [{ round: 1, eh: 100, ss: 100, grid_limit: 1000 }]
};

export const INITIAL_PLAYERS: Partial<Player>[] = [
  { group_name: 'G1', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G2', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G3', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G4', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0 },
  { group_name: 'G5', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0 },
  { group_name: 'G6', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0 },
  { group_name: 'G7', role: 'EVN', balance: 5000, gdp_score: 0, green_points: 0 },
];

export const SCENARIOS = [
  { name: 'Khởi đầu bình ổn', multiplier: 1.0 },
  { name: 'Tăng trưởng nóng', multiplier: 1.2 },
  { name: 'Khủng hoảng nhẹ', multiplier: 0.8 },
  { name: 'Đại dịch', multiplier: 0.5 },
  { name: 'Cách mạng công nghiệp', multiplier: 1.5 },
  { name: 'Cấm vận kinh tế', multiplier: 0.7 },
  { name: 'Mùa hè rực lửa', multiplier: 1.3 },
  { name: 'Mùa đông băng giá', multiplier: 0.9 },
  { name: 'Đình trệ', multiplier: 0.6 },
  { name: 'Phục hồi', multiplier: 1.1 },
  { name: 'Đỉnh cao hegemony', multiplier: 2.0 },
  { name: 'Thoái trào', multiplier: 0.4 },
  { name: 'Tái cấu trúc', multiplier: 1.0 },
  { name: 'Bùng nổ dân số', multiplier: 1.4 },
  { name: 'Thiên tai liên miên', multiplier: 0.3 },
  { name: 'Hòa bình xanh', multiplier: 1.0 },
  { name: 'Chiến tranh thương mại', multiplier: 0.75 },
  { name: 'Kỷ nguyên số', multiplier: 1.6 },
  { name: 'Cạn kiệt tài nguyên', multiplier: 0.5 },
  { name: 'Ngày tận thế', multiplier: 0.1 },
];

/**
 * LÊNIN'S 3 CHARACTERISTICS IN CODE:
 *
 * 1. Kết hợp nhân sự: GENCO OP-03 Lobby → chiếm slot ưu tiên từ EVN
 * 2. Sở hữu nhà nước: EVN kiểm soát grid_limit — cổ chai của toàn hệ thống
 * 3. Điều tiết nhà nước: EVN OP-02/03 tác động trực tiếp lên CONSUMER balance
 */
export function processRound(
  currentState: GameState,
  players: Player[]
): { nextState: GameState; updatedPlayers: Player[] } {
  let { eh, ss, grid_limit, round, history } = currentState;
  const updatedPlayers = players.map(p => ({ ...p }));
  const scenario = SCENARIOS[(round - 1) % SCENARIOS.length];
  const multiplier = scenario.multiplier;

  // ── Step 1: Determine EVN policy this round ──────────────────────────────
  const evn = updatedPlayers.find(p => p.role === 'EVN');
  const evnOption = evn?.last_option ?? null;

  // Flag: EVN áp trần → CONSUMER hưởng lợi; EVN tăng phí → CONSUMER bị hại
  const evnCapPrice = evnOption === 2;   // Áp trần giá bán
  const evnRaiseFee = evnOption === 3;   // Tăng phí vận chuyển

  // ── Step 2: Detect lobby (Đặc trưng 1 — kết hợp nhân sự) ────────────────
  const gencos = updatedPlayers.filter(p => p.role === 'GENCO');
  const lobbyingGenco = gencos.find(p => p.last_option === 3);
  // Nhóm lobby chiếm 60% realEnergy; các GENCO khác mỗi nhóm chỉ còn 20%

  // ── Step 3: Calculate Supply & Demand ───────────────────────────────────
  let totalGen = 0;
  let totalDemand = 0;

  gencos.forEach(p => {
    let gen = 400 * multiplier;
    if (p.last_option === 1) gen *= 1.4;   // Tăng công suất: +40% gen
    // OP-02 bảo trì: gen ổn định, không penalty; OP-03 lobby: gen bình thường
    totalGen += gen;
  });

  const consumers = updatedPlayers.filter(p => p.role === 'CONSUMER');
  consumers.forEach(p => {
    let demand = 300 * multiplier;
    if (p.last_option === 1) demand *= 1.2;  // Mở rộng: cầu +20%
    if (p.last_option === 2) demand *= 0.85; // Tiết kiệm: cầu -15%
    totalDemand += demand;
  });

  // ── Step 4: Grid capacity (Đặc trưng 2 — nhà nước sở hữu hạ tầng) ──────
  const realEnergy = Math.min(totalGen, totalDemand, grid_limit);

  // ── Step 5: Update global EH ─────────────────────────────────────────────
  const newEh = (realEnergy / Math.max(1, totalDemand)) * 100;
  eh = Math.round((eh * 0.6 + newEh * 0.4)); // Smoothing: 60% trọng số lịch sử
  eh = Math.max(0, Math.min(100, eh));

  let ssDelta = 0;
  if (realEnergy < totalDemand * 0.8) ssDelta -= 12; // Thiếu điện → bất ổn xã hội

  // ── Step 6: Process GENCO finances ───────────────────────────────────────
  // Phân bổ doanh thu: lobby ưu tiên được 60%, còn lại chia đều
  const gencoCount = gencos.length;
  const gencoRevPerUnit = (realEnergy / Math.max(1, totalGen));

  gencos.forEach(p => {
    const baseCost = 250 * multiplier;

    let myShare: number;
    if (lobbyingGenco && p.id === lobbyingGenco.id) {
      // Đặc trưng 1: lobby chiếm ưu tiên — nhận 60% tổng doanh thu GENCO
      myShare = realEnergy * 0.6;
    } else if (lobbyingGenco) {
      // GENCO còn lại chia đều phần còn lại (40% / số nhóm không lobby)
      const nonLobbyCount = gencoCount - 1;
      myShare = realEnergy * 0.4 / Math.max(1, nonLobbyCount);
    } else {
      // Không lobby: chia đều
      myShare = realEnergy / gencoCount;
    }

    const revenue = myShare * 1.2; // Đơn giá điện: 1.2$/MW

    if (p.last_option === 1) {
      // Tăng công suất: flat reward, không lãi kép
      p.balance += revenue - baseCost + 700;
      ssDelta -= 3; // Khai thác tối đa → nhẹ bất ổn
    } else if (p.last_option === 2) {
      // Bảo trì: chi phí thấp hơn vòng này
      p.balance += revenue - baseCost * 0.5;
    } else if (p.last_option === 3) {
      // Lobby: trả phí lobby cho EVN, nhưng nhận được nhiều hơn
      p.balance += revenue - baseCost - 300; // 300 = phí lobby
    } else if (p.last_option === 4) {
      // Chuyển đổi Xanh
      p.green_points += 15;
      p.balance += revenue - baseCost + 200; // Thưởng xanh
      ssDelta += 3;
    } else {
      // Không chọn (null)
      p.balance += revenue - baseCost;
    }
  });

  // ── Step 7: Process CONSUMER finances ────────────────────────────────────
  consumers.forEach(p => {
    const baseGdp = 80 * multiplier;

    if (p.last_option === 1) {
      // Mở rộng xưởng: có chi phí đầu tư, GDP tăng cao
      p.gdp_score += baseGdp * 1.5 + 40;
      p.balance -= 150;
    } else if (p.last_option === 2) {
      // Tiết kiệm điện: thu được lợi tài chính, GDP nhẹ, SS tốt hơn
      p.gdp_score += baseGdp * 0.25 + 20;
      p.balance += 250;
      ssDelta += 5;
    } else if (p.last_option === 3) {
      // Bãi công đòi giá: có lợi ngắn hạn (đòi được quyền lợi), nhưng hại SS
      // Phản ánh: mâu thuẫn giai cấp — công nhân tranh đấu có kết quả nhưng gây bất ổn
      p.gdp_score += baseGdp * 0.75 + 60;
      p.balance -= 100;
      ssDelta -= 8;
    } else if (p.last_option === 4) {
      // Hỗ trợ hạ tầng: đầu tư vào lưới điện → dài hạn có lợi
      p.gdp_score += baseGdp * 0.5 + 40;
      p.balance -= 400;
      grid_limit += 80;
    } else {
      p.gdp_score += baseGdp;
    }

    // Đặc trưng 3: EVN điều tiết → tác động trực tiếp lên CONSUMER
    if (evnCapPrice) {
      // Áp trần giá: CONSUMER hưởng lợi trực tiếp
      p.gdp_score += 30;
      p.balance += 100;
    }
    if (evnRaiseFee) {
      // Tăng phí vận chuyển: CONSUMER chịu thiệt
      p.balance -= 200;
      p.gdp_score -= 20;
    }
  });

  // ── Step 8: Process EVN finances (Đặc trưng 2 & 3) ───────────────────────
  if (evn) {
    // Phí vận chuyển cơ bản: giảm xuống 0.15 để cân bằng hơn
    const transmissionFee = realEnergy * 0.15;

    // Thưởng thêm nếu GENCO nào đó lobby → EVN nhận phí lobby
    const lobbyFee = lobbyingGenco ? 300 : 0;

    evn.balance += transmissionFee + lobbyFee;

    if (evnOption === 1) {
      // Nâng cấp lưới: đầu tư hạ tầng (Đặc trưng 2: mở rộng sở hữu nhà nước)
      evn.balance -= 1200;
      grid_limit = Math.round(grid_limit * 1.25);
    } else if (evnOption === 2) {
      // Áp trần giá bán: hy sinh lợi nhuận để ổn định xã hội
      evn.balance -= 800;
      ssDelta += 25;
    } else if (evnOption === 3) {
      // Tăng phí vận chuyển: thu lợi từ tất cả (bóc lột qua hạ tầng)
      evn.balance += 600;
      ssDelta -= 12;
    } else if (evnOption === 4) {
      // Cắt điện luân phiên: bảo vệ grid dài hạn nhưng hại xã hội ngắn hạn
      grid_limit += 150;
      eh = Math.max(0, eh - 5);
      ssDelta -= 15;
    }
  }

  // ── Step 9: Finalise SS ──────────────────────────────────────────────────
  ss = Math.max(0, Math.min(100, ss + ssDelta));

  // ── Step 10: Reset ready status ──────────────────────────────────────────
  updatedPlayers.forEach(p => { p.is_ready = false; });

  // ── Step 11: Game over check ──────────────────────────────────────────────
  const isGameOver = eh < 20 || ss < 20 || round >= 20;

  const nextState: GameState = {
    ...currentState,
    round: round + 1,
    eh,
    ss,
    grid_limit: Math.round(grid_limit),
    is_game_over: isGameOver,
    history: [...history, { round: round + 1, eh, ss, grid_limit: Math.round(grid_limit) }],
    current_event: null,
  };

  return { nextState, updatedPlayers };
}

export function triggerEvent(state: GameState): Partial<GameState> {
  const events = [
    {
      name: 'Bão lũ — Hạ tầng lưới điện thiệt hại nặng',
      impact: { grid_limit: Math.round(state.grid_limit * 0.7) }
    },
    {
      name: 'Khủng hoảng nhiên liệu — Chi phí sản xuất tăng vọt',
      impact: { eh: Math.max(20, state.eh - 10) }
    },
    {
      name: 'Cách mạng xanh — Chính phủ trợ cấp năng lượng tái tạo',
      impact: { ss: Math.min(100, state.ss + 10) }
    },
    {
      name: 'Biểu tình — Người dân phản đối giá điện cao',
      impact: { ss: Math.max(20, state.ss - 15) }
    },
    {
      name: 'Đầu tư ngoại — Vốn FDI vào ngành điện',
      impact: { eh: Math.min(100, state.eh + 8) }
    },
  ];

  const randomEvent = events[Math.floor(Math.random() * events.length)];
  return {
    current_event: randomEvent.name,
    ...randomEvent.impact,
  };
}

/**
 * Compute the final score for each player at game end.
 * Scoring tường minh — phản ánh mục tiêu từng role:
 *   GENCO: balance + green_points × 20 (đầu tư dài hạn)
 *   CONSUMER: gdp_score × 2 + balance (tăng trưởng kinh tế)
 *   EVN: balance + (eh + ss) × 10 (ổn định hệ thống là ưu tiên)
 */
export function computeFinalScore(player: Player, gameState: GameState): number {
  if (player.role === 'GENCO') {
    return Math.round(player.balance + player.green_points * 20);
  } else if (player.role === 'CONSUMER') {
    return Math.round(player.gdp_score * 2 + player.balance);
  } else {
    // EVN
    return Math.round(player.balance + (gameState.eh + gameState.ss) * 10);
  }
}

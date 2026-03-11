
import { Player, GameState } from '../types/game';

export const INITIAL_GAME_STATE: GameState = {
  id: 'global',
  round: 1,
  eh: 100,
  ss: 100,
  grid_limit: 1000,
  current_event: null,
  next_event_prediction: null,
  is_started: false,
  is_game_over: false,
  waiting_for_admin_confirm: false,
  history: [{ round: 1, eh: 100, ss: 100, grid_limit: 1000 }]
};

export const INITIAL_PLAYERS: Partial<Player>[] = [
  { group_name: 'G1', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G2', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G3', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0 },
  { group_name: 'G4', role: 'CONSUMER', balance: 1500, gdp_score: 500, green_points: 0 },
  { group_name: 'G5', role: 'CONSUMER', balance: 1500, gdp_score: 500, green_points: 0 },
  { group_name: 'G6', role: 'CONSUMER', balance: 1500, gdp_score: 500, green_points: 0 },
  { group_name: 'G7', role: 'EVN', balance: 4000, gdp_score: 0, green_points: 0 },
];

export const SCENARIOS: { name: string; multiplier: number; description: string }[] = [
  { name: 'Khởi đầu bình ổn',     multiplier: 1.0, description: 'Thị trường điện cân bằng. Cung cầu ổn định, không có biến động đặc biệt.' },
  { name: 'Tăng trưởng nóng',     multiplier: 1.2, description: 'Kinh tế mở rộng nhanh. Nhu cầu điện tăng 20%, doanh thu GENCO cao hơn.' },
  { name: 'Khủng hoảng nhẹ',      multiplier: 0.8, description: 'Tín dụng thắt chặt, sản xuất chậm lại. Cung và cầu đều giảm 20%.' },
  { name: 'Đại dịch',             multiplier: 0.5, description: 'Phong tỏa toàn quốc. Sản xuất và tiêu dùng điện giảm một nửa.' },
  { name: 'Cách mạng công nghiệp', multiplier: 1.5, description: 'Công nghệ tự động hóa bùng nổ. Tiêu thụ điện công nghiệp tăng vọt 50%.' },
  { name: 'Cấm vận kinh tế',      multiplier: 0.7, description: 'Bị cắt nguồn nguyên liệu nhập khẩu. Sản lượng phát điện giảm 30%.' },
  { name: 'Mùa hè rực lửa',       multiplier: 1.3, description: 'Nắng nóng cực đoan. Điều hòa không khí đẩy cầu điện lên +30%.' },
  { name: 'Mùa đông băng giá',    multiplier: 0.9, description: 'Lạnh giá làm giảm hiệu suất nhà máy. Cung giảm nhẹ 10%.' },
  { name: 'Đình trệ',             multiplier: 0.6, description: 'Lạm phát cao, đầu tư đóng băng. Hoạt động kinh tế chỉ còn 60%.' },
  { name: 'Phục hồi',             multiplier: 1.1, description: 'Kinh tế hồi phục sau khủng hoảng. Cầu điện tăng trở lại nhẹ nhàng.' },
  { name: 'Đỉnh cao hegemony',    multiplier: 2.0, description: 'Thống trị thị trường năng lượng. Cung và cầu đều ở đỉnh — ai nắm lưới, nắm tất cả.' },
  { name: 'Thoái trào',           multiplier: 0.4, description: 'Sụp đổ bong bóng kinh tế. Sản lượng điện chỉ còn 40% mức bình thường.' },
  { name: 'Tái cấu trúc',         multiplier: 1.0, description: 'Cải cách thể chế năng lượng. Thị trường ổn định trong giai đoạn chuyển đổi.' },
  { name: 'Bùng nổ dân số',       multiplier: 1.4, description: 'Di cư ồ ạt vào đô thị. Cầu điện dân sinh và công nghiệp tăng 40%.' },
  { name: 'Thiên tai liên miên',  multiplier: 0.3, description: 'Lũ lụt, bão, động đất liên tiếp. Hạ tầng tê liệt, sản lượng chỉ còn 30%.' },
  { name: 'Hòa bình xanh',        multiplier: 1.0, description: 'Hiệp ước môi trường toàn cầu. Thị trường ổn định, ưu tiên năng lượng tái tạo.' },
  { name: 'Chiến tranh thương mại', multiplier: 0.75, description: 'Thuế quan trả đũa, chuỗi cung ứng đứt gãy. Hoạt động điện giảm 25%.' },
  { name: 'Kỷ nguyên số',         multiplier: 1.6, description: 'Trung tâm dữ liệu và AI bùng nổ. Tiêu thụ điện số hóa tăng 60%.' },
  { name: 'Cạn kiệt tài nguyên',  multiplier: 0.5, description: 'Than, khí đốt, dầu cạn dần. Chi phí sản xuất điện tăng gấp đôi, cung giảm 50%.' },
  { name: 'Ngày tận thế',         multiplier: 0.1, description: 'Khủng hoảng văn minh toàn cầu. Chỉ 10% hạ tầng điện còn hoạt động. Ai sống sót?' },
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
  eh = Math.round((eh * 0.65 + newEh * 0.35)); // Smoothing: 65% trọng số lịch sử — ổn định hơn
  eh = Math.max(0, Math.min(100, eh));

  let ssDelta = 0;
  if (realEnergy < totalDemand * 0.85) ssDelta -= 8; // Thiếu điện → bất ổn xã hội

  // ── Step 6: Process GENCO finances ───────────────────────────────────────
  // Phân bổ doanh thu: lobby ưu tiên được 60%, còn lại chia đều
  const gencoCount = gencos.length;

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
      myShare = realEnergy / Math.max(1, gencoCount);
    }

    const revenue = myShare * 1.2; // Đơn giá điện: 1.2$/MW

    if (p.last_option === 1) {
      // Tăng công suất: flat reward giảm từ 700→350 để không quá dominant
      p.balance += revenue - baseCost + 350;
      ssDelta -= 5; // Khai thác tối đa → bất ổn môi trường
    } else if (p.last_option === 2) {
      // Bảo trì: chi phí thấp + thưởng độ tin tưởng
      p.balance += revenue - baseCost * 0.5 + 150;
      ssDelta += 3;
    } else if (p.last_option === 3) {
      // Lobby: phí giảm 300→150 để viable hơn
      p.balance += revenue - baseCost - 150; // 150 = phí lobby
      p.green_points += 3;
    } else if (p.last_option === 4) {
      // Chuyển đổi Xanh: tốt cho dài hạn
      p.green_points += 15;
      p.balance += revenue - baseCost + 250; // Tăng thưởng xanh từ 200→250
      ssDelta += 5;
    } else {
      // Không chọn (null)
      p.balance += revenue - baseCost;
    }
  });

  // ── Step 7: Process CONSUMER finances ────────────────────────────────────
  consumers.forEach(p => {
    const baseGdp = 80 * multiplier;

    if (p.last_option === 1) {
      // Mở rộng xưởng: GDP cao, chi phí đầu tư giảm 150→100
      p.gdp_score += baseGdp * 1.5 + 40;
      p.balance -= 100;
    } else if (p.last_option === 2) {
      // Tiết kiệm điện: nerf reward 250→180 để không dominant
      p.gdp_score += baseGdp * 0.25 + 20;
      p.balance += 180;
      ssDelta += 8;
    } else if (p.last_option === 3) {
      // Bãi công: chi phí giảm 100→50, phản ánh mâu thuẫn giai cấp
      p.gdp_score += baseGdp * 0.75 + 60;
      p.balance -= 50;
      ssDelta -= 8;
    } else if (p.last_option === 4) {
      // Hỗ trợ hạ tầng: chi phí giảm 400→200, GDP tăng lên, grid tăng 80→100
      p.gdp_score += baseGdp * 0.8 + 60;
      p.balance -= 200;
      grid_limit += 100;
      eh = Math.min(100, eh + 4);
    } else {
      p.gdp_score += baseGdp;
    }

    // Đặc trưng 3: EVN điều tiết → tác động trực tiếp lên CONSUMER
    if (evnCapPrice) {
      // Áp trần giá: CONSUMER hưởng lợi trực tiếp
      p.gdp_score += 25;
      p.balance += 80;
    }
    if (evnRaiseFee) {
      // Tăng phí vận chuyển: CONSUMER chịu thiệt (giảm từ 200→150 và 20→15)
      p.balance -= 150;
      p.gdp_score -= 15;
    }
  });

  // ── Step 8: Process EVN finances (Đặc trưng 2 & 3) ───────────────────────
  if (evn) {
    // Phí vận chuyển: tăng lên 0.15 để EVN có income bền vững hơn
    const transmissionFee = realEnergy * 0.15;

    // Trợ cấp chính phủ: EVN là DNNN → nhận hỗ trợ cố định
    const govSubsidy = 350;

    // Thưởng thêm nếu GENCO nào đó lobby → EVN nhận phí lobby
    const lobbyFee = lobbyingGenco ? 150 : 0;

    evn.balance += transmissionFee + govSubsidy + lobbyFee;

    if (evnOption === 1) {
      // Nâng cấp lưới: chi phí giảm 1500→900, grid *1.25→*1.2
      evn.balance -= 900;
      grid_limit = Math.round(grid_limit * 1.2);
    } else if (evnOption === 2) {
      // Áp trần giá bán: chi phí giảm 1200→700, SS +18→+15
      evn.balance -= 700;
      ssDelta += 15;
    } else if (evnOption === 3) {
      // Tăng phí vận chuyển: thu lợi thêm, giảm từ 450→350 và SS -12→-8
      evn.balance += 350;
      ssDelta -= 8;
    } else if (evnOption === 4) {
      // Cắt điện luân phiên: grid +150→+200, SS -15→-10
      grid_limit += 200;
      eh = Math.max(0, eh - 4);
      ssDelta -= 10;
    }
  }

  // ── Step 9: Finalise SS — cap delta để tránh collapse tức thì ─────────────
  const cappedSsDelta = Math.max(-20, ssDelta); // Tối đa mất 20 SS/vòng
  ss = Math.max(0, Math.min(100, ss + cappedSsDelta));

  // ── Step 10: Reset ready status ──────────────────────────────────────────
  updatedPlayers.forEach(p => { p.is_ready = false; });

  // ── Step 11: Game over check ──────────────────────────────────────────────
  const isGameOver = eh < 20 || ss < 20 || round >= 20;

  const nextRoundNumber = round + 1;
  let nextEventPrediction = currentState.next_event_prediction;
  
  // Nếu vòng tới chia hết cho 3 → vòng này random sự kiện và gắn cảnh báo
  if (nextRoundNumber % 3 === 0) {
    const fakeStateForPrediction = { ...currentState };
    const evt = triggerEvent(fakeStateForPrediction);
    nextEventPrediction = evt.current_event || null;
  }
  // Xóa cảnh báo nếu vòng sắp tới không chia hết cho 3
  if (nextRoundNumber % 3 !== 0) {
    nextEventPrediction = null;
  }

  const nextState: GameState = {
    ...currentState,
    round: nextRoundNumber,
    eh,
    ss,
    grid_limit: Math.round(grid_limit),
    is_game_over: isGameOver,
    waiting_for_admin_confirm: true, // Admin phải confirm trước khi sang vòng mới
    history: [...history, { round: nextRoundNumber, eh, ss, grid_limit: Math.round(grid_limit) }],
    current_event: null,
    next_event_prediction: nextEventPrediction,
  };

  return { nextState, updatedPlayers };
}

export const EVENTS = [
  {
    name: 'Bão lũ — Hạ tầng lưới điện thiệt hại nặng (-30% Grid)',
    impact: (state: GameState) => ({ grid_limit: Math.round(state.grid_limit * 0.7) })
  },
  {
    name: 'Khủng hoảng nhiên liệu — Chi phí sản xuất tăng vọt (EH -10 điểm)',
    impact: (state: GameState) => ({ eh: Math.max(20, state.eh - 10) })
  },
  {
    name: 'Cách mạng xanh — Chính phủ trợ cấp năng lượng tái tạo (SS +10 điểm)',
    impact: (state: GameState) => ({ ss: Math.min(100, state.ss + 10) })
  },
  {
    name: 'Biểu tình — Người dân phản đối giá điện cao (SS -15 điểm)',
    impact: (state: GameState) => ({ ss: Math.max(20, state.ss - 15) })
  },
  {
    name: 'Đầu tư ngoại FDI — Vốn vào ngành điện (EH +8 điểm)',
    impact: (state: GameState) => ({ eh: Math.min(100, state.eh + 8) })
  },
];

export function triggerEvent(state: GameState): Partial<GameState> {
  const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  return {
    current_event: randomEvent.name,
    ...randomEvent.impact(state),
  };
}

/**
 * Compute the final score for each player at game end.
 * Scoring tường minh — phản ánh mục tiêu từng role:
 *   GENCO: balance + green_points × 15 (đã giảm từ 20 để cân bằng)
 *   CONSUMER: gdp_score × 2 + balance
 *   EVN: balance + (eh + ss) × 8
 *
 * ÁN PHẠT SỤP ĐỔ SỚM:
 *   Nếu hệ thống sụp đổ trước vòng 20:
 *   - GENCO & CONSUMER: điểm × 0.3 (bị phạt 70%)
 *   - EVN: điểm × 0.5 (bị phạt 50% trách nhiệm quản lý)
 */
export function computeFinalScore(player: Player, gameState: GameState): number {
  let score: number;
  if (player.role === 'GENCO') {
    // GP×20 (tăng từ 15) để OP-04 Xanh cạnh tranh với OP-01
    score = Math.round(player.balance + player.green_points * 20);
  } else if (player.role === 'CONSUMER') {
    score = Math.round(player.gdp_score * 2 + player.balance);
  } else {
    // ×10 (tăng từ 8) để EVN được thưởng xứng đáng khi duy trì hệ thống
    score = Math.round(player.balance + (gameState.eh + gameState.ss) * 10);
  }

  // Áp dụng án phạt nếu hệ thống sụp đổ trước vòng 20
  const isEarlyCollapse = gameState.is_game_over && gameState.round <= 20 && (gameState.eh < 20 || gameState.ss < 20);
  if (isEarlyCollapse) {
    const penalty = player.role === 'EVN' ? 0.5 : 0.3;
    score = Math.round(score * penalty);
  }

  return score;
}

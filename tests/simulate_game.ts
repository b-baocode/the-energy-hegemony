/**
 * Game Simulation Test Script
 * 
 * Mô phỏng 7 nhóm + admin xử lý vòng.
 * Case 1: Nền kinh tế sụp đổ (EH hoặc SS < 20%)
 * Case 2: Chơi hết 20 vòng → ranking cuối cùng
 */

// ---- Inline types ----

interface Player {
  id: string;
  group_name: string;
  role: 'GENCO' | 'CONSUMER' | 'EVN';
  balance: number;
  gdp_score: number;
  green_points: number;
  last_option: number | null;
  is_ready: boolean;
  custom_name?: string | null;
}

interface GameState {
  id: string;
  round: number;
  eh: number;
  ss: number;
  grid_limit: number;
  current_event: string | null;
  is_game_over: boolean;
  history: Array<{ round: number; eh: number; ss: number; grid_limit: number }>;
}

const SCENARIOS = [
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

function processRound(currentState: GameState, players: Player[]): { nextState: GameState; updatedPlayers: Player[] } {
  let { eh, ss, grid_limit, round, history } = currentState;
  const updatedPlayers = players.map(p => ({ ...p }));
  const scenario = SCENARIOS[(round - 1) % SCENARIOS.length];
  const multiplier = scenario.multiplier;

  const evn = updatedPlayers.find(p => p.role === 'EVN')!;
  const evnOption = evn?.last_option ?? null;
  const evnCapPrice = evnOption === 2;
  const evnRaiseFee = evnOption === 3;

  const gencos = updatedPlayers.filter(p => p.role === 'GENCO');
  const lobbyingGenco = gencos.find(p => p.last_option === 3);

  let totalGen = 0;
  let totalDemand = 0;

  gencos.forEach(p => {
    let gen = 400 * multiplier;
    if (p.last_option === 1) gen *= 1.4;
    totalGen += gen;
  });

  const consumers = updatedPlayers.filter(p => p.role === 'CONSUMER');
  consumers.forEach(p => {
    let demand = 300 * multiplier;
    if (p.last_option === 1) demand *= 1.2;
    if (p.last_option === 2) demand *= 0.85;
    totalDemand += demand;
  });

  const realEnergy = Math.min(totalGen, totalDemand, grid_limit);
  const newEh = (realEnergy / Math.max(1, totalDemand)) * 100;
  eh = Math.round((eh * 0.6 + newEh * 0.4));
  eh = Math.max(0, Math.min(100, eh));

  let ssDelta = 0;
  if (realEnergy < totalDemand * 0.8) ssDelta -= 12;

  const gencoCount = gencos.length;

  gencos.forEach(p => {
    const baseCost = 250 * multiplier;
    let myShare: number;
    if (lobbyingGenco && p.id === lobbyingGenco.id) {
      myShare = realEnergy * 0.6;
    } else if (lobbyingGenco) {
      myShare = realEnergy * 0.4 / Math.max(1, gencoCount - 1);
    } else {
      myShare = realEnergy / gencoCount;
    }
    const revenue = myShare * 1.2;

    if (p.last_option === 1) { p.balance += revenue - baseCost + 700; ssDelta -= 3; }
    else if (p.last_option === 2) { p.balance += revenue - baseCost * 0.5; }
    else if (p.last_option === 3) { p.balance += revenue - baseCost - 300; }
    else if (p.last_option === 4) { p.green_points += 15; p.balance += revenue - baseCost + 200; ssDelta += 3; }
    else { p.balance += revenue - baseCost; }
  });

  consumers.forEach(p => {
    const baseGdp = 80 * multiplier;
    if (p.last_option === 1) { p.gdp_score += baseGdp * 1.5 + 40; p.balance -= 150; }
    else if (p.last_option === 2) { p.gdp_score += baseGdp * 0.25 + 20; p.balance += 250; ssDelta += 5; }
    else if (p.last_option === 3) { p.gdp_score += baseGdp * 0.75 + 60; p.balance -= 100; ssDelta -= 8; }
    else if (p.last_option === 4) { p.gdp_score += baseGdp * 0.5 + 40; p.balance -= 400; grid_limit += 80; }
    else { p.gdp_score += baseGdp; }
    if (evnCapPrice) { p.gdp_score += 30; p.balance += 100; }
    if (evnRaiseFee) { p.balance -= 200; p.gdp_score -= 20; }
  });

  if (evn) {
    const transmissionFee = realEnergy * 0.15;
    const lobbyFee = lobbyingGenco ? 300 : 0;
    evn.balance += transmissionFee + lobbyFee;
    if (evnOption === 1) { evn.balance -= 1200; grid_limit = Math.round(grid_limit * 1.25); }
    else if (evnOption === 2) { evn.balance -= 800; ssDelta += 25; }
    else if (evnOption === 3) { evn.balance += 600; ssDelta -= 12; }
    else if (evnOption === 4) { grid_limit += 150; eh = Math.max(0, eh - 5); ssDelta -= 15; }
  }

  ss = Math.max(0, Math.min(100, ss + ssDelta));
  updatedPlayers.forEach(p => { p.is_ready = false; });
  const isGameOver = eh < 20 || ss < 20 || round >= 20;

  return {
    nextState: {
      ...currentState, round: round + 1, eh, ss,
      grid_limit: Math.round(grid_limit), is_game_over: isGameOver,
      history: [...history, { round: round + 1, eh, ss, grid_limit: Math.round(grid_limit) }],
      current_event: null,
    },
    updatedPlayers,
  };
}

function computeFinalScore(player: Player, gameState: GameState): number {
  if (player.role === 'GENCO') return Math.round(player.balance + player.green_points * 20);
  if (player.role === 'CONSUMER') return Math.round(player.gdp_score * 2 + player.balance);
  return Math.round(player.balance + (gameState.eh + gameState.ss) * 10);
}

function triggerEvent(state: GameState): Partial<GameState> {
  const events = [
    { name: 'Bão lũ', impact: { grid_limit: Math.round(state.grid_limit * 0.7) } },
    { name: 'Khủng hoảng nhiên liệu', impact: { eh: Math.max(20, state.eh - 10) } },
    { name: 'Cách mạng xanh', impact: { ss: Math.min(100, state.ss + 10) } },
    { name: 'Biểu tình', impact: { ss: Math.max(20, state.ss - 15) } },
    { name: 'Đầu tư ngoại', impact: { eh: Math.min(100, state.eh + 8) } },
  ];
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  return { current_event: randomEvent.name, ...randomEvent.impact };
}

// ---- Helpers ----
function makeState(): GameState {
  return { id: 'global', round: 1, eh: 100, ss: 100, grid_limit: 1000, current_event: null, is_game_over: false, history: [{ round: 1, eh: 100, ss: 100, grid_limit: 1000 }] };
}

function makePlayers(): Player[] {
  return [
    { id: '1', group_name: 'G1', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0, last_option: null, is_ready: false, custom_name: 'Cloudy' },
    { id: '2', group_name: 'G2', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0, last_option: null, is_ready: false, custom_name: 'Storm' },
    { id: '3', group_name: 'G3', role: 'GENCO', balance: 2000, gdp_score: 0, green_points: 0, last_option: null, is_ready: false, custom_name: 'Phoenix' },
    { id: '4', group_name: 'G4', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0, last_option: null, is_ready: false, custom_name: 'Delta' },
    { id: '5', group_name: 'G5', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0, last_option: null, is_ready: false, custom_name: 'Sigma' },
    { id: '6', group_name: 'G6', role: 'CONSUMER', balance: 1000, gdp_score: 500, green_points: 0, last_option: null, is_ready: false, custom_name: 'Alpha' },
    { id: '7', group_name: 'G7', role: 'EVN', balance: 5000, gdp_score: 0, green_points: 0, last_option: null, is_ready: false, custom_name: 'State' },
  ];
}

function set(players: Player[], id: string, option: number) {
  const p = players.find(p => p.id === id);
  if (p) { p.last_option = option; p.is_ready = true; }
}

function printRow(state: GameState, players: Player[]) {
  console.log(`  EH=${state.eh}%  SS=${state.ss}%  Grid=${state.grid_limit}MW  ${state.current_event ? '🔥 ' + state.current_event : ''}`);
  players.forEach(p => {
    const sc = computeFinalScore(p, state);
    console.log(`    ${p.role.padEnd(8)} ${(p.custom_name || p.group_name).padEnd(10)} | Bal=$${Math.round(p.balance).toString().padStart(6)}  GDP=${Math.round(p.gdp_score).toString().padStart(5)}  GP=${p.green_points.toString().padStart(3)} | Score=${sc}`);
  });
}

function printRanking(state: GameState, players: Player[]) {
  console.log('\n🏆 ═══════════ BẢNG XẾP HẠNG CUỐI CÙNG ═══════════');
  console.log(`   EH=${state.eh}%  SS=${state.ss}%  Grid=${state.grid_limit}MW  Round=${state.round - 1}`);
  const reason = state.eh < 20 ? 'EH sụp đổ' : state.ss < 20 ? 'SS sụp đổ' : 'Hết 20 vòng';
  console.log(`   Game Over: ${state.is_game_over}  Lý do: ${reason}\n`);

  const ranked = [...players].map(p => ({ ...p, score: computeFinalScore(p, state) })).sort((a, b) => b.score - a.score);
  ranked.forEach((p, i) => {
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '  ';
    const f = p.role === 'GENCO' ? `Bal(${Math.round(p.balance)}) + GP(${p.green_points})×20`
            : p.role === 'CONSUMER' ? `GDP(${Math.round(p.gdp_score)})×2 + Bal(${Math.round(p.balance)})`
            : `Bal(${Math.round(p.balance)}) + (EH${state.eh}+SS${state.ss})×10`;
    console.log(`  ${medal} #${i + 1}  ${p.role.padEnd(8)} ${(p.custom_name || p.group_name).padEnd(10)} → ${p.score.toString().padStart(6)}  [${f}]`);
  });
  console.log('═══════════════════════════════════════════════════\n');
}

// ━━━━━━ CASE 1: SỤP ĐỔ ━━━━━━
function simulateCollapse() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  CASE 1: MÔ PHỎNG NỀN KINH TẾ SỤP ĐỔ              ║');
  console.log('║  GENCO tăng ồ ạt, CONSUMER bãi công, EVN tăng phí   ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  let state = makeState();
  let players = makePlayers();
  let rounds = 0;

  while (!state.is_game_over && state.round <= 20) {
    rounds++;
    console.log(`\n── Vòng ${state.round} (${SCENARIOS[(state.round - 1) % SCENARIOS.length].name}) ──`);

    // Tất cả GENCO tăng công suất (SS -3 mỗi)
    set(players, '1', 1); set(players, '2', 1); set(players, '3', 1);
    // Tất cả CONSUMER bãi công (SS -8 mỗi)
    set(players, '4', 3); set(players, '5', 3); set(players, '6', 3);
    // EVN tăng phí (SS -12)
    set(players, '7', 3);

    const r = processRound(state, players);
    state = r.nextState; players = r.updatedPlayers;
    if (state.round % 3 === 0) { state = { ...state, ...triggerEvent(state) }; }

    printRow(state, players);
    if (state.is_game_over) {
      console.log(`\n  ❌ GAME OVER tại vòng ${state.round - 1}!`);
      if (state.eh < 20) console.log('  💀 Economy Health sụp đổ (EH < 20%)');
      if (state.ss < 20) console.log('  💀 Social Stability sụp đổ (SS < 20%)');
      break;
    }
  }
  printRanking(state, players);
  return rounds;
}

// ━━━━━━ CASE 2: ĐỦ 20 VÒNG ━━━━━━
function simulateFull20() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  CASE 2: CHƠI HẾT 20 VÒNG (chiến lược hỗn hợp)    ║');
  console.log('║  Mỗi nhóm chiến lược riêng, EVN cân bằng           ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  let state = makeState();
  let players = makePlayers();

  // Chiến lược 20 vòng cho từng nhóm
  const plans: Record<string, number[]> = {
    '1': [1,1,2,1,3,1,4,1,2,1,1,1,2,1,3,1,4,1,2,1], // Cloudy GENCO: tăng + lobby
    '2': [2,1,1,4,2,1,1,4,2,1,1,4,2,1,1,4,2,1,1,4], // Storm GENCO: cân bằng
    '3': [4,4,4,1,4,4,4,1,4,4,4,1,4,4,4,1,4,4,4,1], // Phoenix GENCO: chuyển đổi xanh
    '4': [1,1,2,1,1,2,4,1,1,2,1,1,2,4,1,1,2,1,1,2], // Delta CONSUMER: mở rộng
    '5': [2,2,2,4,2,2,2,4,2,2,2,4,2,2,2,4,2,2,2,4], // Sigma CONSUMER: tiết kiệm
    '6': [1,3,1,3,1,3,1,4,1,3,1,3,1,3,1,4,1,3,1,3], // Alpha CONSUMER: bãi công luân phiên
    '7': [1,2,3,1,2,1,2,3,1,2,1,2,3,1,2,1,2,3,1,2], // State EVN: đa dạng
  };

  while (!state.is_game_over && state.round <= 20) {
    const r = state.round;
    console.log(`\n── Vòng ${r} (${SCENARIOS[(r - 1) % SCENARIOS.length].name}) ──`);

    Object.entries(plans).forEach(([id, plan]) => { set(players, id, plan[(r - 1) % plan.length]); });

    const result = processRound(state, players);
    state = result.nextState; players = result.updatedPlayers;
    if (state.round % 3 === 0) { state = { ...state, ...triggerEvent(state) }; }

    printRow(state, players);
    if (state.is_game_over && state.round - 1 < 20) {
      console.log(`\n  ⚠️  GAME OVER EARLY tại vòng ${state.round - 1}!`);
      break;
    }
  }
  printRanking(state, players);
}

// ━━━━━━ RUN ━━━━━━
console.log('🎮 THE ENERGY HEGEMONY — Simulation Test');
console.log('========================================');

const collapseRounds = simulateCollapse();
simulateFull20();

console.log('\n📋 TÓM TẮT:');
console.log(`  Case 1 (Sụp đổ): Game Over sau ${collapseRounds} vòng`);
console.log(`  Case 2 (Đủ 20 vòng): Xem ranking ở trên`);
console.log('  ✅ Simulation hoàn tất');

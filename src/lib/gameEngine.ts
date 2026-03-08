
import { Player, GameState, PlayerRole } from '../types/game';

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

export function processRound(currentState: GameState, players: Player[]): { nextState: GameState, updatedPlayers: Player[] } {
  let { eh, ss, grid_limit, round, history } = currentState;
  const updatedPlayers = [...players];
  const scenario = SCENARIOS[(round - 1) % SCENARIOS.length];
  const multiplier = scenario.multiplier;

  // 1. Calculate Supply and Demand
  let totalGen = 0;
  let totalDemand = 0;

  players.forEach(p => {
    if (p.role === 'GENCO') {
      let gen = 400 * multiplier; // Base generation scaled by scenario
      if (p.last_option === 1) gen *= 1.3;
      totalGen += gen;
    } else if (p.role === 'CONSUMER') {
      let demand = 300 * multiplier; // Base demand scaled by scenario
      if (p.last_option === 1) demand *= 1.2;
      if (p.last_option === 2) demand *= 0.9;
      totalDemand += demand;
    }
  });

  // 2. Grid Capacity check
  const realEnergy = Math.min(totalGen, totalDemand, grid_limit);
  
  // 3. Update Global Indices
  const newEh = (realEnergy / Math.max(1, totalDemand)) * 100;
  eh = Math.round((eh + newEh) / 2); // Smoothing

  // Social Stability impacts
  let ssDelta = 0;
  if (realEnergy < totalDemand) ssDelta -= 10; // Blackouts
  
  // 4. Process Player Options & Finances
  updatedPlayers.forEach(p => {
    // Reset ready status for next round
    p.is_ready = false;

    if (p.role === 'GENCO') {
      // Base profit logic
      let profit = (realEnergy / 3) * 2; // Simplified allocation
      let cost = 300;
      
      if (p.last_option === 1) { p.balance *= 1.3; ssDelta -= 5; }
      if (p.last_option === 2) { p.balance -= 500; }
      if (p.last_option === 3) { /* Lobby logic: prioritized in real allocation if implemented */ }
      if (p.last_option === 4) { p.green_points += 10; ssDelta += 5; }
      
      p.balance += (profit - cost);
    } 
    else if (p.role === 'CONSUMER') {
      let gdpGain = 100;
      if (p.last_option === 1) gdpGain = 150;
      if (p.last_option === 2) p.balance -= 400;
      if (p.last_option === 3) { gdpGain = 0; ssDelta -= 15; }
      if (p.last_option === 4) { p.balance -= 600; grid_limit *= 1.1; }
      
      p.gdp_score += gdpGain;
    }
    else if (p.role === 'EVN') {
      if (p.last_option === 1) { p.balance -= 1500; grid_limit *= 1.3; }
      if (p.last_option === 2) { p.balance *= 0.8; ssDelta += 20; }
      if (p.last_option === 3) { p.balance *= 1.2; ssDelta -= 10; }
      if (p.last_option === 4) { ssDelta -= 20; grid_limit += 100; } // Protect grid
      
      p.balance += (realEnergy * 0.5); // Transmission fees
    }
  });

  ss = Math.max(0, Math.min(100, ss + ssDelta));

  // 5. Check Game Over
  const isGameOver = eh < 20 || ss < 20 || round >= 20;

  const nextState: GameState = {
    ...currentState,
    round: round + 1,
    eh,
    ss,
    grid_limit: Math.round(grid_limit),
    is_game_over: isGameOver,
    history: [...history, { round: round + 1, eh, ss, grid_limit }]
  };

  return { nextState, updatedPlayers };
}

export function triggerEvent(state: GameState): Partial<GameState> {
  const events = [
    { name: 'Bão lũ', impact: { grid_limit: state.grid_limit * 0.3 } },
    { name: 'Khủng hoảng nhiên liệu', impact: {} }, // Handled in costs if we had dynamic costs
    { name: 'Cách mạng xanh', impact: {} }
  ];
  
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  return {
    current_event: randomEvent.name,
    ...randomEvent.impact
  };
}

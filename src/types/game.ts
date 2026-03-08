
export type PlayerRole = 'GENCO' | 'CONSUMER' | 'EVN';

export interface Player {
  id: string;
  group_name: string;
  role: PlayerRole;
  balance: number;
  gdp_score: number;
  green_points: number;
  last_option: number | null;
  is_ready: boolean;
}

export interface GameState {
  id: string;
  round: number;
  eh: number; // Economy Health
  ss: number; // Social Stability
  grid_limit: number;
  current_event: string | null;
  is_game_over: boolean;
  history: {
    round: number;
    eh: number;
    ss: number;
    grid_limit: number;
  }[];
}

export interface GameOption {
  id: number;
  name: string;
  personal_impact: string;
  system_impact: string;
}

export const GENCO_OPTIONS: GameOption[] = [
  { id: 1, name: 'Tăng công suất', personal_impact: 'Tiền +30%', system_impact: 'EH +5, SS -5' },
  { id: 2, name: 'Bảo trì máy', personal_impact: 'Tiền -500', system_impact: 'EH ổn định' },
  { id: 3, name: 'Lobby truyền tải', personal_impact: 'Chiếm slot ưu tiên', system_impact: 'EH ổn định, hại nhóm G khác' },
  { id: 4, name: 'Chuyển đổi Xanh', personal_impact: 'Điểm "Xanh" +10', system_impact: 'EH bền vững, SS +5' },
];

export const CONSUMER_OPTIONS: GameOption[] = [
  { id: 1, name: 'Mở rộng xưởng', personal_impact: 'GDP +50', system_impact: 'Cầu điện +20%' },
  { id: 2, name: 'Tiết kiệm điện', personal_impact: 'Tiền -400', system_impact: 'Cầu điện -10%' },
  { id: 3, name: 'Bãi công đòi giá', personal_impact: 'GDP dừng tăng', system_impact: 'SS -15' },
  { id: 4, name: 'Hỗ trợ hạ tầng', personal_impact: 'Tiền -600', system_impact: 'L_grid +10%' },
];

export const EVN_OPTIONS: GameOption[] = [
  { id: 1, name: 'Nâng cấp lưới', personal_impact: 'Tiền -1500', system_impact: 'L_grid +30%' },
  { id: 2, name: 'Áp trần giá bán', personal_impact: 'Tiền -20%', system_impact: 'SS +20, EH ổn định' },
  { id: 3, name: 'Tăng phí vận chuyển', personal_impact: 'Tiền +20%', system_impact: 'SS -10, GDP nhóm B giảm' },
  { id: 4, name: 'Cắt điện luân phiên', personal_impact: 'Tiền 0', system_impact: 'SS -20, Bảo vệ Grid' },
];

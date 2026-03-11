
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
  custom_name?: string | null; // Tên tuỳ chỉnh của nhóm, VD: "Cloudy"
}

// Tiền tố hiển thị theo role
export const ROLE_PREFIX: Record<PlayerRole, string> = {
  GENCO: '⚡ GENCO',
  CONSUMER: '🏭 CONSUMER',
  EVN: '🏛️ EVN',
};

// Hiển thị tên đầy đủ của nhóm: "⚡ GENCO - Cloudy" hoặc "⚡ GENCO - G1"
export function getDisplayName(player: Player): string {
  const prefix = ROLE_PREFIX[player.role];
  const suffix = player.custom_name?.trim() || player.group_name;
  return `${prefix} — ${suffix}`;
}

export interface GameState {
  id: string;
  round: number;
  eh: number;   // Economy Health (Sức khỏe kinh tế)
  ss: number;   // Social Stability (Ổn định xã hội)
  grid_limit: number;
  current_event: string | null;
  next_event_prediction: string | null;
  is_started: boolean;
  is_game_over: boolean;
  waiting_for_admin_confirm: boolean; 
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

// ─── GENCO: Nhà sản xuất điện tư nhân ───────────────────────────────────────
// Mục tiêu: tối đa hóa Balance. Cạnh tranh nhau giành doanh thu phân phối từ EVN.
export const GENCO_OPTIONS: GameOption[] = [
  {
    id: 1,
    name: 'Tăng công suất',
    personal_impact: 'Tiền +350 (flat) + doanh thu cao hơn',
    system_impact: 'Phát điện +40%, SS -5 (khai thác môi trường)',
  },
  {
    id: 2,
    name: 'Bảo trì máy',
    personal_impact: 'Chi phí -50% + thưởng uy tín +150$',
    system_impact: 'Sản lượng ổn định, SS +3 (dân tin tưởng)',
  },
  {
    id: 3,
    name: 'Lobby EVN',
    personal_impact: 'Chiếm 60% doanh thu — Nhận +3 Green Points',
    system_impact: 'EH không đổi, bất bình đẳng tăng (Lênin 1)',
  },
  {
    id: 4,
    name: 'Chuyển đổi Xanh',
    personal_impact: 'Điểm Xanh +15, Tiền +250 bonus',
    system_impact: 'SS +5, EH bền vững dài hạn',
  },
];

// ─── CONSUMER: Công nghiệp / Doanh nghiệp sử dụng điện ──────────────────────
// Mục tiêu: tối đa hóa GDP Score. Chịu ảnh hưởng từ cả GENCO lẫn EVN.
export const CONSUMER_OPTIONS: GameOption[] = [
  {
    id: 1,
    name: 'Mở rộng xưởng',
    personal_impact: 'GDP +120, Tiền -100 (đầu tư)',
    system_impact: 'Cầu điện +20%, EH giảm nếu thiếu cung',
  },
  {
    id: 2,
    name: 'Tiết kiệm điện',
    personal_impact: 'Tiền +180, GDP +20 (hiệu quả)',
    system_impact: 'Cầu điện -15%, SS +8 (ổn định cao)',
  },
  {
    id: 3,
    name: 'Bãi công đòi giá',
    personal_impact: 'GDP +60, Tiền -50 (đòi được quyền lợi)',
    system_impact: 'SS -8 (mâu thuẫn giai cấp — Lênin 3)',
  },
  {
    id: 4,
    name: 'Hỗ trợ hạ tầng',
    personal_impact: 'Tiền -200, GDP +70',
    system_impact: 'L_grid +100 MW, EH +4 (năng suất tăng)',
  },
];

// ─── EVN: Nhà nước độc quyền — "Nhà tư bản tập thể" (Lênin) ─────────────────
// Mục tiêu: duy trì hệ thống + tối đa hóa Balance. Kiểm soát grid_limit.
// Quyết định của EVN ảnh hưởng trực tiếp lên CONSUMER balance/gdp.
export const EVN_OPTIONS: GameOption[] = [
  {
    id: 1,
    name: 'Nâng cấp lưới',
    personal_impact: 'Tiền -900 (đầu tư hạ tầng)',
    system_impact: 'L_grid +20% — toàn hệ thống hưởng lợi (Lênin Đặc trưng 2)',
  },
  {
    id: 2,
    name: 'Áp trần giá bán',
    personal_impact: 'Tiền -700 (hy sinh lợi nhuận)',
    system_impact: 'SS +15, CONSUMER nhận +80$, +25 GDP (ổn định xã hội)',
  },
  {
    id: 3,
    name: 'Tăng phí vận chuyển',
    personal_impact: 'Tiền +350 (thu tô từ hạ tầng)',
    system_impact: 'SS -8, CONSUMER mất -150$, -15 GDP (Lênin Đặc trưng 3)',
  },
  {
    id: 4,
    name: 'Cắt điện luân phiên',
    personal_impact: 'Tiền không đổi',
    system_impact: 'L_grid +200 MW, EH -4, SS -10 (bảo vệ hạ tầng dài hạn)',
  },
];

// Helper: tên option theo id
export function getOptionName(role: PlayerRole, optionId: number | null): string {
  if (optionId === null) return '—';
  const map: Record<PlayerRole, GameOption[]> = {
    GENCO: GENCO_OPTIONS,
    CONSUMER: CONSUMER_OPTIONS,
    EVN: EVN_OPTIONS,
  };
  return map[role].find(o => o.id === optionId)?.name ?? '—';
}

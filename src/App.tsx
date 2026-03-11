
import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { GameState, Player, ROLE_PREFIX, getDisplayName } from './types/game';
import { INITIAL_GAME_STATE, INITIAL_PLAYERS, processRound, triggerEvent, EVENTS, SCENARIOS } from './lib/gameEngine';
import { AdminDashboard } from './components/AdminDashboard';
import { PlayerControls } from './components/PlayerControls';
import { ShieldAlert, ChevronDown, ChevronUp, Pencil, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground } from './components/VisualEffects';

const ADMIN_PASSWORD = '100204';

// ── In-App Guide Component ────────────────────────────────────────────────────
const GameGuide: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'play' | 'theory' | 'scenarios'>('play');

  return (
    <div className="w-full max-w-4xl z-10 mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 game-border-blue hover:bg-white transition-all"
      >
        <span className="font-mono font-bold text-blue-700 uppercase tracking-widest text-sm">
          📖 Hướng Dẫn Chơi & Lý Thuyết
        </span>
        {open ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-blue-500" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/95 rounded-2xl mt-2 p-6 game-border-blue">
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                {[
                  { key: 'play', label: '🎮 Cách Chơi' },
                  { key: 'theory', label: '📚 Lý Thuyết Lênin' },
                  { key: 'scenarios', label: '🎬 Kịch Bản' },
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key as 'play' | 'theory' | 'scenarios')}
                    className={`px-4 py-2 rounded-xl font-mono font-bold text-sm transition-all border-2 ${
                      tab === t.key
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === 'play' && (
                <div className="space-y-6 text-blue-900">
                  {/* Overview */}
                  <div>
                    <h3 className="font-mono font-bold uppercase text-xs tracking-widest opacity-50 mb-2">Tổng Quan</h3>
                    <p className="text-sm leading-relaxed">
                      <b>The Energy Hegemony</b> mô phỏng thị trường điện lực. Các nhóm đưa ra quyết định mỗi vòng.
                      Trò chơi kết thúc sau <b>20 vòng</b> hoặc khi <b>EH &lt; 20%</b> hoặc <b>SS &lt; 20%</b>.
                    </p>
                    <div className="mt-3 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-xs">
                      <span className="font-bold text-red-700">⚠️ Án Phạt Sụp Đổ Sớm (v4.1):</span>
                      <span className="text-red-600 ml-1">Nếu hệ thống sụp đổ trước vòng 20, cả ba khối đều bị phạt điểm. GENCO/CONSUMER: <b>×0.3</b> | EVN: <b>×0.5</b>.</span>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
                      <div className="text-xs font-mono font-bold uppercase text-yellow-700 mb-2">⚡ GENCO</div>
                      <p className="text-xs leading-relaxed mb-3">Mục tiêu: tối đa <b>Balance + GreenPoints × 15</b>.</p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-yellow-100/50 rounded p-2">
                          <div className="font-bold text-yellow-800">OP-01: Tăng công suất</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +700$.<br/><b>Chung:</b> Phát điện +40%, SS -3%.</div>
                        </div>
                        <div className="bg-yellow-100/50 rounded p-2">
                          <div className="font-bold text-yellow-800">OP-02: Bảo trì máy</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> Chi phí -50%.<br/><b>Chung:</b> SS <b>+2%</b>.</div>
                        </div>
                        <div className="bg-yellow-200/50 rounded p-2">
                          <div className="font-bold text-yellow-800">OP-03: Lobby EVN</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> 60% doanh thu + Nhận <b>+2 Green Points</b>.</div>
                        </div>
                        <div className="bg-yellow-100/50 rounded p-2">
                          <div className="font-bold text-yellow-800">OP-04: Chuyển đổi Xanh</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +15 Green Points, +200$.<br/><b>Chung:</b> SS +3%.</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-300">
                      <div className="text-xs font-mono font-bold uppercase text-blue-700 mb-2">🏭 CONSUMER</div>
                      <p className="text-xs leading-relaxed mb-3">Mục tiêu: tối đa <b>GDP Score × 2 + Balance</b>.</p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-blue-100/50 rounded p-2">
                          <div className="font-bold text-blue-800">OP-01: Mở rộng xưởng</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +120 GDP, -150$.<br/><b>Chung:</b> Cầu điện +20%.</div>
                        </div>
                        <div className="bg-blue-100/50 rounded p-2">
                          <div className="font-bold text-blue-800">OP-02: Tiết kiệm điện</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +250$, +20 GDP.<br/><b>Chung:</b> Cầu -15%, SS <b>+8%</b>.</div>
                        </div>
                        <div className="bg-blue-200/50 rounded p-2">
                          <div className="font-bold text-blue-800">OP-03: Bãi công đòi giá</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +60 GDP, -100$.<br/><b>Chung:</b> SS -8%.</div>
                        </div>
                        <div className="bg-blue-100/50 rounded p-2">
                          <div className="font-bold text-blue-800">OP-04: Hỗ trợ hạ tầng</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> -400$, +40 GDP.<br/><b>Chung:</b> Grid +80 MW, EH <b>+3%</b>.</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
                      <div className="text-xs font-mono font-bold uppercase text-red-700 mb-2">🏛️ EVN — Nhà nước</div>
                      <p className="text-xs leading-relaxed mb-3">Mục tiêu: Duy trì hệ thống. <b>×0.5</b> penalty nếu sập sớm.</p>
                      <div className="space-y-2 text-xs">
                        <div className="bg-red-100/50 rounded p-2">
                          <div className="font-bold text-red-800">OP-01: Nâng cấp lưới</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> -1200$.<br/><b>Chung:</b> Grid +25%.</div>
                        </div>
                        <div className="bg-red-200/50 rounded p-2">
                          <div className="font-bold text-red-800">OP-02: Áp trần giá bán</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> -800$.<br/><b>Chung:</b> SS +25%, CONSUMER +100$.</div>
                        </div>
                        <div className="bg-red-200/50 rounded p-2">
                          <div className="font-bold text-red-800">OP-03: Tăng phí vận chuyển</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> +600$.<br/><b>Chung:</b> SS -12%, CONSUMER -200$.</div>
                        </div>
                        <div className="bg-red-100/50 rounded p-2">
                          <div className="font-bold text-red-800">OP-04: Cắt điện luân phiên</div>
                          <div className="text-gray-600 mt-1"><b>Riêng:</b> 0$.<br/><b>Chung:</b> Grid +150 MW, EH -5, SS -15.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicators */}
                  <div>
                    <h3 className="font-mono font-bold uppercase text-xs tracking-widest opacity-50 mb-2">Chỉ Số Hệ Thống</h3>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
                        <div className="font-mono font-bold text-red-600">EH — Economy Health</div>
                        <div className="text-gray-500 mt-1">Tỉ lệ điện cung cấp / cầu. Dưới 20% → Game Over</div>
                      </div>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                        <div className="font-mono font-bold text-blue-600">SS — Social Stability</div>
                        <div className="text-gray-500 mt-1">Ổn định xã hội. Dưới 20% → Game Over</div>
                      </div>
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
                        <div className="font-mono font-bold text-yellow-600">Grid Limit (MW)</div>
                        <div className="text-gray-500 mt-1">Giới hạn truyền tải. EVN kiểm soát. Càng cao càng tốt</div>
                      </div>
                    </div>
                  </div>

                  {/* Scoring */}
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="font-mono font-bold uppercase text-xs tracking-widest mb-2 text-gray-500">Cách Tính Điểm Cuối</h3>
                    <div className="text-sm space-y-1">
                      <div>⚡ <b>GENCO:</b> Balance + Green Points × 20</div>
                      <div>🏭 <b>CONSUMER:</b> GDP Score × 2 + Balance</div>
                      <div>🏛️ <b>EVN:</b> Balance + (EH + SS) × 10 — được thưởng khi hệ thống sống sót tốt</div>
                      <div className="mt-2 text-xs text-red-600 border-t border-red-100 pt-2">⚠️ <b>Án phạt:</b> Sụp đổ trước vòng 20 → GENCO &amp; CONSUMER còn 30% điểm. EVN miễn phạt.</div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'theory' && (
                <div className="space-y-5 text-blue-900">
                  <div className="bg-blue-600 text-white rounded-xl p-4 text-sm leading-relaxed">
                    <b>Lý luận V.I. Lênin:</b> Chủ nghĩa tư bản độc quyền nhà nước là sự kết hợp sức mạnh của
                    tổ chức độc quyền tư nhân với nhà nước tư sản thành một thể chế thống nhất,
                    điều tiết nền kinh tế từ trung tâm. Nhà nước trở thành <b>"nhà tư bản tập thể"</b>.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="border-2 border-purple-300 bg-purple-50 rounded-xl p-4">
                      <div className="font-mono font-bold text-purple-700 mb-2">ĐẶC TRƯNG 1</div>
                      <div className="font-bold mb-1">Kết hợp nhân sự</div>
                      <p className="text-gray-600">"Hôm nay bộ trưởng, ngày mai chủ ngân hàng"</p>
                      <div className="mt-2 bg-purple-100 rounded p-2">
                        🎮 Trong game: <b>GENCO Lobby EVN</b> — mua ảnh hưởng, chiếm 60% doanh thu
                      </div>
                    </div>
                    <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-4">
                      <div className="font-mono font-bold text-orange-700 mb-2">ĐẶC TRƯNG 2</div>
                      <div className="font-bold mb-1">Sở hữu nhà nước</div>
                      <p className="text-gray-600">Nhà nước sở hữu hạ tầng then chốt, kiểm soát "thị trường nhà nước"</p>
                      <div className="mt-2 bg-orange-100 rounded p-2">
                        🎮 Trong game: <b>EVN kiểm soát Grid Limit</b> — cổ chai của toàn hệ thống
                      </div>
                    </div>
                    <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4">
                      <div className="font-mono font-bold text-green-700 mb-2">ĐẶC TRƯNG 3</div>
                      <div className="font-bold mb-1">Công cụ điều tiết</div>
                      <p className="text-gray-600">Nhà nước dùng doanh nghiệp độc quyền điều tiết toàn bộ nền kinh tế</p>
                      <div className="mt-2 bg-green-100 rounded p-2">
                        🎮 Trong game: <b>EVN Áp trần / Tăng phí</b> → tác động ngược lên CONSUMER balance
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 text-xs">
                    <div className="font-bold text-sm mb-2">EVN trong thực tế (phân tích)</div>
                    <ul className="space-y-1 text-gray-600">
                      <li>✅ 100% vốn nhà nước, lãnh đạo do chính phủ bổ nhiệm → Đặc trưng 1</li>
                      <li>✅ Sở hữu toàn bộ lưới truyền tải quốc gia → Đặc trưng 2</li>
                      <li>✅ Giá điện điều chỉnh theo lộ trình nhà nước; hỗ trợ hộ nghèo → Đặc trưng 3</li>
                      <li>⚡ Mâu thuẫn: SS thấp khi EVN tăng phí = công nhân/doanh nghiệp phản ứng</li>
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'scenarios' && (
                <div className="text-blue-900">
                  <p className="text-xs text-gray-500 mb-4 font-mono">
                    Hệ số nhân ảnh hưởng đến cả phát điện cơ bản (400 MW/GENCO) và cầu điện cơ bản (300 MW/CONSUMER).
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="px-3 py-2 font-mono text-left rounded-tl-xl">Vòng</th>
                          <th className="px-3 py-2 font-mono text-left">Kịch Bản</th>
                          <th className="px-3 py-2 font-mono text-center">Hệ Số</th>
                          <th className="px-3 py-2 font-mono text-left rounded-tr-xl">Mô Tả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SCENARIOS.map((s, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-3 py-2 font-mono font-bold text-blue-500">{i + 1}</td>
                            <td className="px-3 py-2 font-bold">{s.name}</td>
                            <td className="px-3 py-2 text-center">
                              <span className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                s.multiplier >= 1.3 ? 'bg-green-100 text-green-700' :
                                s.multiplier >= 1.0 ? 'bg-blue-100 text-blue-700' :
                                s.multiplier >= 0.6 ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                ×{s.multiplier.toFixed(1)}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-500">{s.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Admin Password Modal ──────────────────────────────────────────────────────
const AdminPasswordModal: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = () => {
    if (input === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: error ? [1, 1.02, 0.98, 1] : 1, opacity: 1 }}
        className="w-full max-w-sm bg-white rounded-3xl p-8 game-border-yellow shadow-2xl"
      >
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-2xl ${error ? 'bg-red-100' : 'bg-yellow-100'}`}>
            <Lock className={`w-8 h-8 ${error ? 'text-red-500' : 'text-yellow-600'}`} />
          </div>
        </div>
        <h2 className="text-2xl font-mono font-bold text-center text-blue-700 mb-1">Admin Access</h2>
        <p className="text-xs font-mono text-center text-gray-400 uppercase tracking-widest mb-6">Nhập mật khẩu quản trị</p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-xs font-mono text-red-600 text-center font-bold"
          >
            ❌ Sai mật khẩu — Thử lại
          </motion.div>
        )}

        <input
          ref={inputRef}
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="••••••"
          className="w-full bg-gray-50 border-2 border-blue-200 rounded-xl px-4 py-3 font-mono text-xl text-center tracking-[0.5em] focus:outline-none focus:border-blue-500 transition-colors mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-mono font-bold text-sm text-gray-400 hover:bg-gray-50 transition-all"
          >
            ← Huỷ
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="flex-grow py-3 bg-yellow-400 text-yellow-900 rounded-xl font-mono font-bold text-sm hover:bg-yellow-300 transition-all border-2 border-yellow-600 shadow-[0_4px_0_#854d0e]"
          >
            Xác nhận →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// ── DB helper: only send columns that exist in the Supabase game_state table ──
// Prevents PGRST204 errors when GameState has fields not yet in DB schema.
const toDbState = (s: GameState) => ({
  round:                   s.round,
  eh:                      s.eh,
  ss:                      s.ss,
  grid_limit:              s.grid_limit,
  current_event:           s.current_event,
  next_event_prediction:     s.next_event_prediction,
  is_started:            s.is_started,
  is_game_over:            s.is_game_over,
  waiting_for_admin_confirm: s.waiting_for_admin_confirm,
  history:                 s.history,
});

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [view, setView] = useState<'SELECT_ROLE' | 'ADMIN' | 'PLAYER' | 'NAME_INPUT'>('SELECT_ROLE');
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Admin auth
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Round timer (30s countdown, resets each round)
  const [roundTimer, setRoundTimer] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start/restart timer when round changes
  useEffect(() => {
    if (view === 'PLAYER' && gameState.is_started && !gameState.is_game_over && !gameState.waiting_for_admin_confirm) {
      setRoundTimer(30);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRoundTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setRoundTimer(30);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.round, view, gameState.is_started, gameState.is_game_over, gameState.waiting_for_admin_confirm]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
      setLoading(false);
      return;
    }

    const initGame = async () => {
      try {
        const { data: stateData, error: stateError } = await supabase
          .from('game_state').select('*').eq('id', 'global').single();
        if (stateError && stateError.code !== 'PGRST116') throw stateError;
        if (stateData) {
          setGameState(stateData);
        } else {
          await supabase.from('game_state').insert(INITIAL_GAME_STATE);
        }

        const { data: playersData, error: playersError } = await supabase.from('players').select('*');
        if (playersError) throw playersError;

        // Yêu cầu ít nhất 1 mỗi loại role; nếu DB trống → insert mặc định
        const hasRoles = (data: Player[]) =>
          data.some(p => p.role === 'GENCO') &&
          data.some(p => p.role === 'CONSUMER') &&
          data.some(p => p.role === 'EVN');

        if (playersData && playersData.length > 0 && hasRoles(playersData as Player[])) {
          setPlayers(playersData as Player[]);
        } else {
          // Xóa hết rác cũ rồi insert lại nhóm mặc định
          await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          const { data: newPlayers, error: insertError } = await supabase
            .from('players').insert(INITIAL_PLAYERS).select();
          if (insertError) throw insertError;
          setPlayers(newPlayers as Player[]);
        }
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    initGame();

    const stateSub = supabase
      .channel('game_state_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        console.log('GameState Realtime Update:', payload.new);
        if (payload.new) setGameState(payload.new as GameState);
      }).subscribe((status) => {
        console.log('GameState Subscription Status:', status);
      });

    const playersSub = supabase
      .channel('players_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload: any) => {
        if (payload.eventType === 'DELETE') {
          setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
        } else {
          setPlayers(prev => {
            const index = prev.findIndex(p => p.id === payload.new.id);
            if (index === -1) return [...prev, payload.new as Player];
            const next = [...prev];
            next[index] = payload.new as Player;
            return next;
          });
        }
      }).subscribe();

    return () => {
      stateSub.unsubscribe();
      playersSub.unsubscribe();
    };
  }, []);

  const handleAdminClick = () => {
    if (adminAuthenticated) {
      setView('ADMIN');
    } else {
      setShowAdminModal(true);
    }
  };

  // Click nhóm → vào màn nhập tên
  const handleSelectRole = (player: Player) => {
    setPendingPlayer(player);
    setCustomNameInput(player.custom_name || '');
    setView('NAME_INPUT');
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  // Xác nhận tên → lưu lên Supabase → vào PlayerControls
  const handleConfirmName = async () => {
    if (!pendingPlayer) return;
    const trimmed = customNameInput.trim();
    const { error } = await supabase
      .from('players')
      .update({ custom_name: trimmed || null })
      .eq('id', pendingPlayer.id);
    if (error) console.error(error);
    setCurrentPlayer(pendingPlayer);
    setView('PLAYER');
  };

  const handleSelectOption = async (optionId: number) => {
    if (!currentPlayer) return;
    const { error } = await supabase
      .from('players')
      .update({ last_option: optionId, is_ready: true })
      .eq('id', currentPlayer.id);
    if (error) console.error(error);
  };

  const handleProcessRound = async () => {
    const { nextState, updatedPlayers } = processRound(gameState, players);
    let finalState = nextState;

    if (nextState.round % 3 === 0 && gameState.next_event_prediction) {
      const predictedEvent = EVENTS.find(e => e.name === gameState.next_event_prediction);
      if (predictedEvent) {
        finalState = { 
          ...nextState, 
          current_event: predictedEvent.name,
          ...predictedEvent.impact(nextState) 
        };
      }
    }

    const { error: stateError } = await supabase
      .from('game_state').update(toDbState(finalState)).eq('id', 'global');
    if (stateError) {
      console.error('State update error:', stateError);
      alert('Lỗi cập nhật game: ' + stateError.message);
    } else {
      // Optimistic update
      setGameState(finalState);
    }

    const { error: playersError } = await supabase.from('players').upsert(updatedPlayers);
    if (playersError) {
      console.error('Players update error:', playersError);
    }
  };

  // Admin confirms moving to the next round
  const handleConfirmNextRound = async () => {
    const { error } = await supabase
      .from('game_state')
      .update({ waiting_for_admin_confirm: false })
      .eq('id', 'global');
    if (error) {
      console.error(error);
    } else {
      setGameState(prev => ({ ...prev, waiting_for_admin_confirm: false }));
    }
  };

  // Admin starts the game
  const handleStartGame = async () => {
    const { error } = await supabase
      .from('game_state')
      .update({ is_started: true })
      .eq('id', 'global');
    if (error) {
      console.error(error);
    } else {
      setGameState(prev => ({ ...prev, is_started: true }));
    }
  };

  // Admin adds a new player group
  const handleAddPlayer = async (role: 'GENCO' | 'CONSUMER') => {
    const existingByRole = players.filter(p => p.role === role).length;
    const allNumbers = players.map(p => parseInt(p.group_name.replace('G', ''))).filter(n => !isNaN(n));
    const nextNum = allNumbers.length > 0 ? Math.max(...allNumbers) + 1 : players.length + 1;
    const newPlayerData = {
      group_name: `G${nextNum}`,
      role,
      balance: role === 'GENCO' ? 2000 : 1000,
      gdp_score: role === 'CONSUMER' ? 500 : 0,
      green_points: 0,
      last_option: null,
      is_ready: false,
    };
    const { error } = await supabase.from('players').insert(newPlayerData);
    if (error) console.error(error);
  };

  const handleReset = async () => {
    console.log('Reset triggered...');
    const confirmed = window.confirm('⚠️ Xác nhận Reset?\n\nToàn bộ dữ liệu game sẽ về Vòng 1. Dữ liệu trên hệ thống sẽ bị xóa sạch.\n\nBạn có chắc không?');
    if (!confirmed) {
      console.log('Reset cancelled by user');
      return;
    }

    console.log('Executing reset flow...');

    const resetState = { ...INITIAL_GAME_STATE, is_started: false };

    // 1. Reset local state ngay lập tức (UI feedback tức thì)
    setGameState(resetState);
    setPlayers([]);
    setCurrentPlayer(null);
    setAdminAuthenticated(false);
    setView('SELECT_ROLE');

    try {
      // 2. Sync DB — game_state
      console.log('Syncing game_state reset...');
      const { error: resetError } = await supabase
        .from('game_state')
        .update(toDbState(resetState))
        .eq('id', 'global');
      if (resetError) {
        console.error('Reset state DB error:', resetError);
        alert('Lỗi Reset GameState: ' + resetError.message);
      }

      // 3. Xóa và khởi tạo lại players
      console.log('Cleaning up players table...');
      const { error: delErr } = await supabase
        .from('players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (delErr) {
        console.error('Delete players DB error:', delErr);
        alert('Lỗi Xóa Players: ' + delErr.message);
      }

      console.log('Re-inserting initial players...');
      const { data: newPlayers, error: insertErr } = await supabase
        .from('players')
        .insert(INITIAL_PLAYERS)
        .select();
      
      if (insertErr) {
        console.error('Insert players DB error:', insertErr);
        alert('Lỗi Chèn Players: ' + insertErr.message);
      }
      
      if (newPlayers) {
        setPlayers(newPlayers as Player[]);
        console.log('Reset complete, players re-initialized.');
      }
    } catch (err) {
      console.error('Unexpected reset error:', err);
      alert('Đã xảy ra lỗi không xác định khi Reset.');
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#E4E3E0] flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#141414]/10 border-t-[#141414] rounded-full animate-spin mx-auto mb-4" />
          <p className="uppercase tracking-widest text-xs">Initializing Hegemony...</p>
        </div>
      </div>
    );
  }

  // ── Config Error ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white border border-red-200 p-8 shadow-xl">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <ShieldAlert className="w-8 h-8" />
            <h2 className="text-xl font-bold uppercase tracking-tight">Configuration Error</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6 font-mono">{error}</p>
          <div className="p-4 bg-gray-50 rounded border border-gray-200 text-[10px] font-mono leading-relaxed">
            <p className="font-bold mb-2">Required SQL for Supabase:</p>
            <pre className="whitespace-pre-wrap mb-4">
{`CREATE TABLE game_state (
  id TEXT PRIMARY KEY,
  round INTEGER,
  eh INTEGER,
  ss INTEGER,
  grid_limit INTEGER,
  current_event TEXT,
  is_game_over BOOLEAN,
  waiting_for_admin_confirm BOOLEAN DEFAULT false,
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

ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;`}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // ── Select Role ───────────────────────────────────────────────────────────
  if (view === 'SELECT_ROLE') {
    return (
      <div className="min-h-screen bg-[#86efac] text-[#1e3a8a] p-4 md:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <CityBackground />
        {showAdminModal && (
          <AdminPasswordModal
            onSuccess={() => { setShowAdminModal(false); setAdminAuthenticated(true); setView('ADMIN'); }}
            onCancel={() => setShowAdminModal(false)}
          />
        )}
        <div className="max-w-4xl w-full z-10">
          <header className="text-center mb-8 bg-white/90 p-8 rounded-3xl game-border-blue">
            <h1 className="text-5xl md:text-7xl font-mono font-bold uppercase tracking-tighter mb-4 text-blue-600 drop-shadow-lg">
              The Energy Hegemony
            </h1>
            <p className="font-mono text-sm font-bold opacity-60 uppercase tracking-[0.3em]">Select your sector to begin simulation</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="game-border-yellow p-8 bg-white rounded-3xl hover:bg-yellow-400 transition-all cursor-pointer group"
              onClick={handleAdminClick}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-4 group-hover:text-yellow-900">System Monitor</div>
              <h2 className="text-3xl font-mono font-bold mb-4 group-hover:text-yellow-900">Admin Dashboard</h2>
              <p className="text-sm font-medium opacity-70 mb-6 group-hover:text-yellow-900">Oversee the entire energy grid, monitor indices, and execute rounds.</p>
              <div className="text-xs font-mono font-bold uppercase border-2 border-current inline-flex items-center gap-2 px-6 py-3 rounded-xl group-hover:bg-yellow-900 group-hover:text-white">
                <Lock className="w-3 h-3" /> Enter Command Center
              </div>
            </motion.div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(p => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={p.id}
                  onClick={() => handleSelectRole(p)}
                  className="game-border-blue p-6 bg-white rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group"
                >
                  <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1 group-hover:text-white/50">{ROLE_PREFIX[p.role]}</div>
                  <div className="text-xl font-mono font-bold leading-tight">
                    {p.custom_name?.trim() || p.group_name}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-mono font-bold uppercase opacity-30 group-hover:opacity-100">
                    <Pencil className="w-3 h-3" /> Join &amp; Set Name
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Game Guide Section */}
          <GameGuide />

          <footer className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-full mt-6">
            <p className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest">A Simulation of State Monopoly &amp; Infrastructure — Lênin's Theory Applied</p>
          </footer>
        </div>
      </div>
    );
  }

  // ── Name Input Screen ─────────────────────────────────────────────────────
  if (view === 'NAME_INPUT' && pendingPlayer) {
    const prefix = ROLE_PREFIX[pendingPlayer.role];
    return (
      <div className="min-h-screen bg-[#86efac] flex items-center justify-center p-8 font-sans relative overflow-hidden">
        <CityBackground />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md z-10"
        >
          <div className="bg-white rounded-3xl p-8 game-border-blue text-blue-900">
            <div className="text-[10px] font-mono font-bold uppercase opacity-40 tracking-widest mb-2">Đặt tên cho nhóm của bạn</div>
            <h2 className="text-3xl font-mono font-bold mb-6 text-blue-600">{prefix}</h2>

            {/* Preview */}
            <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 mb-6 text-center">
              <div className="text-[9px] font-mono font-bold uppercase opacity-40 mb-1">Preview tên hiển thị</div>
              <div className="text-xl font-mono font-bold text-blue-700">
                {prefix} — {customNameInput.trim() || pendingPlayer.group_name}
              </div>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="text-[10px] font-mono font-bold uppercase opacity-50 block mb-2">Tên nhóm (tuỳ chọn)</label>
              <input
                ref={nameInputRef}
                type="text"
                value={customNameInput}
                onChange={e => setCustomNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
                placeholder={`VD: Cloudy, Phoenix, Delta...`}
                maxLength={24}
                className="w-full bg-gray-50 border-2 border-blue-200 rounded-xl px-4 py-3 font-mono text-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <div className="text-right text-[10px] font-mono opacity-30 mt-1">{customNameInput.length}/24</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setView('SELECT_ROLE')}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-mono font-bold text-sm text-gray-400 hover:bg-gray-50 transition-all"
              >
                ← Quay lại
              </button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirmName}
                className="flex-2 flex-grow py-3 bg-blue-600 text-white rounded-xl font-mono font-bold text-sm hover:bg-blue-500 transition-all border-2 border-blue-700 shadow-[0_4px_0_#1e3a8a]"
              >
                Vào game →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Admin / Player Views ──────────────────────────────────────────────────
  return (
    <>
      {view === 'ADMIN' ? (
        <AdminDashboard
          gameState={gameState}
          players={players}
          onReset={handleReset}
          onProcessRound={handleProcessRound}
          onConfirmNextRound={handleConfirmNextRound}
          onStartGame={handleStartGame}
          onAddPlayer={handleAddPlayer}
        />
      ) : currentPlayer ? (
        <PlayerControls
          player={players.find(p => p.id === currentPlayer.id) || currentPlayer}
          gameState={gameState}
          players={players}
          onSelectOption={handleSelectOption}
          roundTimer={roundTimer}
        />
      ) : null}
    </>
  );
}

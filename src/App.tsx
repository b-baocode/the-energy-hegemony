
import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { GameState, Player, ROLE_PREFIX, getDisplayName } from './types/game';
import { INITIAL_GAME_STATE, INITIAL_PLAYERS, processRound, triggerEvent } from './lib/gameEngine';
import { AdminDashboard } from './components/AdminDashboard';
import { PlayerControls } from './components/PlayerControls';
import { ShieldAlert, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground } from './components/VisualEffects';

// ── In-App Guide Component ────────────────────────────────────────────────────
const GameGuide: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'play' | 'theory'>('play');

  return (
    <div className="w-full max-w-4xl z-10 mt-8">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 game-border-blue hover:bg-white transition-all"
      >
        <span className="font-mono font-bold text-blue-700 uppercase tracking-widest text-sm">
          📖 Hướng Dẫn Chơi &amp; Lý Thuyết
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
                ].map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key as 'play' | 'theory')}
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
                      <b>The Energy Hegemony</b> mô phỏng thị trường điện lực. 7 nhóm (G1–G7) đưa ra quyết định mỗi vòng.
                      Trò chơi kết thúc sau <b>20 vòng</b> hoặc khi <b>EH &lt; 20%</b> hoặc <b>SS &lt; 20%</b>.
                    </p>
                  </div>

                  {/* Roles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
                      <div className="text-xs font-mono font-bold uppercase text-yellow-700 mb-2">⚡ GENCO (G1, G2, G3)</div>
                      <p className="text-xs leading-relaxed">Nhà sản xuất điện. Mục tiêu: tối đa <b>Balance</b>. Cạnh tranh giành doanh thu từ lưới điện.</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="bg-yellow-100 rounded px-2 py-1">OP-01: Tăng công suất → +700$ flat</div>
                        <div className="bg-yellow-100 rounded px-2 py-1">OP-02: Bảo trì → chi phí -50%</div>
                        <div className="bg-yellow-100 rounded px-2 py-1"><b>OP-03: Lobby EVN → chiếm 60% doanh thu!</b></div>
                        <div className="bg-yellow-100 rounded px-2 py-1">OP-04: Chuyển đổi Xanh → +15 Green Points</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-300">
                      <div className="text-xs font-mono font-bold uppercase text-blue-700 mb-2">🏭 CONSUMER (G4, G5, G6)</div>
                      <p className="text-xs leading-relaxed">Doanh nghiệp / Công nghiệp. Mục tiêu: tối đa <b>GDP Score × 2 + Balance</b>.</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="bg-blue-100 rounded px-2 py-1">OP-01: Mở rộng xưởng → GDP +120, -150$</div>
                        <div className="bg-blue-100 rounded px-2 py-1">OP-02: Tiết kiệm điện → +250$, SS +5</div>
                        <div className="bg-blue-100 rounded px-2 py-1">OP-03: Bãi công → GDP +60, SS -8</div>
                        <div className="bg-blue-100 rounded px-2 py-1">OP-04: Hỗ trợ hạ tầng → GDP +40, Grid +80</div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
                      <div className="text-xs font-mono font-bold uppercase text-red-700 mb-2">🏛️ EVN (G7) — Nhà nước</div>
                      <p className="text-xs leading-relaxed">Độc quyền lưới. Kiểm soát Grid Limit. Quyết định ảnh hưởng trực tiếp CONSUMER.</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="bg-red-100 rounded px-2 py-1">OP-01: Nâng cấp lưới → Grid +25%</div>
                        <div className="bg-red-100 rounded px-2 py-1"><b>OP-02: Áp trần giá → SS +25, CONSUMER +100$</b></div>
                        <div className="bg-red-100 rounded px-2 py-1"><b>OP-03: Tăng phí → +600$, CONSUMER -200$</b></div>
                        <div className="bg-red-100 rounded px-2 py-1">OP-04: Cắt điện → Grid +150, SS -15</div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

        // Nếu đúng 7 nhóm → dùng data hiện tại
        if (playersData && playersData.length === 7) {
          setPlayers(playersData);
        } else {
          // Xóa hết rác cũ (duplicate / thiếu) rồi insert lại đúng 7 nhóm
          await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          const { data: newPlayers, error: insertError } = await supabase
            .from('players').insert(INITIAL_PLAYERS).select();
          if (insertError) throw insertError;
          setPlayers(newPlayers);
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
        setGameState(payload.new as GameState);
      }).subscribe();

    const playersSub = supabase
      .channel('players_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload: any) => {
        setPlayers(prev => {
          const index = prev.findIndex(p => p.id === payload.new.id);
          if (index === -1) return [...prev, payload.new as Player];
          const next = [...prev];
          next[index] = payload.new as Player;
          return next;
        });
      }).subscribe();

    return () => {
      stateSub.unsubscribe();
      playersSub.unsubscribe();
    };
  }, []);

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
    if (nextState.round % 3 === 0) {
      const eventImpact = triggerEvent(nextState);
      finalState = { ...nextState, ...eventImpact };
    }

    const { error: stateError } = await supabase
      .from('game_state').update(finalState).eq('id', 'global');
    if (stateError) {
      console.error('State update error:', stateError);
      alert('Failed to update game state. Check Supabase RLS policies.');
    }

    const { error: playersError } = await supabase.from('players').upsert(updatedPlayers);
    if (playersError) {
      console.error('Players update error:', playersError);
      alert('Failed to update players. Check Supabase RLS policies.');
    }
  };

  const handleReset = async () => {
    // Reset game state
    await supabase.from('game_state').update(INITIAL_GAME_STATE).eq('id', 'global');
    // Xóa hết players cũ (tránh duplicate) rồi insert lại đúng 7 nhóm
    await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('players').insert(INITIAL_PLAYERS);
    setCurrentPlayer(null);
    setView('SELECT_ROLE');
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
              onClick={() => setView('ADMIN')}
            >
              <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-4 group-hover:text-yellow-900">System Monitor</div>
              <h2 className="text-3xl font-mono font-bold mb-4 group-hover:text-yellow-900">Admin Dashboard</h2>
              <p className="text-sm font-medium opacity-70 mb-6 group-hover:text-yellow-900">Oversee the entire energy grid, monitor indices, and execute rounds.</p>
              <div className="text-xs font-mono font-bold uppercase border-2 border-current inline-block px-6 py-3 rounded-xl group-hover:bg-yellow-900 group-hover:text-white">Enter Command Center</div>
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
        />
      ) : currentPlayer ? (
        <PlayerControls
          player={players.find(p => p.id === currentPlayer.id) || currentPlayer}
          gameState={gameState}
          players={players}
          onSelectOption={handleSelectOption}
        />
      ) : null}
    </>
  );
}

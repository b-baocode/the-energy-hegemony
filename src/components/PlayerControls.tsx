
import React, { useState } from 'react';
import { Player, GameOption, GENCO_OPTIONS, CONSUMER_OPTIONS, EVN_OPTIONS, GameState, getOptionName, getDisplayName, ROLE_PREFIX } from '../types/game';
import { Wallet, TrendingUp, Leaf, Zap, CheckCircle2, Eye, EyeOff, Activity, Users, BatteryCharging, ShieldAlert, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';
import { SCENARIOS } from '../lib/gameEngine';

interface PlayerControlsProps {
  player: Player;
  gameState: GameState;
  onSelectOption: (optionId: number) => void;
  players: Player[];
  roundTimer: number;
}

const ROLE_COLOR: Record<string, string> = {
  GENCO: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  CONSUMER: 'bg-blue-100 text-blue-800 border-blue-400',
  EVN: 'bg-red-100 text-red-800 border-red-400',
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({ player, gameState, onSelectOption, players, roundTimer }) => {
  const [effects, setEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const options: GameOption[] = player.role === 'GENCO' ? GENCO_OPTIONS : player.role === 'CONSUMER' ? CONSUMER_OPTIONS : EVN_OPTIONS;

  const handleOptionClick = (id: number) => {
    const newEffect = {
      id: Date.now(),
      icon: player.role === 'GENCO' ? '⚡' : player.role === 'CONSUMER' ? '🏭' : '🏛️',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setEffects(prev => [...prev, newEffect]);
    onSelectOption(id);
  };

  // ── "Decision Locked" screen — waiting for others ──────────────────────────
  if (player.is_ready) {
    // Other players who are also ready (can now see their choices)
    const otherReady = players.filter(p => p.id !== player.id && p.is_ready);
    const otherPending = players.filter(p => p.id !== player.id && !p.is_ready);
    const myOptionName = getOptionName(player.role, player.last_option);

    return (
      <div className="min-h-screen bg-[#1e3a8a] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
        <CityBackground />
        <div className="w-full max-w-md z-10 space-y-4">
          {/* Locked card */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl game-border-blue text-blue-700 text-center"
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500 animate-bounce" />
            <h2 className="text-3xl font-mono font-bold uppercase mb-1">Đã chốt!</h2>
            <p className="text-sm font-mono text-blue-400 uppercase tracking-widest mb-3">Lựa chọn của bạn:</p>
            <div className="bg-blue-50 rounded-2xl px-6 py-3 inline-block border-2 border-blue-200">
              <span className="text-xl font-mono font-bold text-blue-800">{myOptionName}</span>
            </div>
            <p className="mt-4 text-xs font-mono opacity-40 uppercase tracking-widest">
              Đang chờ vòng {gameState.round} kết thúc...
            </p>
          </motion.div>

          {/* Decisions reveal — only visible AFTER self is ready */}
          {otherReady.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-green-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-white/60 tracking-widest">
                  Các nhóm đã sẵn sàng
                </h3>
              </div>
              <div className="space-y-2">
                {otherReady.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="font-mono font-bold text-sm">{p.custom_name?.trim() || p.group_name}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${ROLE_COLOR[p.role]}`}>{p.role}</span>
                    </div>
                    <span className="text-xs font-mono text-green-300 font-bold">
                      {getOptionName(p.role, p.last_option)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pending players */}
          {otherPending.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <EyeOff className="w-4 h-4 text-white/40" />
                <h3 className="text-xs font-mono font-bold uppercase text-white/40 tracking-widest">
                  Chưa quyết định ({otherPending.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {otherPending.map(p => (
                  <div key={p.id} className="flex items-center gap-1 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                    <span className="font-mono text-sm text-white/50">{p.custom_name?.trim() || p.group_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Main selection screen ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-4 md:p-6 font-sans relative overflow-hidden">
      <CityBackground />
      <AnimatePresence>
        {effects.map(effect => (
          <FloatingIcon key={effect.id} {...effect} />
        ))}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-6 bg-white/90 p-4 rounded-2xl game-border-blue">
        <div>
          <h1 className="text-2xl font-mono font-bold text-blue-600">{player.custom_name?.trim() || player.group_name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
            <div className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded inline-block border ${ROLE_COLOR[player.role]}`}>
              {player.role} Sector
            </div>
            <div className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              Công thức: {player.role === 'GENCO' ? 'Balance + GP×20' : player.role === 'CONSUMER' ? 'GDP×2 + Balance' : 'Balance + (EH+SS)×10'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className={`flex flex-col items-center px-4 py-2 rounded-xl border-2 text-center transition-all ${
            roundTimer <= 10 ? 'bg-red-500 border-red-700 text-white animate-pulse' : 'bg-white border-blue-200 text-blue-700'
          }`}>
            <Timer className="w-3 h-3 mb-0.5 opacity-70" />
            <div className="text-xl font-mono font-bold leading-none">{roundTimer}s</div>
          </div>
          <div className="bg-yellow-400 px-4 py-2 rounded-xl game-border-yellow text-center">
            <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
            <div className="text-xl font-mono font-bold text-yellow-900">{gameState.round}<span className="text-sm opacity-50">/20</span></div>
          </div>
        </div>
      </header>

      {/* Scenario Banner */}
      {(() => {
        const s = SCENARIOS[(gameState.round - 1) % SCENARIOS.length];
        return (
          <div className={`mb-4 px-4 py-2 rounded-xl text-xs font-mono font-bold border-2 ${
            s.multiplier >= 1.3 ? 'bg-green-50 border-green-300 text-green-800' :
            s.multiplier >= 1.0 ? 'bg-blue-50 border-blue-200 text-blue-800' :
            s.multiplier >= 0.6 ? 'bg-orange-50 border-orange-200 text-orange-800' :
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            🎬 Vòng {gameState.round}: <span className="font-bold">{s.name}</span>
            <span className="ml-2 opacity-60">(×{s.multiplier.toFixed(1)}) — {s.description}</span>
          </div>
        );
      })()}

        {/* Stats Grid - Player Specific */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-3 rounded-2xl game-border-green flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 opacity-50 mb-1">
            <Wallet className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-mono font-bold uppercase">Balance</span>
          </div>
          <div className="text-xl font-mono font-bold text-green-600">${Math.round(player.balance).toLocaleString()}</div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-3 rounded-2xl game-border-blue flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 opacity-50 mb-1">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-mono font-bold uppercase">GDP Score</span>
          </div>
          <div className="text-xl font-mono font-bold text-blue-600">{Math.round(player.gdp_score).toLocaleString()}</div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-3 rounded-2xl game-border-yellow flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 opacity-50 mb-1">
            <Leaf className="w-3 h-3 text-yellow-600" />
            <span className="text-[10px] font-mono font-bold uppercase">Green Pts</span>
          </div>
          <div className="text-xl font-mono font-bold text-yellow-600">{player.green_points}</div>
        </motion.div>
      </div>

      {/* Public Indicators: Economy Health, Social Stability, Grid Capacity */}
      <div className="space-y-3 mb-6">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-2xl border-4 border-red-500 shadow-[4px_4px_0_0_rgba(239,68,68,1)] flex flex-col"
        >
          <div className="flex justify-between items-center mb-1">
            <Activity className="w-6 h-6 text-red-500" />
            <span className="text-[9px] font-mono font-bold uppercase text-red-400 tracking-widest">Economy Health</span>
          </div>
          <div className="text-3xl font-mono font-bold text-red-600 mb-2">{gameState.eh}%</div>
          <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-red-500 h-full rounded-full" 
              initial={{ width: 0 }} animate={{ width: `${gameState.eh}%` }} transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-2xl border-4 border-blue-500 shadow-[4px_4px_0_0_rgba(59,130,246,1)] flex flex-col"
        >
          <div className="flex justify-between items-center mb-1">
            <Users className="w-6 h-6 text-blue-500" />
            <span className="text-[9px] font-mono font-bold uppercase text-blue-400 tracking-widest">Social Stability</span>
          </div>
          <div className="text-3xl font-mono font-bold text-blue-600 mb-2">{gameState.ss}%</div>
          <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-full rounded-full" 
              initial={{ width: 0 }} animate={{ width: `${gameState.ss}%` }} transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-2xl border-4 border-yellow-500 shadow-[4px_4px_0_0_rgba(234,179,8,1)] flex flex-col"
        >
          <div className="flex justify-between items-center mb-1">
            <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-[9px] font-mono font-bold uppercase text-yellow-500 tracking-widest">Grid Capacity</span>
          </div>
          <div className="text-3xl font-mono font-bold text-yellow-600">{gameState.grid_limit}</div>
          <div className="text-[10px] font-mono text-yellow-600/60 font-bold max-w-full truncate">MW Transmission Limit</div>
        </motion.div>
      </div>

      {/* Event Forecast Banner */}
      <AnimatePresence>
        {gameState.next_event_prediction && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-r-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10"><Zap className="w-16 h-16" /></div>
              <div className="flex gap-3">
                <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <div className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest mb-1 shadow-sm">⚠️ DỰ BÁO VÒNG TỚI ({gameState.round + 1})</div>
                  <div className="text-sm font-bold text-orange-900 leading-tight">Cảnh báo: {gameState.next_event_prediction}</div>
                  <div className="text-xs text-orange-700 mt-1">Hãy chuẩn bị chiến lược đối phó ngay từ vòng này.</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="mb-4">
        <h2 className="text-[10px] font-mono font-bold uppercase opacity-50 mb-3 tracking-widest text-center">Chọn Chiến Lược Vòng {gameState.round}</h2>
        <div className="grid grid-cols-1 gap-3">
          {options.map(opt => (
            <motion.button
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className="group relative bg-white hover:bg-blue-600 text-left p-5 rounded-2xl game-border-blue transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-lg font-mono font-bold group-hover:text-white">{opt.name}</span>
                <span className="text-[10px] font-mono font-bold bg-blue-100 group-hover:bg-blue-800 group-hover:text-white px-2 py-1 rounded">OP-0{opt.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 group-hover:bg-blue-700 p-2 rounded-lg transition-colors">
                  <div className="text-[9px] font-mono font-bold uppercase opacity-40 group-hover:text-white/50">Cá nhân</div>
                  <div className="text-xs font-bold group-hover:text-white">{opt.personal_impact}</div>
                </div>
                <div className="bg-gray-50 group-hover:bg-blue-700 p-2 rounded-lg transition-colors">
                  <div className="text-[9px] font-mono font-bold uppercase opacity-40 group-hover:text-white/50">Hệ thống</div>
                  <div className="text-xs font-bold group-hover:text-white">{opt.system_impact}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Current event warning */}
      <AnimatePresence>
        {gameState.current_event && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 p-4 bg-red-100 border-4 border-red-500 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-red-500 mb-0.5">⚡ Sự Kiện Đặc Biệt!</div>
                <div className="text-sm font-bold text-red-900">{gameState.current_event}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detailed Strategy Guide ─────────────────────────────────────────── */}
      <div className="mt-8 bg-white rounded-2xl game-border-blue p-4">
        <h3 className="text-sm font-mono font-bold uppercase text-blue-600 mb-4 text-center tracking-widest">
          📖 Hướng Dẫn Chi Tiết — {player.role}
        </h3>

        {player.role === 'GENCO' && (
          <div className="space-y-4 text-sm">
            <div className="text-xs font-mono text-gray-500 mb-3 text-center">
              🎯 <b>Mục tiêu:</b> Tối đa hóa <span className="text-green-600 font-bold">Balance + Green Points × 20</span>
            </div>

            {/* OP-01 */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-yellow-800">OP-01: Tăng công suất</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-bold">💰 Tiền nhanh</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• +$350 bonus cố định</li>
                    <li>• Sản lượng phát điện +40%</li>
                    <li>• Doanh thu cao hơn nhiều</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• SS giảm <b>-5</b> (khai thác môi trường)</li>
                    <li>• Spam nhiều → SS sụp → mất 70% điểm</li>
                    <li>• Không có Green Points</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang cao (trên 60), cần tiền gấp, hoặc kịch bản có hệ số cao (×1.3+).
              </div>
            </div>

            {/* OP-02 */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-blue-800">OP-02: Bảo trì máy</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">🛡️ An toàn</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Chi phí giảm 50%</li>
                    <li>• Thưởng uy tín +$150</li>
                    <li>• SS tăng <b>+3</b> (dân tin tưởng)</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Lợi nhuận trung bình</li>
                    <li>• Không có Green Points</li>
                    <li>• Không chiếm ưu thế doanh thu</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang thấp (dưới 50), muốn chơi an toàn, hoặc kịch bản hệ số thấp.
              </div>
            </div>

            {/* OP-03 */}
            <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-purple-800">OP-03: Lobby EVN</span>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-bold">🤝 Quan hệ</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Chiếm <b>60%</b> tổng doanh thu GENCO</li>
                    <li>• +3 Green Points (×20 = 60 điểm)</li>
                    <li>• Rất mạnh khi sản lượng cao</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Phí lobby -$150</li>
                    <li>• Các GENCO khác chỉ còn 40%</li>
                    <li>• Chỉ 1 GENCO lobby được/vòng</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Kịch bản hệ số cao (×1.5+), muốn chèn ép GENCO đối thủ.
              </div>
            </div>

            {/* OP-04 */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-green-800">OP-04: Chuyển đổi Xanh</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-bold">🌿 Dài hạn</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• <b>+15 Green Points</b> (×20 = 300 điểm!)</li>
                    <li>• +$250 bonus</li>
                    <li>• SS tăng <b>+5</b> (bền vững)</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Tiền mặt không cao bằng OP-01</li>
                    <li>• Không chiếm ưu thế doanh thu</li>
                    <li>• Hiệu quả chủ yếu cuối game</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Chơi dài hạn — 10 vòng OP-04 = 3,000 điểm từ GP. Rất mạnh nếu game đi đủ 20 vòng!
              </div>
            </div>
          </div>
        )}

        {player.role === 'CONSUMER' && (
          <div className="space-y-4 text-sm">
            <div className="text-xs font-mono text-gray-500 mb-3 text-center">
              🎯 <b>Mục tiêu:</b> Tối đa hóa <span className="text-blue-600 font-bold">GDP × 2 + Balance</span>
            </div>

            {/* OP-01 */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-yellow-800">OP-01: Mở rộng xưởng</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-bold">📈 GDP cao</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• GDP tăng cao nhất (+120 gốc + bonus)</li>
                    <li>• GDP × 2 trong công thức → rất giá trị</li>
                    <li>• Mở rộng sản xuất = lợi thế dài hạn</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Tiền mất <b>-$100</b></li>
                    <li>• Cầu điện tăng +20%</li>
                    <li>• EH giảm nếu Grid không đủ</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Grid còn dư nhiều, EH còn cao, muốn tăng điểm nhanh.
              </div>
            </div>

            {/* OP-02 */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-blue-800">OP-02: Tiết kiệm điện</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">💰 Kiếm tiền</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Tiền <b>+$180</b></li>
                    <li>• SS tăng <b>+8</b> (rất cao!)</li>
                    <li>• Cầu điện giảm -15% → giúp hệ thống</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• GDP chỉ +20 (thấp nhất)</li>
                    <li>• Không mở rộng được sản xuất</li>
                    <li>• Thua GDP so với đối thủ</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang thấp (dưới 40), cần cứu hệ thống, hoặc cần tiền gấp.
              </div>
            </div>

            {/* OP-03 */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-red-800">OP-03: Bãi công đòi giá</span>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">✊ Đấu tranh</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• GDP +60 (trung bình)</li>
                    <li>• Chi phí thấp chỉ -$50</li>
                    <li>• Đại diện quyền lợi công nhân</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• SS giảm <b>-8</b> (mâu thuẫn giai cấp)</li>
                    <li>• Có thể gây sụp đổ nếu SS thấp</li>
                    <li>• Không tốt cho hệ thống</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang cao, EVN tăng phí và bạn muốn phản đối.
              </div>
            </div>

            {/* OP-04 */}
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-green-800">OP-04: Hỗ trợ hạ tầng</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded font-bold">🔌 Nâng Grid</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Grid <b>+100 MW</b></li>
                    <li>• EH <b>+4</b></li>
                    <li>• GDP +70 (khá tốt)</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Tiền mất <b>-$200</b> (cao nhất)</li>
                    <li>• Hy sinh cá nhân cho hệ thống</li>
                    <li>• Lợi ích chia đều cho mọi người</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Grid sắp đầy (gần 1000 MW), EH đang thấp, cần cứu hệ thống.
              </div>
            </div>

            {/* EVN Impact Warning */}
            <div className="bg-orange-50 border-2 border-orange-400 rounded-xl p-3">
              <div className="font-mono font-bold text-orange-800 mb-2">⚠️ Ảnh hưởng từ EVN:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700">EVN Áp trần giá bán:</div>
                  <div className="text-green-800">Bạn được <b>+$80</b> và <b>+25 GDP</b></div>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700">EVN Tăng phí vận chuyển:</div>
                  <div className="text-red-800">Bạn mất <b>-$150</b> và <b>-15 GDP</b></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {player.role === 'EVN' && (
          <div className="space-y-4 text-sm">
            <div className="text-xs font-mono text-gray-500 mb-3 text-center">
              🎯 <b>Mục tiêu:</b> Tối đa hóa <span className="text-red-600 font-bold">Balance + (EH + SS) × 10</span>
            </div>
            <div className="text-xs bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3 text-center">
              💵 <b>Thu nhập tự động mỗi vòng:</b> Phí truyền tải (realEnergy × 0.15) + Trợ cấp nhà nước <b>+$350</b>
            </div>

            {/* OP-01 */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-yellow-800">OP-01: Nâng cấp lưới</span>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded font-bold">🔌 Hạ tầng</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Grid <b>×1.2</b> (tăng 20%)</li>
                    <li>• Toàn hệ thống hưởng lợi</li>
                    <li>• Tăng phí truyền tải dài hạn</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Chi phí <b>-$900</b> (cao nhất)</li>
                    <li>• Tốn tiền ngay lập tức</li>
                    <li>• Hiệu quả chậm</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Grid đang nghẽn, còn nhiều tiền, muốn đầu tư dài hạn.
              </div>
            </div>

            {/* OP-02 */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-blue-800">OP-02: Áp trần giá bán</span>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">👥 Vì dân</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• SS <b>+15</b> (rất cao!)</li>
                    <li>• Mỗi CONSUMER +$80 & +25 GDP</li>
                    <li>• SS × 10 → +150 điểm cuối</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• Chi phí <b>-$700</b></li>
                    <li>• Hy sinh lợi nhuận</li>
                    <li>• Giúp CONSUMER cạnh tranh</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang thấp (dưới 50), cần cứu hệ thống, hoặc chơi chiến lược "vì cộng đồng".
              </div>
            </div>

            {/* OP-03 */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-red-800">OP-03: Tăng phí vận chuyển</span>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded font-bold">💸 Thu tô</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Tiền <b>+$350</b> ngay lập tức</li>
                    <li>• Tận dụng quyền lực độc quyền</li>
                    <li>• Tiền mặt = an toàn</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• SS <b>-8</b></li>
                    <li>• Mỗi CONSUMER -$150 & -15 GDP</li>
                    <li>• SS × 10 → mất 80 điểm cuối</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> SS đang cao (trên 70), cần tiền gấp. ⚠️ Cẩn thận: +$350 nhưng mất 80 điểm từ SS!
              </div>
            </div>

            {/* OP-04 */}
            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-orange-800">OP-04: Cắt điện luân phiên</span>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded font-bold">⚡ Khẩn cấp</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 rounded-lg p-2">
                  <div className="font-bold text-green-700 mb-1">✅ Ưu điểm:</div>
                  <ul className="text-green-800 space-y-0.5">
                    <li>• Grid <b>+200 MW</b> (cao nhất!)</li>
                    <li>• Không tốn tiền</li>
                    <li>• Giải pháp khẩn cấp khi Grid nghẽn</li>
                  </ul>
                </div>
                <div className="bg-red-100 rounded-lg p-2">
                  <div className="font-bold text-red-700 mb-1">❌ Nhược điểm:</div>
                  <ul className="text-red-800 space-y-0.5">
                    <li>• EH <b>-4</b></li>
                    <li>• SS <b>-10</b> (dân bức xúc)</li>
                    <li>• Tổng mất 140 điểm từ EH+SS!</li>
                  </ul>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 italic">
                💡 <b>Khi nào chọn:</b> Grid đã hết, không đủ tiền nâng cấp, EH và SS còn cao để chịu được.
              </div>
            </div>

            {/* EVN Special Note */}
            <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-3">
              <div className="font-mono font-bold text-purple-800 mb-2">🏛️ Vai trò đặc biệt của EVN:</div>
              <ul className="text-xs text-purple-900 space-y-1">
                <li>• Bạn là <b>nhóm duy nhất</b> — không có đối thủ cùng role.</li>
                <li>• Kiểm soát <b>Grid Limit</b> = nút thắt cổ chai của cả hệ thống.</li>
                <li>• Quyết định của bạn <b>ảnh hưởng trực tiếp</b> tới 3 nhóm CONSUMER.</li>
                <li>• Công thức (EH+SS)×10: Nếu giữ EH=100, SS=100 → <b>+2,000 điểm</b>!</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

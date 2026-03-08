
import React, { useState } from 'react';
import { Player, GameOption, GENCO_OPTIONS, CONSUMER_OPTIONS, EVN_OPTIONS, GameState, getOptionName, getDisplayName, ROLE_PREFIX } from '../types/game';
import { Wallet, TrendingUp, Leaf, Zap, CheckCircle2, Eye, EyeOff, Activity, Users, BatteryCharging, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';

interface PlayerControlsProps {
  player: Player;
  gameState: GameState;
  onSelectOption: (optionId: number) => void;
  players: Player[];
}

const ROLE_COLOR: Record<string, string> = {
  GENCO: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  CONSUMER: 'bg-blue-100 text-blue-800 border-blue-400',
  EVN: 'bg-red-100 text-red-800 border-red-400',
};

export const PlayerControls: React.FC<PlayerControlsProps> = ({ player, gameState, onSelectOption, players }) => {
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
          <h1 className="text-2xl font-mono font-bold text-blue-600">{player.group_name}</h1>
          <div className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded inline-block border mt-1 ${ROLE_COLOR[player.role]}`}>
            {player.role} Sector
          </div>
        </div>
        <div className="bg-yellow-400 px-4 py-2 rounded-xl game-border-yellow text-center">
          <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
          <div className="text-xl font-mono font-bold text-yellow-900">{gameState.round}<span className="text-sm opacity-50">/20</span></div>
        </div>
      </header>

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
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GameState, Player, getOptionName, getDisplayName } from '../types/game';
import { computeFinalScore, SCENARIOS } from '../lib/gameEngine';
import { Zap, Heart, Users, Trophy, RefreshCw, Play, ShieldAlert, CheckCircle2, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';

interface AdminDashboardProps {
  gameState: GameState;
  players: Player[];
  onReset: () => void;
  onProcessRound: () => void;
  onConfirmNextRound: () => void;
  onStartGame: () => void;
  onAddPlayer: (role: 'GENCO' | 'CONSUMER') => void;
}

const ROLE_COLOR: Record<string, string> = {
  GENCO: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  CONSUMER: 'bg-blue-100 text-blue-800 border-blue-400',
  EVN: 'bg-red-100 text-red-800 border-red-400',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  gameState, players, onReset, onProcessRound, onConfirmNextRound, onStartGame, onAddPlayer
}) => {
  const [effects, setEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const readyCount = players.filter(p => p.is_ready).length;
  const allReady = readyCount === players.length && players.length > 0;

  // Current scenario (0-indexed by round)
  const scenarioIdx = ((gameState.round - 1) % SCENARIOS.length);
  const currentScenario = SCENARIOS[scenarioIdx];

  useEffect(() => {
    if (gameState.round > 1) {
      const newEffect = {
        id: Date.now(),
        icon: '❤️',
        x: Math.random() * window.innerWidth,
        y: window.innerHeight - 100
      };
      setEffects(prev => [...prev, newEffect]);
      setTimeout(() => {
        setEffects(prev => prev.filter(e => e.id !== newEffect.id));
      }, 1500);
    }
  }, [gameState.eh, gameState.ss]);

  // ── Game Over / Winner Screen ──────────────────────────────────────────────
  if (gameState.is_game_over) {
    const isEarlyCollapse = gameState.round <= 20 && (gameState.eh < 20 || gameState.ss < 20);

    const ranked = [...players]
      .map(p => ({
        ...p,
        rawScore: p.role === 'GENCO' ? Math.round(p.balance + p.green_points * 20)
          : p.role === 'CONSUMER' ? Math.round(p.gdp_score * 2 + p.balance)
          : Math.round(p.balance + (gameState.eh + gameState.ss) * 10),
        finalScore: computeFinalScore(p, gameState)
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
    const winner = ranked[0];

    return (
      <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
        <CityBackground />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-full max-w-2xl z-10"
        >
          {/* Header */}
          <div className={`rounded-3xl p-8 text-center border-4 mb-6 ${isEarlyCollapse ? 'bg-red-500 border-red-800' : 'bg-yellow-400 border-yellow-600'}`}>
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${isEarlyCollapse ? 'text-white' : 'text-yellow-800 fill-yellow-800'}`} />
            <h1 className={`text-5xl font-mono font-bold uppercase mb-2 ${isEarlyCollapse ? 'text-white' : 'text-yellow-900'}`}>
              {isEarlyCollapse ? '💀 Hệ Thống Sụp Đổ!' : 'Game Over'}
            </h1>
            <p className={`text-sm font-mono font-bold uppercase tracking-widest ${isEarlyCollapse ? 'text-red-100' : 'text-yellow-800 opacity-70'}`}>
              {isEarlyCollapse
                ? `Sụp đổ tại Vòng ${gameState.round - 1} — ${gameState.eh < 20 ? 'EH' : 'SS'} < 20%`
                : 'Vòng 20 hoàn thành — Kết thúc mô phỏng'}
            </p>
          </div>

          {/* Penalty Banner */}
          {isEarlyCollapse && (
            <motion.div
              initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="bg-red-900/80 border-2 border-red-400 rounded-2xl p-4 mb-4 text-center"
            >
              <div className="text-red-300 font-mono text-xs uppercase tracking-widest mb-1">⚠️ Án Phạt Sụp Đổ Sớm (v4.1)</div>
              <div className="text-white text-sm font-bold">GENCO & CONSUMER: điểm × 0.3 | EVN: điểm × 0.5</div>
              <div className="text-red-200 text-[10px] mt-1 italic">Hệ thống sụp đổ khiến tài sản bốc hơi nhanh chóng.</div>
            </motion.div>
          )}

          {/* Winner */}
          <div className="bg-white rounded-3xl p-6 border-4 border-green-500 mb-4 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <div className="text-xs font-mono font-bold uppercase text-green-600 mb-1 tracking-widest">🏆 Người chiến thắng</div>
            <div className="text-4xl font-mono font-bold text-blue-700">{winner.custom_name?.trim() || winner.group_name}</div>
            <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border-2 ${ROLE_COLOR[winner.role]}`}>{winner.role}</div>
            <div className="text-3xl font-mono font-bold text-green-600 mt-3">{winner.finalScore.toLocaleString()} pts</div>
          </div>

          {/* Full Ranking */}
          <div className="bg-white/90 rounded-2xl p-6 border-4 border-blue-300">
            <h2 className="text-xs font-mono font-bold uppercase opacity-50 mb-4 tracking-widest">Bảng Xếp Hạng Cuối</h2>
            <div className="space-y-2">
              {ranked.map((p, idx) => (
                <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border-2 ${idx === 0 ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-gray-300 w-8">#{idx + 1}</span>
                    <div>
                      <div className="font-bold">{p.custom_name?.trim() || p.group_name}</div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${ROLE_COLOR[p.role]}`}>{p.role}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-700 text-lg">{p.finalScore.toLocaleString()} pts</div>
                    {isEarlyCollapse && p.role !== 'EVN' && (
                      <div className="text-[10px] font-mono text-red-400 line-through">{p.rawScore.toLocaleString()}</div>
                    )}
                    <div className="text-[10px] font-mono opacity-50">
                      {p.role === 'GENCO' && `$${Math.round(p.balance)} + 🌿${p.green_points}×20`}
                      {p.role === 'CONSUMER' && `GDP${Math.round(p.gdp_score)}×2 + $${Math.round(p.balance)}`}
                      {p.role === 'EVN' && `$${Math.round(p.balance)} + sys×10`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final EH/SS */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-red-100 border-4 border-red-400 rounded-2xl p-4 text-center">
              <div className="text-xs font-mono font-bold uppercase text-red-600">Economy Health</div>
              <div className="text-4xl font-mono font-bold text-red-700">{gameState.eh}%</div>
            </div>
            <div className="bg-blue-100 border-4 border-blue-400 rounded-2xl p-4 text-center">
              <div className="text-xs font-mono font-bold uppercase text-blue-600">Social Stability</div>
              <div className="text-4xl font-mono font-bold text-blue-700">{gameState.ss}%</div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="mt-6 w-full py-4 bg-white border-4 border-gray-300 rounded-2xl font-mono font-bold uppercase text-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Chơi lại từ đầu
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Admin Confirm Screen — between rounds ─────────────────────────────────
  if (gameState.waiting_for_admin_confirm) {
    // Previous round stats: compare last 2 history items
    const hist = gameState.history;
    const prev = hist.length >= 2 ? hist[hist.length - 2] : null;
    const curr = hist[hist.length - 1];

    return (
      <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-center p-8 font-sans relative overflow-hidden">
        <CityBackground />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg z-10 space-y-4"
        >
          <div className="bg-yellow-400 rounded-3xl p-8 text-center border-4 border-yellow-600">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-3 text-yellow-800" />
            <h1 className="text-4xl font-mono font-bold uppercase text-yellow-900 mb-1">Vòng hoàn thành!</h1>
            <p className="text-sm font-mono text-yellow-800 opacity-70 uppercase tracking-widest">
              Vòng {gameState.round - 1} → Chuẩn bị Vòng {gameState.round}
            </p>
          </div>

          {/* Round Summary */}
          {prev && (
            <div className="bg-white/90 rounded-2xl p-6 border-4 border-blue-300">
              <h2 className="text-xs font-mono font-bold uppercase text-blue-500 mb-4 tracking-widest">Kết Quả Vòng {prev.round}</h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={`rounded-xl p-3 border-2 ${curr.eh < prev.eh ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1">Economy Health</div>
                  <div className="text-2xl font-mono font-bold text-red-600">{curr.eh}%</div>
                  <div className={`text-xs font-mono font-bold mt-1 ${curr.eh < prev.eh ? 'text-red-500' : 'text-green-600'}`}>
                    {curr.eh > prev.eh ? '+' : ''}{curr.eh - prev.eh}
                  </div>
                </div>
                <div className={`rounded-xl p-3 border-2 ${curr.ss < prev.ss ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
                  <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1">Social Stability</div>
                  <div className="text-2xl font-mono font-bold text-blue-600">{curr.ss}%</div>
                  <div className={`text-xs font-mono font-bold mt-1 ${curr.ss < prev.ss ? 'text-red-500' : 'text-green-600'}`}>
                    {curr.ss > prev.ss ? '+' : ''}{curr.ss - prev.ss}
                  </div>
                </div>
                <div className={`rounded-xl p-3 border-2 ${curr.grid_limit > prev.grid_limit ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1">Grid Limit</div>
                  <div className="text-2xl font-mono font-bold text-yellow-600">{curr.grid_limit}</div>
                  <div className={`text-xs font-mono font-bold mt-1 ${curr.grid_limit >= prev.grid_limit ? 'text-green-600' : 'text-red-500'}`}>
                    {curr.grid_limit >= prev.grid_limit ? '+' : ''}{curr.grid_limit - prev.grid_limit} MW
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next scenario preview */}
          {gameState.round <= 20 && (
            <div className="bg-white/90 rounded-2xl p-4 border-4 border-blue-200">
              <div className="text-[10px] font-mono font-bold uppercase text-blue-400 mb-2 tracking-widest">Kịch Bản Vòng {gameState.round}</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-blue-800">{SCENARIOS[(gameState.round - 1) % SCENARIOS.length].name}</div>
                  <div className="text-xs text-gray-500 mt-1">{SCENARIOS[(gameState.round - 1) % SCENARIOS.length].description}</div>
                </div>
                <span className={`font-mono font-bold text-lg px-3 py-1 rounded-xl border-2 ${
                  SCENARIOS[(gameState.round - 1) % SCENARIOS.length].multiplier >= 1.3 ? 'bg-green-100 text-green-700 border-green-300' :
                  SCENARIOS[(gameState.round - 1) % SCENARIOS.length].multiplier >= 1.0 ? 'bg-blue-100 text-blue-700 border-blue-300' :
                  SCENARIOS[(gameState.round - 1) % SCENARIOS.length].multiplier >= 0.6 ? 'bg-orange-100 text-orange-700 border-orange-300' :
                  'bg-red-100 text-red-700 border-red-300'
                }`}>
                  ×{SCENARIOS[(gameState.round - 1) % SCENARIOS.length].multiplier.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirmNextRound}
            className="w-full py-6 bg-green-500 text-white rounded-2xl font-mono font-bold uppercase text-xl border-4 border-green-700 shadow-[0_8px_0_#166534] hover:bg-green-400 flex items-center justify-center gap-3"
          >
            <ChevronRight className="w-6 h-6 fill-white" />
            Bắt Đầu Vòng {gameState.round}
          </motion.button>

          <button
            onClick={onReset}
            className="w-full py-3 bg-white/10 border-2 border-white/20 rounded-xl font-mono font-bold uppercase text-sm text-white/60 hover:bg-white/20 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Reset Game
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Normal Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#86efac] text-[#1e3a8a] p-4 md:p-8 font-sans relative overflow-hidden">
      <CityBackground />
      <AnimatePresence>
        {effects.map(effect => (
          <FloatingIcon key={effect.id} {...effect} />
        ))}
      </AnimatePresence>

      {/* Start Game Overlay */}
      <AnimatePresence>
        {!gameState.is_started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#86efac]/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white p-12 rounded-[2.5rem] game-border-blue text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Play className="w-10 h-10 text-blue-600 fill-current ml-1" />
              </div>
              <h2 className="text-4xl font-mono font-bold text-blue-900 mb-4 uppercase tracking-tighter text-center">Hegemony</h2>
              <p className="text-blue-600/60 font-mono text-xs mb-10 uppercase tracking-widest text-center">Sẵn sàng để điều hành hệ thống?</p>
              
              <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 mb-8 text-left">
                <div className="text-[10px] font-mono font-bold text-blue-400 uppercase mb-3 text-center">Tiến độ chuẩn bị</div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-blue-900 uppercase">Nhóm đã join:</span>
                  <span className="text-lg font-mono font-bold text-blue-600">{players.length}</span>
                </div>
                
                {players.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {players.map(p => {
                      const isNamed = !!p.custom_name;
                      return (
                        <div key={p.id} className="flex items-center justify-between text-[11px] font-mono bg-white/50 rounded-lg px-3 py-1.5">
                          <span className={`${isNamed ? 'text-blue-900 font-bold' : 'text-gray-400'}`}>
                            {p.group_name}
                          </span>
                          <span className={`uppercase font-bold ${isNamed ? 'text-green-500' : 'text-orange-400 animate-pulse'}`}>
                            {isNamed ? '✓ Done' : '... Naming'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {players.length > 0 && players.some(p => !p.custom_name) && (
                <div className="mb-6 p-3 bg-orange-50 border-2 border-orange-100 rounded-xl flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-[10px] font-mono text-orange-700 text-left leading-tight uppercase font-bold">
                    Chờ tất cả các nhóm đặt tên xong mới có thể bắt đầu.
                  </p>
                </div>
              )}

              <motion.button
                whileHover={players.length === 0 || players.some(p => !p.custom_name) ? {} : { scale: 1.02 }}
                whileTap={players.length === 0 || players.some(p => !p.custom_name) ? {} : { scale: 0.98 }}
                onClick={onStartGame}
                disabled={players.length === 0 || players.some(p => !p.custom_name)}
                className={`w-full py-5 rounded-2xl font-mono font-bold text-xl uppercase tracking-widest transition-all border-b-4 shadow-lg ${
                  players.length > 0 && players.every(p => p.custom_name)
                    ? 'bg-blue-600 text-white hover:bg-blue-500 border-blue-800'
                    : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                }`}
              >
                Bắt đầu ngay
              </motion.button>
              
              <button 
                onClick={onReset}
                className="mt-6 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                ← Xóa trắng data để join lại
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/90 p-6 game-border-blue rounded-2xl">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-tighter text-blue-600 drop-shadow-sm">
            The Energy Hegemony
          </h1>
          <p className="text-xs font-mono font-bold opacity-60 uppercase tracking-widest">Admin Control Center v4.2</p>
        </div>
        <div className="bg-yellow-400 p-4 game-border-yellow rounded-xl text-center min-w-[100px]">
          <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
          <div className="text-4xl font-mono font-bold text-yellow-900">{gameState.round}</div>
          <div className="text-[9px] font-mono text-yellow-800 opacity-70">/ 20</div>
        </div>
      </header>

      {/* Scenario Card — prominent full-width */}
      <div className={`rounded-2xl p-5 mb-6 border-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${
        currentScenario.multiplier >= 1.3 ? 'bg-green-50 border-green-400' :
        currentScenario.multiplier >= 1.0 ? 'bg-blue-50 border-blue-300' :
        currentScenario.multiplier >= 0.6 ? 'bg-orange-50 border-orange-400' :
        'bg-red-50 border-red-400'
      }`}>
        <div className="flex-1">
          <div className="text-[10px] font-mono font-bold uppercase opacity-50 tracking-widest mb-1">🎬 Kịch Bản Vòng {gameState.round}</div>
          <div className="text-2xl font-mono font-bold text-blue-900 mb-1">{currentScenario.name}</div>
          <div className="text-sm text-gray-600">{currentScenario.description}</div>
        </div>
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className={`text-4xl font-mono font-bold px-5 py-3 rounded-xl border-4 ${
            currentScenario.multiplier >= 1.3 ? 'text-green-700 bg-green-100 border-green-400' :
            currentScenario.multiplier >= 1.0 ? 'text-blue-700 bg-blue-100 border-blue-300' :
            currentScenario.multiplier >= 0.6 ? 'text-orange-700 bg-orange-100 border-orange-400' :
            'text-red-700 bg-red-100 border-red-400'
          }`}>×{currentScenario.multiplier.toFixed(1)}</div>
          <div className="text-[10px] font-mono opacity-60 text-center">
            GENCO: {Math.round(400 * currentScenario.multiplier)} MW
            &nbsp;|&nbsp;
            CONSUMER: {Math.round(300 * currentScenario.multiplier)} MW
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="game-border-red p-6 bg-white rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="relative">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xs font-mono font-bold uppercase opacity-50">Economy Health</span>
          </div>
          <div>
            <div className="text-6xl font-mono font-bold text-red-600">{gameState.eh}%</div>
            <div className="w-full bg-red-100 h-4 mt-2 rounded-full border-2 border-red-600 overflow-hidden">
              <motion.div animate={{ width: `${gameState.eh}%` }} className={`h-full ${gameState.eh < 40 ? 'bg-red-700 animate-pulse' : 'bg-red-500'}`} />
            </div>
            {gameState.eh < 40 && <p className="text-xs font-mono text-red-600 mt-1 font-bold animate-pulse">⚠️ NGUY HIỂM — &lt;20% GAME OVER</p>}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="game-border-blue p-6 bg-white rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <Users className="w-10 h-10 text-blue-500 fill-blue-500" />
            <span className="text-xs font-mono font-bold uppercase opacity-50">Social Stability</span>
          </div>
          <div>
            <div className="text-6xl font-mono font-bold text-blue-600">{gameState.ss}%</div>
            <div className="w-full bg-blue-100 h-4 mt-2 rounded-full border-2 border-blue-600 overflow-hidden">
              <motion.div animate={{ width: `${gameState.ss}%` }} className={`h-full ${gameState.ss < 40 ? 'bg-blue-700 animate-pulse' : 'bg-blue-500'}`} />
            </div>
            {gameState.ss < 40 && <p className="text-xs font-mono text-blue-600 mt-1 font-bold animate-pulse">⚠️ NGUY HIỂM — &lt;20% GAME OVER</p>}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="game-border-yellow p-6 bg-white rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-mono font-bold uppercase opacity-50">Grid Capacity</span>
          </div>
          <div>
            <div className="text-6xl font-mono font-bold text-yellow-600">{gameState.grid_limit}</div>
            <div className="text-xs font-mono font-bold mt-2 opacity-60">MW Transmission Limit</div>
          </div>
        </motion.div>
      </div>

      {/* Decisions Panel + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ── Decision Panel ── */}
        <div className="game-border-blue p-6 bg-white/90 rounded-2xl">
          <div className="flex justify-between items-center mb-4 border-b-2 border-blue-100 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase opacity-50">Quyết Định Vòng {gameState.round}</h2>
            <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full ${allReady ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
              {readyCount}/{players.length} Sẵn sàng
            </span>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {players.map(p => (
              <motion.div layout key={p.id} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${p.is_ready ? 'bg-green-50 border-green-400' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${p.is_ready ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                  <div>
                    <div className="font-bold text-sm">{p.custom_name?.trim() || p.group_name}</div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${ROLE_COLOR[p.role]}`}>{p.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  {p.is_ready ? (
                    <div className="text-xs font-mono font-bold text-blue-700">
                      {getOptionName(p.role, p.last_option)}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-gray-300">Đang suy nghĩ...</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="game-border-blue p-6 bg-white/90 rounded-2xl">
          <h2 className="text-xs font-mono font-bold uppercase opacity-50 mb-6 border-b-2 border-blue-100 pb-2">Live Telemetry</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gameState.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b82f620" vertical={false} />
                <XAxis dataKey="round" stroke="#1e3a8a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#1e3a8a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'monospace' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace' }} />
                <Line type="stepAfter" dataKey="eh" name="Economy" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} />
                <Line type="stepAfter" dataKey="ss" name="Stability" stroke="#3b82f6" strokeWidth={4} strokeDasharray="8 8" dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="game-border-green p-6 bg-white/90 rounded-2xl mb-6">
        <h2 className="text-xs font-mono font-bold uppercase opacity-50 mb-4 border-b-2 border-green-100 pb-2">
          Leaderboard — Điểm Hiện Tại
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...players]
            .sort((a, b) => computeFinalScore(b, gameState) - computeFinalScore(a, gameState))
            .map((p, idx) => (
              <motion.div layout key={p.id} className={`flex items-center justify-between p-3 rounded-xl border-2 ${p.is_ready ? 'bg-green-50 border-green-400' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-gray-200">#{idx + 1}</span>
                  <div>
                    <div className="font-bold">{p.custom_name?.trim() || p.group_name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${ROLE_COLOR[p.role]}`}>{p.role}</span>
                      <span className="text-[9px] font-mono text-gray-400 bg-gray-50 px-1 rounded border border-gray-100 hidden sm:inline-block">
                        {p.role === 'GENCO' ? 'Balance + GP×15' : p.role === 'CONSUMER' ? 'GDP×2 + Balance' : 'Balance + (EH+SS)×8'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-green-600">{computeFinalScore(p, gameState).toLocaleString()}</div>
                  <div className="text-[9px] font-mono opacity-40">pts</div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onProcessRound}
            disabled={!allReady}
            className={`flex-1 py-6 rounded-2xl font-mono font-bold uppercase tracking-widest text-xl transition-all border-4 ${
              allReady
                ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-500 hover:-translate-y-1 active:translate-y-0 shadow-[0_8px_0_#1e3a8a]'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Play className="fill-current" />
              {allReady ? 'Execute Round' : `Chờ ${players.length - readyCount} nhóm nữa...`}
            </div>
          </button>
          <button
            onClick={onReset}
            className="px-10 py-6 bg-white border-4 border-gray-300 rounded-2xl font-mono font-bold uppercase text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Reset
          </button>
        </div>

        {/* Add Player buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddPlayer('GENCO')}
            className="flex-1 py-3 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-xs font-mono font-bold uppercase text-yellow-700 hover:bg-yellow-100 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Thêm GENCO
          </button>
          <button
            onClick={() => onAddPlayer('CONSUMER')}
            className="flex-1 py-3 bg-blue-50 border-2 border-blue-300 rounded-xl text-xs font-mono font-bold uppercase text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Thêm CONSUMER
          </button>
        </div>

        {!allReady && (
          <button
            onClick={onProcessRound}
            className="w-full py-3 bg-white/50 border-2 border-dashed border-blue-300 rounded-xl text-[10px] font-mono font-bold uppercase text-blue-400 hover:bg-white hover:text-blue-600 transition-all"
          >
            ⚡ Force Execute Round — Nhóm chưa chọn sẽ có option = null
          </button>
        )}
      </div>

      {/* Event notification */}
      <AnimatePresence>
        {gameState.current_event && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-10 py-6 rounded-2xl border-4 border-red-800 shadow-2xl z-50 max-w-lg text-center"
          >
            <div className="text-[10px] font-mono font-bold uppercase opacity-70 mb-1">⚡ Sự Kiện Đặc Biệt!</div>
            <div className="text-lg font-mono font-bold uppercase flex items-center justify-center gap-3">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              {gameState.current_event}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

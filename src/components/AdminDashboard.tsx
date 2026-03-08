
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GameState, Player, getOptionName, getDisplayName } from '../types/game';
import { computeFinalScore } from '../lib/gameEngine';
import { Zap, Heart, Users, Trophy, RefreshCw, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';

interface AdminDashboardProps {
  gameState: GameState;
  players: Player[];
  onReset: () => void;
  onProcessRound: () => void;
}

const ROLE_COLOR: Record<string, string> = {
  GENCO: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  CONSUMER: 'bg-blue-100 text-blue-800 border-blue-400',
  EVN: 'bg-red-100 text-red-800 border-red-400',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ gameState, players, onReset, onProcessRound }) => {
  const [effects, setEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const readyCount = players.filter(p => p.is_ready).length;
  const allReady = readyCount === players.length && players.length > 0;

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
    const ranked = [...players]
      .map(p => ({ ...p, finalScore: computeFinalScore(p, gameState) }))
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
          <div className="bg-yellow-400 rounded-3xl p-8 text-center border-4 border-yellow-600 mb-6">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-800 fill-yellow-800" />
            <h1 className="text-5xl font-mono font-bold uppercase text-yellow-900 mb-2">Game Over</h1>
            <p className="text-sm font-mono font-bold uppercase text-yellow-800 opacity-70 tracking-widest">
              {gameState.round > 20 ? 'Vòng 20 hoàn thành' : 'Hệ thống sụp đổ — EH/SS < 20%'}
            </p>
          </div>

          {/* Winner */}
          <div className="bg-white rounded-3xl p-6 border-4 border-green-500 mb-4 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <div className="text-xs font-mono font-bold uppercase text-green-600 mb-1 tracking-widest">🏆 Người chiến thắng</div>
            <div className="text-4xl font-mono font-bold text-blue-700">{winner.group_name}</div>
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

  // ── Normal Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#86efac] text-[#1e3a8a] p-4 md:p-8 font-sans relative overflow-hidden">
      <CityBackground />
      <AnimatePresence>
        {effects.map(effect => (
          <FloatingIcon key={effect.id} {...effect} />
        ))}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white/90 p-6 game-border-blue rounded-2xl">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-mono font-bold uppercase tracking-tighter text-blue-600 drop-shadow-sm">
            The Energy Hegemony
          </h1>
          <p className="text-xs font-mono font-bold opacity-60 uppercase tracking-widest">Admin Control Center v2.0</p>
        </div>
        <div className="bg-yellow-400 p-4 game-border-yellow rounded-xl text-center min-w-[120px]">
          <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
          <div className="text-4xl font-mono font-bold text-yellow-900">{gameState.round}</div>
          <div className="text-[9px] font-mono text-yellow-800 opacity-70">/ 20</div>
        </div>
      </header>

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
            {gameState.eh < 40 && <p className="text-xs font-mono text-red-600 mt-1 font-bold animate-pulse">⚠️ NGUY HIỂM</p>}
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
            {gameState.ss < 40 && <p className="text-xs font-mono text-blue-600 mt-1 font-bold animate-pulse">⚠️ NGUY HIỂM</p>}
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

        {/* ── Decision Panel (Đặc trưng Lênin: minh bạch quyết định) ── */}
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
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-gray-200">#{idx + 1}</span>
                  <div>
                    <div className="font-bold">{p.custom_name?.trim() || p.group_name}</div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${ROLE_COLOR[p.role]}`}>{p.role}</span>
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

        {!allReady && (
          <button
            onClick={onProcessRound}
            className="w-full py-3 bg-white/50 border-2 border-dashed border-blue-300 rounded-xl text-[10px] font-mono font-bold uppercase text-blue-400 hover:bg-white hover:text-blue-600 transition-all"
          >
            Debug: Force Execute Round (Bypass Readiness)
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

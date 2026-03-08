
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GameState, Player } from '../types/game';
import { Zap, Heart, Users, Trophy, RefreshCw, Play, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';

interface AdminDashboardProps {
  gameState: GameState;
  players: Player[];
  onReset: () => void;
  onProcessRound: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ gameState, players, onReset, onProcessRound }) => {
  const [effects, setEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const readyCount = players.filter(p => p.is_ready).length;
  const allReady = readyCount === players.length && players.length > 0;

  // Trigger effects when stats change
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
          <p className="text-xs font-mono font-bold opacity-60 uppercase tracking-widest">System Control Center v1.0</p>
        </div>
        <div className="bg-yellow-400 p-4 game-border-yellow rounded-xl text-center min-w-[120px]">
          <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
          <div className="text-4xl font-mono font-bold text-yellow-900">{gameState.round}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="game-border-red p-6 bg-white rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="relative">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute -top-1 -right-1" />
            </div>
            <span className="text-xs font-mono font-bold uppercase opacity-50">Economy Health</span>
          </div>
          <div>
            <div className={`text-6xl font-mono font-bold text-red-600 ${gameState.eh === 100 ? 'pixel-text' : ''}`}>
              {gameState.eh}%
            </div>
            <div className="w-full bg-red-100 h-4 mt-2 rounded-full border-2 border-red-600 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${gameState.eh}%` }}
                className="bg-red-500 h-full" 
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="game-border-blue p-6 bg-white rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex -space-x-2">
              <Users className="w-10 h-10 text-blue-500 fill-blue-500" />
              <Users className="w-10 h-10 text-blue-400 fill-blue-400" />
            </div>
            <span className="text-xs font-mono font-bold uppercase opacity-50">Social Stability</span>
          </div>
          <div>
            <div className={`text-6xl font-mono font-bold text-blue-600 ${gameState.ss === 100 ? 'pixel-text' : ''}`}>
              {gameState.ss}%
            </div>
            <div className="w-full bg-blue-100 h-4 mt-2 rounded-full border-2 border-blue-600 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${gameState.ss}%` }}
                className="bg-blue-500 h-full" 
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="game-border-yellow p-6 bg-white rounded-2xl flex flex-col justify-between"
        >
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="game-border-blue p-6 bg-white/90 rounded-2xl">
          <h2 className="text-xs font-mono font-bold uppercase opacity-50 mb-6 border-b-2 border-blue-100 pb-2">Live Telemetry</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gameState.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b82f620" vertical={false} />
                <XAxis dataKey="round" stroke="#1e3a8a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#1e3a8a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e3a8a', border: 'none', borderRadius: '12px', color: '#fff', fontFamily: 'monospace' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'monospace' }} />
                <Line type="stepAfter" dataKey="eh" name="Economy" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} />
                <Line type="stepAfter" dataKey="ss" name="Stability" stroke="#3b82f6" strokeWidth={4} strokeDasharray="8 8" dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ranking */}
        <div className="game-border-green p-6 bg-white/90 rounded-2xl">
          <div className="flex justify-between items-center mb-6 border-b-2 border-green-100 pb-2">
            <h2 className="text-xs font-mono font-bold uppercase opacity-50">Leaderboard</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase bg-green-500 text-white px-3 py-1 rounded-full">
                {readyCount}/{players.length} Ready
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {players.sort((a, b) => (b.balance + b.gdp_score) - (a.balance + a.gdp_score)).map((player, idx) => (
              <motion.div 
                layout
                key={player.id} 
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  player.is_ready ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xl font-bold text-gray-300">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-lg">{player.group_name}</div>
                    <div className="text-[10px] font-mono font-bold uppercase opacity-50 px-2 bg-gray-100 rounded inline-block">{player.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-bold text-green-600">${Math.round(player.balance)}</div>
                  <div className="text-[10px] font-mono font-bold opacity-50 uppercase">GDP: {Math.round(player.gdp_score)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onProcessRound}
            disabled={!allReady || gameState.is_game_over}
            className={`flex-1 py-6 rounded-2xl font-mono font-bold uppercase tracking-widest text-xl transition-all border-4 ${
              allReady && !gameState.is_game_over 
                ? 'bg-blue-600 text-white border-blue-800 hover:bg-blue-500 hover:-translate-y-1 active:translate-y-0 shadow-[0_8px_0_#1e3a8a]' 
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Play className="fill-current" />
              {gameState.is_game_over ? 'Game Over' : allReady ? 'Execute Round' : 'Waiting for Players...'}
            </div>
          </button>
          <button 
            onClick={onReset}
            className="px-10 py-6 bg-white border-4 border-gray-300 rounded-2xl font-mono font-bold uppercase text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>
        
        {!allReady && !gameState.is_game_over && (
          <button 
            onClick={onProcessRound}
            className="w-full py-3 bg-white/50 border-2 border-dashed border-blue-300 rounded-xl text-[10px] font-mono font-bold uppercase text-blue-400 hover:bg-white hover:text-blue-600 transition-all"
          >
            Debug: Force Execute Round (Bypass Player Readiness)
          </button>
        )}
      </div>

      <AnimatePresence>
        {gameState.current_event && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-10 py-6 rounded-2xl border-4 border-red-800 shadow-2xl z-50"
          >
            <div className="text-[10px] font-mono font-bold uppercase opacity-70 mb-1">Emergency Alert!</div>
            <div className="text-2xl font-mono font-bold uppercase italic flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
              {gameState.current_event}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


import React, { useState } from 'react';
import { Player, GameOption, GENCO_OPTIONS, CONSUMER_OPTIONS, EVN_OPTIONS, GameState } from '../types/game';
import { Wallet, TrendingUp, Leaf, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CityBackground, FloatingIcon } from './VisualEffects';

interface PlayerControlsProps {
  player: Player;
  gameState: GameState;
  onSelectOption: (optionId: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ player, gameState, onSelectOption }) => {
  const [effects, setEffects] = useState<{ id: number; icon: string; x: number; y: number }[]>([]);
  const options = player.role === 'GENCO' ? GENCO_OPTIONS : player.role === 'CONSUMER' ? CONSUMER_OPTIONS : EVN_OPTIONS;

  const handleOptionClick = (id: number) => {
    const newEffect = {
      id: Date.now(),
      icon: '💰',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    setEffects(prev => [...prev, newEffect]);
    onSelectOption(id);
  };

  if (player.is_ready) {
    return (
      <div className="min-h-screen bg-[#1e3a8a] text-white flex flex-col items-center justify-center p-8 text-center font-sans">
        <CityBackground />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl game-border-blue text-blue-600"
        >
          <CheckCircle2 className="w-24 h-24 mx-auto mb-6 text-green-500 animate-bounce" />
          <h2 className="text-4xl font-mono font-bold uppercase mb-2">Decision Locked!</h2>
          <p className="font-mono text-sm opacity-60 uppercase tracking-widest">Waiting for other sectors to finish Round {gameState.round}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-4 md:p-6 font-sans relative overflow-hidden">
      <CityBackground />
      <AnimatePresence>
        {effects.map(effect => (
          <FloatingIcon key={effect.id} {...effect} />
        ))}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-8 bg-white/90 p-4 rounded-2xl game-border-blue">
        <div>
          <h1 className="text-2xl font-mono font-bold text-blue-600">{player.group_name}</h1>
          <div className="text-[10px] font-mono font-bold uppercase opacity-50 tracking-widest">{player.role} Sector</div>
        </div>
        <div className="bg-yellow-400 px-4 py-2 rounded-xl game-border-yellow text-center">
          <div className="text-[10px] font-mono font-bold uppercase text-yellow-900">Round</div>
          <div className="text-xl font-mono font-bold text-yellow-900">{gameState.round}</div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-2xl game-border-green">
          <div className="flex items-center gap-2 mb-1 opacity-50">
            <Wallet className="w-3 h-3 text-green-600" />
            <span className="text-[10px] font-mono font-bold uppercase">Balance</span>
          </div>
          <div className="text-2xl font-mono font-bold text-green-600">${Math.round(player.balance)}</div>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-2xl game-border-blue">
          <div className="flex items-center gap-2 mb-1 opacity-50">
            <TrendingUp className="w-3 h-3 text-blue-600" />
            <span className="text-[10px] font-mono font-bold uppercase">GDP Score</span>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-600">{Math.round(player.gdp_score)}</div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-2xl game-border-yellow">
          <div className="flex items-center gap-2 mb-1 opacity-50">
            <Leaf className="w-3 h-3 text-yellow-600" />
            <span className="text-[10px] font-mono font-bold uppercase">Greenery</span>
          </div>
          <div className="text-2xl font-mono font-bold text-yellow-600">{player.green_points}</div>
        </motion.div>

        <motion.div whileTap={{ scale: 0.95 }} className="bg-white p-4 rounded-2xl game-border-red">
          <div className="flex items-center gap-2 mb-1 opacity-50">
            <Zap className="w-3 h-3 text-red-600" />
            <span className="text-[10px] font-mono font-bold uppercase">Grid Load</span>
          </div>
          <div className={`text-2xl font-mono font-bold text-red-600 ${gameState.eh === 100 ? 'pixel-text' : ''}`}>
            {gameState.eh}%
          </div>
        </motion.div>
      </div>

      <div className="mb-4">
        <h2 className="text-[10px] font-mono font-bold uppercase opacity-50 mb-4 tracking-widest text-center">Choose Your Strategy</h2>
        <div className="grid grid-cols-1 gap-4">
          {options.map((opt) => (
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              key={opt.id}
              onClick={() => handleOptionClick(opt.id)}
              className="group relative bg-white hover:bg-blue-600 text-left p-5 rounded-2xl game-border-blue transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xl font-mono font-bold group-hover:text-white">{opt.name}</span>
                <span className="text-[10px] font-mono font-bold bg-blue-100 group-hover:bg-blue-800 group-hover:text-white px-2 py-1 rounded">OP-0{opt.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 group-hover:bg-blue-700 p-2 rounded-lg transition-colors">
                  <div className="text-[9px] font-mono font-bold uppercase opacity-40 group-hover:text-white/50">Personal</div>
                  <div className="text-xs font-bold group-hover:text-white">{opt.personal_impact}</div>
                </div>
                <div className="bg-gray-50 group-hover:bg-blue-700 p-2 rounded-lg transition-colors">
                  <div className="text-[9px] font-mono font-bold uppercase opacity-40 group-hover:text-white/50">System</div>
                  <div className="text-xs font-bold group-hover:text-white">{opt.system_impact}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {gameState.current_event && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 p-5 bg-red-100 border-4 border-red-500 rounded-2xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-500 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase text-red-500 mb-0.5">Alert: External Shock</div>
                <div className="text-sm font-bold text-red-900 uppercase">{gameState.current_event} in progress!</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

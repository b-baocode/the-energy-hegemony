
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CityBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#86efac] overflow-hidden opacity-40 pointer-events-none">
      {/* Simple stylized city elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-lg border-4 border-blue-600 flex items-center justify-center">
        <div className="w-12 h-12 bg-white/30 rounded" />
      </div>
      <div className="absolute top-40 right-20 w-32 h-20 bg-red-400 rounded-t-xl border-4 border-red-600">
        <div className="flex gap-2 p-2">
          <div className="w-4 h-4 bg-white/50 rounded" />
          <div className="w-4 h-4 bg-white/50 rounded" />
        </div>
      </div>
      <div className="absolute bottom-20 left-1/4 w-40 h-32 bg-yellow-300 rounded-lg border-4 border-yellow-600">
        <div className="absolute -top-8 left-4 w-8 h-12 bg-gray-400 border-4 border-gray-600" />
        <div className="absolute -top-8 left-16 w-8 h-12 bg-gray-400 border-4 border-gray-600" />
      </div>
      <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-emerald-400 rounded-full border-4 border-emerald-600" />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-emerald-400 rounded-full border-4 border-emerald-600" />
      
      {/* Roads */}
      <div className="absolute top-1/2 left-0 w-full h-8 bg-gray-300 border-y-4 border-gray-400 flex items-center justify-around">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-8 h-1 bg-white" />
        ))}
      </div>
    </div>
  );
};

export const FloatingIcon: React.FC<{ icon: string; x: number; y: number }> = ({ icon, x, y }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: y, x: x }}
      animate={{ opacity: 1, y: y - 100 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="fixed z-50 pointer-events-none text-2xl"
    >
      {icon}
    </motion.div>
  );
};

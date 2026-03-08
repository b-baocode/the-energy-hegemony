
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { GameState, Player, PlayerRole } from './types/game';
import { INITIAL_GAME_STATE, INITIAL_PLAYERS, processRound, triggerEvent } from './lib/gameEngine';
import { AdminDashboard } from './components/AdminDashboard';
import { PlayerControls } from './components/PlayerControls';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { CityBackground } from './components/VisualEffects';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [view, setView] = useState<'SELECT_ROLE' | 'ADMIN' | 'PLAYER'>('SELECT_ROLE');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
      setLoading(false);
      return;
    }

    const initGame = async () => {
      try {
        // Fetch current game state
        const { data: stateData, error: stateError } = await supabase
          .from('game_state')
          .select('*')
          .eq('id', 'global')
          .single();

        if (stateError && stateError.code !== 'PGRST116') throw stateError;
        
        if (stateData) {
          setGameState(stateData);
        } else {
          // Initialize if not exists
          await supabase.from('game_state').insert(INITIAL_GAME_STATE);
        }

        // Fetch players
        const { data: playersData, error: playersError } = await supabase
          .from('players')
          .select('*');

        if (playersError) throw playersError;

        if (playersData && playersData.length > 0) {
          setPlayers(playersData);
        } else {
          // Initialize players if not exists
          const { data: newPlayers, error: insertError } = await supabase
            .from('players')
            .insert(INITIAL_PLAYERS)
            .select();
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

    // Real-time subscriptions
    const stateSub = supabase
      .channel('game_state_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        setGameState(payload.new as GameState);
      })
      .subscribe();

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
      })
      .subscribe();

    return () => {
      stateSub.unsubscribe();
      playersSub.unsubscribe();
    };
  }, []);

  const handleSelectRole = (player: Player) => {
    setCurrentPlayer(player);
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
    
    // Trigger random event every 3 rounds
    let finalState = nextState;
    if (nextState.round % 3 === 0) {
      const eventImpact = triggerEvent(nextState);
      finalState = { ...nextState, ...eventImpact };
    }

    // Update Supabase
    const { error: stateError } = await supabase
      .from('game_state')
      .update(finalState)
      .eq('id', 'global');

    if (stateError) {
      console.error('State update error:', stateError);
      alert('Failed to update game state. Check Supabase RLS policies.');
    }

    // Update all players in Supabase using upsert for efficiency
    const { error: playersError } = await supabase
      .from('players')
      .upsert(updatedPlayers);

    if (playersError) {
      console.error('Players update error:', playersError);
      alert('Failed to update players. Check Supabase RLS policies.');
    }
  };

  const handleReset = async () => {
    await supabase.from('game_state').update(INITIAL_GAME_STATE).eq('id', 'global');
    for (const p of INITIAL_PLAYERS) {
      await supabase.from('players').update({
        balance: p.balance,
        gdp_score: p.gdp_score,
        green_points: 0,
        last_option: null,
        is_ready: false
      }).eq('group_name', p.group_name);
    }
  };

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

-- IMPORTANT: Disable RLS for testing or add policies
ALTER TABLE game_state DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;

-- OR add permissive policies:
-- CREATE POLICY "Allow all" ON game_state FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all" ON players FOR ALL USING (true) WITH CHECK (true);`}
            </pre>
            <p className="font-bold text-red-600">Note: Also enable Realtime for both tables in Database &gt; Replication.</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'SELECT_ROLE') {
    return (
      <div className="min-h-screen bg-[#86efac] text-[#1e3a8a] p-4 md:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden">
        <CityBackground />
        <div className="max-w-4xl w-full z-10">
          <header className="text-center mb-12 bg-white/90 p-8 rounded-3xl game-border-blue">
            <h1 className="text-5xl md:text-7xl font-mono font-bold uppercase tracking-tighter mb-4 text-blue-600 drop-shadow-lg">
              The Energy Hegemony
            </h1>
            <p className="font-mono text-sm font-bold opacity-60 uppercase tracking-[0.3em]">Select your sector to begin simulation</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
              {players.map((p) => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  key={p.id}
                  onClick={() => handleSelectRole(p)}
                  className="game-border-blue p-6 bg-white rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group"
                >
                  <div className="text-[10px] font-mono font-bold uppercase opacity-50 mb-1 group-hover:text-white/50">{p.role}</div>
                  <div className="text-2xl font-mono font-bold">{p.group_name}</div>
                  <div className="mt-4 text-[10px] font-mono font-bold uppercase opacity-30 group-hover:opacity-100">Join Sector</div>
                </motion.button>
              ))}
            </div>
          </div>

          <footer className="text-center bg-white/50 backdrop-blur-sm p-4 rounded-full">
            <p className="text-[10px] font-mono font-bold opacity-40 uppercase tracking-widest">A Simulation of State Monopoly & Infrastructure</p>
          </footer>
        </div>
      </div>
    );
  }

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
          onSelectOption={handleSelectOption} 
        />
      ) : null}
    </>
  );
}

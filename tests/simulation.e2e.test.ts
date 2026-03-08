import assert from 'node:assert/strict';

import {
  INITIAL_GAME_STATE,
  INITIAL_PLAYERS,
  processRound,
  triggerEvent,
} from '../src/lib/gameEngine';
import type { GameState, Player, PlayerRole } from '../src/types/game';

function buildPlayers(): Player[] {
  return INITIAL_PLAYERS.map((p, index) => ({
    id: `P${index + 1}`,
    group_name: p.group_name ?? `G${index + 1}`,
    role: (p.role ?? 'CONSUMER') as PlayerRole,
    balance: p.balance ?? 0,
    gdp_score: p.gdp_score ?? 0,
    green_points: p.green_points ?? 0,
    last_option: null,
    is_ready: false,
  }));
}

function chooseOption(player: Player, round: number): number {
  if (player.role === 'GENCO') {
    // Rotate through all role options to mimic real classroom decisions.
    return ((round + Number(player.id.replace('P', ''))) % 4) + 1;
  }

  if (player.role === 'CONSUMER') {
    return ((round * 2 + Number(player.id.replace('P', ''))) % 4) + 1;
  }

  // EVN alternates strongly between grid expansion and stabilizing actions.
  return round % 2 === 0 ? 1 : 2;
}

function assertValidState(state: GameState, players: Player[]): void {
  assert.ok(Number.isFinite(state.eh), 'EH must be finite');
  assert.ok(Number.isFinite(state.ss), 'SS must be finite');
  assert.ok(Number.isFinite(state.grid_limit), 'Grid limit must be finite');
  assert.ok(state.eh >= 0 && state.eh <= 100, 'EH must stay in [0, 100]');
  assert.ok(state.ss >= 0 && state.ss <= 100, 'SS must stay in [0, 100]');
  assert.ok(state.grid_limit > 0, 'Grid limit must stay positive');

  players.forEach((p) => {
    assert.ok(Number.isFinite(p.balance), `${p.group_name} balance must be finite`);
    assert.ok(Number.isFinite(p.gdp_score), `${p.group_name} GDP must be finite`);
    assert.ok(Number.isFinite(p.green_points), `${p.group_name} green points must be finite`);
    assert.equal(p.is_ready, false, `${p.group_name} ready flag should be reset after round`);
  });
}

function runSimulation(): void {
  let state: GameState = { ...INITIAL_GAME_STATE, history: [...INITIAL_GAME_STATE.history] };
  let players = buildPlayers();

  const maxRounds = 25;
  let executedRounds = 0;

  while (!state.is_game_over && executedRounds < maxRounds) {
    players = players.map((p) => ({
      ...p,
      last_option: chooseOption(p, state.round),
      is_ready: true,
    }));

    if (state.round % 5 === 0) {
      const eventPatch = triggerEvent(state);
      state = { ...state, ...eventPatch };
    }

    const result = processRound(state, players);
    state = result.nextState;
    players = result.updatedPlayers;

    assertValidState(state, players);
    executedRounds += 1;
  }

  assert.ok(executedRounds > 0, 'Simulation should execute at least one round');
  assert.equal(state.is_game_over, true, 'Simulation should reach a game-over condition');
  assert.ok(state.round <= 21, 'Game should end by designed round limit');
  assert.equal(state.history.length, state.round, 'History length should match current round');

  const gencos = players.filter((p) => p.role === 'GENCO');
  const consumers = players.filter((p) => p.role === 'CONSUMER');

  assert.ok(gencos.some((p) => p.green_points > 0), 'At least one GENCO should accumulate green points');
  assert.ok(consumers.every((p) => p.gdp_score >= 500), 'Consumers should keep non-decreasing GDP scores');
}

runSimulation();
console.log('Simulation E2E test passed.');

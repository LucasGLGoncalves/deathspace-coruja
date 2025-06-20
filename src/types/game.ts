export interface Player {
  id: string;
  name: string;
  actionPoints: number;
  ships: Ship[];
  lastPointGain: Date;
}

export type ShipType = 'fighter' | 'cruiser';

export interface Ship {
  id: string;
  type: ShipType;
  position: Position;
  health: number;
  actionPoints: number;
  playerId: string;
}

export interface Position {
  x: number;
  y: number;
}

export type GameAction = {
  type: 'MOVE' | 'ATTACK' | 'DONATE';
  shipId: string;
  playerId: string;
  target?: Position | string;
  points?: number;
};

export type DebrisType = 'asteroid' | 'satellite';

export interface Debris {
  id: string;
  type: DebrisType;
  position: Position;
  health: number;
}

export interface ActionTimeWindow {
  start: string;
  end: string;
}

export interface GameRoom {
  id?: string;
  name: string;
  players: string[];
  gridSize: {
    width: number;
    height: number;
  };
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
  currentTurn: string;
  debris: Debris[];
  ships: Ship[];
  actionTimeWindows: ActionTimeWindow[];
}
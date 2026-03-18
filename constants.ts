/**
 * Bagha-Faas (Bagh-Chal) Constants and Types
 */

export type PieceType = 'tiger' | 'goat' | null;
export type GamePhase = 'placement' | 'movement' | 'gameover';
export type Player = 'tiger' | 'goat';

export interface GameState {
  board: PieceType[]; // 25 nodes
  turn: Player;
  phase: GamePhase;
  goatsToPlace: number;
  capturedGoats: number;
  winner: Player | null;
  lastMove?: {
    from: number | null;
    to: number;
    type: 'move' | 'capture' | 'placement';
    capturedIndex?: number;
    piece: PieceType;
  };
}

export const BOARD_SIZE = 5;
export const TOTAL_GOATS = 20;
export const WIN_CAPTURED_GOATS = 5;

/**
 * Returns the neighbors of a node at index i
 */
export function getNeighbors(index: number): number[] {
  const x = index % BOARD_SIZE;
  const y = Math.floor(index / BOARD_SIZE);
  const neighbors: number[] = [];

  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0], // Orthogonal
  ];

  // Diagonals only on nodes where (x+y) is even
  if ((x + y) % 2 === 0) {
    directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
  }

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
      neighbors.push(ny * BOARD_SIZE + nx);
    }
  }

  return neighbors;
}

/**
 * Initial state
 */
export const INITIAL_STATE: GameState = {
  board: Array(25).fill(null).map((_, i) => {
    // Tigers start at corners
    if (i === 0 || i === 4 || i === 20 || i === 24) return 'tiger';
    return null;
  }),
  turn: 'goat',
  phase: 'placement',
  goatsToPlace: TOTAL_GOATS,
  capturedGoats: 0,
  winner: null,
};

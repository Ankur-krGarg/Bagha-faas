import { GameState, Player, getNeighbors } from './constants';
import { isValidMove } from './logic';

/**
 * LOGIC: Find every legal move for a role (Tiger or Goat)
 */
export const findAllLegalMoves = (state: GameState, role: Player) => {
  const moves: { from: number | null; to: number; isCapture: boolean }[] = [];
  const { board, phase } = state;

  if (phase === 'placement' && role === 'goat') {
    board.forEach((cell, i) => {
      if (cell === null) moves.push({ from: null, to: i, isCapture: false });
    });
  } else {
    board.forEach((cell, i) => {
      if (cell === role) {
        // Normal slides
        getNeighbors(i).forEach(neighbor => {
          if (board[neighbor] === null) moves.push({ from: i, to: neighbor, isCapture: false });
        });
        
        // Tiger Jumps
        if (role === 'tiger') {
          const jumpOffsets = [-2, 2, -10, 10, -8, 8, -12, 12];
          jumpOffsets.forEach(offset => {
            const target = i + offset;
            if (target >= 0 && target < 25) {
              const check = isValidMove(state, i, target);
              if (check.valid && check.isCapture) moves.push({ from: i, to: target, isCapture: true });
            }
          });
        }
      }
    });
  }
  return moves;
};

/**
 * AI: Evaluates the board and returns the best move instantly.
 */
export const getBestMove = (state: GameState, difficulty: number) => {
  const moves = findAllLegalMoves(state, state.turn);
  if (moves.length === 0) return null;

  // Level 2/3: Priority to captures
  const captureMove = moves.find(m => m.isCapture);
  if (captureMove && difficulty > 1) return captureMove;

  // Default: Return a strategic random move
  return moves[Math.floor(Math.random() * moves.length)];
};

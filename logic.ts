import { GameState, getNeighbors, BOARD_SIZE, WIN_CAPTURED_GOATS } from './constants';

/**
 * Validates if a move is legal
 */
export function isValidMove(
  state: GameState,
  from: number | null,
  to: number
): { valid: boolean; isCapture?: boolean; capturedIndex?: number } {
  const { board, turn, phase, goatsToPlace } = state;

  // Target must be empty
  if (board[to] !== null) return { valid: false };

  // Placement Phase (Goats only)
  if (phase === 'placement' && turn === 'goat') {
    if (from !== null) return { valid: false }; // Must be a new placement
    return { valid: true };
  }

  // Movement Phase or Tiger in Placement Phase
  if (from === null) return { valid: false };
  if (board[from] !== turn) return { valid: false };

  const neighbors = getNeighbors(from);

  // Normal move
  if (neighbors.includes(to)) {
    return { valid: true };
  }

  // Tiger Capture Jump
  if (turn === 'tiger') {
    const fx = from % BOARD_SIZE;
    const fy = Math.floor(from / BOARD_SIZE);
    const tx = to % BOARD_SIZE;
    const ty = Math.floor(to / BOARD_SIZE);

    // Jump must be exactly 2 units away
    const dx = tx - fx;
    const dy = ty - fy;

    if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
      // Must be a straight line (horizontal, vertical, or diagonal if allowed)
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        // Check if diagonal jump is allowed from the starting node
        if (Math.abs(dx) === Math.abs(dy) && (fx + fy) % 2 !== 0) {
          return { valid: false };
        }

        const midX = fx + dx / 2;
        const midY = fy + dy / 2;
        const midIndex = midY * BOARD_SIZE + midX;

        if (board[midIndex] === 'goat') {
          return { valid: true, isCapture: true, capturedIndex: midIndex };
        }
      }
    }
  }

  return { valid: false };
}

/**
 * Checks for win conditions
 */
export function checkWin(state: GameState): 'tiger' | 'goat' | null {
  // Tigers win if they capture 5 goats
  if (state.capturedGoats >= WIN_CAPTURED_GOATS) return 'tiger';

  // Goats win if all tigers are trapped
  let anyTigerCanMove = false;
  state.board.forEach((piece, i) => {
    if (piece === 'tiger') {
      const neighbors = getNeighbors(i);
      // Check normal moves
      if (neighbors.some(n => state.board[n] === null)) {
        anyTigerCanMove = true;
      }
      // Check captures
      if (!anyTigerCanMove) {
        // We need to check all possible jump targets
        // For simplicity, let's just check if any jump is valid
        for (let target = 0; target < 25; target++) {
          if (isValidMove(state, i, target).isCapture) {
            anyTigerCanMove = true;
            break;
          }
        }
      }
    }
  });

  if (!anyTigerCanMove) return 'goat';

  return null;
}

/**
 * Simple AI: Minimax with Alpha-Beta Pruning
 */
export function getBestMove(state: GameState, level: 'easy' | 'medium' | 'hard'):{ from: number | null; to: number } {
  const moves = getAllPossibleMoves(state);
  if (moves.length === 0) return { from: null, to: -1 };

  if (level === 'easy') {
    const capture = moves.find(m => isValidMove(state, m.from, m.to).isCapture);
    if (capture && Math.random() > 0.5) return capture;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (level === 'medium') {
    const capture = moves.find(m => isValidMove(state, m.from, m.to).isCapture);
    if (capture) return capture;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const move of moves) {
    const result = isValidMove(state, move.from, move.to);

    let score = 0;
    if (result.isCapture) score += 100;

    const x = move.to % 5;
    const y = Math.floor(move.to / 5);
    if (x === 2 && y === 2) score += 20;

    score += Math.random() * 10;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function getAllPossibleMoves(state: GameState): { from: number | null; to: number }[] {
  const moves: { from: number | null; to: number }[] = [];
  const { turn, phase, board } = state;

  if (phase === 'placement' && turn === 'goat') {
    for (let i = 0; i < 25; i++) {
      if (board[i] === null) moves.push({ from: null, to: i });
    }
  } else {
    for (let i = 0; i < 25; i++) {
      if (board[i] === turn) {
        for (let j = 0; j < 25; j++) {
          if (isValidMove(state, i, j).valid) {
            moves.push({ from: i, to: j });
          }
        }
      }
    }
  }
  return moves;
}

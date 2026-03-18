import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Define an interface so TypeScript understands the move structure
interface TutorialMove {
  from: number | null;
  to: number;
  piece?: 'tiger' | 'goat';
  text: string;
  capture?: number; // Optional
  invalid?: boolean; // Optional
}

interface Scenario {
  title: string;
  desc: string;
  moves: TutorialMove[];
  initialBoard?: Record<number, 'tiger' | 'goat' | null>;
  isVictoryDemo?: boolean;
}

const SCENARIOS: Scenario[] = [
  {
    title: "Step 1: The Placement",
    desc: "Goats place 20 pieces one by one. Tigers start at the corners and move immediately to disrupt the formation.",
    moves: [
      { from: null, to: 12, piece: 'goat', text: "Goat takes the center." },
      { from: 0, to: 1, piece: 'tiger', text: "Tiger moves to pressure the center." }
    ]
  },
  {
    title: "Step 2: The Tiger's Jump",
    desc: "A Tiger kills by jumping over a single Goat into an empty spot.",
    moves: [
      { from: 6, to: 8, piece: 'tiger', capture: 7, text: "Tiger jumps over index 7. Goat is removed!" },
    ],
    initialBoard: { 6: 'tiger', 7: 'goat', 8: null }
  },
  {
    title: "Step 3: Invalid Moves",
    desc: "You cannot jump over two goats, and you cannot jump if the landing spot is occupied.",
    moves: [
      { from: 10, to: 12, piece: 'tiger', invalid: true, text: "Blocked! Landing spot is not empty." }
    ],
    initialBoard: { 10: 'tiger', 11: 'goat', 12: 'goat' }
  },
  {
    title: "Step 4: The Trap (Victory)",
    desc: "Goats win by surrounding all 4 Tigers.",
    moves: [],
    isVictoryDemo: true
  }
];

export default function TutorialModal({ onClose }: { onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [demoBoard, setDemoBoard] = useState<(string | null)[]>(Array(25).fill(null));
  const [statusText, setStatusText] = useState("");

  const currentScenario = SCENARIOS[stepIndex];

  useEffect(() => {
    // Reset board for new scenario
    const newBoard: (string | null)[] = Array(25).fill(null);
    if (currentScenario.initialBoard) {
      Object.entries(currentScenario.initialBoard).forEach(([idx, p]) => {
        newBoard[parseInt(idx)] = p;
      });
    } else if (currentScenario.isVictoryDemo) {
      [6, 8, 16, 18].forEach(i => newBoard[i] = 'tiger');
      [1, 5, 7, 11, 15, 17, 19, 23].forEach(i => newBoard[i] = 'goat');
      setStatusText("Tigers are stuck. Goats win!");
    }
    setDemoBoard(newBoard);

    let moveIdx = 0;
    const interval = setInterval(() => {
      if (moveIdx < currentScenario.moves.length) {
        const move = currentScenario.moves[moveIdx];
        setStatusText(move.text);
        
        setDemoBoard(prev => {
          const b = [...prev];
          // Use optional chaining and explicit checks to satisfy TS
          if (!move.invalid) {
            if (move.from !== null && move.from !== undefined) b[move.from] = null;
            if (move.piece) b[move.to] = move.piece;
            if (typeof move.capture === 'number') b[move.capture] = null;
          }
          return b;
        });
        moveIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [stepIndex]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-[100] p-10 backdrop-blur-md">
       {/* UI implementation remains the same */}
       <div className="flex w-full max-w-6xl gap-20 items-center">
          <div className="grid grid-cols-5 gap-4 bg-zinc-900 p-8 rounded-[3rem] border-4 border-orange-900/20">
            {demoBoard.map((cell, i) => (
              <div key={i} className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${cell === 'tiger' ? 'bg-orange-600' : cell === 'goat' ? 'bg-white' : 'bg-zinc-800'}`}>
                {cell === 'tiger' ? "🐅" : cell === 'goat' ? "🐐" : ""}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-8 text-white">
            <h2 className="text-5xl font-black uppercase italic">{currentScenario.title}</h2>
            <p className="text-2xl text-zinc-400 italic border-l-4 border-orange-600 pl-6">
              {statusText || currentScenario.desc}
            </p>
            <div className="flex gap-4 pt-10">
              <button onClick={() => stepIndex > 0 && setStepIndex(s => s - 1)} className="px-8 py-4 bg-zinc-800 rounded-2xl font-black">BACK</button>
              <button onClick={() => stepIndex < SCENARIOS.length - 1 ? setStepIndex(s => s + 1) : onClose()} className="px-12 py-4 bg-orange-600 rounded-2xl font-black">
                {stepIndex === SCENARIOS.length - 1 ? "ENTER ARENA" : "NEXT LESSON"}
              </button>
            </div>
          </div>
       </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
// --- MISSING IMPORTS FIXED BELOW ---
import { motion, AnimatePresence } from 'framer-motion'; 
import Board2D, {THEMES, ThemeKey} from './components/Board2D';

import { INITIAL_STATE, GameState } from './game/constants';
import { isValidMove, checkWin, getBestMove } from './game/logic';

export default function App() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [history, setHistory] = useState<GameState[]>([INITIAL_STATE]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('heritage'); // Default to Bagheli style
  const [gameMode, setGameMode] = useState<'pvp' | 'pve'>('pve');

  // AI Logic - Triggers only in PvE mode when it's Tiger's turn
  useEffect(() => {
    if (gameMode === 'pve' && state.turn === 'tiger' && !state.winner) {
      const timer = setTimeout(() => {
        const move = getBestMove(state, "medium");
        if (move.to !== -1) processMove(move.from, move.to);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.turn, gameMode, state.winner]);

  const handleNodeClick = (to: number) => {
    if (state.winner) return;
    if (selectedNode === null) {
      if (state.phase === 'placement' && state.turn === 'goat') {
        processMove(null, to);
      } else if (state.board[to] === state.turn) {
        setSelectedNode(to);
        const hints = [];
        for (let i = 0; i < 25; i++) if (isValidMove(state, to, i).valid) hints.push(i);
        setValidMoves(hints);
      }
    } else {
      processMove(selectedNode, to);
    }
  };

  const processMove = (from: number | null, to: number) => {
    const move = isValidMove(state, from, to);
    if (!move.valid) { setSelectedNode(null); setValidMoves([]); return; }

    const newBoard = [...state.board];
    if (from !== null) newBoard[from] = null;
    newBoard[to] = state.turn;
    if (move.isCapture && move.capturedIndex !== undefined) newBoard[move.capturedIndex] = null;

    const nextState = {
      ...state,
      board: newBoard,
      turn: (state.turn === 'goat' ? 'tiger' : 'goat') as any,
      phase: (state.phase === 'placement' && state.goatsToPlace > 1) ? 'placement' : 'movement' as any,
      goatsToPlace: from === null ? state.goatsToPlace - 1 : state.goatsToPlace,
      capturedGoats: move.isCapture ? state.capturedGoats + 1 : state.capturedGoats,
    };

    setState({ ...nextState, winner: checkWin(nextState) });
    setHistory([...history, nextState]);
    setSelectedNode(null);
    setValidMoves([]);
  };

  const undo = () => {
    if (history.length > 1) {
      const prev = history[history.length - 2];
      setHistory(history.slice(0, -1));
      setState(prev);
    }
  };

  const theme = THEMES[currentTheme];

  return (
    <div className={`w-screen h-screen flex ${theme.bg} text-white transition-all duration-1000 font-sans overflow-hidden`}>
      
      {/* 🏛 LEFT HUD: NARROW & PROFESSIONAL */}
      <div className="w-[15%] h-full flex flex-col justify-between p-8 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-50">
        <div className="space-y-10">
          <header>
            <h1 className="text-3xl font-black italic tracking-tighter leading-none mb-2">BAGHA<br/>FAAS</h1>
            <div className="h-1 w-10 bg-orange-600" />
          </header>

          <nav className="flex flex-col gap-6">
            <button onClick={() => setGameMode(gameMode === 'pve' ? 'pvp' : 'pve')} className="group text-left outline-none">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Opponent</span>
              <span className="text-sm font-black uppercase italic group-hover:text-orange-500 transition-colors">
                {gameMode === 'pve' ? 'A.I. Hunter' : 'Local Human'}
              </span>
            </button>
            <button onClick={() => setState(INITIAL_STATE)} className="text-sm font-black uppercase italic hover:text-orange-500 transition-colors text-left">New Hunt</button>
            <button onClick={undo} className="text-sm font-black uppercase italic hover:text-orange-500 transition-colors text-left">Redo Move</button>
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Surface Type</p>
          {(Object.keys(THEMES) as ThemeKey[]).map(tk => (
            <button 
              key={tk} 
              onClick={() => setCurrentTheme(tk)} 
              className={`w-full py-2.5 px-4 rounded-lg text-left text-[10px] font-bold transition-all border ${currentTheme === tk ? 'bg-white text-black border-white' : 'border-white/10 text-zinc-400 hover:bg-white/5'}`}
            >
              {THEMES[tk].name}
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 MAIN BOARD AREA */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Labels - Large & Bold */}
        <div className="flex justify-between w-full px-20 pt-10">
          <div className={`transition-all duration-700 ${state.turn === 'tiger' ? 'opacity-100 translate-y-0' : 'opacity-10 -translate-y-4'}`}>
            <h2 className="text-7xl font-black italic tracking-tighter leading-none">FAAS</h2>
            <p className="text-[10px] font-bold tracking-[0.6em] text-orange-600 mt-2">THE HUNTER</p>
          </div>
          <div className={`transition-all duration-700 ${state.turn === 'goat' ? 'opacity-100 translate-y-0' : 'opacity-10 -translate-y-4'}`}>
            <h2 className="text-7xl font-black italic tracking-tighter leading-none text-right">BAGHA</h2>
            <p className="text-[10px] font-bold tracking-[0.6em] text-white mt-2 text-right">THE HERD</p>
          </div>
        </div>

        <div className="flex-1">
            <Board2D board={state.board} onNodeClick={handleNodeClick} selectedNode={selectedNode} validMoves={validMoves} theme={currentTheme} />
        </div>

        {/* 📊 FOOTER: MASSIVE TEXT SCOREBOARD */}
        <div className="w-full px-20 pb-12 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 block mb-2">Captured</span>
            <div className="flex items-baseline gap-4">
              <h3 className="text-[140px] font-black italic leading-none tabular-nums">{state.capturedGoats}</h3>
              <span className="text-4xl font-black text-zinc-800 italic">/ 5</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 block mb-2">Reserves</span>
            <h3 className="text-[140px] font-black italic leading-none tabular-nums text-zinc-800">
               {state.goatsToPlace}
            </h3>
          </div>
        </div>
      </div>

      {/* 🏆 VICTORY OVERLAY */}
      <AnimatePresence>
        {state.winner && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center backdrop-blur-3xl"
          >
            <motion.h1 
              initial={{ y: 50 }} animate={{ y: 0 }}
              className="text-[150px] font-black italic leading-none tracking-tighter text-center"
            >
              {state.winner.toUpperCase()}<br/><span className="text-orange-600 underline">TRIUMPHS</span>
            </motion.h1>
            <button 
              onClick={() => setState(INITIAL_STATE)} 
              className="mt-16 px-16 py-6 bg-white text-black text-xl font-black uppercase rounded-full hover:scale-110 active:scale-95 transition-all"
            >
              Start New Hunt
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

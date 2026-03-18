import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNeighbors } from '../game/constants';

export const THEMES = {
  mahogany: {
    name: "The Royal Court",
    bg: "bg-[#0a0602]",
    surface: "bg-[#1c0f0a]", // Deep wood grain feel
    lines: "#d4af37", // Metallic Gold
    node: "#3d2314",
    glow: "shadow-[0_0_20px_rgba(212,175,55,0.3)]",
    tiger: "🐅",
    goat: "🐐",
    accent: "#ff9d00"
  },
  obsidian: {
    name: "Midnight Stealth",
    bg: "bg-[#050505]",
    surface: "bg-[#0f1115]", // Polished Stone
    lines: "#4ade80", // Neon Emerald
    node: "#1a1d23",
    glow: "shadow-[0_0_25px_rgba(74,222,128,0.2)]",
    tiger: "🔴",
    goat: "⚪",
    accent: "#22c55e"
  },
  heritage: {
    name: "Bagheli Sandstone",
    bg: "bg-[#1c1917]",
    surface: "bg-[#d6d3d1]", // Carved Stone Look
    lines: "#78350f", // Burnt Umber
    node: "#a8a29e",
    glow: "shadow-[0_0_15px_rgba(120,53,15,0.2)]",
    tiger: "🐅",
    goat: "🐐",
    accent: "#b45309"
  }
};

export type ThemeKey = keyof typeof THEMES;

interface BoardProps {
  board: (string | null)[];
  onNodeClick: (i: number) => void;
  selectedNode: number | null;
  validMoves: number[];
  theme: ThemeKey;
}

export default function Board2D({ board, onNodeClick, selectedNode, validMoves, theme }: BoardProps) {
  const t = THEMES[theme];
  const step = 95;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      {/* The Physical "Table" Surface */}
      <div className={`relative w-full h-full max-w-[750px] max-h-[750px] rounded-[3rem] p-10 ${t.surface} ${t.glow} border border-white/5 transition-all duration-700`}>
        
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.5"/>
            </filter>
          </defs>

          {/* Grid Lines with "Etched" look */}
          {board.map((_, i) => (
            <g key={`lines-${i}`}>
              {getNeighbors(i).map(neighbor => neighbor > i && (
                <line 
                  key={`${i}-${neighbor}`}
                  x1={(i % 5) * step + 60} y1={Math.floor(i / 5) * step + 60}
                  x2={(neighbor % 5) * step + 60} y2={Math.floor(neighbor / 5) * step + 60}
                  stroke={t.lines} strokeWidth="6" strokeLinecap="round" opacity="0.8"
                  filter="url(#shadow)"
                />
              ))}
            </g>
          ))}

          {/* Nodes & Interactive Pieces */}
          {board.map((piece, i) => {
            const x = (i % 5) * step + 60;
            const y = Math.floor(i / 5) * step + 60;
            const isSelected = selectedNode === i;
            const isValid = validMoves.includes(i);

            return (
              <g key={i} onClick={() => onNodeClick(i)} className="cursor-pointer">
                {/* Node Dimple */}
                <circle cx={x} cy={y} r="10" fill={t.node} className="shadow-inner" />
                
                {/* Movement Hint */}
                {isValid && (
                  <motion.circle 
                    initial={{ r: 0 }} animate={{ r: 15 }} 
                    cx={x} cy={y} fill={t.accent} opacity="0.4"
                    className="animate-pulse"
                  />
                )}

                {/* Selection Aura */}
                {isSelected && (
                  <motion.circle 
                    layoutId="aura" cx={x} cy={y} r="45" 
                    fill="none" stroke={t.accent} strokeWidth="2" strokeDasharray="10 5" 
                  />
                )}

                {/* 3D-esque Piece */}
                <AnimatePresence>
                  {piece && (
                    <motion.g 
                      initial={{ y: -50, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }} 
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {/* Sub-base for piece shadow */}
                      <circle cx={x} cy={y + 8} r="35" fill="black" opacity="0.3" />
                      
                      {/* The Piece Body */}
                      <circle 
                        cx={x} cy={y} r="35" 
                        fill={piece === 'tiger' ? 'url(#tigerGrad)' : 'url(#goatGrad)'} 
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                      />
                      
                      <text x={x} y={y + 14} textAnchor="middle" fontSize="42" className="select-none pointer-events-none">
                        {piece === 'tiger' ? t.tiger : t.goat}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}

          {/* Gradients for Premium Look */}
          <defs>
            <linearGradient id="tigerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="goatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#d1d1d1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

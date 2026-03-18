import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onStartPVE: () => void;
  onStartPVP: () => void;
  onTutorial: () => void;
  onHistory: () => void;
  onSettings: () => void;
}

const BaghaFaasIntro = ({ 
  onStartPVE, onStartPVP, onTutorial, onHistory, onSettings 
}: IntroScreenProps) => {
  const [view, setView] = useState<'main' | 'settings' | 'history'>('main');

  // --- Audio Assets ---
  const sounds = {
    hover: useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')),
    click: useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')),
    roar: useRef(new Audio('https://www.myinstants.com/media/sounds/tiger_roar.mp3')), // Place your local tiger_roar.mp3 here
    back: useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3')),
  };

  const playSound = (type: keyof typeof sounds) => {
    const sfx = sounds[type].current;
    sfx.currentTime = 0;
    sfx.volume = type === 'roar' ? 0.6 : 0.3;
    sfx.play().catch(() => {});
  };

  return (
    <div className="relative w-screen h-screen bg-[#080605] overflow-hidden flex flex-col items-center justify-center font-serif">
      
      {/* 1. BACKGROUND LAYER (Opaque & Atmospheric) */}
      <div 
        className="absolute inset-0 z-0 opacity-10 contrast-150 scale-105 transition-transform duration-[10s] animate-pulse"
        style={{ backgroundImage: `url('/path-to-your-tiger-art.jpg')`, backgroundSize: 'cover' }} 
      />

      {/* 2. THE CORNER CREST (LOGO) */}
      <motion.div 
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        className="absolute top-8 right-8 z-50 w-24 h-24 rounded-full border-2 border-orange-600/50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div className="w-20 h-20 rounded-full border border-orange-900/30 flex items-center justify-center overflow-hidden">
            <span className="text-orange-600 font-bold text-xs text-center leading-tight">BAGHEL<br/>REIGN</span>
        </div>
      </motion.div>

      {/* 3. THIN EXTERNAL BORDER */}
      <div className="absolute inset-6 border-[0.5px] border-orange-900/20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {view === 'main' ? (
          <motion.div 
            key="main-menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* THE CLAW & TITLE */}
            <div className="relative mb-24 flex flex-col items-center">
              <svg className="absolute -top-12 w-[600px] h-[200px] opacity-40" viewBox="0 0 400 100">
                {/* Claw Marks */}
                <motion.path 
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                  d="M100,20 Q120,50 110,80 M150,15 Q170,45 160,75 M200,20 Q220,50 210,80" 
                  stroke="#ea580c" strokeWidth="3" fill="none" strokeLinecap="round" 
                />
              </svg>
              <h1 className="text-[12rem] font-black italic uppercase leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-orange-100 to-stone-600 drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                BAGHA
              </h1>
              <h2 className="text-6xl font-light tracking-[1.5em] text-orange-600 -mt-6 ml-6 opacity-80 uppercase">
                Faas
              </h2>
            </div>

            {/* PRIMARY ACTION BUTTONS */}
            <div className="flex gap-10 mb-32">
              <BigHuntButton 
                label="Solo Hunt" 
                sub="Vs Spirit AI" 
                onClick={() => { playSound('roar'); onStartPVE(); }} 
                onHover={() => playSound('hover')}
                primary
              />
              <BigHuntButton 
                label="Duel" 
                sub="Local Combat" 
                onClick={() => { playSound('roar'); onStartPVP(); }} 
                onHover={() => playSound('hover')}
              />
            </div>

            {/* HEAVY BOTTOM NAVIGATION */}
            <div className="flex gap-16 items-center justify-center">
                <IconButton label="History" icon="📜" onClick={() => setView('history')} onHover={() => playSound('hover')} />
                <IconButton label="Tutorial" icon="⚔️" onClick={onTutorial} onHover={() => playSound('hover')} />
                <IconButton label="Settings" icon="⚙️" onClick={() => setView('settings')} onHover={() => playSound('hover')} />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="submenu"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="z-20 flex flex-col items-center"
          >
            <h2 className="text-7xl font-black text-orange-600 uppercase mb-8 italic">{view}</h2>
            <div className="w-[800px] h-[400px] bg-stone-950/80 border border-orange-900/30 rounded-2xl p-12 backdrop-blur-xl shadow-2xl relative">
                {view === 'history' ? (
                   <div className="text-orange-100/60 font-mono space-y-4">
                      <p className="">{'>'} LAST ENCOUNTER: TIGER VICTORIOUS (14 MOVES)</p>
                      <p className="">{'>'} RECORD: 124 HUNTS | 88 TRAPS SET</p>
                   </div>
                ) : <div className="text-center text-stone-500 mt-20">Configuration Modules Loading...</div>}
            </div>

            {/* THE RETURN BUTTON */}
            <motion.button 
              onClick={() => { playSound('back'); setView('main'); }}
              whileHover={{ x: -10, color: '#fff' }}
              className="mt-12 text-orange-600 font-black tracking-[0.8em] uppercase text-sm flex items-center gap-6"
            >
              <span>←</span> BACK TO GATEWAY
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- LARGE SVG ACTION BUTTONS ---
const BigHuntButton = ({ label, sub, primary, onClick, onHover }: any) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onMouseEnter={onHover}
    onClick={onClick}
    className={`relative ${primary ? 'w-96 h-32' : 'w-80 h-32'} flex flex-col items-center justify-center transition-all group`}
  >
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
      <path 
        d="M 0,20 L 20,0 L 280,0 L 300,20 L 300,80 L 280,100 L 20,100 L 0,80 Z" 
        fill={primary ? "rgba(234, 88, 12, 0.15)" : "rgba(255,255,255,0.03)"}
        stroke={primary ? "#ea580c" : "#333"}
        strokeWidth="2"
        className="group-hover:stroke-orange-400 group-hover:fill-orange-950/20 transition-all"
      />
    </svg>
    <span className="relative z-10 text-3xl font-black text-white uppercase tracking-tighter">{label}</span>
    <span className="relative z-10 text-[10px] text-orange-600 tracking-[0.4em] uppercase font-bold">{sub}</span>
  </motion.button>
);

// --- CIRCULAR ICON BUTTONS (BOTTOM) ---
const IconButton = ({ label, icon, onClick, onHover }: any) => (
  <motion.button
    whileHover={{ y: -10 }}
    onMouseEnter={onHover}
    onClick={onClick}
    className="flex flex-col items-center gap-4 group"
  >
    <div className="w-24 h-24 rounded-full border-2 border-stone-800 flex items-center justify-center group-hover:border-orange-600 group-hover:bg-orange-600/10 transition-all shadow-xl">
      <span className="text-4xl group-hover:scale-125 transition-transform">{icon}</span>
    </div>
    <span className="text-xs font-black uppercase tracking-[0.3em] text-stone-500 group-hover:text-orange-200 transition-colors">
      {label}
    </span>
  </motion.button>
);

export default BaghaFaasIntro;

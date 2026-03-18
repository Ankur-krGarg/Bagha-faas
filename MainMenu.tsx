import Logo from "./Logo";
import { motion } from "motion/react";

export default function MainMenu({ 
  onStartPVE, 
  onStartPVP,
  onTutorial,
  onHistory,
  onSettings
}: any) {

  const menuButton = "w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 active:scale-95 ";

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/40 backdrop-blur-xl z-40 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-10 bg-white/80 rounded-[3rem] border border-white shadow-[0_40px_80px_rgba(255,95,31,0.1)] text-center"
      >
        <Logo />

        <div className="mt-12 space-y-3">
          <button 
            className={menuButton + "bg-[#ff5f1f] text-white shadow-lg shadow-orange-500/20 hover:bg-[#e6551a]"} 
            onClick={onStartPVE}
          >
            Play vs Intelligence
          </button>

          <button 
            className={menuButton + "bg-[#2d5a5a] text-white shadow-lg shadow-teal-900/20 hover:bg-[#234747]"} 
            onClick={onStartPVP}
          >
            Local Multiplayer
          </button>

          <div className="grid grid-cols-1 gap-2 pt-4 border-t border-zinc-100 mt-6">
            {[
              { label: 'Tutorial', action: onTutorial },
              { label: 'History', action: onHistory },
              { label: 'Settings', action: onSettings }
            ].map((item) => (
              <button 
                key={item.label}
                onClick={item.action}
                className="py-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-[#ff5f1f] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
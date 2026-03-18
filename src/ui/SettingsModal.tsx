import { motion } from "framer-motion";

export default function SettingsModal({ onClose }: any) {
  const TacticalSlider = ({ label, icon }: { label: string; icon: string }) => (
    <div className="flex flex-col gap-4 py-8 border-b border-orange-900/10 last:border-0">
      <div className="flex justify-between items-center">
        <span className="font-black text-white tracking-[0.3em] uppercase text-2xl flex items-center gap-4">
          <span className="opacity-50 text-3xl">{icon}</span> {label}
        </span>
      </div>
      <input 
        type="range" 
        className="w-full h-4 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-600 hover:accent-orange-400 transition-all" 
      />
    </div>
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-3xl z-50 p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-8xl font-black text-orange-600 mb-12 tracking-tighter italic uppercase text-center">System Config</h2>

        <div className="w-full bg-stone-950/90 border-2 border-orange-900/30 rounded-[3rem] p-16 shadow-2xl">
          <TacticalSlider label="Atmospheric Music" icon="🎵" />
          <TacticalSlider label="Combat Sound" icon="🔊" />
          <TacticalSlider label="Ambient Light" icon="🕯️" />
        </div>

        <motion.button 
          whileHover={{ scale: 1.1, color: '#fff' }}
          className="mt-16 text-3xl font-black text-orange-600 tracking-[0.5em] uppercase" 
          onClick={onClose}
        >
          APPLY & EXIT
        </motion.button>
      </motion.div>
    </div>
  );
}

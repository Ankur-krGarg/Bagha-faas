import { motion } from "framer-motion";

export default function GameSetupModal({ onStart, onClose }: any) {
  const modes = [
    { id: 'pve_tiger', label: 'VS SPIRIT AI', role: 'Tiger (P1)', icon: '🤖' },
    { id: 'pve_goat', label: 'VS SPIRIT AI', role: 'Goat (P1)', icon: '🤖' },
    { id: 'pvp_tiger', label: 'LOCAL DUEL', role: 'Tiger (P1)', icon: '👥' },
    { id: 'pvp_goat', label: 'LOCAL DUEL', role: 'Goat (P1)', icon: '👥' }
  ];

  return (
    <div className="absolute inset-0 bg-black/98 z-[60] flex flex-col items-center justify-center p-10">
      <h2 className="text-7xl font-black text-white uppercase italic mb-16 tracking-tighter">Choose Your Path</h2>
      
      <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
        {modes.map((mode) => (
          <motion.button 
            key={mode.id}
            whileHover={{ scale: 1.05, borderColor: '#ea580c' }}
            onClick={() => onStart(mode)}
            className="h-48 bg-stone-900 border-2 border-stone-800 rounded-3xl flex flex-col items-center justify-center group"
          >
            <span className="text-orange-600 text-xs font-black tracking-[0.4em] uppercase mb-2">{mode.label}</span>
            <span className="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-orange-500">
               Play as {mode.role}
            </span>
          </motion.button>
        ))}
      </div>

      <button onClick={onClose} className="mt-20 text-orange-900 font-black tracking-[1em] hover:text-orange-600">CANCEL</button>
    </div>
  );
}
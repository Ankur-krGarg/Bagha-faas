import { motion } from "framer-motion";

export default function ScoreboardModal({ isLive, onClose, gameState }: any) {
  return (
    <div className={`absolute ${isLive ? 'top-0 left-0 w-full p-10 pointer-events-none' : 'inset-0 flex items-center justify-center bg-black/95 z-50 p-6'}`}>
      {isLive ? (
        /* DURING GAME VIEW */
        <div className="flex justify-between items-center w-full">
          <div className="bg-stone-900/80 p-6 border-l-4 border-orange-600 backdrop-blur-md">
            <p className="text-orange-600 font-black text-xs tracking-widest uppercase">Tiger (P1)</p>
            <p className="text-white text-4xl font-black">{gameState.goatsKilled} KILLED</p>
          </div>
          <div className="bg-stone-900/80 p-6 border-r-4 border-white backdrop-blur-md text-right">
            <p className="text-stone-400 font-black text-xs tracking-widest uppercase">Goat (P2)</p>
            <p className="text-white text-4xl font-black">{gameState.goatsRemaining} REMAINING</p>
          </div>
        </div>
      ) : (
        /* INTRO PAGE VIEW */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl flex flex-col items-center pointer-events-auto">
          <h2 className="text-8xl font-black text-orange-600 mb-12 italic uppercase">Registry</h2>
          <div className="w-full bg-stone-950/50 border-2 border-orange-900/20 rounded-[2rem] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-orange-600/10 text-orange-500 uppercase text-xl font-black">
                <tr><th className="p-8">Warrior</th><th className="p-8">Hunts</th><th className="p-8 text-green-500">Win</th><th className="p-8 text-red-500">Loss</th></tr>
              </thead>
              <tbody className="text-white/80 text-2xl font-mono">
                <tr className="border-t border-orange-900/10">
                  <td className="p-8 font-black text-white uppercase">Arjun_Rewa</td>
                  <td className="p-8">142</td><td className="p-8 text-green-400">98</td><td className="p-8 text-red-400">44</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={onClose} className="mt-12 text-2xl font-black text-orange-600 tracking-[0.5em]">← BACK</button>
        </motion.div>
      )}
    </div>
  );
}
import { motion } from "framer-motion";

export default function HistoryModal({ onClose }: any) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-50 p-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl">
        <h2 className="text-8xl font-black text-orange-600 mb-10 italic uppercase text-center">The Encyclopedia</h2>
        
        <div className="bg-stone-900/50 border border-orange-900/20 rounded-[3rem] p-16 space-y-10 text-orange-100/70 text-2xl">
          <section>
            <h3 className="text-4xl font-black text-white uppercase mb-4 tracking-widest">Baghelkhand Roots</h3>
            <p className="font-serif italic">
              Bagha-Faas is a traditional strategy game from the Baghelkhand region of India. It simulates the real-life struggle of shepherds protecting their flocks from tigers in the dense jungles of Rewa.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-10 border-t border-orange-900/20 pt-10">
            <div>
              <h4 className="text-white font-bold mb-2">Nepal (Bagh-Chal)</h4>
              <p className="text-lg">The national game, identical in mechanics, focusing on the movement of 4 tigers.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">South India (Aadu Puli)</h4>
              <p className="text-lg">Known as the 'Goats and Tigers' game, popular in Tamil Nadu and Karnataka.</p>
            </div>
          </section>
        </div>

        <button onClick={onClose} className="mt-12 w-full text-center text-orange-600 font-black text-3xl tracking-[0.5em]">← EXIT ARCHIVES</button>
      </motion.div>
    </div>
  );
}
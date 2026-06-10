import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const EQUIPMENT_OPTIONS = [
  "Mancuernas", "Barra olímpica", "Mat", "Kettlebell",
  "Banda elástica", "TRX", "Stepper", "Peso libre",
  "Bicicleta fija", "Soga de saltar", "Rack", "Banco",
];

interface AddLocationScreenProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, equipment: string[]) => void;
}

export default function AddLocationScreen({ open, onClose, onSave }: AddLocationScreenProps) {
  const [name, setName] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  function toggle(item: string) {
    setSelectedEquipment(prev =>
      prev.includes(item) ? prev.filter(e => e !== item) : [...prev, item]
    );
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim(), selectedEquipment);
    setName("");
    setSelectedEquipment([]);
  }

  function handleClose() {
    setName("");
    setSelectedEquipment([]);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] bg-white flex flex-col"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34, mass: 0.9 }}
        >
          <div className="shrink-0 h-[52px]" />

          {/* Header */}
          <div className="shrink-0 px-[20px] pb-[24px]">
            <p className="font-['Druk_Wide:Medium',sans-serif] text-[24px] text-[#3d3d3d] leading-[1.1] tracking-[-0.5px]">
              Nueva ubicación
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-[20px] pb-[20px]">
            {/* Name */}
            <div className="flex flex-col gap-[8px] mb-[32px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#a3a3a3] uppercase tracking-[0.8px]">
                Nombre del lugar
              </p>
              <input
                type="text"
                placeholder="Mi casa, Trabajo, Gym del barrio..."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-[#e0e0e0] rounded-[14px] px-[16px] py-[14px] font-['MessinaSansWeb:Regular',sans-serif] text-[15px] text-[#3d3d3d] placeholder:text-[#c4c4c4] outline-none focus:border-[#3d3d3d] transition-colors bg-white"
              />
            </div>

            {/* Equipment */}
            <div className="flex flex-col gap-[12px]">
              <p className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[11px] text-[#a3a3a3] uppercase tracking-[0.8px]">
                Equipamiento disponible
              </p>
              <div className="flex flex-wrap gap-[8px]">
                {EQUIPMENT_OPTIONS.map(item => {
                  const active = selectedEquipment.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggle(item)}
                      className="px-[14px] py-[9px] rounded-[10px] active:scale-95 transition-transform"
                      style={{ background: active ? "#adff19" : "#f2f2f2" }}
                    >
                      <p
                        className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[13px] whitespace-nowrap"
                        style={{ color: active ? "#1a3d00" : "#3d3d3d" }}
                      >
                        {item}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="shrink-0 px-[20px] pt-[14px] pb-[40px] border-t border-[#f0f0f0] flex gap-[10px]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-[16px] py-[16px] flex items-center justify-center border border-[#e0e0e0] active:opacity-70 transition-opacity"
            >
              <span className="font-['MessinaSansWeb:SemiBold',sans-serif] text-[15px] text-[#3d3d3d]">
                Cancelar
              </span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-[2] rounded-[16px] py-[16px] flex items-center justify-center active:opacity-80 transition-opacity disabled:opacity-30"
              style={{ background: "#adff19" }}
            >
              <span className="font-['MessinaSansWeb:Bold',sans-serif] text-[15px] text-[#1a3d00]">
                Guardar ubicación
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

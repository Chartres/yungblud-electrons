import React, { useState, useEffect, useMemo } from 'react';
import { ToggleLeft, ToggleRight, Play, RotateCcw, Hand, Cpu } from 'lucide-react';

interface OrbitalVisualizerProps {
  atomicNumber: number;
  elementSymbol: string;
  isRebellious?: boolean;
}

interface SubshellDef {
  n: number;
  sub: 's' | 'p' | 'd';
  max: number;
  boxes: number;
}

// Definition of orbitals in standard energy order (approximate Aufbau for filling)
// We will render this reversed (bottom = low energy)
const ORBITALS: SubshellDef[] = [
  { n: 1, sub: 's', max: 2, boxes: 1 },
  { n: 2, sub: 's', max: 2, boxes: 1 },
  { n: 2, sub: 'p', max: 6, boxes: 3 },
  { n: 3, sub: 's', max: 2, boxes: 1 },
  { n: 3, sub: 'p', max: 6, boxes: 3 },
  { n: 4, sub: 's', max: 2, boxes: 1 },
  { n: 3, sub: 'd', max: 10, boxes: 5 },
];

export const OrbitalVisualizer: React.FC<OrbitalVisualizerProps> = ({ atomicNumber, elementSymbol, isRebellious }) => {
  // State: Map of "n-sub-boxIndex" -> electron count (0, 1, 2)
  const [electronState, setElectronState] = useState<Record<string, number>>({});
  const [nobleShortcut, setNobleShortcut] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false); 

  // Generate the "Goal" state correctly handling exceptions
  const targetState = useMemo(() => {
    const state: Record<string, number> = {};
    
    // Custom filling logic
    const fillSubshell = (n: number, sub: string, count: number) => {
        const totalBoxes = ORBITALS.find(o => o.n === n && o.sub === sub)?.boxes || 1;
        for (let i = 0; i < count; i++) {
            const boxIdx = i % totalBoxes; 
            const currentBoxVal = state[`${n}${sub}-${boxIdx}`] || 0;
            state[`${n}${sub}-${boxIdx}`] = currentBoxVal + 1;
        }
    };

    if (atomicNumber === 24) { // Chromium
        [
            {n:1,s:'s',c:2}, {n:2,s:'s',c:2}, {n:2,s:'p',c:6}, 
            {n:3,s:'s',c:2}, {n:3,s:'p',c:6}, {n:4,s:'s',c:1}, {n:3,s:'d',c:5}
        ].forEach(d => fillSubshell(d.n, d.s, d.c));
    } else if (atomicNumber === 29) { // Copper
        [
            {n:1,s:'s',c:2}, {n:2,s:'s',c:2}, {n:2,s:'p',c:6}, 
            {n:3,s:'s',c:2}, {n:3,s:'p',c:6}, {n:4,s:'s',c:1}, {n:3,s:'d',c:10}
        ].forEach(d => fillSubshell(d.n, d.s, d.c));
    } else {
        // Standard Aufbau
        let rem = atomicNumber;
        for (const orb of ORBITALS) {
            const take = Math.min(rem, orb.max);
            fillSubshell(orb.n, orb.sub, take);
            rem -= take;
            if (rem <= 0) break;
        }
    }
    return state;
  }, [atomicNumber]);

  // Handle Element Changes: Always fill if in Auto mode, clear if in Manual mode
  useEffect(() => {
    if (!isManualMode) {
        setElectronState(targetState);
    } else {
        setElectronState({}); 
    }
    setNobleShortcut(false);
  }, [atomicNumber, targetState]); 
  // IMPORTANT: Removed isManualMode from dependencies to prevent clearing when switching modes manually

  // Handle Mode Toggling Manually
  const toggleMode = () => {
      const newMode = !isManualMode;
      setIsManualMode(newMode);
      if (!newMode) {
          // If switching BACK to Auto, fill it
          setElectronState(targetState);
      }
      // If switching to Manual, keep current state so they can edit it
  };

  // Handlers
  const handleInteraction = (key: string, action: 'add' | 'remove') => {
    // Automatically switch to manual mode if user interacts, but KEEP the current electrons
    if (!isManualMode) {
        setIsManualMode(true);
    }

    setElectronState(prev => {
        const current = prev[key] || 0;
        const newState = { ...prev };

        if (action === 'add') {
            if (current < 2) newState[key] = current + 1;
        } else if (action === 'remove') {
            if (current > 0) newState[key] = current - 1;
        }
        return newState;
    });
  };

  const autoFill = () => {
      setIsManualMode(false);
      setElectronState(targetState);
  };

  const reset = () => {
      setIsManualMode(true);
      setElectronState({});
  };

  // Determine which orbitals to show based on shortcut
  const showCore = nobleShortcut && atomicNumber > 18;
  const visibleOrbitals = showCore 
    ? ORBITALS.filter(o => o.n >= 4 || o.sub === 'd') 
    : ORBITALS;

  // Configuration String Generator
  const generateConfigString = () => {
      let str = "";
      if (showCore) str += "[Ar] ";
      
      const subshells = new Map<string, number>(); 
      
      Object.entries(electronState).forEach(([key, count]) => {
          const [sub] = key.split('-');
          subshells.set(sub, (subshells.get(sub) || 0) + count);
      });

      visibleOrbitals.forEach(orb => {
          const key = `${orb.n}${orb.sub}`;
          const count = subshells.get(key);
          if (count && count > 0) {
              str += `${key}${count} `;
          }
      });

      return str || (showCore ? "[Ar]" : "Empty Pit");
  };

  return (
    <div className="w-full bg-yb-gray border-2 border-dashed border-yb-pink rounded-xl relative overflow-hidden flex flex-col">
        {/* Top Controls Bar */}
        <div className="bg-black/50 p-3 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between backdrop-blur-sm z-10">
            <div className="flex items-center gap-4">
                 {/* Manual/Auto Toggle */}
                <button 
                    onClick={toggleMode}
                    className={`flex items-center gap-2 text-xs font-mono font-bold transition-colors ${isManualMode ? 'text-yb-pink' : 'text-cyan-400'}`}
                    title={isManualMode ? "Manual Mode: You fill the electrons" : "Auto Mode: Electrons fill automatically"}
                >
                    {isManualMode ? <Hand size={20} /> : <Cpu size={20} />}
                    {isManualMode ? "MANUAL FILL" : "AUTO FILL"}
                </button>

                <button 
                    onClick={() => setNobleShortcut(!nobleShortcut)}
                    className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300 hover:text-white transition-colors"
                    disabled={atomicNumber <= 18}
                >
                    {nobleShortcut ? <ToggleRight className="text-yb-pink" size={24}/> : <ToggleLeft className="text-gray-500" size={24}/>}
                    <span className={atomicNumber <= 18 ? "opacity-50 line-through" : ""}>NOBLE GAS SHORTCUT</span>
                </button>
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={autoFill}
                    className="flex items-center gap-1 bg-yb-pink text-black px-3 py-1 rounded-sm font-bold font-mono text-xs hover:bg-white transition-colors"
                >
                    <Play size={14} fill="black" /> FILL
                </button>
                <button 
                    onClick={reset}
                    className="flex items-center gap-1 border border-gray-600 text-gray-400 px-3 py-1 rounded-sm font-bold font-mono text-xs hover:border-white hover:text-white transition-colors"
                >
                    <RotateCcw size={14} /> RESET
                </button>
            </div>
        </div>

        {/* Configuration Display */}
        <div className="bg-black text-center py-2 font-mono text-lg text-cyan-400 shadow-inner min-h-[44px]">
            {generateConfigString()}
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 p-6 flex flex-col-reverse gap-4 items-center justify-start min-h-[400px] overflow-y-auto">
            {/* The Stage (Nucleus) */}
            <div className="w-full mt-4 p-4 border-t-4 border-double border-white bg-gradient-to-t from-gray-900 to-transparent text-center group">
                 <div className="inline-block bg-white text-black font-marker text-xl px-4 py-1 -mt-8 rotate-1 group-hover:rotate-0 transition-transform shadow-[4px_4px_0_#FF007F]">
                     THE STAGE (NUCLEUS)
                 </div>
                 <p className="text-[10px] text-gray-500 font-mono mt-2">LOWEST ENERGY LEVEL</p>
            </div>

            {showCore && (
                <div className="w-full bg-yb-gray border border-gray-700 p-2 text-center font-rock text-gray-500 mb-4 animate-pulse">
                    [ARGON CORE: 1s² 2s² 2p⁶ 3s² 3p⁶]
                </div>
            )}

            {visibleOrbitals.map((orb) => {
                const subshellKey = `${orb.n}${orb.sub}`;
                let subTotal = 0;
                for(let i=0; i<orb.boxes; i++) subTotal += electronState[`${subshellKey}-${i}`] || 0;

                return (
                    <div key={subshellKey} className="flex items-center gap-4 w-full max-w-md mx-auto group">
                        {/* Label */}
                        <div className="w-12 text-right font-mono font-bold text-yb-pink text-xl group-hover:scale-110 transition-transform cursor-default">
                            {orb.n}{orb.sub}
                        </div>

                        {/* Boxes Container */}
                        <div className="flex gap-3 justify-center flex-1">
                            {Array.from({ length: orb.boxes }).map((_, boxIndex) => {
                                const boxKey = `${subshellKey}-${boxIndex}`;
                                const count = electronState[boxKey] || 0;
                                const isFull = count === 2;
                                
                                return (
                                    <div 
                                        key={boxIndex}
                                        onClick={() => handleInteraction(boxKey, 'add')}
                                        onContextMenu={(e) => { e.preventDefault(); handleInteraction(boxKey, 'remove'); }}
                                        className={`
                                            w-14 h-14 border-2 flex items-center justify-center relative transition-all cursor-pointer select-none
                                            ${isFull 
                                                ? 'bg-yb-pink/20 border-yb-pink shadow-[0_0_10px_rgba(255,0,127,0.5)]' 
                                                : 'bg-black border-gray-600 hover:border-white'
                                            }
                                        `}
                                    >
                                        {count >= 1 && (
                                            <span className="absolute text-3xl text-cyan-400 font-bold -translate-x-2 -translate-y-1 drop-shadow-md">
                                                &uarr;
                                            </span>
                                        )}
                                        {count >= 2 && (
                                            <span className="absolute text-3xl text-yb-pink font-bold translate-x-2 translate-y-1 drop-shadow-md">
                                                &darr;
                                            </span>
                                        )}
                                        
                                        <span className="absolute bottom-0 right-1 text-[8px] font-mono text-gray-700">{boxIndex + 1}</span>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Counter */}
                        <div className="w-12 text-left font-mono text-xs text-gray-500">
                            {subTotal}/{orb.max}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Footer/Energy Label */}
        <div className="absolute left-2 bottom-20 top-20 w-1 bg-gradient-to-t from-gray-800 to-yb-pink rounded-full opacity-50 flex items-center justify-center pointer-events-none">
             <span className="text-[10px] font-mono text-yb-pink -rotate-90 whitespace-nowrap bg-yb-black px-2">ENERGY LEVEL</span>
        </div>
    </div>
  );
};
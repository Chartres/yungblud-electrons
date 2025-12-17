import React, { useState } from 'react';
import { OrbitalVisualizer } from './components/OrbitalVisualizer';
import { PeriodicTableMap } from './components/PeriodicTableMap';
import { ChatTutor } from './components/ChatTutor';
import { SetlistModal } from './components/SetlistModal';
import { MerchModal } from './components/MerchModal';
import { Atom, Music, Zap, BookOpen, AlertTriangle } from 'lucide-react';

const ELEMENTS = [
  { z: 1, s: 'H', name: 'Hydrogen' },
  { z: 2, s: 'He', name: 'Helium' },
  { z: 3, s: 'Li', name: 'Lithium' },
  { z: 6, s: 'C', name: 'Carbon' },
  { z: 7, s: 'N', name: 'Nitrogen' },
  { z: 8, s: 'O', name: 'Oxygen' },
  { z: 9, s: 'F', name: 'Fluorine' },
  { z: 10, s: 'Ne', name: 'Neon' },
  { z: 11, s: 'Na', name: 'Sodium' },
  { z: 12, s: 'Mg', name: 'Magnesium' },
  { z: 13, s: 'Al', name: 'Aluminium' },
  { z: 15, s: 'P', name: 'Phosphorus' },
  { z: 16, s: 'S', name: 'Sulfur' },
  { z: 17, s: 'Cl', name: 'Chlorine' },
  { z: 18, s: 'Ar', name: 'Argon' },
  { z: 19, s: 'K', name: 'Potassium' },
  { z: 20, s: 'Ca', name: 'Calcium' },
  { z: 21, s: 'Sc', name: 'Scandium' },
  { z: 22, s: 'Ti', name: 'Titanium' },
  { z: 23, s: 'V', name: 'Vanadium' },
  { z: 24, s: 'Cr', name: 'Chromium', rebellious: true },
  { z: 25, s: 'Mn', name: 'Manganese' },
  { z: 26, s: 'Fe', name: 'Iron' },
  { z: 27, s: 'Co', name: 'Cobalt' },
  { z: 28, s: 'Ni', name: 'Nickel' },
  { z: 29, s: 'Cu', name: 'Copper', rebellious: true },
  { z: 30, s: 'Zn', name: 'Zinc' },
];

const App: React.FC = () => {
  // Ensure default is Iron if possible, else 0
  const defaultEl = ELEMENTS.find(e => e.s === 'Fe') || ELEMENTS[0];
  const [current, setCurrent] = useState(defaultEl);
  const [activeModal, setActiveModal] = useState<'none' | 'setlist' | 'merch'>('none');

  return (
    <div className="min-h-screen bg-yb-black text-yb-white overflow-x-hidden font-sans selection:bg-yb-pink selection:text-black">
      {/* Navbar */}
      <nav className="border-b-2 border-yb-pink bg-black/90 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrent(defaultEl)}>
            <Atom className="text-yb-pink animate-spin-slow" size={32} />
            <h1 className="font-marker text-2xl md:text-3xl tracking-wider">
              ELECTRON <span className="text-yb-pink">UNDERGROUND</span>
            </h1>
          </div>
          <div className="hidden md:flex gap-6 font-rock text-sm cursor-pointer">
            <span className="hover:text-yb-pink transition-colors">THE PIT</span>
            <button onClick={() => setActiveModal('setlist')} className="hover:text-yb-pink transition-colors">SETLIST</button>
            <button onClick={() => setActiveModal('merch')} className="hover:text-yb-pink transition-colors">MERCH</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Elements */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Section */}
          <section className="bg-yb-gray p-6 rounded-none border-l-4 border-yb-pink relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yb-pink opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
            <h2 className="text-4xl font-marker mb-2 text-white">DON'T CONFORM. <span className="text-yb-pink">CONFIGURE.</span></h2>
            <p className="font-mono text-gray-400 max-w-xl">
              Electrons are like fans at a gig. They fill the pit from the stage out. 
              Opposites attract, and nobody likes a crowded seat. Let's break down the chaos.
            </p>
          </section>

          {/* Element Selector */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Music className="text-yb-pink" />
                <h3 className="font-rock text-xl">PICK YOUR TRACK (ELEMENT)</h3>
             </div>
             <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yb-pink scrollbar-track-yb-gray">
               {ELEMENTS.map((el) => (
                 <button
                   key={el.z}
                   onClick={() => setCurrent(el)}
                   className={`
                     px-3 py-1 font-mono font-bold text-md border-2 transition-all transform hover:-translate-y-1 relative
                     ${current.z === el.z 
                       ? 'bg-yb-pink text-black border-yb-pink shadow-[4px_4px_0px_#fff]' 
                       : 'bg-black text-white border-white hover:border-yb-pink'
                     }
                   `}
                 >
                   {el.s} <span className="text-xs opacity-70">{el.z}</span>
                   {el.rebellious && (
                     <span className="absolute -top-2 -right-2 text-yellow-400 bg-black rounded-full p-0.5 border border-yellow-400" title="Rebellious Exception!">
                       <AlertTriangle size={10} />
                     </span>
                   )}
                 </button>
               ))}
             </div>
          </section>

          {/* Visualizer */}
          <section>
            <div className="flex justify-between items-end mb-4">
               <div>
                 <h2 className="text-5xl font-marker text-white flex items-center gap-3">
                   {current.name.toUpperCase()}
                   {current.rebellious && (
                     <span title="This element breaks the rules!">
                       <AlertTriangle className="text-yellow-400 w-8 h-8 animate-pulse" />
                     </span>
                   )}
                 </h2>
                 <p className="font-mono text-yb-pink mt-1">ATOMIC NUMBER: {current.z}</p>
               </div>
               <div className="hidden md:block text-right">
                 <div className="text-xs font-mono text-gray-400 mb-1">CONTROLS</div>
                 <div className="flex gap-4 text-xs font-mono text-gray-300">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 border border-white bg-black"></div> CLICK: ADD FAN</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 border border-red-500 bg-red-900/50"></div> RIGHT CLICK: EJECT</span>
                 </div>
               </div>
            </div>
            
            <div className="space-y-4">
               <OrbitalVisualizer atomicNumber={current.z} elementSymbol={current.s} isRebellious={current.rebellious} />
               
               {/* Periodic Table Map Visualization - Placed "under the stage" */}
               <PeriodicTableMap currentZ={current.z} />
            </div>
          </section>

          {/* Rules/Cheatsheet */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black border border-gray-700 p-4 hover:border-yb-pink transition-colors">
              <div className="flex items-center gap-2 text-yb-pink mb-2"><Zap size={18}/> <span className="font-bold font-mono">AUFBAU</span></div>
              <p className="text-sm text-gray-400 font-mono">Fill low energy orbitals first. Bottom to top. Build the energy up.</p>
            </div>
            <div className="bg-black border border-gray-700 p-4 hover:border-yb-pink transition-colors">
              <div className="flex items-center gap-2 text-yb-pink mb-2"><BookOpen size={18}/> <span className="font-bold font-mono">PAULI</span></div>
              <p className="text-sm text-gray-400 font-mono">Max 2 electrons per box. Must have opposite spins. No clones allowed.</p>
            </div>
             <div className="bg-black border border-gray-700 p-4 hover:border-yb-pink transition-colors">
              <div className="flex items-center gap-2 text-yb-pink mb-2"><Music size={18}/> <span className="font-bold font-mono">HUND</span></div>
              <p className="text-sm text-gray-400 font-mono">Empty boxes first. Don't pair up unless you have to. Spread the vibe.</p>
            </div>
          </section>
        </div>

        {/* Right Column: Chat & Info */}
        <div className="lg:col-span-4 space-y-8 sticky top-24 self-start">
           <ChatTutor />
           
           <div className="p-4 bg-white text-black transform rotate-1 border-4 border-yb-pink shadow-[8px_8px_0px_#333]">
             <h3 className="font-marker text-2xl mb-2 text-center">DID YOU KNOW?</h3>
             <p className="font-mono text-sm text-center">
               Chromium and Copper are the punks of the periodic table. They steal an electron from the 4s orbital to make their 3d shell more stable (half-full or full).
             </p>
           </div>

           <div className="text-center opacity-50 font-mono text-xs">
             <p>THE ELECTRON UNDERGROUND &copy; 2024</p>
             <p>STAY WEIRD. STAY SAFE.</p>
           </div>
        </div>

      </main>

      {/* Modals */}
      {activeModal === 'setlist' && <SetlistModal onClose={() => setActiveModal('none')} />}
      {activeModal === 'merch' && <MerchModal onClose={() => setActiveModal('none')} />}
    </div>
  );
};

export default App;
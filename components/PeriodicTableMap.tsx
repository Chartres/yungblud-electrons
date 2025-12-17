import React from 'react';

interface PeriodicTableMapProps {
  currentZ: number;
}

const ROWS = [
  { n: 1, cells: [1, 18] }, // H, He
  { n: 2, cells: [3, 4, 5, 6, 7, 8, 9, 10] }, // Li-Ne
  { n: 3, cells: [11, 12, 13, 14, 15, 16, 17, 18] }, // Na-Ar
  { n: 4, cells: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30] }, // K-Zn (and beyond technically, but we stop here)
];

const BLOCK_COLORS = {
  s: 'bg-cyan-900 border-cyan-500',
  p: 'bg-pink-900 border-pink-500',
  d: 'bg-yellow-900 border-yellow-500',
};

// Helper to determine block type based on Z
const getBlockType = (z: number): 's' | 'p' | 'd' => {
  if ([1, 2, 3, 4, 11, 12, 19, 20].includes(z)) return 's';
  if ((z >= 5 && z <= 10) || (z >= 13 && z <= 18) || (z >= 31 && z <= 36)) return 'p';
  if (z >= 21 && z <= 30) return 'd';
  return 's';
};

// Helper to place element in 18-column grid
const getGridColumn = (z: number): number => {
  if (z === 1) return 1;
  if (z === 2) return 18;
  // Period 2 & 3
  if (z >= 3 && z <= 4) return z - 2; // Li(3)->1, Be(4)->2
  if (z >= 5 && z <= 10) return z + 8; // B(5)->13... Ne(10)->18
  if (z >= 11 && z <= 12) return z - 10; // Na(11)->1, Mg(12)->2
  if (z >= 13 && z <= 18) return z; // Al(13)->13... Ar(18)->18
  // Period 4
  if (z >= 19 && z <= 30) return z - 18; // K(19)->1... Zn(30)->12
  return 1;
};

export const PeriodicTableMap: React.FC<PeriodicTableMapProps> = ({ currentZ }) => {
  // We'll render a grid 18 columns wide
  const gridCells = [];
  
  // Fill grid with simplified placeholders
  // We primarily want to show the blocks
  
  const renderCell = (z: number) => {
    const isCurrent = z === currentZ;
    const block = getBlockType(z);
    const col = getGridColumn(z);
    
    // Determine row
    let row = 1;
    if (z > 2) row = 2;
    if (z > 10) row = 3;
    if (z > 18) row = 4;

    return (
      <div 
        key={z}
        className={`
          w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[10px] md:text-xs font-mono border
          ${BLOCK_COLORS[block]}
          ${isCurrent ? 'ring-2 ring-white scale-125 z-10 font-bold bg-white text-black' : 'opacity-60 text-white'}
        `}
        style={{ 
          gridColumn: col, 
          gridRow: row 
        }}
        title={`Z=${z} (${block}-block)`}
      >
        {z}
      </div>
    );
  };

  const elementsToRender = [];
  for (let z = 1; z <= 30; z++) elementsToRender.push(z);
  // Add simplified noble gases for row completion visuals if needed, 
  // but strictly we just loop elements we support + fillers if we want the full shape.
  // For Z=1-30 it's fine.

  return (
    <div className="bg-yb-black p-4 border border-yb-gray rounded-xl">
       <div className="flex justify-between items-center mb-2">
         <h3 className="font-rock text-yb-pink text-sm">BLOCK MAP</h3>
         <div className="flex gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-cyan-900 border border-cyan-500"></div> s-block</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-900 border border-yellow-500"></div> d-block</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-900 border border-pink-500"></div> p-block</span>
         </div>
       </div>
       
       <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 p-2 bg-gray-900/50 rounded-lg overflow-x-auto">
          {elementsToRender.map(z => renderCell(z))}
          
          {/* Add labels for blocks roughly? No, too messy. The legend is enough. */}
       </div>
       
       <p className="mt-2 text-xs font-mono text-gray-500">
         The "Block" tells you which subshell is being filled last. 
         {getBlockType(currentZ) === 'd' && " Transition metals (d-block) are high energy rebels!"}
         {getBlockType(currentZ) === 's' && " s-block elements are building the foundation."}
         {getBlockType(currentZ) === 'p' && " p-block elements bring the variety."}
       </p>
    </div>
  );
};

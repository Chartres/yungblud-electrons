import React from 'react';
import { X, Music, Disc, Mic2 } from 'lucide-react';

interface SetlistModalProps {
  onClose: () => void;
}

export const SetlistModal: React.FC<SetlistModalProps> = ({ onClose }) => {
  const tracks = [
    {
      title: "TRACK 01: THE FOUNDATION (s-block)",
      desc: "Spherical pits. 1 box. Max 2 fans. The opening act that starts every show. H and He are the acoustic duo.",
      icon: <Disc className="text-cyan-400" />
    },
    {
      title: "TRACK 02: THE DUMBBELLS (p-block)",
      desc: "3 pits per level. Max 6 fans. Higher energy. Things get louder here. B through Ne bring the noise.",
      icon: <Mic2 className="text-yb-pink" />
    },
    {
      title: "TRACK 03: TRANSITION METAL MANIA (d-block)",
      desc: "5 pits. Max 10 fans. The complex stuff. Energy levels get weird here (4s fills before 3d!).",
      icon: <Music className="text-yellow-400" />
    },
    {
      title: "ENCORE: THE REBELS (Cr & Cu)",
      desc: "They steal electrons from 4s to 3d to get that perfect half-full or full stability. Pure punk attitude.",
      icon: <span className="text-red-500 font-bold text-xl">!</span>
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-yb-gray w-full max-w-2xl border-4 border-white transform -rotate-1 shadow-[10px_10px_0px_#FF007F] relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-yb-pink transition-colors"
        >
          <X size={32} />
        </button>
        
        <div className="p-8">
          <h2 className="font-marker text-5xl mb-2 text-center text-yb-white">THE <span className="text-yb-pink">SETLIST</span></h2>
          <p className="font-mono text-center text-gray-400 mb-8 border-b border-gray-700 pb-4">
            TONIGHT'S LESSON PLAN // NO SKIPS ALLOWED
          </p>

          <div className="space-y-6">
            {tracks.map((track, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-mono text-gray-600 text-sm">0{idx + 1}</span>
                  <div className="p-2 bg-black border border-gray-700 group-hover:border-yb-pink transition-colors rounded-full">
                    {track.icon}
                  </div>
                  <h3 className="font-rock text-xl md:text-2xl text-white group-hover:text-yb-pink transition-colors">
                    {track.title}
                  </h3>
                </div>
                <p className="font-mono text-gray-400 pl-14 text-sm md:text-base border-l-2 border-gray-800 ml-5">
                  {track.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-dashed border-gray-700 text-center font-mono text-xs text-gray-500">
            * DOORS OPEN AT 1S • MOSH SAFELY *
          </div>
        </div>
      </div>
    </div>
  );
};
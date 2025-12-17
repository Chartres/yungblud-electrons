import React, { useState } from 'react';
import { X, Shirt, Sticker, Award, CheckCircle, XCircle } from 'lucide-react';

interface MerchModalProps {
  onClose: () => void;
}

const QUIZ_QUESTIONS = [
  {
    q: "How many electrons fit in a single orbital box?",
    options: ["1", "2", "6", "10"],
    a: 1 // index of correct answer
  },
  {
    q: "Which rule says 'Empty seats first'?",
    options: ["Aufbau Principle", "Pauli Exclusion", "Hund's Rule", "The Mosh Pit Rule"],
    a: 2
  },
  {
    q: "Why is Copper (Cu) weird?",
    options: ["It hates electrons", "It fills 4s fully first", "It steals from 4s to fill 3d", "It's a noble gas"],
    a: 2
  }
];

export const MerchModal: React.FC<MerchModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'store' | 'quiz'>('store');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === QUIZ_QUESTIONS[quizIndex].a;
    setLastAnswerCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setLastAnswerCorrect(null);
      if (quizIndex < QUIZ_QUESTIONS.length - 1) {
        setQuizIndex(i => i + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setShowResult(false);
    setLastAnswerCorrect(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-yb-black w-full max-w-3xl border-2 border-yb-pink shadow-[0_0_20px_rgba(255,0,127,0.2)] relative max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
        
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-yb-pink transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Sidebar */}
        <div className="bg-yb-gray w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col gap-4">
           <h2 className="font-marker text-3xl text-white">MERCH <br/><span className="text-yb-pink">STAND</span></h2>
           <button 
             onClick={() => setActiveTab('store')}
             className={`p-3 text-left font-rock text-sm transition-all ${activeTab === 'store' ? 'bg-yb-pink text-black' : 'bg-black text-white hover:bg-gray-800'}`}
           >
             BROWSE ITEMS
           </button>
           <button 
             onClick={() => setActiveTab('quiz')}
             className={`p-3 text-left font-rock text-sm transition-all ${activeTab === 'quiz' ? 'bg-yb-pink text-black' : 'bg-black text-white hover:bg-gray-800'}`}
           >
             EARN DISCOUNTS (QUIZ)
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-black min-h-[400px]">
          {activeTab === 'store' && (
             <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-700 p-4 text-center group hover:border-yb-pink transition-colors">
                   <Shirt className="mx-auto mb-2 text-gray-500 group-hover:text-cyan-400" size={48} />
                   <h3 className="font-mono font-bold text-white">TOUR TEE</h3>
                   <p className="text-xs text-gray-400">Sold Out</p>
                </div>
                <div className="border border-gray-700 p-4 text-center group hover:border-yb-pink transition-colors">
                   <Sticker className="mx-auto mb-2 text-gray-500 group-hover:text-yellow-400" size={48} />
                   <h3 className="font-mono font-bold text-white">STICKER PACK</h3>
                   <p className="text-xs text-gray-400">$5.00</p>
                </div>
                <div className="col-span-2 border border-dashed border-gray-800 p-4 text-center mt-4">
                  <p className="font-mono text-sm text-yb-pink">PROVE YOUR KNOWLEDGE IN THE QUIZ TO UNLOCK DIGITAL BADGES</p>
                </div>
             </div>
          )}

          {activeTab === 'quiz' && !showResult && (
             <div className="space-y-6">
               <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                  <span>QUESTION {quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                  <span>SCORE: {score}</span>
               </div>
               
               <h3 className="font-rock text-xl text-white">{QUIZ_QUESTIONS[quizIndex].q}</h3>
               
               <div className="grid gap-3">
                 {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => handleAnswer(i)}
                     disabled={lastAnswerCorrect !== null}
                     className="p-3 border border-gray-600 text-left font-mono text-sm hover:border-yb-pink hover:bg-yb-pink/10 transition-all disabled:opacity-50"
                   >
                     {opt}
                   </button>
                 ))}
               </div>

               {lastAnswerCorrect === true && (
                  <div className="flex items-center gap-2 text-green-400 font-bold font-mono animate-pulse">
                     <CheckCircle size={20} /> CORRECT!
                  </div>
               )}
               {lastAnswerCorrect === false && (
                  <div className="flex items-center gap-2 text-red-500 font-bold font-mono animate-pulse">
                     <XCircle size={20} /> WRONG SPOT, MATE!
                  </div>
               )}
             </div>
          )}

          {activeTab === 'quiz' && showResult && (
            <div className="text-center space-y-6 pt-8">
               <Award size={64} className="mx-auto text-yellow-400 animate-bounce" />
               <h3 className="font-marker text-3xl text-white">GIG COMPLETE!</h3>
               <p className="font-mono text-xl">YOU SCORED {score}/{QUIZ_QUESTIONS.length}</p>
               
               {score === QUIZ_QUESTIONS.length ? (
                 <div className="bg-yb-pink/20 border border-yb-pink p-4 rounded-lg">
                   <p className="font-rock text-yb-pink">UNLOCKED: "PIT MASTER" BADGE</p>
                 </div>
               ) : (
                 <p className="text-gray-400 font-mono text-sm">Practice makes perfect. Get back in the pit!</p>
               )}

               <button 
                 onClick={resetQuiz}
                 className="px-6 py-2 bg-white text-black font-bold font-mono hover:bg-gray-200"
               >
                 TRY AGAIN
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
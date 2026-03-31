import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') { setDisplay('0'); setEquation(''); return; }
    if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(equation + display);
        setDisplay(String(result));
        setEquation('');
      } catch (e) { setDisplay('Error'); }
      return;
    }
    if (['+', '-', '*', '/'].includes(val)) {
      setEquation(display + ' ' + val + ' ');
      setDisplay('0');
      return;
    }
    setDisplay(display === '0' ? val : display + val);
  };

  const buttons = ['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=', ''];

  return (
    <div className="flex flex-col h-full bg-black/60 p-5 text-white font-sans backdrop-blur-xl">
      <div className="bg-black/40 p-4 rounded-2xl mb-4 text-right border border-white/10 shadow-inner flex flex-col justify-end h-24">
        <div className="text-white/50 text-sm h-5 font-mono">{equation}</div>
        <div className="text-5xl font-light tracking-wider truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 flex-1">
        {buttons.map((btn, i) => btn ? (
          <button 
            key={i} 
            onClick={() => handlePress(btn)} 
            className={`rounded-2xl text-xl font-medium transition-all active:scale-95 border border-white/5 shadow-lg
              ${['/', '*', '-', '+', '='].includes(btn) ? 'bg-primary/80 hover:bg-primary text-white' : 
                btn === 'C' ? 'bg-red-500/80 hover:bg-red-400 text-white' : 
                'bg-white/10 hover:bg-white/20 text-white/90'}`}
          >
            {btn}
          </button>
        ) : <div key={i} />)}
      </div>
    </div>
  );
};

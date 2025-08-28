import { useState, useEffect } from 'react'
import { generateThrow, getPlayerName, getThrows } from './query';

interface DiceThrow {
  dice: number[];
  sum: number;
}

function App() {
  const [throws, setThrows] = useState<DiceThrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolling, setIsRolling] = useState(false);
  const [playerName, setPlayerName] = useState('default');

  // Fetch player name
  useEffect(() => {
    getPlayerName().then(data => setPlayerName(data));
  }, []);

  // Fetch throws from backend
  useEffect(() => {
    getThrows().then(data => setThrows(data));
    setIsLoading(false);
  }, []);

  // Roll dice and add to throws
  const rollDice = () => {
    setIsRolling(true);
    generateThrow().then(getThrows).then(data => {
      setThrows(data);
      setIsRolling(false);
    });
  };

  // Get dice emoji for each dice value
  const getDiceEmoji = (value: number) => {
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return diceEmojis[value - 1];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
        🎲 Dice Rolling Simulator
      </h1>
      
      <button 
        onClick={rollDice} 
        disabled={isRolling}
        className={`block mx-auto mb-8 px-8 py-4 text-xl font-bold rounded-full cursor-pointer transition-all duration-300 ${
          isRolling 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-lg hover:-translate-y-1 active:translate-y-0'
        }`}
      >
        {isRolling ? 'Rolling...' : 'Roll 5 Dice'}
      </button>

      {/* Animated dice rolling loader */}
      {isRolling && (
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            {[1, 2, 3, 4, 5].map((dice, index) => (
              <div
                key={dice}
                className="text-6xl animate-bounce"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '0.6s'
                }}
              >
                🎲
              </div>
            ))}
          </div>
          <p className="text-lg text-gray-600 font-semibold">Rolling the dice...</p>
        </div>
      )}

      {isLoading && !isRolling && (
        <div className="text-center py-16 text-gray-600 text-xl">
          <p>Loading...</p>
        </div>
      )}

      {throws.length > 0 && !isLoading && (
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            Last 10 Throws
          </h2>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
            <table className="w-full border-collapse bg-white text-sm">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 text-center font-bold border border-gray-300 min-w-[100px]">
                    Dice
                  </th>
                  {[...throws].reverse().map((_, index) => (
                    <th key={index} className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-3 text-center font-bold border border-gray-300 min-w-[80px]">
                      Throw {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Individual dice rows */}
                {[0, 1, 2, 3, 4].map(diceIndex => (
                  <tr key={`dice-${diceIndex}`}>
                    <td className="font-bold text-gray-600 bg-gray-50 p-3 text-left border border-gray-300">
                      Dice {diceIndex + 1}
                    </td>
                    {[...throws].reverse().map((throwData, throwIndex) => (
                      <td key={`throw-${throwIndex}-dice-${diceIndex}`} className="p-3 text-center border border-gray-300">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-4xl leading-none">
                            {getDiceEmoji(throwData.dice[diceIndex])}
                          </span>
                          <span className="text-xs text-gray-600 font-bold">
                            ({throwData.dice[diceIndex]})
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Sum row */}
                <tr className="bg-gray-50">
                  <td className="font-bold text-gray-800 bg-blue-50 p-3 text-left border border-gray-300">
                    Sum
                  </td>
                  {[...throws].reverse().map((throwData, index) => (
                    <td key={`sum-${index}`} className="font-bold text-lg text-blue-600 bg-blue-50 p-3 text-center border border-gray-300">
                      {throwData.sum}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col justify-center m-4 gap-4">
              <div className="text-gray-600 text-xl font-bold">
                player: {playerName}
              </div>
              <div className="text-gray-600 text-xl font-bold">
                Total result: {throws.reduce((acc, throwData) => acc + throwData.sum, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {throws.length === 0 && !isRolling && (
        <div className="text-center py-16 text-gray-600 text-xl">
          <p>Click "Roll 5 Dice" to start rolling!</p>
        </div>
      )}
    </div>
  )
}

export default App

import  { useState, useEffect } from 'react';

type LeaderboardEntry = {
  id: string | number;
  username: string;
  score: number;
  timetaken: number;
};

const WeeklyLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/weekly_leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-cyan-400">
          Weekly Leaderboard
        </h1>
        
        {isLoading ? (
          <div className="text-center text-gray-400">Loading leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-400">
            No results yet. Be the first to complete this week's quiz!
          </div>
        ) : (
          <div className="bg-gray-800/50 rounded-xl border border-cyan-500/20 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 font-semibold bg-gray-700/50">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-7">Username</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Time</div>
            </div>
            
            {leaderboard.map((entry, index) => (
              <div 
                key={entry.id} 
                className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-700/30 ${
                  index < 3 ? 'bg-gradient-to-r from-cyan-900/20 to-blue-900/10' : ''
                }`}
              >
                <div className="col-span-1 text-center">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div className="col-span-7 truncate">{entry.username}</div>
                <div className="col-span-2 text-center">{entry.score}</div>
                <div className="col-span-2 text-center">{entry.timetaken}s</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyLeaderboard;
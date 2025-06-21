/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Trophy, ChevronDown, ChevronUp, Crown, Award, Medal, Zap } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  score: number;
  timetaken: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof LeaderboardEntry; direction: 'asc' | 'desc' }>({
    key: 'score',
    direction: 'desc'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format');
      }
      const data = await response.json();
      const safeData = data.map((entry: any) => ({
        username: entry.username || 'Anonymous',
        score: entry.score || 0,
        timetaken: entry.timetaken || 0
      }));
      setLeaderboardData(safeData);
    } catch (error) {
      console.error('Error fetching leaderboard, using fallback:', error);
      const storedData = localStorage.getItem('quizLeaderboard');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const formattedData = parsedData.map((entry: any) => ({
            username: entry.username || 'Anonymous',
            score: entry.score || 0,
            timetaken: entry.timeTaken || 0
          })).sort((a: any, b: any) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.timetaken - b.timetaken;
          }).slice(0, 10);
          setLeaderboardData(formattedData);
        } catch (parseError) {
          console.error('Failed to parse fallback data:', parseError);
          setLeaderboardData([]);
        }
      } else {
        setLeaderboardData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchLeaderboard();
}, []);

  const sortData = (key: keyof LeaderboardEntry) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });

    const sorted = [...leaderboardData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setLeaderboardData(sorted);
  };

  const getSortIcon = (key: keyof LeaderboardEntry) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline-block" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline-block" />;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400/20" />;
    if (index === 1) return <Award className="h-6 w-6 text-gray-300 fill-gray-300/20" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600 fill-amber-600/20" />;
    return <span className="text-lg font-bold">{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden p-3 md:p-6">
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 md:w-64 md:h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-10 mt-4 md:mt-6">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-8 w-8 md:h-10 md:w-10 mr-2 text-yellow-400" />
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                Quiz Leaderboard
              </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
              Top performers in Nexus blockchain knowledge challenge
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div className="text-cyan-400 text-xs md:text-sm font-semibold">TOTAL PARTICIPANTS</div>
            <div className="text-xl text-blue-200 md:text-3xl font-bold mt-1">{leaderboardData.length}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div className="text-cyan-400 text-xs md:text-sm font-semibold">BEST SCORE</div>
            <div className="text-xl md:text-3xl font-bold mt-1 text-blue-200">
              {leaderboardData.length ? `${Math.max(...leaderboardData.map(item => item.score))}/20` : '0/20'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg">
            <div className="text-cyan-400 text-xs md:text-sm font-semibold">FASTEST TIME</div>
            <div className="text-xl text-blue-200 md:text-3xl font-bold mt-1">
              {leaderboardData.length ? formatTime(Math.min(...leaderboardData.map(item => item.timetaken))) : '0:00'}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-5 bg-gray-800/80 border-b border-gray-700">
            <div className="col-span-1 text-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Rank
            </div>
            <div className="col-span-5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
              User Name
            </div>
            <div 
              className="col-span-3 text-xs text-gray-400 font-semibold uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors flex items-center"
              onClick={() => sortData('score')}
            >
              Score {getSortIcon('score')}
            </div>
            <div 
              className="col-span-3 text-xs text-gray-400 font-semibold uppercase tracking-wider cursor-pointer hover:text-cyan-400 transition-colors flex items-center"
              onClick={() => sortData('timetaken')}
            >
              Time {getSortIcon('timetaken')}
            </div>
          </div>

          <div className="divide-y divide-gray-800/50">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((entry, index) => (
                <React.Fragment key={index}>
                  <div 
                    className="hidden md:grid grid-cols-12 gap-4 px-4 py-5 hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-400/10' :
                        index === 1 ? 'bg-gray-300/10' :
                        index === 2 ? 'bg-amber-600/10' : 'bg-gray-700'
                      }`}>
                        {getRankBadge(index)}
                      </div>
                    </div>
                    <div className="col-span-5 flex items-center">
                      <div className="bg-gray-700 border border-gray-600 rounded-lg w-8 h-8 flex items-center justify-center mr-3">
                        <span className="text-gray-300 font-semibold">{entry.username.charAt(0)?? ''}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{entry.username}</div>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div className="w-full">
                        <div className="text-lg font-bold text-gray-100">{entry.score}/20</div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                            style={{ width: `${(entry.score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div className="font-mono text-lg font-bold text-blue-400">
                        {formatTime(entry.timetaken)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:hidden p-4 hover:bg-gray-800/50 transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          index === 0 ? 'bg-yellow-400/10' :
                          index === 1 ? 'bg-gray-300/10' :
                          index === 2 ? 'bg-amber-600/10' : 'bg-gray-700'
                        }`}>
                          {getRankBadge(index)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-200">{entry.username}</div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-blue-400">
                        {formatTime(entry.timetaken)}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm text-gray-400">Score</div>
                        <div className="font-bold text-gray-100">{entry.score}/20</div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(entry.score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="text-gray-500 mb-4">No records yet</div>
                <div className="text-gray-600 text-sm">Be the first to take the quiz!</div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <p className="text-gray-500 text-xs md:text-sm mb-4">
            Leaderboard updates in real-time • Only top 10 scores are displayed
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 font-medium shadow-lg text-sm md:text-base"
          >
            <Zap className="h-4 w-4 mr-2" />
            Take the Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
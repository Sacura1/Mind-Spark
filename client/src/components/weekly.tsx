import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Weekly = () => {
  const [quizActive, setQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const navigate = useNavigate();

const getNextFriday2PM = () => {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  let daysToAdd;
  if (day < 5) {
    daysToAdd = 5 - day;
  } else if (day === 5) {
    if (hour < 14 || (hour === 14 && minute < 0)) {
      daysToAdd = 0;
    } else {
      daysToAdd = 7;
    }
  } else {
    daysToAdd = 5 + (7 - day);
  }
  const nextFriday = new Date(now);
  nextFriday.setUTCDate(now.getUTCDate() + daysToAdd);
  nextFriday.setUTCHours(14, 0, 0, 0);
  return nextFriday;
};

  const handleUsernameSubmit = () => {
    if (tempUsername.trim()) {
      localStorage.setItem('username', tempUsername.trim());
      setUsername(tempUsername.trim());
      setShowUsernameModal(false);
      navigate('/weekly-quiz');
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    const nextFriday = getNextFriday2PM();
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextFriday.getTime() - now.getTime();

      if (diff <= 0) {
        setQuizActive(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (quizActive && username) {
      navigate('/weekly-quiz');
    } else if (quizActive && !username) {
      setShowUsernameModal(true);
    }
  }, [quizActive, username, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center p-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">
          Weekly Quiz Challenge
        </h1>
        
        {quizActive ? (
          <div className="bg-gray-800/50 p-8 rounded-xl border border-cyan-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Quiz is Active!
            </h2>
            <p className="mb-6 text-gray-300">
              The weekly quiz is now running. Test your knowledge and compete for 
              the top spot on the leaderboard!
            </p>
            {username ? (
              <button
                onClick={() => navigate('/weekly-quiz')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-cyan-700 transition-all duration-300"
              >
                Start Quiz Now
              </button>
            ) : (
              <p className="text-yellow-400">
                Please enter your username to participate
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-800/50 p-8 rounded-xl border border-cyan-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
              Next Weekly Quiz Starts In:
            </h2>
            <div className="text-4xl font-mono font-bold mb-6 text-white">
              {timeLeft || 'Loading.....'}
            </div>
            <p className="text-gray-300 mb-2">
              Every Friday at 2 PM UTC
            </p>
            <p className="text-gray-400 text-sm">
              Make sure you have your username set to participate when the quiz starts
            </p>
          </div>
        )}

        {showUsernameModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-blue-500/20 rounded-xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2 text-blue-400">
                  Enter Username
                </h2>
                <p className="text-gray-400 text-sm">
                  Required to participate in the weekly quiz
                </p>
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                />
              </div>
              
              <button
                onClick={handleUsernameSubmit}
                disabled={!tempUsername.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50"
              >
                Save & Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weekly;
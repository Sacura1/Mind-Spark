import { useState} from 'react';
import { Zap, ArrowRight, User, Sparkles, Brain, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Homee = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSliding, setIsSliding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const weekly = ()=>{
    navigate('/weekly-quiz')
  }

  const handleQuizClick = () => {
    const savedUsername = localStorage.getItem('username');
    
    if (savedUsername) {
      navigate('/quiz');
    } else {
      setShowWelcomeModal(true);
    }
  };

  const handleWelcomeNext = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowWelcomeModal(false);
      setShowChallengeModal(true);
      setIsSliding(false);
    }, 400);
  };

  const handleChallengeAccept = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowChallengeModal(false);
      setShowUsernameModal(true);
      setIsSliding(false);
    }, 400);
  };

  const handleUsernameSubmit = () => {
    if (discordUsername.trim()) {
      localStorage.setItem('username', discordUsername.trim());
      setShowUsernameModal(false);
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="relative">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-lg rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Mind-Spark
              </h1>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 text-gray-300 px-2 sm:px-4">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              Resharpen Your Mind And Improve your knowledge About The World Supercomputer
            </p>
            <div className="flex justify-center mr-5  my-3">
              <img
                className="w-20 h-20 object-contain"
                src="src/assets/nexus_logo.png"
                alt="logo"
              />
                <h2 className="flex items-center ml-2 text-xl font-semibold text-white-300">Nexus</h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg">
              You can participate in quizzes to get a place on the leaderboard
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-400">
              Do you have what it takes?
            </p>
            <div className="">
              <button 
              onClick={handleQuizClick}
              className="mt-6 m-5 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
            >
              The Quiz Realm
            </button>
            <button 
              onClick={weekly}
              className="mt-6 sm:mt-8 px-6  sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base"
            >
              Weekly Quizes
            </button>
            </div>
            
            
          </div>
        </div>
      </div>

      {showWelcomeModal && location.pathname === '/' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-800/95 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full transform transition-all duration-500 ease-in-out ${
            isSliding 
              ? 'translate-x-[-100vw] opacity-0 scale-75' 
              : 'translate-x-0 opacity-100 scale-100'
          }`}>
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Welcome To Mind-Spark
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Resharpen your mind and dive into the Realm Of Nexus. 
                Test your knowledge and compete with the best minds globally.
              </p>
              
              <button
                onClick={handleWelcomeNext}
                className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showChallengeModal && location.pathname === '/' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-800/95 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full transform transition-all duration-500 ease-in-out ${
            isSliding 
              ? 'translate-x-[100vw] opacity-0 scale-75' 
              : 'translate-x-0 opacity-100 scale-100'
          }`}>
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
                <div className="relative">
                  <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-purple-400" />
                  <div className="absolute inset-0 bg-purple-400/30 blur-md rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Do You Have What It Takes?
              </h2>
              
              <div className="space-y-3 sm:space-y-4 text-gray-300">
                <p className="text-base sm:text-lg">
                  Challenge yourself with advanced concepts of  the world's first Super Computer and compete on our global leaderboard.
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-400">
                  <Trophy className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  <span>Prove your expertise and earn your place among the top minds</span>
                </div>
              </div>
              
              <button
                onClick={handleChallengeAccept}
                className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                <span>Accept Challenge</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showUsernameModal && location.pathname === '/' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`bg-gray-800/95 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full transform transition-all duration-500 ease-in-out ${
            isSliding 
              ? 'translate-x-[100vw] opacity-0 scale-75' 
              : 'translate-x-0 opacity-100 scale-100'
          }`}>
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="relative">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
                    <div className="absolute inset-0 bg-blue-400/30 blur-md rounded-full animate-pulse"></div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Enter Your Username
                  </h2>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  We'll use this to track your progress on the leaderboard
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-sm sm:text-base pr-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                    autoFocus
                  />
                  <User className="absolute right-3 top-3 sm:top-3.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                
                <button
                  onClick={handleUsernameSubmit}
                  disabled={!discordUsername.trim()}
                  className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homee;
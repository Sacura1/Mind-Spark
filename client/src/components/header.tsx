import  { useState } from 'react';
import { Menu, X, Zap, BarChart3 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-gray-800/50 relative">
      <div className="max-w-full mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="h-8 w-8 text-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Mind-Spark
                </span>
              </div>
            </div>
            <nav className="hidden lg:flex items-center space-x-1">
              <a href="/leaderboard" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                <BarChart3 className="h-4 w-4" />
                <span>Leaderboard</span>
              </a>
              <a href="/weekly-leaderboard" className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200">
                <BarChart3 className="h-4 w-4" />
                <span>Weekly Leaderboard</span>
              </a>
            </nav>
          </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 z-40">
            <div className="px-6 py-4 space-y-4">
              <a href="/leaderboard" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 py-2">
                <BarChart3 className="h-4 w-4" />
                <span>Leaderboard</span>
              </a>
            </div>
          </div>
        )}
        </header>
  );
};

export default Header;
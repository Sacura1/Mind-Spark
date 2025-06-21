import { useState, useEffect } from "react";
import { Clock, Trophy, CheckCircle, Zap, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
}

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(80);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const discordUsername = localStorage.getItem('username') || 'Guest';
  const navigate = useNavigate();

useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/questions');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const randomQuestions = shuffled.slice(0, 20);
      setQuestions(randomQuestions);
    } catch (error) {
      console.error('Error fetching questions, using fallback:', error);
      const fallbackQuestions = [
        {
          id: 1,
          question: "What is the primary advantage of blockchain's distributed ledger technology?",
          options: [
            "Faster processing speeds",
            "Decentralization and immutability",
            "Lower energy consumption",
            "Better user interfaces"
          ],
          correct_answer: 1
        },
      ];
      const randomFallback = [...fallbackQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);
      setQuestions(randomFallback);
      console.log("Using fallback questions:", randomFallback);
    } finally {
      setIsLoading(false);
    }
  };
  fetchQuestions();
}, []);

  const handleQuizEnd = async () => {
  setQuizCompleted(true);
  setEndTime(Date.now());
  const correctAnswers = calculateScore();
  const timeTaken = Math.floor((Date.now() - startTime!) / 1000);
  const username = localStorage.getItem('username') || discordUsername;
  const isWeeklyQuiz = window.location.pathname.includes('weekly-quiz');
  try {
    const endpoint = isWeeklyQuiz 
      ? `${import.meta.env.VITE_API_URL}/api/weekly_leaderboard` 
      : `${import.meta.env.VITE_API_URL}/api/scores`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username, 
        score: correctAnswers, 
        timeTaken 
      })
    });
    if (!response.ok) throw new Error('Failed to save score');
    navigate(isWeeklyQuiz ? '/weekly-leaderboard' : '/leaderboard');
  } catch (error) {
    console.error('Error saving score:', error);
    const storageKey = isWeeklyQuiz ? 'weeklyQuizLeaderboard' : 'quizLeaderboard';
    const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newEntry = { 
      username, 
      score: correctAnswers, 
      timeTaken, 
      timestamp: Date.now() 
    };
    localStorage.setItem(storageKey, JSON.stringify([...existing, newEntry]));
    navigate(isWeeklyQuiz ? '/weekly-leaderboard' : '/leaderboard');
  }
};

  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizEnd();
    }
  }, [quizStarted, quizCompleted, timeLeft]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
    setShowStartModal(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answerIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizEnd();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-2xl mx-auto w-full">
            <div className="mb-4 md:mb-8">
              <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                <div className="relative">
                  <Brain className="h-8 w-8 md:h-12 md:w-12 text-purple-400" />
                  <div className="absolute inset-0 bg-purple-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Mind-Spark Quiz
                </h1>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 text-gray-300 mb-6 md:mb-8">
              <p className="text-base md:text-lg lg:text-xl">
                Ready to test your knowledge about Nexus?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm">
                <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-purple-400 font-semibold text-xs md:text-sm">Questions</div>
                  <div className="text-xl md:text-2xl font-bold">{questions.length}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-blue-400 font-semibold text-xs md:text-sm">Time Limit</div>
                  <div className="text-xl md:text-2xl font-bold">80 sec</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                  <div className="text-cyan-400 font-semibold text-xs md:text-sm">Difficulty</div>
                  <div className="text-xl md:text-2xl font-bold">Expert</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowStartModal(true)}
              className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500
               to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600
                hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg
                 text-sm md:text-base"
            >
              Start Quiz
            </button>
          </div>
        </div>

        {showStartModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/95 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 md:p-8 max-w-md w-full">
              <div className="text-center space-y-4 md:space-y-6">
                <div className="flex items-center justify-center">
                  <Zap className="h-10 w-10 md:h-12 md:w-12 text-yellow-400" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Ready to Begin?</h2>
                <p className="text-gray-300 text-sm md:text-base">
                  You'll have 80 seconds to answer {questions.length} questions about Nexus (The world's supercomputer). 
                  Your score and time will be recorded on the leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowStartModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all text-sm md:text-base"
                  >
                    Start Now!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (quizCompleted) {
    const score = calculateScore();
    const timeTaken = Math.floor((endTime! - startTime!) / 1000);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/95 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 md:p-8 max-w-md w-full text-center">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-center">
              <Trophy className="h-12 w-12 md:h-16 md:w-16 text-yellow-400" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Quiz Completed!
            </h2>
            
            <div className="space-y-3 md:space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-gray-400 text-xs md:text-sm">Your Score</div>
                <div className={`text-2xl md:text-3xl font-bold ${getScoreColor(score, questions.length)}`}>
                  {score}/{questions.length}
                </div>
                <div className="text-xs md:text-sm text-gray-400">
                  {Math.round((score / questions.length) * 100)}% Correct
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-gray-400 text-xs md:text-sm">Time Taken</div>
                <div className="text-xl md:text-2xl font-bold text-blue-400">
                  {formatTime(timeTaken)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm md:text-base"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => {navigate('/leaderboard');}}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-sm md:text-base"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4 gap-3">
            <div className="flex items-center space-x-2 md:space-x-3">
              <Brain className="h-6 w-6 md:h-8 md:w-8 text-purple-400" />
              <span className="text-lg md:text-xl font-bold text-white">Mind-Spark Quiz</span>
            </div>
            <div className="flex items-center justify-end space-x-2 md:space-x-4">
              <div className="flex items-center space-x-1 md:space-x-2 text-yellow-400">
                <Clock className="h-4 w-4 md:h-5 md:w-5" />
                <span className="font-mono text-base md:text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-1.5 md:h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-5 md:p-6 lg:p-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 leading-relaxed">
            {currentQ.question}
          </h2>
          
          <div className="grid gap-2 md:gap-3 lg:gap-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-3 md:p-4 rounded-lg border text-left transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className={`min-w-[20px] h-5 w-5 flex items-center justify-center rounded-full border ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-500'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    )}
                  </div>
                  <span className="flex-1 text-sm md:text-base">{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-6 md:mt-8 gap-4">
            <div className="text-xs md:text-sm text-gray-400">
              {selectedAnswers[currentQuestion] === undefined 
                ? "Select an answer to continue" 
                : "Answer selected"}
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="w-full sm:w-auto px-5 py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
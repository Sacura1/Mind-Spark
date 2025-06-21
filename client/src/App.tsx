import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import { Routes, Route } from "react-router-dom";
import Quiz from "./components";
import Homee from "./components/home";
import Leaderboard from "./components/leaderboard";
import WeeklyLeaderboard from "./components/weekly_leaderboard";
import Weekly from "./components/weekly";

const App: React.FC = () => {

return (
  <>
    <Header/>
    <Routes>
      <Route path="/" element={<Homee/>}/>
      <Route path="/quiz" element={<Quiz/>} />
      <Route path="/leaderboard" element={<Leaderboard/>} />
      <Route path="/weekly-leaderboard" element={<WeeklyLeaderboard/>} />
      <Route path="/weekly-quiz" element={<Weekly/>}/>
    </Routes>
    <Footer/>
  </>
);
};

export default App;

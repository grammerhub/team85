import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/ChatPage";
import Navbar from "./components/Navbar";

function App() {
  return (
      
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path='/tutor' element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;

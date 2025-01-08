import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PasswordManager from "./components/PasswordManager";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
	<Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-manager" element={<PasswordManager />} />
        {/* Можно добавить домашнюю страницу или редирект */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

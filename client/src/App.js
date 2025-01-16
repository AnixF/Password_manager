import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import PasswordManager from "./components/PasswordManager";
import Register from "./components/Register";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <Router>
      <Routes>
	<Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-manager" element={<PasswordManager />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        {/* Можно добавить домашнюю страницу или редирект */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
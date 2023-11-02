import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Profile } from "./views/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

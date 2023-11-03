import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Profile } from "./views/Profile";
import { Edit } from "./views/Edit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

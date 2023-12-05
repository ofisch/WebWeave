import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Profile } from "./views/Profile";
import { Edit } from "./views/Edit";
import { LogData } from "./views/LogData";
import Creations from "./views/Creations";
import FrontPage from "./views/FrontPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/generator" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/logs" element={<LogData />}></Route>
        <Route path="/creations" element={<Creations />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

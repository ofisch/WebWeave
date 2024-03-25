import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Profile } from "./views/Profile";
import { Edit } from "./views/Edit";
import { LogData } from "./views/LogData";
import FrontPage from "./views/FrontPage";
import { ComponentGenerator } from "./views/ComponentGenerator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/generator" element={<Home />} />
        <Route path="/component" element={<ComponentGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit" element={<Edit />}></Route>
        <Route path="/logs" element={<LogData />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

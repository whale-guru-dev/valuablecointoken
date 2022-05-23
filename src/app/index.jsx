import React from "react";
import { Routes , Route } from "react-router-dom";
import Home from "./routes/Home";
import Staking from "./routes/Staking";
import WalletModal from "./components/WalletModal";

function App() {
  return (
    <div>
      <WalletModal />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/staking" element={<Staking/>}/>
      </Routes>
    </div>
  );
}

export default App;

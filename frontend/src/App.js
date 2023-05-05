import React from 'react';
import './App.css';
import Header from './components/Headers';
import {Routes, Route} from 'react-router-dom';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";

function App() {
  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/user" element={<Welcome />}></Route>
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;

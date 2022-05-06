import './App.css';
import React from 'react';
import { Route, Routes, Link } from "react-router-dom";
import PastProjects from './PastProjects';
import Home from './Home';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div>
          <nav>
            <ul id="navigation">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/projects" element={<PastProjects />}/>
        </Routes>
      </div>
    );
  }
}

export default App;

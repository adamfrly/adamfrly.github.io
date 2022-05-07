import './App.css';
import React from 'react';
import { Route, Routes, Link } from "react-router-dom";
import PastProjects from './PastProjects';
import Home from './Home';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className='App-nav'>
          <nav>
            <ul class="App-nav" id="navigation">
              <li>
                <Link to="/" style={{ textDecoration: 'none' }}>Home</Link>
              </li>
              <li>
                <Link to="/projects" style={{ textDecoration: 'none' }}>Projects</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/projects" element={<PastProjects />}/>
        </Routes>
      </div>
    );
  }
}

export default App;

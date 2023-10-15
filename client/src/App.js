import "./styles.css";
import { Component } from "react";
import * as React from 'react';
import Home from "./routes/Home";
import "./components/NavbarStyles.css";
import Contact from './routes/Contact';
import About from './routes/About';
import Process from './routes/Process';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
} from 'react-router-dom';
class App extends Component {
  state = { clicked: false };
  handleclicked = () => {
    this.setState({ clicked: !this.state.clicked })
  }
  render() {
    return (
      <>

        <div className="">
          <Router>
            <div>
              <nav className="NavbarItems">
                <h1 className="navbar-logo">FASHION-CHEK <span role="img" aria-label="cloth">👗</span></h1>
                <div className="menu-icon" onClick={this.handleclicked}>
                  <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>

                </div>
                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                  <li>
                    <Link className="nav-link" to="/"><i class="fa-solid fa-house-user"></i>Home</Link>
                  </li>
                  <li>
                    <Link className="nav-link" to="/about"><i class="fa-solid fa-circle-info"></i>About</Link>
                  </li>
                  <li>
                    <Link className="nav-link" to="/process"><i class="fa-solid fa-briefcase"></i>process</Link>
                  </li>
                  <li>
                    <Link className="nav-link" to="/contact"><i className="fa-solid fa-address-book"></i>Contact</Link>
                  </li>
                  <li>
                    <Link className="nav-link-btn" >signup</Link>
                  </li>
                  <button>Sign Up</button>
                </ul>
              </nav>
            </div>

            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/process" element={<Process />} />
            </Routes>
          </Router>




        </div>
      </>
    );
  }
}

export default App;




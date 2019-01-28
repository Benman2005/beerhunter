import React, { Component } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Map from "./components/Map";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/map" component={Map} />
            <Route exact path="/" component={HomePage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

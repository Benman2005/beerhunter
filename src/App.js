import React, { Component } from "react";
import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import DetailsPage from "./components/DetailsPage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <div className="header">
              <h1>The Beer Hunter</h1>
            </div>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/:name" component={DetailsPage} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

import "./App.css";
import React, { Component } from "react";
import WebcamWithRef from "./Webcam";
import Counter from "./Counter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Real Cart</h1>
        <div className="lock">
          <WebcamWithRef className="webcam" />
          <img src="img/key2.png" alt="" className="graphic"></img>
          <div className="number-container">
            <Counter />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

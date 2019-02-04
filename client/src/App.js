import React, { Component } from "react";
// subcomponents
import Start from './components/Start';
import Game from './components/Game';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      intervalIsSet: false
    }
  }
  
  componentDidMount() {
    this.getDataFromDb();
  }
  
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };
  
  // Here is our UI
  render() {
    const { data } = this.state;
    console.log(data);
    if (data.length === 0){
      return (
        <div className="App">
          <Start></Start>
        </div>
      );
    }else{
      return (
        <div className="App">
          < Game></Game>
        </div>
      );
    }
    
  }
}

export default App;
import React from 'react';
import './app.css';
import './loading.css';
import * as d3 from 'd3';
import { stateManager } from './state_manager';


class App extends React.Component {
  state = { fetchedData: '' };

  render() {
    if (stateManager.loading) {
      return (<div className="loader"></div>
      )
    }
    return (
      <div>
        {this.state.fetchedData}
      </div>
    );
  }

  async componentDidMount() {
    const fetchedData = (await stateManager.fetch());
    // Code to run after component has loaded
    this.setState(state => ({ ...state, fetchedData }));
  }
}

export default App;

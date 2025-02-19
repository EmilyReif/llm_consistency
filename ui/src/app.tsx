import React from 'react';
import './app.css';
import Datatable from './datatable';
import Scatterplot from './scatterplot';
import SingleExample from './single_example';
import * as d3 from 'd3';
import { state } from './state';


function App() {
  return (
    <div className="app">
      <Datatable></Datatable>
      <div>
        <div className='scatterplots-holder'>
          <Scatterplot />
        </div>
        <SingleExample></SingleExample>
      </div>
    </div>
  );
}

export default App;

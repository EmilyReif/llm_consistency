import React from 'react';
import './app.css';
import Datatable from './datatable';
import Scatterplot from './scatterplot';
import SingleExample from './single_example';
import SingleExampleApp from './single_example_app';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function renderDatasetView() {
  return <div className="app">
    <Datatable></Datatable>
    <div>
      <div className='scatterplots-holder'>
        <Scatterplot />
      </div>
      <SingleExample></SingleExample>
    </div>
  </div>
}
function renderSingletonView() {
  return <SingleExampleApp></SingleExampleApp>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/input" element={renderSingletonView()} />
        <Route path="/" element={renderDatasetView()} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;

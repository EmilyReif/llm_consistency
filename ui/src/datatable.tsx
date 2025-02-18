import React from 'react';
import { state } from './state';
import './datatable.css';
import { observer } from "mobx-react";

class Datatable extends React.Component {
  state = { data: {}, loading: true, keyToSortBy: '', ascending: false };

  render() {

    return (
      <div className="Datatable">
        <div className='all-tables'>
          {this.renderTable()}
        </div>
      </div>
    );
  }

  renderTable() {
    const transforms = [
      'original question',
      'lowercase',
      'uppercase',
      'shuffle',
      'french',
      'german',
      'chinese',
      'russian',
      'use long and flowery words, but keep the meaning the same',
      'use short words (ie, 3rd grade reading level or simple english wikipedia)',
    ];
    return transforms.map(transform =>
      <div className='table'>
        {this.renderHeader(transform)}
        {this.renderData(transform)}
      </div>
    )
  }

  renderHeader(header: string) {
    const selected = this.state.keyToSortBy == header;
    const ascending = selected && this.state.ascending;
    const icon = ascending ? '▲' : '▼';
    const handleClick = () => {
      this.setState(state => ({ ...state, keyToSortBy: header, ascending: !ascending}));
    }
    return <div  onClick={() => handleClick()}
      className={selected ? 'header-selected header line' : 'header line'}
      key={`${header}`}>
      <span>{header}</span>
      <span className='icon'>{icon}</span>
    </div>
  }

  renderData(header: string) {
    const {loading, keyToSortBy, ascending} = this.state;
    if (loading) {
      return this.renderLoading();
    }
    let data = state.getDataColumn(header);
    let consistencyValues = state.getConsistencyValues(header);

    // Sort table if needed.
    if (keyToSortBy) {
      const sortArray = state.getConsistencyValues(keyToSortBy);
      data = state.sortArrayByOther(data, sortArray, ascending);
      consistencyValues = state.sortArrayByOther(consistencyValues, sortArray, ascending);
    }


    return data.map((example: string, i: number) => {

      const handleSelect = (example: string) => {
        state.selectedExample = example;
      };

      const consistencyVal = consistencyValues[i];
      const style = { background: state.colorScale(consistencyVal) };
      const className = state.selectedExample == example ? 'line selected' : 'line';
      return <div
        className={className}
        key={`${example} ${i}`}
        style={style}
        onClick={() => handleSelect(example)}>
        {example}
        <div className='consistency-value'>{consistencyVal.toFixed(2)}</div>
      </div>
    }
    )
  }

  renderLoading() {
    return (<span className="loader"></span>)
  }

  async componentDidMount() {
    const data = await state.getData();
    const selectedExample = state.selectedExample;
    this.setState(state => ({ ...state, data, selectedExample, loading: false }));
  }
}

export default observer(Datatable);

import React from "react";
import './single_example.css';
import { observer } from "mobx-react";
import { state } from "./state"; // Import your MobX store
import SingleExample from './single_example';
import './single_example_app.css'
import './loading.css'

const DEFAULT_TEXT = 'Tell me a story';
class SingleExampleApp extends React.Component {
    state = { inputValue: DEFAULT_TEXT, temperature: state.temp, numGenerations: state.numGenerations };

    handleInputChange = (event: any) => {
        this.setState({ inputValue: event.target.value });
    }

    handleSliderChange = (event: any, param: string) => {
        this.setState({ [param]: parseFloat(event.target.value) });
    }

    handleSubmit = () => {
        state.temp = this.state.temperature;
        state.numGenerations = this.state.numGenerations;
        state.selectedExample = this.state.inputValue;
    }

    handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            this.handleSubmit();
        }
    }

    render() {
        return (
            <div className='single-input-holder'>
                <div className='controls'>
                    <div className="input-box">
                        <input
                            type="text"
                            className="input-field"
                            value={this.state.inputValue}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                        />
                        <div className="actions">
                            <button className="action-btn" onClick={this.handleSubmit}>˃</button>
                        </div>
                    </div>
                        <div className="slider-container">
                            <label><b>Temperature:</b> {this.state.temperature}</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={this.state.temperature}
                                onChange={(e) => this.handleSliderChange(e, 'temperature')}
                                onMouseUp={() => this.handleSubmit()}
                            />
                        </div>
                        <div className="slider-container">
                            <label><b>Number of Generations:</b> {this.state.numGenerations}</label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={this.state.numGenerations}
                                onChange={(e) => this.handleSliderChange(e, 'numGenerations')}
                                onMouseUp={() => this.handleSubmit()}
                            />
                        </div>
                </div>
                {state.loading ? this.renderLoading() : <SingleExample></SingleExample>}
            </div>
        );
    }


  renderLoading() {
    return (<span className="loader"></span>)
  }

    async componentDidMount() {
        state.selectedExample = DEFAULT_TEXT;
    }
}

export default observer(SingleExampleApp);
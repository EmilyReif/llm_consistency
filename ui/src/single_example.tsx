import React from "react";
import './single_example.css';
import { observer } from "mobx-react";
import { state } from "./state"; // Import your MobX store

class SingleExample extends React.Component {
    state = { generations: [], visType: 'basic' };
    render() {
        return (
            <div className="single-example">
                <div>
                    <div className='inout'><span>Input:</span></div>{state.selectedExample}
                </div>
                <div>
                    <div className='inout'><span>Outputs:</span></div>{this.renderOutputs()}
                </div>
            </div>
        );
    }

    renderOutputs() {
        const isFancy = this.state.visType === 'fancy';
        return (<div>
            {/* {this.renderRadioButtons()} */}
            {isFancy ? this.renderOutputsFancy() : this.renderOutputsBasic()}
        </div>)
    }

    renderRadioButtons() {
        const makeRadioButton = (label: string) => {
            const handleClick = (e: any) => {
                const visType = e.target.value;
                this.setState(state => ({ ...state, visType }))
            }
            return (
                <span>
                    <input
                        type="radio" 
                        id={label} 
                        name="rendertype" 
                        value={label} 
                        checked={this.state.visType == label}
                        onChange={handleClick}>
                    </input>
                    <label htmlFor={label}>{label}</label>
                </span>)
        }
        return (<div>
            {makeRadioButton('basic')}
            {makeRadioButton('fancy')}
        </div>)
    }

    renderOutputsFancy() {
        return <div className="outputs">
            {this.state.generations.map(generation => <div>{generation}</div>)}
        </div>;    }

    renderOutputsBasic() {
        return <div className="outputs">
            {this.state.generations.map(generation => <div>{generation}</div>)}
        </div>;
    }

    async componentDidUpdate() {
        if (state.selectedExample) {
            const oldGenerations = this.state.generations;
            let generations = await state.fetchGenerations(state.selectedExample);
            if (oldGenerations != generations) {
                this.setState(state => ({ ...state, generations }))
            }
        }
    }
}

export default observer(SingleExample);

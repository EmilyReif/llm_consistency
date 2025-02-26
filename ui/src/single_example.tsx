import React from "react";
import './single_example.css';
import { observer } from "mobx-react";
import { state } from "./state"; // Import your MobX store
import * as d3 from 'd3';
import SingleExampleWordtree from './single_example_wordtree';
import SingleExampleWordGraph from "./single_example_wordgraph";

class SingleExample extends React.Component {
    state = { generations: [], visType: 'treeMap' };
    render() {
        if (!state.selectedExample) {
            return;
        }
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
        let vis;
        switch (this.state.visType) {
            case 'treeMap':
                vis = this.renderOutputstreeMap();
                break;
            case 'graph':
                vis = this.renderOutputsGraph();
                break;
            default: 
            vis = this.renderOutputsBasic();

        }
        return (<div>
            {this.renderRadioButtons()}
            {vis}
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
            {makeRadioButton('treeMap')}
            {/* {makeRadioButton('graph')} */}
        </div>)
    }

    renderOutputstreeMap() {
        if (this.state.generations) {
            return <SingleExampleWordtree generations={this.state.generations}></SingleExampleWordtree>;
        }
    }
    renderOutputsGraph() {
        if (this.state.generations) {
            return <SingleExampleWordGraph generations={this.state.generations}></SingleExampleWordGraph>;
        }
    }

    renderOutputsBasic() {
        if (!this.state.generations) {
            return;
        }

        const sorted = [...this.state.generations ].sort();
        return <div className="outputs">
            {sorted.map(generation => <div>{generation}</div>)}
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

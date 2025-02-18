import React from 'react';
import { state } from './state';
import './scatterplot.css';
import './loading.css'
import * as d3 from 'd3';
import { observer } from "mobx-react";

const WIDTH = 800;
const HEIGHT = 500;
const PAD = 10;
// TODO: move to vega

class Scatterplot extends React.Component {
    state = { coords: [], data: [], consistencyValues: [], zoom: 1, projX: d3.scaleLinear(), projY: d3.scaleLinear() };


    render() {
        const { coords, data, consistencyValues} = this.state;

        const viewbox = `${-PAD} ${-PAD} ${WIDTH + PAD} ${HEIGHT + PAD}`;
        // Inline style object
        // Show nothing until the data is loaded.
        const style = {width: `${WIDTH}px`, height: `${HEIGHT}px`}
        if (!data.length) {
            return (
                <div className='holder' style={style}>
                    {this.gridlines('gridlines gridlines-x')}
                    {this.gridlines('gridlines')}
                    <span className="loader"></span>
                </div>
            );
        }

        const handleClick = (example: string) => {
            state.selectedExample = example;
        }
        return (
            <div className='holder'>
                {this.axes()}
                <svg viewBox={viewbox} width={WIDTH} height={HEIGHT}>
                    {coords.map(([x_raw, y_raw], i) => {
                        const consistencyVal = consistencyValues[i];
                        const [x, y] = this.projCoords(x_raw, y_raw);
                        const label = data[i];
                        const color = state.colorScale(consistencyVal);
                        return (
                            <circle
                                cx={x}
                                cy={y}
                                r={label == state.selectedExample ? '10' : '4'}
                                key={i}
                                fill={color}
                                opacity='.8'
                                strokeWidth='2'
                                stroke={label == state.selectedExample ? 'white' : color}
                                onClick={() => handleClick(label)}>
                                <title>{label}</title>
                            </circle>
                        )
                    })}
                </svg>
            </div>
        );
    }
    private gridlines(className: string) {
        const numGridLines = 5;
        const lines = [...Array(numGridLines)];
        return (
            <div className={className}>
                {lines.map((_, i) => {
                    return (<div className='gridline' key={i}></div>)
                })}
            </div>
        )
    }

    private axes() {
        const { projX, projY } = this.state;

        const [minX, maxX] = projX.domain();
        const [minY, maxY] = projY.domain();
        return (
            <div>
                <div className='axis x'>
                    <div className='tick'>{maxX.toFixed(2)}</div> umap 1
                    <div className='tick'>{minX.toFixed(2)}</div>
                </div>
                <div className='axis y'>
                    <div className='tick'>{minY.toFixed(2)}</div>
                    umap 2
                    <div className='tick'>{maxY.toFixed(2)}</div>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        // Lists of length <dataset>, with floats corresponding to how 
        // much it exhibits styleX or styleY feature.
        await state.getData();
        const { x, y } = await state.getCoords();

        const coords = x.map((_: any, i: number) => [x[i], y[i]]);

        // Get the x and y ranges.
        const projX = d3.scaleLinear(d3.extent(x) as any, [0, WIDTH]);
        const projY = d3.scaleLinear(d3.extent(y) as any, [0, HEIGHT]);

        const header = 'original question';
        const data = state.getDataColumn(header);

        const consistencyValues = state.getConsistencyValues(header);

        this.setState(state => ({ ...state, coords, data, projX, projY, consistencyValues }));
    }
    private projCoords(x: number, y: number) {
        const { projX, projY } = this.state;
        return [projX(x), projY(y)]
    }
}

export default observer(Scatterplot);

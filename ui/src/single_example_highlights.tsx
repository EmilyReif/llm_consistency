import React from "react";
import './single_example_highlight.css';
import { observer } from "mobx-react";
import { observable } from "mobx";

import { state } from "./state"; // Import your MobX store
import * as d3 from 'd3';
interface Props {
    generations: string[];
}

class SingleExampleHighlights extends React.Component<Props> {
    state = { hoveredToken: '' };

    render() {
        if (!this.props.generations) {
            return;
        }
        const [stems, allSubstrings] = this.getAllSubstrings(this.props.generations).slice(0, 50);
        const colorScheme = d3.scaleOrdinal(d3.schemeAccent).domain(stems);

        const sorted = [...this.props.generations].sort();
        return <div className="outputs">
            {sorted.map(generation => {
                let genString = generation;
                allSubstrings.forEach(substring => {
                    const relevantStem = stems.find(stem => stem.includes(substring)) || stems[0];
                    // const color = d3.color(colorScheme(substring)) as any;
                    const color = d3.color(colorScheme(relevantStem)) as any;
                    color.opacity = .2;
                    genString = genString.replace(substring, `<span style='background-color:${color}'> ${substring}</span>`)
                })
                return (<div className='highlight-line' dangerouslySetInnerHTML={{__html: genString}}></div>);
            })}
        </div>;
    }

    getAllSubstrings(generations: string[]) {
        const allSubstringCounts: { [key: string]: number } = {}
        for (let generationString of generations) {
            let i, j, result = [];
            const generation = generationString.split(' ');

            for (i = 0; i < generation.length; i++) {
                for (j = i + 1; j < generation.length + 1; j++) {

                    const substringArr = generation.slice(i, j);
                    const substring = substringArr.join(' ');
                    if (!(substring in allSubstringCounts)) {
                        allSubstringCounts[substring] = 0;
                    }
                    allSubstringCounts[substring] += 1;
                }
            }
        }

        // Remove counts of 1
        const allSubstringCountsFiltered = Object.entries(allSubstringCounts)
            .filter(([substring, count]) => count > 2 && substring.length > 5)
            .sort((a, b) => b[1] - a[1]) // sort by counts
            .sort((a, b) => b[0].length - a[0].length) // sort by substring length
            .map(([substring, count]) => substring)

        const stems: string[] = [];
        allSubstringCountsFiltered.forEach((substring) => {
            if (!stems.join('').includes(substring)) {
                stems.push(substring);
            }
        })

        return [stems, allSubstringCountsFiltered];
    }
}



export default observer(SingleExampleHighlights);

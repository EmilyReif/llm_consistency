import * as d3 from 'd3';
import { makeAutoObservable } from "mobx";

const BASE_URL = 'http://localhost:5432';

class State {
    protected data: { [key: string]: string[] } = {};
    protected coords: { x: number[], y: number[] } = { x: [], y: [] }
    protected loading = false;
    selectedExample: string = '';
    generationsCache: { [key: string]: string[] } = {};

    colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 1]);
    // colorScale = d3.scaleSequential(d3.interpolateHsl('gray', 'midnightblue')).domain([0, 1]);

    constructor() {
        makeAutoObservable(this);
    }

    getDataColumn(header: string) {
        const dataOfType = (this.data as any)[header];
        return Object.values(dataOfType).map((k, v) => k) as string[];
    }

    getConsistencyValues(header: string) {
        const cosSimKey = `cos_sim_${header}`;
        return this.getNumericalDataColumn(cosSimKey)
    }

    getNumericalDataColumn(header: string) {
        const stringList = this.getDataColumn(header);
        return stringList.map(element => parseFloat(element))
    }

    sortArrayByOther(toBeSorted: any[], toSortBy: any[], ascending: boolean) {
        return toBeSorted
            .map((value, index) => ({ value, index: toSortBy[index] })) // Pair elements with sort index
            .sort((a, b) => ascending ? a.index - b.index: b.index - a.index) // Sort by index
            .map(({ value }) => value); // Extract sorted values
    }

    async fetchData() {
        const url = `${BASE_URL}/get_dataset`;
        this.loading = true;
        this.data = await d3.json(url) as any;
        this.loading = false;
    }

    async getData() {
        if (!Object.keys(this.data).length) {
            await this.fetchData();
        }
        return this.data;
    }

    /**
     * Get the coordinates of each datapoint along the generated axis.
     * Coordinates are returned in order of the original dataset.
     * @param sortName 
     */
    async fetchCoords() {
        await this.getData();
        const x = this.getNumericalDataColumn('umap_x');
        const y = this.getNumericalDataColumn('umap_y');

        // Extract the scores
        this.coords = { x, y }
    }

    async getCoords() {
        if (!this.coords.x.length) {
            await this.fetchCoords();
        }
        return this.coords;
    }

    async fetchGenerations(input: string) {
        if (!input) {
            return [];
        }
        if (input in this.generationsCache) {
            return this.generationsCache[input];
        }

        const url = `${BASE_URL}/get_generations?&input=${input}`;
        this.loading = true;
        const result = (await d3.json(url) as any)['generations'];
        this.generationsCache[input] = result;
        this.loading = false;
        return result;
    }


}

export const state = new State();
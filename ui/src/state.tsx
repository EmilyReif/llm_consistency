import * as d3 from 'd3';
import { makeAutoObservable } from "mobx";

const BASE_URL = 'http://localhost:5432';
const DEFAULT_NUM_GENERATIONS = 10;
const DEFAULT_TEMP = .7;

class State {
    protected data: { [key: string]: string[] } = {};
    protected coords: { x: number[], y: number[] } = { x: [], y: [] }
    loading = false;
    selectedExample: string = '';
    temp: number = DEFAULT_TEMP;
    numGenerations: number = DEFAULT_NUM_GENERATIONS;
    generationsCache: { [example: string]: { [temp: number]: { [numGenerations: number]: string[] } } } = {};

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
            .sort((a, b) => ascending ? a.index - b.index : b.index - a.index) // Sort by index
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

    async fetchGenerations() {
        const input = this.selectedExample;
        if (!input) {
            return [];
        }
        // TODO: Currently, if the generation was in the original giant cache, it is not recalculated if n or temp changes.
        const cachedValue = this.generationsCache[input]?.[this.temp]?.[this.numGenerations];
        if (cachedValue) {
            return cachedValue;
        }
        let url = `${BASE_URL}/get_generations?&input=${input}&n=${this.numGenerations}&temp=${this.temp}`;
        this.loading = true;
        const result = (await d3.json(url) as any)['generations'];

        // Create dictionary entries when needed, and then cache the result value.
        this.generationsCache[input] ??= {};
        this.generationsCache[input][this.temp] ??= {};
        this.generationsCache[input][this.temp][this.numGenerations] ??= result;

        this.loading = false;
        return result;
    }
}

export const state = new State();
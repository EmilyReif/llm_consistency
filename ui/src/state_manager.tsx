import * as d3 from 'd3';

// TODO: figure out how to do better state management. Maybe observable?
const BASE_URL = 'http://localhost:5432';


class StateManager {
    public result: string = '';
    public loading = true;

    async fetch() {
        console.log('called fetch')
        const url = `${BASE_URL}/hi_world`;
        this.loading = true;
        console.log(this.loading)

        const rawRes = await d3.json(url) as any;
        this.loading = false;
        this.result = rawRes['a test key'];
        return this.result;
    }
}

export const stateManager = new StateManager();
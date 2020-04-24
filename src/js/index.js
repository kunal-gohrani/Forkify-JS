// Global app controller
// http://forkify-api.herokuapp.com/
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */

const state = {};

const controlSearch = async() => {
    // 1) Get Query from view (TODO)
    const query = searchView.getInput(); //TODO
    console.log(query);

    if (query) {
        // 2) New Search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results (TODO)
        searchView.clearInput();
        searchView.clearResults();

        // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results on UI (TODO)
        console.log(state.search.result);
        searchView.renderResults(state.search.result);

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
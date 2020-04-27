// Global app controller
// http://forkify-api.herokuapp.com/
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */

const state = {};

/**SEARCH CONTROLLER */
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
        renderLoader(elements.searchResult);

        try {
            // 4) Search for recipes
            await state.search.getResults();
            // 5) Render results on UI (TODO)
            clearLoader();
        } catch (error) {
            alert('error processing recipe search');
            clearLoader();
        }
        // console.log(state.search.result);
        searchView.renderResults(state.search.result);

    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.resultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        console.log(goToPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
    // console.log(`Closest = ${btn}`);
    // console.log(e.target);
});


/**RECIPE CONTROLLER */
const controlRecipe = async() => {
    // Get ID of recipe from URL
    const id = window.location.hash.replace('#', ''); // hash is the query overhere, or the recipe ID
    if (id) {
        // prepare UI for changes
        recipeView.clearResults();
        renderLoader(elements.recipe);
        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
        } catch (error) {
            alert('error processing recipe');
        }


        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();

        // Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe);
        console.log(state.recipe);
    }
};

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1)
            state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
})
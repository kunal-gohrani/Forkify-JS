// Global app controller
// http://forkify-api.herokuapp.com/
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
    //console.log(query);

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
        //console.log(goToPage);
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
            //console.log(state.recipe.ingredients);
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
        //console.log(state.recipe);
    }
};

/**Shopping list controller */
const controlList = () => {
    //create new list if none yet
    if (!state.list)
        state.list = new List();

    // Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(e.target);
    // Handle the delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state and UI
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        console.log(e.target.value);
        state.list.updateCount(id, val);
    }
})


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);

/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1)
            state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    //console.log(state.recipe);
});

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => { likesView.renderLike(like) });
});
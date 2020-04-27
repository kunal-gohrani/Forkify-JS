import { elements } from './base';

const renderRecipe = recipe => {
    const markup = `
    <li>
    <a class="results__link results__link--active" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)

        //return newTitle
        return `${newTitle.join(' ')}...`;
    }
    return title;
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'?page-1:page+1}>
    <span>Page ${type==='prev'?page-1:page+1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type==='prev'?'left':'right'}"></use>
        </svg>
        
    </button> 
`
const pageButtons = (page, numResults, resultPerPage) => {
    const numberOfPages = Math.ceil(numResults / resultPerPage);
    let button;
    if (page == 1 && numberOfPages > 1) {
        //Button to goto next page
        button = createButton(page, 'next');
    } else if (page == numberOfPages && numberOfPages > 1) {
        //only previous button
        button = createButton(page, 'prev');
    } else if (page < numberOfPages) {
        //button to goto previous or next page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    }
    elements.resultsPages.insertAdjacentHTML('afterbegin', button);

}

export const getInput = () => elements.searchInput.value;

export const renderResults = (recipes, page = 1, resultPerPage = 10) => {
    const numberOfResults = recipes.length
    let start = (page - 1) * 10;
    start = numberOfResults > start ? start : numberOfResults;
    let end = page * 10;
    end = numberOfResults > end ? end : numberOfResults;
    recipes = recipes.slice(start, end);
    recipes.forEach(renderRecipe);

    // pagination of results
    pageButtons(page, numberOfResults, resultPerPage);
};

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = "";
    elements.resultsPages.innerHTML = "";
};
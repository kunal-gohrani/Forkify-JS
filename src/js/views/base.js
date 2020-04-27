export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResultList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'),
    resultsPages: document.querySelector(".results__pages"),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesList: document.querySelector('.likes__list'),
    likesMenu: document.querySelector('.likes__panel')

};

export const renderLoader = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.parentNode.removeChild(loader);
    }
}
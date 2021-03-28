// import async functions to comunicate with the API
import {
    getTrendings,
    getTrendingsSearch,
    getSuggestions,
    getSearchByWord,
    getSearchById,
    downloadGifFunction,
} from "./services.js";

window.onload = function () {
    themeLoad(); //load de diurn or nocturn theme as appropriate
    loadMyGifsFromLS(); // load my gifs from LS
    loadFavoritesFromLS(); // load favorites from LS
    showTrending(); //load the trendings carousel
    showTrendingSearch(); //load the trendings search suggestions
};

let myGifs = []; //for use with localStorage in my gifs case
let myFavorites = []; //for use with localStorage in my favorites case

//function load favorites from LocalStorage
function loadFavoritesFromLS() {
    let favoriteGifs = JSON.parse(localStorage.getItem("myFavorites"));
    if (favoriteGifs) {
        myFavorites = favoriteGifs;
    }
    console.log("Favorites Loaded");
    console.log(myFavorites);
}

//function load myGifs from LocalStorage
function loadMyGifsFromLS() {
    let myOwnGifs = JSON.parse(localStorage.getItem("myGifs"));
    if (myOwnGifs) {
        myGifs = myOwnGifs;
    }
    console.log("My Gifs Loaded");
    console.log(myGifs);
}

//FOR THEMES
let themeName = ""; //create theme name variable global for use later

// FOR BURGER MENU IN MOBILE MODE -------------
let navIcon = document.getElementById("navIcon"); //burger or X image
let navMenu = document.getElementById("navMenu"); //options menu
let searchIcon = document.getElementById("searchIcon"); // search icon
let searchingIcon = document.getElementById("searchingIcon"); // the search icon appears on the left of the search bar
let navIconImageClose = "";
let navIconImageBurger = "";
let searchIconImage = "";
let ilustraHeader = document.getElementById("ilustraHeader");

let searching = false; //variable to know if searching mode is active or not

// burguer menu changes
navIcon.addEventListener("click", () => {
    changeIconBurger();
});

//function to change the burger menu icon when the user clicks on it
function changeIconBurger() {
    if (navMenu.style.display === "" || navMenu.style.display === "none"){
        navIcon.src = navIconImageClose;
        navMenu.style.display = "block";
    } else {
        navIcon.src = navIconImageBurger;
        navMenu.style.display = "none";
        // navMenu.style.display = "none";
    }
}
// END FOR BURGER MENU IN MOBILE MODE ---------

//THEMES ------------------------------------------------
let logo = document.getElementById("logo"); //para poder cambiar al logo modo light o dark

// function to set a given theme/color-scheme and icons update
function setTheme(theme) {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
    iconsUpdate();
}

//function to update de icons between light or dark theme in order to selected mode
function iconsUpdate() {
    // for the icons, principal logo and search icon
    if (themeName === "theme-light") {
        logo.src = "./images/logo-mobile.svg"; //principal logo light mode
        navIconImageClose = "./images/close.svg"; // X icon in light mode
        navIconImageBurger = "./images/burger.svg"; // burger icon in light mode
        searchIconImage = "./images/icon-search.svg"; //search icon in light mode
    } else {
        logo.src = "./images/logo-mobile-modo-noct.svg"; //principal logo dark mode
        navIconImageClose = "./images/close-modo-noct.svg"; // X icon in dark mode
        navIconImageBurger = "./images/burger-modo-noct.svg"; // burger icon in dark mode
        searchIconImage = "./images/icon-search-modo-noct.svg"; // search icon in dark mode
    }

    //update the burger icon
    navMenu.style.display === "none" || navMenu.style.display === ""
        ? (navIcon.src = navIconImageBurger)
        : (navIcon.src = navIconImageClose);

    //update the search icon
    searching
        ? (searchIcon.src = navIconImageClose)
        : (searchIcon.src = searchIconImage);
    //update the searching icon
    searchingIcon.src = searchIconImage;
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem("theme") === "theme-dark") {
        themeName = "theme-light";
        changeMode.textContent = "Modo Nocturno";
        setTheme(themeName);
    } else {
        themeName = "theme-dark";
        changeMode.textContent = "Modo Diurno";
        setTheme(themeName);
    }
}

//load the teme saved on localStorage
function themeLoad() {
    if (localStorage.getItem("theme") === "theme-dark") {
        themeName = "theme-dark";
        setTheme(themeName);
    } else {
        themeName = "theme-light";
        setTheme(themeName);
    }
}

// nocturn or light mode menu option
let changeMode = document.getElementById("changeMode");
changeMode.addEventListener("click", () => {
    toggleTheme();
    changeIconBurger();
});

//END THEMES ------------------------------------------------------

//SEARCH SECTION --------------------------------------------------
let sectionSearch = document.getElementById("sectionSearch"); //gets the Section node corresponding to the search, to be able to hide it and show it accordingly
let search = document.getElementById("search"); //gets the div node that contains the Div node for search bar, and the div node for the hints
let searchContainer = document.getElementById("searchContainer"); //gets the div node that contains the search bar
let resultsTitle = document.getElementById("resultsTitle"); //gets the h2 node to put the search text  title in it
let searchSuggestion = document.getElementById("searchSuggestion");

//when usr click in search icon
searchIcon.addEventListener("click", searchPrepare);

//function that shows SUGGESTIONS TO SEARCH
async function showSuggestions(word) {
    try {
        const info = await getSuggestions(word);
        searchSuggestion.innerHTML = "<hr>";

        if (info.length > 0) {
            // only if the fetch brings data
            searchSuggestion.style.display = "block"; //show the suggestions container

            //here we have each suggestion through iteration
            info.forEach((element) => {
                //create the elements for suggestions list and set its properties
                let divContainSuggest = document.createElement("div");
                divContainSuggest.classList = "containerFlex";
                let imgSearchSuggest = document.createElement("img");
                imgSearchSuggest.src = searchIconImage;
                let paragraphSuggest = document.createElement("p");
                paragraphSuggest.textContent = element.name;

                //add the items from the suggestion list to the container
                searchSuggestion.appendChild(divContainSuggest);
                divContainSuggest.appendChild(imgSearchSuggest);
                divContainSuggest.appendChild(paragraphSuggest);

                //subscribe the paragraph to the click event so that its text passes to the input
                paragraphSuggest.addEventListener("click", () => {
                    searchInput.value = paragraphSuggest.textContent;
                    searchSuggestion.style.display = "none";
                    searchGifs();
                });
            });
        }
    } catch (error) {
        console.error(error);
    }
}
//END SEARCH SECTION -----------------------------------------------

//RESULT SECTION ---------------------------------------------------
let offset = 0; //for button SHOW MORE in orden to show 'offset' elements more

let searchInput = document.getElementById("searchInput"); //gets input node where the user puts the search
let searchGif = document.getElementById("searchGif"); // gets the DIV node where the searched gifs appear
searchGif.innerHTML = "";

let btnShowMore = document.getElementById("btnShowMore"); //get "Show More" button node

//function that shows search gifs
async function showSearch(word, offset) {
    try {
        const info = await getSearchByWord(word, offset);
        if (info.length > 0) {
            //here we have each trending gif through iteration
            info.forEach((element) => {
                console.log('elementos: ' + info.length);
                info.length >= 12 // only if first result bring more than 11 gifs show button "show More"
                    ? btnShowMore.style.display = "block" 
                    : btnShowMore.style.display = "none";
                searchGif.className = "searchGif";
                searchGif.innerHTML += `
                <img id="${element.id}" src="${element.images.fixed_height.url}">
                `;
            });

            //suscribe each Gif to click event in order to changge it to full screen mode
            searchGif.querySelectorAll(".searchGif img").forEach((gif) => {
                gif.addEventListener("click", clickOnGif, false);
            });

            //after search, show ilustra header again
            ilustraHeader.style.display = "block";
            sectionSearch.style.marginTop = "0px";
            //-----------------------------------------
        } else {
            btnShowMore.style.display = "none"; //if there are no more gifs, hide "Show More" button
            if (!searchGif.innerHTML) {
                btnShowMore.style.display = "none";
                searchGif.className = "searchGifWithoutResult";
                searchGif.innerHTML += `
                <img src="./images/icon-busqueda-sin-resultado.svg">
                <h3> Intenta con otra búsqueda.</h3>
                `;
            }
        }
    } catch (error) {
        console.error(error);
    }
}

//search gifs when the usr press Enter
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        hideIlustraHeader();
        searchInput.value !== "" ? searchGifs() : searchPrepare();
    } else {
        showSuggestions(searchInput.value);
    }
});

//when usr click on search input prepare the screen for search gifs
searchInput.addEventListener("focus", hideIlustraHeader);

function hideIlustraHeader() {
    searching = true;
    searchingIcon.style.display = "block";
    ilustraHeader.style.display = "none";
    sectionSearch.style.marginTop = "41.2px";
    sectionResults.style.display = "block";
    // if there aren't results in section results, "Show More" button must be hide
    searchGif.innerHTML == 0
        ? (btnShowMore.style.display = "none")
        : (btnShowMore.style.display = "block");
    iconsUpdate();
}

//search gifs when the usr press search icon on the left of te search bar
searchingIcon.addEventListener("click", searchGifs);

function searchGifs() {
    if (searchInput.value !== "") {
        offset = 0;
        searchGif.innerHTML = "";
        resultsTitle.textContent = searchInput.value;
        searchSuggestion.style.display = "none";
        showSearch(searchInput.value, offset);
    }
}

function searchPrepare() {
    //the usr want close the search. So hide section results, if ilustra header is hide or search results its not empty
    // if (ilustraHeader.style.display === "none" || searchGif.innerHTML !== 0) {
    if (searching) {
        ilustraHeader.style.display = "block";
        sectionSearch.style.marginTop = "0px";
        sectionResults.style.display = "none";
        searchInput.value = "";
        searchGif.innerHTML = "";
        resultsTitle.textContent = "";
        searching = false;
        searchingIcon.style.display = "none";
        //show X icon
    } else {
        searching = true;
        searchingIcon.style.display = "block";
        ilustraHeader.style.display = "none";
        sectionSearch.style.marginTop = "41.2px";
        sectionResults.style.display = "block";
        searchGif.innerHTML == 0
            ? (btnShowMore.style.display = "none")
            : (btnShowMore.style.display = "block"); // if there aren't results in section results, "Show More" button must be hide
        searchInput.focus();
        if (searchInput.value !== "") searchGifs();
    }
    iconsUpdate();
}

//search gifs when the usr press "Show More" button
btnShowMore.addEventListener("click", () => {
    offset += 12;
    showSearch(searchInput.value, offset);
});

//for hover efect in "Show More" button ------
btnShowMore.addEventListener("mouseover", (event) => {
    if (themeName === "theme-dark") {
        event.target.style.color = "black";
        event.target.style.backgroundColor = "white";
    } else {
        event.target.style.color = "white";
        event.target.style.backgroundColor = "#572EE5";
    }
});

btnShowMore.addEventListener("mouseout", (event) => {
    event.target.style.color = "var(--font-color)";
    event.target.style.backgroundColor = "var(--color-primary)";
});
//end for hover efect ------

//END RESULT SECTION --------------------------------------------------

//TRENDING SECTION ---------------------------------------------------
let sectionTrending = document.getElementById("sectionTrending"); //get DIV node where show the trending gifs
let trendingGif = document.getElementById("trendingGif"); //get DIV node where show the trending gifs
let trendingDescription = document.getElementById("trendingDescription"); //get DIV node where places the trendig descriptions

//function that shows trending gifs
async function showTrending() {
    try {
        let info = await getTrendings();
        trendingGif.innerHTML = "";
        info.forEach((element) => {
            // construct the inerHTML for trendings carrousel
            trendingGif.innerHTML += `
                <img id="${element.id}" src="${element.images.fixed_height.url}" alt= "${element.title}"/>
            `;
        });
        //suscribe each Gif to click event in order to changge it to full screen mode
        trendingGif.querySelectorAll(".trendingGif img").forEach((gif) => {
            gif.addEventListener("click", clickOnGif, false);
        });

    } catch (error) {
        console.error(error);
    }
}

let gifMax = document.getElementById("gifMax"); //get Div node for show the gif in max window
let gifMaxClose = document.getElementById("gifMaxClose"); //get img node for close max window
let selectedGif = document.getElementById("selectedGif"); //get img node for place de gif selected with click
let gifMaxUser = document.querySelector("#gifMax h4"); //get h4 node  to put the username of the gif
let gifMaxTitle = document.querySelector("#gifMax h3"); // get h3 node  to put the title of the gif
let downloadGif = document.getElementById("downloadGif"); //get img node with download icon

let favoriteIcon = document.getElementById("favoriteIcon"); //get img node for favorite icon

//show gif max window with details and buttons download and favorite
async function clickOnGif(gif) {
    try {
        let info = await getSearchById(gif.target.id);
        selectedGif.src = info.images.original.url;
        info.username === ""
            ? (gifMaxUser.textContent = "Unregistered User")
            : (gifMaxUser.textContent = info.username);
        info.title === ""
            ? (gifMaxTitle.textContent = "Unregistered Title")
            : (gifMaxTitle.textContent = info.title);
 
        window.scrollTo(0, 0);
        gifMax.style.display = "flex";


        myFavorites.includes(gif.target.id) //if this gif is in favorite favorite icons must be active
            ? (favoriteIcon.src = "./images/icon-favorite-active.svg")
            : (favoriteIcon.src = "./images/icon-favorite-inactive.svg");

        favoriteIcon.addEventListener("click", () => {
            console.log("inicio del evento click src: " + favoriteIcon.src);
            if (myFavorites.includes(gif.target.id)) {
                favoriteIcon.src = "./images/icon-favorite-inactive.svg";
                console.log("pasó a inactivo");

                //eliminate gif from Favorites
                if (myFavorites.indexOf(gif.target.id) !== -1) {
                    myFavorites.splice(myFavorites.indexOf(gif.target.id), 1);
                    console.log("favoritos despues de eliminar: ");
                    console.log(myFavorites);
                }
            } else {
                favoriteIcon.src = "./images/icon-favorite-active.svg";
                console.log("pasó a activo");

                //add gif to favorites
                if (myFavorites.indexOf(gif.target.id) === -1) {
                    //only add the gif if it doesn't exist
                    myFavorites.push(gif.target.id);
                    console.log("favoritos despues de agregar: ");
                    console.log(myFavorites);
                }
            }
            localStorage.setItem("myFavorites", JSON.stringify(myFavorites));
        });

        downloadGif.addEventListener('click' , () => {
            let string = info.title;
            let name = string.replace(/ /g, '-');
            downloadGifFunction(gif.target.id,name );
        });

    } catch (error) {
        console.error(error);
    }
}

// if usr click over the X icon or in a blank part of the window then close
gifMax.addEventListener("click", (event) => {
    if (event.target.id === "gifMax" || event.target.id === "gifMaxClose") {
        // favoriteIcon.removeEventListener("click");
        if(sectionFavorites.style.display === "block"){
            loadFavorites(); //update favorites
        }
        gifMax.style.display = "none";
    }
});

//function that shows trending SEARCH SUGGESTIONS
async function showTrendingSearch() {
    try {
        let info = await getTrendingsSearch();
        trendingDescription.innerHTML = "";
        let paragraph = "";
        //here we have each trending gif through iteration
        info.forEach((element, index) => {
            // construct the inerHTML for descriptions trending
            let trendingLimitDescription = 5;
            if (index < trendingLimitDescription) {
                paragraph =
                    element +
                    (index === trendingLimitDescription - 1 ? "" : ", ");
                trendingDescription.innerHTML += `<span>${paragraph}</span>`;
            }
        });
        //suscribe each description trending to click event in order to search it
        trendingDescription
            .querySelectorAll(".sectionSearch span")
            .forEach((paragraph) => {
                paragraph.addEventListener("click", clickOnParagraph, false);
            });
    } catch (error) {
        console.error(error);
    }
}

function clickOnParagraph() {
    let texto = this.textContent;
    //trim the final comma when the suggestion has it
    searchInput.value =
        texto.substring(texto.length - 1, texto.length - 2) === ","
            ? texto.substring(0, texto.length - 2)
            : texto;
    searching = false;
    searchPrepare();
}

//END TRENDING SECTION ---------------------------------------------------

//FAVORITES SECTION-------------------------------------------------
let offSetFavorites = 0;
let limitFavorites = 12; // mark the limit of gifs to bring
let sectionFavorites = document.getElementById("sectionFavorites"); //get the favorites Section node
let favoritesNav = document.getElementById("favoritesNav"); //get the favorites li node from the menu
let favoriteGifs = document.getElementById("favoriteGifs"); //get the favorites div node wher puts the favorites
let btnShowMoreFavorites = document.getElementById("btnShowMoreFavorites"); //get "Show More" button node

//function that shows search gifs by id
async function showFavorites(element) {
    try {
        const favorite = await getSearchById(element);
        favoriteGifs.innerHTML += `<img id="${favorite.id}" src="${favorite.images.fixed_height.url}">`;
    } catch (error) {
        console.error(error);
    }
}

favoritesNav.addEventListener("click", loadFavorites);

function loadFavorites(){
    offSetFavorites = 0;
    limitFavorites = 12;
    favoriteGifs.innerHTML ='';
    //hide the sections that should not appear
    ilustraHeader.style.display = "none";
    sectionSearch.style.display = "none";
    sectionResults.style.display = "none";
    //show favorites section
    sectionFavorites.style.display = "block";
    navIcon.src = navIconImageClose;
    navMenu.style.display = "block";
    changeIconBurger();

    //must immediately upload the favorite gifs (if any)
    updateFavorites();

}

function updateFavorites() {
    console.log('Offset Favorites:'+ offSetFavorites);
    if (myFavorites.length - offSetFavorites >=0) {
        
        //show the button showMore if there are more gifs to bring
        myFavorites.length - offSetFavorites >= 12
            ? btnShowMoreFavorites.style.display = "block" 
            : btnShowMoreFavorites.style.display = "none";
        favoriteGifs.className = 'searchGif';

        //if the number of gifs are less than the limit, new limit is the length of the favorites array
        if ((offSetFavorites + limitFavorites) > myFavorites.length) {
            limitFavorites = myFavorites.length;
        } 

        for (let index = offSetFavorites; index < limitFavorites; index++){
            const element = myFavorites[index];
            showFavorites(element);
        }

    } else {
        favoriteGifs.className = 'searchGifWithoutResult';
        favoriteGifs.innerHTML = `
        <img src= ./images/icon-fav-sin-contenido.svg>
        <h3>¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!</h3>
        `;
    }
}



btnShowMoreFavorites.addEventListener('click' , () => { 
    offSetFavorites += 12;
    updateFavorites();
});


//END FAVORITES ----------------------------------------------------------

//FOOTER ----------------------------------------------------------

//for hovers on social media icons ----------------
let facebook = document.getElementById("facebook"); // get facebook icon node
let twitter = document.getElementById("twitter"); // get twitter icon node
let instagram = document.getElementById("instagram"); // get instagram icon node

facebook.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
        ? (event.target.src = "./images/icon-face-hover-noct.svg")
        : (event.target.src = "./images/icon-face-hover.svg");
});
facebook.addEventListener(
    "mouseout",
    (event) => (event.target.src = "./images/icon-face-normal.svg")
);

twitter.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
        ? (event.target.src = "./images/icon-twitter-hover-noct.svg")
        : (event.target.src = "./images/icon-twitter-hover.svg");
});
twitter.addEventListener(
    "mouseout",
    (event) => (event.target.src = "./images/icon-twitter-normal.svg")
);

instagram.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
        ? (event.target.src = "./images/icon-instagram-hover-noct.svg")
        : (event.target.src = "./images/icon-instagram-hover.svg");
});
instagram.addEventListener(
    "mouseout",
    (event) => (event.target.src = "./images/icon-instagram-normal.svg")
);
//END for hovers on social media icons ----------------

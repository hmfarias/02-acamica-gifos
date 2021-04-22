// import async functions to comunicate with the API
import {
    getTrendings,
    getTrendingsSearch,
    getSuggestions,
    getSearchByWord,
    getSearchById,
    downloadGifFunction,
    uploadGif,
    fixMarginSectionResult,
    displayPrepare,
    formatStepButtons,
} from "./services.js";

let desktopDisplay = window.matchMedia('(min-width: 1440px)');

window.onload = function () {
    themeLoad(); //load de diurn or nocturn theme as appropriate
    loadMyGifsFromLS(); // load my gifs from LS
    loadFavoritesFromLS(); // load favorites from LS
    showTrending(); //load the trendings carousel
    showTrendingSearch(); //load the trendings search suggestions
};

let myGifsLS = []; //for use with localStorage in my gifs case
let myFavoritesLS = []; //for use with localStorage in my favorites case

// for cronometre
let h = 0; //hours
let m = 0; //minutes
let s = 0; //seconds
let idInterval = 0; //For interval to cronometre

//function load favorites from LocalStorage
function loadFavoritesFromLS() {
    let favoriteGifsLS = JSON.parse(localStorage.getItem("myFavorites"));
    if (favoriteGifsLS) {
        myFavoritesLS = favoriteGifsLS;
    }
}

//function load myGifs from LocalStorage
function loadMyGifsFromLS() {
    let myOwnGifs = JSON.parse(localStorage.getItem("myGifs"));
    if (myOwnGifs) {
        myGifsLS = myOwnGifs;
    }
}

//FOR THEMES
let themeName = ""; //create theme name variable global for use later

// FOR BURGER MENU IN MOBILE MODE -------------
let navIcon = document.getElementById("navIcon"); //burger or X image
let navMenu = document.getElementById("navMenu"); //options menu
let searchIcon = document.getElementById("searchIcon"); // search icon
let searchingIcon = document.getElementById("searchingIcon"); // the search icon appears on the left of the search bar
let cameraImg = document.getElementById("cameraImg");
let filmImg = document.getElementById("filmImg");
let navIconImageClose = ""; // X icon in light mode
let navIconImageBurger = ""; // burger icon in light mode
let searchIconImage = ""; // search icon in dark mode
let cameraImage = ""; //camera img in create my gif section
let filmImage = ""; //film img in create my gif section
let ilustraHeader = document.getElementById("ilustraHeader");

let searching = false; //variable to know if searching mode is active or not

// burguer menu changes
navIcon.addEventListener("click", () => {
    changeIconBurger();
});

//function to change the burger menu icon when the user clicks on it
function changeIconBurger() {
    if (desktopDisplay.matches) {
        navMenu.style.display = "flex";
    } else {
        if (navMenu.style.display === "" || navMenu.style.display === "none") {
            navIcon.src = navIconImageClose;
            navMenu.style.display = "block";
        } else {
            navIcon.src = navIconImageBurger;
            navMenu.style.display = "none";
        }
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
        cameraImage = "./images/camara.svg"; //camera img in create my gif section
        filmImage = "./images/film.svg"; //film img in create my gif section
    } else {
        logo.src = "./images/logo-mobile-modo-noct.svg"; //principal logo dark mode
        navIconImageClose = "./images/close-modo-noct.svg"; // X icon in dark mode
        navIconImageBurger = "./images/burger-modo-noct.svg"; // burger icon in dark mode
        searchIconImage = "./images/icon-search-modo-noct.svg"; // search icon in dark mode
        cameraImage = "./images/camara-modo-noc.svg"; //camera img in create my gif section
        filmImage = "./images/film-noct.svg"; //film img in create my gif section
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

    //update img in create Gif Section
    cameraImg.src = cameraImage;
    filmImg.src = filmImage;
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
        changeMode.textContent = "Modo Diurno";
    } else {
        themeName = "theme-light";
        setTheme(themeName);
        changeMode.textContent = "Modo Nocturno";
    }
}

// nocturn or light mode menu option
let changeMode = document.getElementById("changeMode");
changeMode.addEventListener("click", () => {
    toggleTheme();
    changeIconBurger();
});
//END THEMES ------------------------------------------------------

//SEARCH SECTION ====================================================================================
//===================================================================================================
let sectionSearch = document.getElementById("sectionSearch"); //gets the Section node corresponding to the search, to be able to hide it and show it accordingly
let search = document.getElementById("search"); //gets the div node that contains the Div node for search bar, and the div node for the hints
let searchContainer = document.getElementById("searchContainer"); //gets the div node that contains the search bar
let resultsTitle = document.getElementById("resultsTitle"); //gets the h2 node to put the search text  title in it
let searchSuggestion = document.getElementById("searchSuggestion");

//when usr click in search icon
searchIcon.addEventListener("click", () => {
    if (searchInput.value === "") {
        searchPrepare();
    } else {
        searchInput.value = "";
        searchInput.focus();
    }
});

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
                paragraphSuggest.style.lineHeight = "25px";

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

//RESULT SECTION ====================================================================================
//===================================================================================================
let offset = 0; //for button SHOW MORE in orden to show 'offset' elements more

let searchInput = document.getElementById("searchInput"); //gets input node where the user puts the search
let searchGif = document.getElementById("searchGif"); // gets the DIV node where the searched gifs appear
searchGif.innerHTML = "";

let btnShowMore = document.getElementById("btnShowMore"); //get "Show More" button node

//function that shows the searched gifs
async function showSearch(word, offset) {
    try {
        const info = await getSearchByWord(word, offset);
        if (info.length > 0) {
            //here we have each trending gif through iteration
            info.forEach((element) => {
                info.length >= 12 // only if first result bring more than 11 gifs show button "show More"
                    ? (btnShowMore.style.display = "block")
                    : (btnShowMore.style.display = "none");

                //fix the section margins when the button disappears
                fixMarginSectionResult(btnShowMore);

                //prepare usr and title text for the card
                let usrSearch = '';
                let titleSearch = '';
                element.username === ''
                    ? (usrSearch = "Unregistered User")
                    : (usrSearch = element.username);
                element.title === ""
                    ? (titleSearch = "Unregistered Title")
                    : (titleSearch = element.title);

                let nameGifSearch = titleSearch.replace(/ /g, "-"); //for download 

                searchGif.className = "searchGif";
                searchGif.innerHTML += `
                    <div class="gifSearchContainer">
                        <img id="${element.id}" src="${element.images.fixed_height.url}" alt= "${titleSearch}"/>

                        <div id="divHoverSearch${element.id}" class="divHoverSearch">

                            <div class="divHoverSearch__infoGif">
                                <h4 class="divHoverSearch__infoGif--usr">${usrSearch}</h4>
                                <h3 class="divHoverSearch__infoGif--title">${titleSearch}</h3>
                            </div>

                            <div class="divHoverSearch__icons" id="divHoverSearch__icons">

                                <img id="${element.id}" src="./images/icon-card-favorite-normal.svg" alt="favorite" key="${element.id}" class="divHoverSearch__button" >

                                <img id="${element.id}" src="./images/icon-card-download-normal.svg" alt="download"  class="divHoverSearch__button" name=${nameGifSearch}>

                                <img id="${element.id}" key="${element.id}" class="divHoverSearch__button" src="./images/icon-card-max-normal.svg" alt="max">
                            </div>

                        </div>
                    </div>
                `;
            });

            //suscribe each Gif to click event in order to changge it to full screen mode
            searchGif.querySelectorAll(".gifSearchContainer > img")
                .forEach((gifElement) => {
                    gifElement.addEventListener("click", clickOnGif, false);
                    //mouseover event for gif's card, only must be functional in desktop display
                    if (desktopDisplay.matches) {
                        gifElement.addEventListener("mouseover", (event) => {
                            let idHoverSearch = 'divHoverSearch' + event.target.getAttribute('id');
                            let divHoverSearch = document.getElementById(idHoverSearch);

                            divHoverSearch.style.display = 'block';

                            divHoverSearch.addEventListener('mouseout', () => {
                                divHoverSearch.style.display = 'none';
                            });
                        });
                    }
                });

            // subscribe the overlay icons to the click event
            searchGif.querySelectorAll(".divHoverSearch__icons > img")
                .forEach(icon => {
                    icon.key = icon.id;
                    switch (icon.getAttribute('alt')) {
                        //for favorite icons ============================================
                        case 'favorite':
                            //if the gif is already a favorite, its icon must be active
                            myFavoritesLS.includes(icon.id)
                                ? icon.src = './images/icon-card-favorite-active.svg'
                                : icon.src = './images/icon-card-favorite-normal.svg';

                            icon.addEventListener('mouseover', () => {
                                //if it is already included in favorites the active icon is not changed
                                myFavoritesLS.includes(icon.id)
                                    ? icon.src = './images/icon-card-favorite-active.svg'
                                    : icon.src = './images/icon-card-favorite-hover.svg';
                            });

                            icon.addEventListener('mouseout', () => {
                                myFavoritesLS.includes(icon.id)
                                    ? icon.src = './images/icon-card-favorite-active.svg'
                                    : icon.src = './images/icon-card-favorite-normal.svg'
                            });

                            icon.addEventListener('click', () => {
                                myFavoritesLS.includes(icon.id)
                                    ? icon.src = './images/icon-card-favorite-normal.svg'
                                    : icon.src = './images/icon-card-favorite-active.svg';

                                //call function to manage the favorites asign
                                manageFavorite(icon);
                            });
                            break;

                        //for download icons ============================================
                        case 'download':
                            icon.addEventListener('mouseover', () => {
                                icon.src = './images/icon-card-download-hover.svg';
                            });
                            icon.addEventListener('mouseout', () => {
                                icon.src = './images/icon-card-download-normal.svg';
                            });
                            icon.addEventListener('mouseout', () => {
                                icon.src = './images/icon-card-download-normal.svg';
                            });
                            icon.addEventListener('click', downloadGifFunction, false);
                            break;

                        //for max icons ============================================
                        case 'max':
                            icon.addEventListener('mouseover', () => {
                                icon.src = './images/icon-card-max-hover.svg';
                            });
                            icon.addEventListener('mouseout', () => {
                                icon.src = './images/icon-card-max-normal.svg';
                            });
                            icon.addEventListener('click', clickOnGif, false);
                            break;
                    }
                });







            //after search, show ilustra header again
            ilustraHeader.style.display = "block";
            sectionSearch.style.marginTop = "0px";
            //-----------------------------------------
        } else {
            btnShowMore.style.display = "none"; //if there are no more gifs, hide "Show More" button

            //fix the section margins when the button disappears
            fixMarginSectionResult(btnShowMore);

            if (!searchGif.innerHTML) {
                btnShowMore.style.display = "none";
                //fix the section margins when the button disappears
                fixMarginSectionResult(btnShowMore);

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
    searchGif.innerHTML === 0
        ? (btnShowMore.style.display = "none")
        : (btnShowMore.style.display = "block");

    //fix the section margins when the button disappears
    fixMarginSectionResult(btnShowMore);

    //update icons
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

        //fix the section margins when the button disappears
        fixMarginSectionResult(btnShowMore);

        searchInput.focus();
        if (searchInput.value !== "") searchGifs();
    }
    iconsUpdate();
}

//search more gifs when the usr press "Show More" button and Update offset
btnShowMore.addEventListener("click", () => {
    offset += 12;
    showSearch(searchInput.value, offset);
});

//END RESULT SECTION --------------------------------------------------

//TRENDING SECTION ==================================================================================
//===================================================================================================
let sectionTrending = document.getElementById("sectionTrending"); //get DIV node where show the trending gifs
let trendingGif = document.getElementById("trendingGif"); //get DIV node where show the trending gifs
let trendingDescription = document.getElementById("trendingDescription"); //get DIV node where places the trendig descriptions
let btnScrollLeft = document.getElementById("btnScrollLeft"); //get button node for scrolling
let btnScrollRight = document.getElementById("btnScrollRight"); //get button node for scrolling



//FOR SCROLLING ---------------------------------------------
let speed = 30;
let distance = trendingGif.scrollWidth/3*2;
let step = 40
let distance2 = trendingGif.scrollWidth;
console.log({distance2});

btnScrollRight.addEventListener('click', () => {
    sideScroll(trendingGif,'right',speed,distance,step);
    console.log(trendingGif.scrollLeft);
});

btnScrollLeft.addEventListener('click', () => {
    sideScroll(trendingGif,'left',speed,distance,step);
    console.log(trendingGif.scrollLeft);
});


//function to scroll left or right
function sideScroll(element,direction,speed,distance,step){
    let scrollAmount = 0;
    var slideTimer = setInterval(function(){
        if(direction == 'left'){
            element.scrollLeft -= step;
        } else {
            element.scrollLeft += step;
        }
        scrollAmount += step;
        if(scrollAmount >= distance){
            window.clearInterval(slideTimer);
        }
    }, speed);
}




//END FOR SCROLLING ---------------------------------------------


//function that shows trending gifs
async function showTrending() {
    try {
        let info = await getTrendings();

        trendingGif.innerHTML = "";
        info.forEach((element) => {

            //prepare usr and title text for the card
            let usrTrend = '';
            let titleTrend = '';
            element.username === ''
                ? (usrTrend = "Unregistered User")
                : (usrTrend = element.username);
            element.title === ""
                ? (titleTrend = "Unregistered Title")
                : (titleTrend = element.title);

            let nameGif = titleTrend.replace(/ /g, "-"); //for download 


            // construct the inerHTML for trendings carrousel
            trendingGif.innerHTML += `
                <div class="gifTrendingContainer">
                    <img id="${element.id}" src="${element.images.fixed_height.url}" alt= "${titleTrend}"/>
                    
                    <div id="divHover${element.id}" class="divHover">
                        
                        <div class="divHover__infoGif">
                            <h4 class="divHover__infoGif--usr">${usrTrend}</h4>
                            <h3 class="divHover__infoGif--title">${titleTrend}</h3>
                        </div>

                        <div class="divHover__icons" id="divHover__icons">
                            <img id="${element.id}" src="./images/icon-card-favorite-normal.svg" alt="favorite" key="${element.id}" class="divHover__button" >

                            <img id="${element.id}" src="./images/icon-card-download-normal.svg" alt="download"  class="divHover__button" name=${nameGif}>

                            <img id="${element.id}" key="${element.id}" class="divHover__button" src="./images/icon-card-max-normal.svg" alt="max">
                        </div>

                    </div>
                </div>
            `;
        });

        //suscribe each Gif to click event in order to changge it to full screen mode
        trendingGif.querySelectorAll(".gifTrendingContainer > img")
            .forEach(gifElement => {
                gifElement.addEventListener("click", clickOnGif, false);

                //mouseover event for gif's card, only must be functional in desktop display
                if (desktopDisplay.matches) {
                    gifElement.addEventListener("mouseover", (event) => {
                        let idHover = 'divHover' + event.target.getAttribute('id');
                        let divHover = document.getElementById(idHover);

                        divHover.style.display = 'block';

                        divHover.addEventListener('mouseout', () => {
                            divHover.style.display = 'none';
                        });
                    });
                }
            });

        // subscribe the overlay icons to the click event
        let arrayIcon = trendingGif.querySelectorAll(".divHover__icons > img");
        arrayIcon.forEach(icon => {
            icon.key = icon.id;
            switch (icon.getAttribute('alt')) {
                //for favorite icons ============================================
                case 'favorite':
                    //if the gif is already a favorite, its icon must be active
                    myFavoritesLS.includes(icon.id)
                        ? icon.src = './images/icon-card-favorite-active.svg'
                        : icon.src = './images/icon-card-favorite-normal.svg';

                    icon.addEventListener('mouseover', () => {
                        //if it is already included in favorites the active icon is not changed
                        myFavoritesLS.includes(icon.id)
                            ? icon.src = './images/icon-card-favorite-active.svg'
                            : icon.src = './images/icon-card-favorite-hover.svg';
                    });

                    icon.addEventListener('mouseout', () => {
                        myFavoritesLS.includes(icon.id)
                            ? icon.src = './images/icon-card-favorite-active.svg'
                            : icon.src = './images/icon-card-favorite-normal.svg'
                    });

                    icon.addEventListener('click', () => {
                        myFavoritesLS.includes(icon.id)
                            ? icon.src = './images/icon-card-favorite-normal.svg'
                            : icon.src = './images/icon-card-favorite-active.svg';

                        //call function to manage the favorites asign
                        manageFavorite(icon);
                    });
                    break;

                //for download icons ============================================
                case 'download':
                    icon.addEventListener('mouseover', () => {
                        icon.src = './images/icon-card-download-hover.svg';
                    });
                    icon.addEventListener('mouseout', () => {
                        icon.src = './images/icon-card-download-normal.svg';
                    });
                    icon.addEventListener('mouseout', () => {
                        icon.src = './images/icon-card-download-normal.svg';
                    });
                    icon.addEventListener('click', downloadGifFunction, false);
                    break;

                //for max icons ============================================
                case 'max':
                    icon.addEventListener('mouseover', () => {
                        icon.src = './images/icon-card-max-hover.svg';
                    });
                    icon.addEventListener('mouseout', () => {
                        icon.src = './images/icon-card-max-normal.svg';
                    });
                    icon.addEventListener('click', clickOnGif, false);
                    break;
            }
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
let downloadIcon = document.getElementById("downloadIcon"); //get img node with download icon

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

        // window.scrollTo(0, 0);
        gifMax.style.display = "flex";

        myFavoritesLS.includes(gif.target.id) //if this gif is in favorite favorite icons must be active
            ? (favoriteIcon.src = "./images/icon-favorite-active.svg")
            : (favoriteIcon.src = "./images/icon-favorite-inactive.svg");

        //save the id of the gif inside the object subscribed to the click event
        favoriteIcon.id = gif.target.id;

        //save the id and id for the gif inside the object subscribed to the click event
        downloadIcon.key = gif.target.id;

        //save the name for the gif inside the object subscribed to the click event
        let string = info.title;
        let formatedNname = string.replace(/ /g, "-");
        downloadIcon.name = formatedNname;

        //subscribe favorite icon to the click event
        favoriteIcon.addEventListener("click", manageFavorite, false);

        //subscribe download icon to the click event
        downloadIcon.addEventListener("click", downloadGifFunction, false);
    } catch (error) {
        console.error(error);
    }
}

// add or delete the gif from the favorites section
function manageFavorite(gif) {
    let gifID = null

    //if the call comes from a pointer event
    Object.prototype.toString.call(gif) === '[object PointerEvent]'
        ? gifID = gif.target.id
        : gifID = gif.id;

    if (myFavoritesLS.includes(gifID)) {
        favoriteIcon.src = "./images/icon-favorite-inactive.svg";

        //eliminate gif from Favorites
        if (myFavoritesLS.indexOf(gifID) !== -1) {
            myFavoritesLS.splice(myFavoritesLS.indexOf(gifID), 1);
        }
    } else {
        favoriteIcon.src = "./images/icon-favorite-active.svg";

        //add gif to favorites
        if (myFavoritesLS.indexOf(gifID) === -1) {
            //only add the gif if it doesn't exist
            myFavoritesLS.push(gifID);
        }
    }
    localStorage.setItem("myFavorites", JSON.stringify(myFavoritesLS));
    // favoriteIcon.removeEventListener("click", manageFavorite, false);

    if (sectionFavorites.style.display === "block") {
        loadFavorites(); //update favorites
    }
}

// if usr click over the X icon or in a blank part of the window then close
gifMax.addEventListener("click", (event) => {
    if (event.target.id === "gifMax" || event.target.id === "gifMaxClose") {
        // favoriteIcon.removeEventListener("click");
        if (sectionFavorites.style.display === "block") {
            loadFavorites(); //update favorites
        }
        gifMax.style.display = "none";

        //unsubscribe favorite and download icons to the click event
        favoriteIcon.removeEventListener("click", manageFavorite, false);
        downloadIcon.removeEventListener("click", downloadGifFunction, false);
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
            let trendingLimitDescription = 7;
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

//FAVORITES SECTION =================================================================================
//===================================================================================================
let offSetFavorites = 0;
let limitFavorites = 12; // mark the limit of gifs to bring
let sectionFavorites = document.getElementById("sectionFavorites"); //get the favorites Section node
let favoritesNav = document.getElementById("favoritesNav"); //get the favorites li node from the menu
let favoriteGifs = document.getElementById("favoriteGifs"); //get the favorites div node wher puts the favorites
let btnShowMoreFavorites = document.getElementById("btnShowMoreFavorites"); //get "Show More" button node

//function that shows search gifs by id
async function showFavorites(id) {
    try {
        const favorite = await getSearchById(id);

        //prepare usr and title text for the card
        let usrFavorite = '';
        let titleFavorite = '';
        favorite.username === ''
            ? (usrFavorite = "Unregistered User")
            : (usrFavorite = favorite.username);
        favorite.title === ""
            ? (titleFavorite = "Unregistered Title")
            : (titleFavorite = favorite.title);

        let nameGifFavorite = titleFavorite.replace(/ /g, "-"); //for download 

        //create Div container
        //<div class="gifSearchContainer">
        let gifFavoriteContainterNew = document.createElement("div");
        gifFavoriteContainterNew.className = "gifSearchContainer";

        //<img id="${element.id}" src="${element.images.fixed_height.url}" alt= "${titleSearch}"/>
        let imgGifNew = document.createElement("img");
        imgGifNew.src = favorite.images.fixed_height.url;
        imgGifNew.alt = titleFavorite;
        imgGifNew.id = favorite.id;

        //<div id="divHoverSearch${element.id}" class="divHoverSearch">
        let divHoverFavoriteNew = document.createElement("div");
        divHoverFavoriteNew.id = `divHoverFavorite${favorite.id}`;
        divHoverFavoriteNew.className = "divHoverSearch";

        // --------------------------------------------------------
        //<div class="divHoverSearch__infoGif">
        let divHoverFavorite__infoGifNew = document.createElement("div");
        divHoverFavorite__infoGifNew.className = "divHoverSearch__infoGif";

        //<h4 class="divHoverSearch__infoGif--usr">${usrSearch}</h4>
        let h4New = document.createElement("h4");
        h4New.className = "divHoverSearch__infoGif--usr";
        h4New.textContent = usrFavorite;

        //<h3 class="divHoverSearch__infoGif--title">${titleSearch}</h3>
        let h3New = document.createElement("h3");
        h3New.className = "divHoverSearch__infoGif--title";
        h3New.textContent = titleFavorite;

        divHoverFavorite__infoGifNew.appendChild(h4New);
        divHoverFavorite__infoGifNew.appendChild(h3New);
        // --------------------------------------------------------

        //<div class="divHoverSearch__icons" id="divHoverSearch__icons">
        let divHoverFavorite_iconsNew = document.createElement("div");
        divHoverFavorite_iconsNew.id = 'divHoverFavorite__icons';
        divHoverFavorite_iconsNew.className = "divHoverSearch__icons";

        // <img id="${element.id}" src="./images/icon-card-favorite-normal.svg" alt="favorite" key="${element.id}" class="divHoverSearch__button" >
        let imgFavoriteNew = document.createElement("img");
        imgFavoriteNew.id = favorite.id;
        imgFavoriteNew.src = './images/icon-card-favorite-normal.svg';
        imgFavoriteNew.alt = 'favorite';
        imgFavoriteNew.key = favorite.id;
        imgFavoriteNew.className = 'divHoverSearch__button';

        // <img id="${element.id}" src="./images/icon-card-download-normal.svg" alt="download"  class="divHoverSearch__button" name=${nameGifSearch}>
        let imgDownNew = document.createElement("img");
        imgDownNew.id = favorite.id;
        imgDownNew.src = './images/icon-card-download-normal.svg';
        imgDownNew.alt = 'download';
        imgDownNew.key = favorite.id;
        imgDownNew.className = 'divHoverSearch__button';
        imgDownNew.name = nameGifFavorite;

        // <img id="${element.id}" key="${element.id}" class="divHoverSearch__button" src="./images/icon-card-max-normal.svg" alt="max">
        let imgMaxNew = document.createElement("img");
        imgMaxNew.id = favorite.id;
        imgMaxNew.key = favorite.id;
        imgMaxNew.className = 'divHoverSearch__button';
        imgMaxNew.src = './images/icon-card-max-normal.svg';
        imgMaxNew.alt = 'max';

        divHoverFavorite_iconsNew.appendChild(imgFavoriteNew);
        divHoverFavorite_iconsNew.appendChild(imgDownNew);
        divHoverFavorite_iconsNew.appendChild(imgMaxNew);

        divHoverFavoriteNew.appendChild(divHoverFavorite__infoGifNew);
        divHoverFavoriteNew.appendChild(divHoverFavorite_iconsNew);

        gifFavoriteContainterNew.appendChild(imgGifNew);
        gifFavoriteContainterNew.appendChild(divHoverFavoriteNew);

        favoriteGifs.appendChild(gifFavoriteContainterNew);



        //suscribe each Gif to click event in order to changge it to full screen mode and manage favorite or download
        imgGifNew.addEventListener("click", clickOnGif, false);

        //mouseover event for gif's card, only must be functional in desktop display
        if (desktopDisplay.matches) {
            gifFavoriteContainterNew.addEventListener("mouseover", (event) => {
                // let idHoverFavorite = 'divHoverFavorite' + event.target.getAttribute('id');
                // let divHoverFavorite = document.getElementById(idHoverFavorite);

                divHoverFavoriteNew.style.display = 'block';

                divHoverFavoriteNew.addEventListener('mouseout', () => {
                    divHoverFavoriteNew.style.display = 'none';
                });
            });
        }

        // subscribe the overlay icons to the click event

        //For FAVORITE icon -----------------------------------------------
        //if the gif is already a favorite, its icon must be active
        myFavoritesLS.includes(imgFavoriteNew.id)
            ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
            : imgFavoriteNew.src = './images/icon-card-favorite-normal.svg';

        imgFavoriteNew.addEventListener('mouseover', () => {
            //if it is already included in favorites the active icon is not changed
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-hover.svg';
        });

        imgFavoriteNew.addEventListener('mouseout', () => {
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-normal.svg'
        });

        imgFavoriteNew.addEventListener('click', () => {
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-normal.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-active.svg';

            //call function to manage the favorites asign
            manageFavorite(imgFavoriteNew);
        });
        //END For FAVORITE icon -----------------------------------------------

        //For DOWNLOAD icon -----------------------------------------------
        imgDownNew.addEventListener('mouseover', () => {
            imgDownNew.src = './images/icon-card-download-hover.svg';
        });
        imgDownNew.addEventListener('mouseout', () => {
            imgDownNew.src = './images/icon-card-download-normal.svg';
        });
        imgDownNew.addEventListener('mouseout', () => {
            imgDownNew.src = './images/icon-card-download-normal.svg';
        });
        imgDownNew.addEventListener('click', downloadGifFunction, false);
        //END For DOWNLOAD icon -----------------------------------------------

        //For MAX icon -----------------------------------------------
        imgMaxNew.addEventListener('mouseover', () => {
            imgMaxNew.src = './images/icon-card-max-hover.svg';
        });
        imgMaxNew.addEventListener('mouseout', () => {
            imgMaxNew.src = './images/icon-card-max-normal.svg';
        });
        imgMaxNew.addEventListener('click', clickOnGif, false);
        //END For MAX icon -----------------------------------------------

    } catch (error) {
        console.error(error);
    }
}

// when selecting the option see favorites gif in the navigation bar
favoritesNav.addEventListener("click", loadFavorites);

function loadFavorites() {
    offSetFavorites = 0;
    limitFavorites = 12;
    favoriteGifs.innerHTML = "";
    
    //hide the sections that should not appear
    displayPrepare([sectionTrending,sectionFavorites,navMenu], "block", [ilustraHeader, sectionSearch, sectionResults, sectionMyGifs,sectionCreateGif], "none");
    navIcon.src = navIconImageClose;
    
    // navMenu.style.display = "block";
    changeIconBurger();

    //must immediately upload the favorite gifs (if any)
    updateFavorites();
}

function updateFavorites() {
    if (myFavoritesLS.length === 0) {
        favoriteGifs.className = "searchGifWithoutResult";
        favoriteGifs.innerHTML = `
        <img src= ./images/icon-fav-sin-contenido.svg>
        <h3>¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!</h3>
        `;

        btnShowMoreFavorites.style.display = "none";
        //fix the section margins when the button disappears
        fixMarginSectionResult(btnShowMoreFavorites);
    } else if (myFavoritesLS.length - offSetFavorites >= 0) {
        //show the button showMore if there are more gifs to bring
        myFavoritesLS.length - offSetFavorites >= 12
            ? (btnShowMoreFavorites.style.display = "block")
            : (btnShowMoreFavorites.style.display = "none");

        //fix the section margins when the button disappears
        fixMarginSectionResult(btnShowMoreFavorites);

        favoriteGifs.className = "searchGif";

        //if the number of gifs are less than the limit, new limit is the length of the favorites array
        if (offSetFavorites + limitFavorites > myFavoritesLS.length) {
            limitFavorites = myFavoritesLS.length;
        }

        for (let index = offSetFavorites; index < limitFavorites; index++) {
            const element = myFavoritesLS[index];
            showFavorites(element);
        }
    }
}

//update favorite gifs when the usr press "Show More" button and Update offset
btnShowMoreFavorites.addEventListener("click", () => {
    offSetFavorites += 12;
    updateFavorites();
});

//END FAVORITES SECTION --------------------------------------------------

//MY GIFOS SECTION ==================================================================================
//===================================================================================================
let offSetMyGifs = 0;
let limitMyGifs = 12; // mark the limit of gifs to bring
let countNameGif = 0;
let sectionMyGifs = document.getElementById("sectionMyGifs"); //get the myGifs Section node
let myGifsNav = document.getElementById("myGifsNav"); //get the myGifs li node from the menu
let myGifs = document.getElementById("myGifs"); //get the myGifs div node wher puts myGifs
let btnShowMoreMyGifs = document.getElementById("btnShowMoreMyGifs"); //get "Show More" button node

//function that shows search gifs by id
async function showMyGifs(id) {
    try {
        const myGif = await getSearchById(id);

        //prepare usr and title text for the card
        let usrMyGif = '';
        let titleMyGif = '';
        countNameGif ++;
        myGif.username === ''
            ? (usrMyGif = "Unregistered User")
            : (usrMyGif = myGif.username);
        myGif.title === ""
            ? (titleMyGif = `My Gif ${countNameGif}`)
            : (titleMyGif = myGif.title);

        let nameGifMyGif = titleMyGif.replace(/ /g, "-"); //for download 

        //create Div container
        //<div class="gifSearchContainer">
        let gifMyGifContainterNew = document.createElement("div");
        gifMyGifContainterNew.className = "gifSearchContainer";

        //<img id="${element.id}" src="${element.images.fixed_height.url}" alt= "${titleSearch}"/>
        let imgGifNew = document.createElement("img");
        imgGifNew.src = myGif.images.fixed_height.url;
        imgGifNew.alt = titleMyGif;
        imgGifNew.id = myGif.id;

        //<div id="divHoverSearch${element.id}" class="divHoverSearch">
        let divHoverMyGifNew = document.createElement("div");
        divHoverMyGifNew.id = `divHoverFavorite${myGif.id}`;
        divHoverMyGifNew.className = "divHoverSearch";

        // --------------------------------------------------------
        //<div class="divHoverSearch__infoGif">
        let divHoverMyGif__infoGifNew = document.createElement("div");
        divHoverMyGif__infoGifNew.className = "divHoverSearch__infoGif";

        //<h4 class="divHoverSearch__infoGif--usr">${usrSearch}</h4>
        let h4New = document.createElement("h4");
        h4New.className = "divHoverSearch__infoGif--usr";
        h4New.textContent = usrMyGif;

        //<h3 class="divHoverSearch__infoGif--title">${titleSearch}</h3>
        let h3New = document.createElement("h3");
        h3New.className = "divHoverSearch__infoGif--title";
        h3New.textContent = titleMyGif;

        divHoverMyGif__infoGifNew.appendChild(h4New);
        divHoverMyGif__infoGifNew.appendChild(h3New);
        // --------------------------------------------------------
       
        //<div class="divHoverSearch__icons" id="divHoverSearch__icons">
        let divHoverMyGif_iconsNew = document.createElement("div");
        divHoverMyGif_iconsNew.id = 'divHoverFavorite__icons';
        divHoverMyGif_iconsNew.className = "divHoverSearch__icons";

        // <img id="${element.id}" src="./images/icon-card-favorite-normal.svg" alt="favorite" key="${element.id}" class="divHoverSearch__button" >
        let imgFavoriteNew = document.createElement("img");
        imgFavoriteNew.id = myGif.id;
        imgFavoriteNew.src = './images/icon-card-favorite-normal.svg';
        imgFavoriteNew.alt = 'favorite';
        imgFavoriteNew.key = myGif.id;
        imgFavoriteNew.className = 'divHoverSearch__button';

        // <img id="${element.id}" src="./images/icon-card-download-normal.svg" alt="download"  class="divHoverSearch__button" name=${nameGifSearch}>
        let imgDownNew = document.createElement("img");
        imgDownNew.id = myGif.id;
        imgDownNew.src = './images/icon-card-download-normal.svg';
        imgDownNew.alt = 'download';
        imgDownNew.key = myGif.id;
        imgDownNew.className = 'divHoverSearch__button';
        imgDownNew.name = nameGifMyGif;

        // <img id="${element.id}" key="${element.id}" class="divHoverSearch__button" src="./images/icon-card-max-normal.svg" alt="max">
        let imgMaxNew = document.createElement("img");
        imgMaxNew.id = myGif.id;
        imgMaxNew.key = myGif.id;
        imgMaxNew.className = 'divHoverSearch__button';
        imgMaxNew.src = './images/icon-card-max-normal.svg';
        imgMaxNew.alt = 'max';

        divHoverMyGif_iconsNew.appendChild(imgFavoriteNew);
        divHoverMyGif_iconsNew.appendChild(imgDownNew);
        divHoverMyGif_iconsNew.appendChild(imgMaxNew);

        divHoverMyGifNew.appendChild(divHoverMyGif__infoGifNew);
        divHoverMyGifNew.appendChild(divHoverMyGif_iconsNew);

        gifMyGifContainterNew.appendChild(imgGifNew);
        gifMyGifContainterNew.appendChild(divHoverMyGifNew);

        myGifs.appendChild(gifMyGifContainterNew);



        //suscribe each Gif to click event in order to changge it to full screen mode and manage favorite or download
        imgGifNew.addEventListener("click", clickOnGif, false);

        //mouseover event for gif's card, only must be functional in desktop display
        if (desktopDisplay.matches) {
            gifMyGifContainterNew.addEventListener("mouseover", (event) => {
                // let idHoverMyGif = 'divHoverMyGif' + event.target.getAttribute('id');
                // let divHoverMyGif = document.getElementById(idHoverMyGif);

                divHoverMyGifNew.style.display = 'block';

                divHoverMyGifNew.addEventListener('mouseout', () => {
                    divHoverMyGifNew.style.display = 'none';
                });
            });
        }
        // subscribe the overlay icons to the click event

        //For FAVORITE icon -----------------------------------------------
        //if the gif is already a favorite, its icon must be active
        myFavoritesLS.includes(imgFavoriteNew.id)
            ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
            : imgFavoriteNew.src = './images/icon-card-favorite-normal.svg';

        imgFavoriteNew.addEventListener('mouseover', () => {
            //if it is already included in favorites the active icon is not changed
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-hover.svg';
        });

        imgFavoriteNew.addEventListener('mouseout', () => {
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-active.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-normal.svg'
        });

        imgFavoriteNew.addEventListener('click', () => {
            myFavoritesLS.includes(imgFavoriteNew.id)
                ? imgFavoriteNew.src = './images/icon-card-favorite-normal.svg'
                : imgFavoriteNew.src = './images/icon-card-favorite-active.svg';

            //call function to manage the favorites asign
            manageFavorite(imgFavoriteNew);
        });
        //END For FAVORITE icon -----------------------------------------------

        //For DOWNLOAD icon -----------------------------------------------
        imgDownNew.addEventListener('mouseover', () => {
            imgDownNew.src = './images/icon-card-download-hover.svg';
        });
        imgDownNew.addEventListener('mouseout', () => {
            imgDownNew.src = './images/icon-card-download-normal.svg';
        });
        imgDownNew.addEventListener('mouseout', () => {
            imgDownNew.src = './images/icon-card-download-normal.svg';
        });
        imgDownNew.addEventListener('click', downloadGifFunction, false);
        //END For DOWNLOAD icon -----------------------------------------------

        //For MAX icon -----------------------------------------------
        imgMaxNew.addEventListener('mouseover', () => {
            imgMaxNew.src = './images/icon-card-max-hover.svg';
        });
        imgMaxNew.addEventListener('mouseout', () => {
            imgMaxNew.src = './images/icon-card-max-normal.svg';
        });
        imgMaxNew.addEventListener('click', clickOnGif, false);
        //END For MAX icon -----------------------------------------------

    } catch (error) {
        console.error(error);
    }
}

// when selecting the option see my gifs in the navigation bar
myGifsNav.addEventListener("click", loadMyGifs);

function loadMyGifs() {
    offSetMyGifs = 0;
    limitMyGifs = 12;
    countNameGif = 0;
    myGifs.innerHTML = "";
    
    //hide the sections that should not appear
    displayPrepare([sectionTrending,sectionMyGifs,navMenu], "block", [ilustraHeader, sectionSearch, sectionResults, sectionFavorites,sectionCreateGif], "none");
    navIcon.src = navIconImageClose;
   
    // navMenu.style.display = "block";
    changeIconBurger();

    //must immediately upload the favorite gifs (if any)
    updateMyGifs();
}

function updateMyGifs() {
    if (myGifsLS.length === 0) {
        myGifs.className = "searchGifWithoutResult";
        myGifs.innerHTML = `
        <img src= ./images/icon-mis-gifos-sin-contenido.svg>
        <h3>¡Anímate a crear tu primer GIFO!</h3>
        `;

        btnShowMoreMyGifs.style.display = "none";
        //fix the section margins when the button disappears
        fixMarginSectionResult(btnShowMoreMyGifs);
    } else if (myGifsLS.length - offSetMyGifs >= 0) {
        //show the button showMore if there are more gifs to bring
        myGifsLS.length - offSetMyGifs >= 12
            ? (btnShowMoreMyGifs.style.display = "block")
            : (btnShowMoreMyGifs.style.display = "none");

        //fix the section margins when the button disappears
        fixMarginSectionResult(btnShowMoreMyGifs);

        myGifs.className = "searchGif";

        //if the number of gifs are less than the limit, new limit is the length of the myGifsLS array
        if (offSetMyGifs + limitMyGifs > myGifsLS.length) {
            limitMyGifs = myGifsLS.length;
        }

        for (let index = offSetMyGifs; index < limitMyGifs; index++) {
            const element = myGifsLS[index];
            showMyGifs(element);
        }
    }
}

//update favorite gifs when the usr press "Show More" button and Update offset
btnShowMoreMyGifs.addEventListener("click", () => {
    offSetMyGifs += 12;
    updateMyGifs();
});

//END MY GIFOS SECTION --------------------------------------------------

//CREATE GIF SECTION ================================================================================
//===================================================================================================
let sectionCreateGif = document.getElementById("sectionCreateGif");
let formGif = null;//create form to upload gif
let btnStartGif = document.getElementById("btnStartGif");
let btnSaveGif = document.getElementById("btnSaveGif");
let btnEndGif = document.getElementById("btnEndGif");
let btnUploadGif = document.getElementById("btnUploadGif");
let canvasCamera = document.getElementById("canvasCamera"); //get canvas zone for show message and video
let stepOne = document.getElementById("stepOne"); //get button node for step one
let stepTwo = document.getElementById("stepTwo"); //get button node for step two
let stepThree = document.getElementById("stepThree"); //get button node for step three
let projectionLight = document.getElementById("projectionLight"); //get projection light node for animation
let filmCrono = document.getElementById("filmCrono"); //get projection light node for animation
let filmRepeat = document.getElementById("filmRepeat"); //get projection light node for animation


let recorder = null;

createGifNav.addEventListener("click", createGif);

btnStartGif.addEventListener("click", createGifStepOne);
stepOne.addEventListener("click", createGifStepOne);
stepTwo.addEventListener("click", createGifStepTwo);
stepThree.addEventListener("click", createGifStepThree);

stepOne.removeAttribute("disabled");
stepTwo.setAttribute("disabled", "true");
stepThree.setAttribute("disabled", "true");

function createGif() {

    formGif = new FormData();//create form to upload gif
    //hide the sections that should not appear
    displayPrepare([navMenu], "block", [ilustraHeader, sectionSearch, sectionResults, sectionFavorites, sectionMyGifs, sectionTrending], "none");

    formatStepButtons([], 'var(--color-primary)', 'var(--font-color', [stepOne, stepTwo, stepThree], 'var(--font-color', 'var(--color-primary)');

    //reset cronometre
    clearInterval(idInterval);
    h = 0; m = 0; s = 0;
    btnSaveGif.removeEventListener("click", saveGif);
    //---------------------

    //show createGif section
    sectionCreateGif.style.display = "flex";
    navIcon.src = navIconImageClose;
    // navMenu.style.display = "block";
    changeIconBurger();

    //show / hide  nodes
    displayPrepare([btnStartGif], "block", [btnSaveGif, btnEndGif, btnUploadGif, projectionLight, filmCrono, filmRepeat,], "none");

    canvasCamera.innerHTML = `
    <h2 id="txtCanvasTitle">Aquí podrás <br> crear tus propios <span>GIFOS</span></h2>
    <p id="txtCanvasParagraph">¡Crea tu GIFO en sólo 3 pasos!<br> (sólo necesitas una cámara para grabar un video)</p>
    <video id="canvasVideo" class="canvasVideo"></video>
    <img id="showVideo" alt="">
    `;

}

//STEP ONE =======================================================
function createGifStepOne() {
    canvasCamera.innerHTML = `
    <h2>¿Nos das acceso <br> a tu cámara?</h2>
    <p>El acceso a tu cámara será válido sólo <br> por el tiempo en el que estés creando el GIFO</p>
    <video id="canvasVideo" class="canvasVideo"></video>
    <img id="showVideo" alt="">
    `;

    let streamTest = getStreamAndRecord(); //to get access to the camera
    streamTest.then((result) => {
        if (result === undefined) {
            window.alert('Sin acceso a la cámara');
            logo.click();
        } else {
            releaseCamera();

        }
    });

    //update the color and background of the steps buttons
    formatStepButtons([stepOne], 'var(--color-primary)', 'var(--font-color', [stepTwo, stepThree], 'var(--font-color', 'var(--color-primary)');


    // stepOne.setAttribute("disabled", "true");
    stepTwo.removeAttribute("disabled");
    stepThree.setAttribute("disabled", "true");

    //hide start buttons
    btnStartGif.style.display = "none";
}
//END STEP ONE =======================================================

//STEP TWO =======================================================
function createGifStepTwo() {
    canvasCamera.innerHTML = `
    <video id="canvasVideo" class="canvasVideo"></video>
    <img id="showVideo" alt="mi gif grabado">
    <div id="OverlayCard" class="OverlayCard">
        <img id="cardDownloadIcon" src="./images/icon-card-download-normal.svg" alt="icono download">
        <img id="cardLinkIcon" src="./images/icon-card-link-normal.svg" alt="icono link">
    </div>
    <div id="OverlayInfoUpload">
        <img id="stateUploadImg" alt="ícono estado de upload">
        <p id="stateUploadP"></p>
    </div>
    `;

    let canvasVideo = document.getElementById("canvasVideo"); //get canvas for put the video to rec
    let OverlayCard = document.getElementById("OverlayCard"); //get overlay card for the canvas video when upload
    let cardDownloadIcon = document.getElementById("cardDownloadIcon"); //get img node with download icon
    let cardLinkIcon = document.getElementById("cardLinkIcon"); //get img node with download icon
    let stateUploadImg = document.getElementById("stateUploadImg"); //get img node with download icon
    let stateUploadP = document.getElementById("stateUploadP"); //get img node with download icon
    let OverlayInfoUpload = document.getElementById("OverlayInfoUpload"); //get img node with download icon
    stateUploadImg.src = './images/loader.svg';
    stateUploadImg.style.animation = "rotateAxisX 3s linear 0s infinite normal backwards";

    stateUploadP.textContent = 'Estamos subiendo tu GIFO';

    OverlayInfoUpload.style.display = 'none';
    cardDownloadIcon.addEventListener('mouseover', () => {
        cardDownloadIcon.src = './images/icon-card-download-hover.svg'
    });

    cardDownloadIcon.addEventListener('mouseout', () => {
        cardDownloadIcon.src = './images/icon-card-download-normal.svg'
    });

    cardLinkIcon.addEventListener('mouseover', () => {
        cardLinkIcon.src = './images/icon-card-link-hover.svg'
    });

    cardLinkIcon.addEventListener('mouseout', () => {
        cardLinkIcon.src = './images/icon-card-link-normal.svg'
    });

    canvasVideo.style.display = "block";

    let stream = getStreamAndRecord();

    //add the stream (promise) inside btnSaveGif to be able to make an eventlistener without parameters and then to be able to do a removeEventListener so that the timer does not duplicate
    btnSaveGif.stream = stream;

    //animation when video canvas appears
    canvasVideo.style.animation =
        "rotateAxisY 1.5s linear 0s 1 normal backwards";

    //update the color and background of the steps buttons
    formatStepButtons([stepTwo], 'var(--color-primary)', 'var(--font-color', [stepOne, stepThree], 'var(--font-color', 'var(--color-primary)');

    //show / hide  nodes
    displayPrepare([btnSaveGif], "block", [btnStartGif, btnEndGif, btnUploadGif, projectionLight, filmCrono, filmRepeat], "none");

    // btnSaveGif.addEventListener("click", () => {
    //     saveGif(stream);
    // });
    btnSaveGif.addEventListener("click", saveGif);
}
//END STEP TWO =======================================================

function saveGif(event) {
    //Animations Start--------------------------------------------------------------
    projectionLight.style.animation = "twinkle 1.5s ease 0s infinite normal backwards";
    filmImg.style.animation = "rotateAxisX 1.5s linear 0s infinite normal backwards";
    //End animations start ---------------------------------------------------------

    //for cronometer -------------------------------
    filmCrono.textContent = "00:00:00";
    // writeCronometer();
    idInterval = setInterval(writeCronometer, 1000);
    //end cronometer----------------------------------

    //show / hide  nodes
    displayPrepare([btnEndGif, filmCrono, projectionLight], "block", [btnStartGif, btnSaveGif, btnUploadGif, filmRepeat], "none");

    event.target.stream.then(
        (resultado) => {
            recordGif(resultado);
        },
        (error) => {
            console.log(error);
        }
    );
}

function writeCronometer() {
    let hAux = 0;
    let mAux = 0;
    let sAux = 0;
    s++;

    if (s > 59) { m++; s = 0; }
    if (m > 59) { h++; m = 0; }
    if (h > 24) { h = 0; }

    if (s < 10) { sAux = "0" + s; } else { sAux = s; }
    if (m < 10) { mAux = "0" + m; } else { mAux = m; }
    if (h < 10) { hAux = "0" + h; } else { hAux = h; }

    filmCrono.textContent = hAux + ":" + mAux + ":" + sAux;
}

//STEP THREE =======================================================
function createGifStepThree() {

    //animation when video canvas appears
    showVideo.style.animation = "rotateAxisY 1.5s linear 0s 1 normal backwards";
    OverlayCard.style.animation = "rotateAxisY 1.5s linear 0s 1 normal backwards";
    OverlayCard.style.display = 'flex';
    OverlayInfoUpload.style.display = 'flex';

    //update the color and background of the steps buttons
    formatStepButtons([stepThree], 'var(--color-primary)', 'var(--font-color', [stepOne, stepTwo], 'var(--font-color', 'var(--color-primary)');
    //disble other buttons
    stepOne.setAttribute("disabled", "true");
    stepTwo.setAttribute("disabled", "true");
    stepThree.setAttribute("disabled", "true");
    btnUploadGif.style.display = 'none';
    filmCrono.style.display = 'none';
    displayPrepare([], "block", [filmRepeat, btnUploadGif, projectionLight, filmCrono, btnStartGif, btnEndGif, btnSaveGif], "none");

    let idMyGif = '';

    let gifUploaded = uploadGif(formGif); //here upload gif to giphy.com and get gif id.

    gifUploaded.then(
        (response) => {
            idMyGif = response.data.id;

            //show info about the upload
            stateUploadImg.src = './images/check.svg';
            stateUploadImg.style.animation = "rotateAxisX 3s linear 0s 2 normal backwards";
            stateUploadP.textContent = 'GIFO subido con éxito';
            
            if (desktopDisplay.matches) {
                setTimeout(function () {
                    OverlayInfoUpload.style.display = 'none';
                    OverlayCard.style.display = 'none';
                }, 5000);

                showVideo.style.animation = 'none';
                
                showVideo.addEventListener('mouseover' , (event) => {
                    console.log('entra');
                    console.log(event);
                    OverlayCard.style.display = 'flex';
                    OverlayCard.style.animation = 'none';
                });
                
                OverlayCard.addEventListener('mouseout' , (event) => {
                    console.log('sale');
                    console.log(event);
                    OverlayCard.style.display = 'none';
                });
            }


            //update local Storage for my Gifs-----------------------
            if (idMyGif !== '' && idMyGif) {
                if (myGifsLS.indexOf(idMyGif) === -1) {
                    //only add the gif if it doesn't exist
                    myGifsLS.push(idMyGif);
                }
                localStorage.setItem("myGifs", JSON.stringify(myGifsLS));
            }
            //----------------------------------------------------------

            //download manage
            //save the id gif's inside the object subscribed to the click event
            cardDownloadIcon.key = idMyGif;
            cardLinkIcon.key = idMyGif;

            //subscribe download icon to the click event
            //save the name for the gif inside the object subscribed to the click event
            let numberGif = myGifsLS.length + 1;
            cardDownloadIcon.name = 'MY-Gif' + numberGif;
            cardDownloadIcon.addEventListener("click", downloadGifFunction, false);
            cardLinkIcon.addEventListener("click", showLink, false);
        })
        .catch(
            (error) => {
                console.log(error);
            }
        );
}



async function showLink(event) {
    try {
        let info = await getSearchById(event.target.key);
        let urlMyGif = info.url;
        window.open(urlMyGif);

    } catch (error) {
        console.log(error);
    }



}
//END STEP THREE =======================================================

async function getStreamAndRecord() {
    let constraints = {
        audio: false,
        video: { width: 480, height: { max: 320 } },
    };

    try {
        let mediaStream = await navigator.mediaDevices.getUserMedia(
            constraints
        );

        canvasVideo.srcObject = mediaStream;
        canvasVideo.onloadedmetadata = function (e) {
            canvasVideo.play();
        };
        return mediaStream;
    } catch (error) {
        console.log(error.name + ": " + error.message);
    }
}

function recordGif(mediaStream) {
    recorder = RecordRTC(mediaStream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
            // console.log("Started");
        },
    });
    recorder.startRecording();
}

btnEndGif.addEventListener("click", endSaveGif);

function endSaveGif() {
    let showVideo = document.getElementById("showVideo"); //get img node to put the result of the filming

    //reset cronometre
    clearInterval(idInterval);
    h = 0; m = 0; s = 0;
    btnSaveGif.removeEventListener("click", saveGif);
    //---------------------

    //Animations End---------------------------
    projectionLight.style.animation = "";
    filmImg.style.animation = "";
    //End animations start --------------------

    //show / hide  nodes
    displayPrepare([btnUploadGif, filmRepeat], "block", [projectionLight, filmCrono, btnStartGif, btnEndGif, btnSaveGif], "none");

    // //create form to upload gif
    // let form = new FormData();

    recorder.stopRecording(async () => {
        let blob = recorder.getBlob();

        //to show the gif in canvas screen
        let url = URL.createObjectURL(blob);
        canvasVideo.style.display = "none";
        showVideo.style.display = "block";
        showVideo.src = url;
        //--------------------------------
        formGif = new FormData();//create form to upload gif
        formGif.append("file", blob, "myGif.gif");
    });
    //release cammera hardware
    releaseCamera();


}

//release the hardware camera
function releaseCamera() {
    // get the Steam 
    canvasVideo.pause();
    canvasVideo.src = '';

    // now get the Steam 
    let streamVideo = canvasVideo.srcObject;
    console.log('streamVideo');
    console.log(streamVideo);
    // now get all tracks
    let tracks = streamVideo.getTracks();
    // now close each track by having forEach loop
    tracks.forEach(function (track) {
        // stopping every track
        console.log('track');
        console.log(track);
        track.stop();
    });
    streamVideo.srcObject = 'null';
    console.log(streamVideo.srcObject);
}

filmRepeat.addEventListener("click", createGifStepTwo);

btnUploadGif.addEventListener('click', createGifStepThree);

//END CREATE GIF SECTION =================================================================

//FOOTER ============================================================================================
//===================================================================================================
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

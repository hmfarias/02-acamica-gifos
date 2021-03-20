//FOR THEMES
let themeName = ""; //create theme name variable global for use later

// FOR BURGER MENU IN MOBILE MODE -------------
let navIcon = document.getElementById("navIcon"); //burger or X image
let navMenu = document.getElementById("navMenu"); //options menu
let searchIcon = document.getElementById("searchIcon"); // search icon
let navIconImageClose = "";
let navIconImageBurger = "";
let searchIconImage = "";
let ilustraHeader = document.getElementById("ilustraHeader");

// burguer menu changes
navIcon.addEventListener("click", () => {
    changeIconBurger();
});

//function to change the burger menu icon when the user clicks on it
function changeIconBurger() {
    if (navMenu.style.display === "" || navMenu.style.display === "none") {
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
    ilustraHeader.style.display === "none"
        ? (searchIcon.src = navIconImageClose)
        : (searchIcon.src = searchIconImage);
}

// function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem("theme") === "theme-dark") {
        themeName = "theme-light";
        setTheme(themeName);
    } else {
        themeName = "theme-dark";
        setTheme(themeName);
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem("theme") === "theme-dark") {
        themeName = "theme-dark";
        setTheme(themeName);
    } else {
        themeName = "theme-light";
        setTheme(themeName);
    }
})();

// nocturn or light mode menu option
let changeMode = document.getElementById("changeMode");
changeMode.addEventListener("click", () => {
    toggleTheme();
});

//END THEMES ------------------------------------------------------

//SEARCH SECTION --------------------------------------------------
let sectionSearch = document.getElementById("sectionSearch"); //gets the Section node corresponding to the search, to be able to hide it and show it accordingly
let search = document.getElementById("search");//gets the div node that contains the Div node for search bar, and the div node for the hints
let searchContainer = document.getElementById("searchContainer"); //gets the div node that contains the search bar
let titleSearch = document.getElementById("titleSearch"); //gets the h2 node to put the search text in it

//to show search icon or X icon
searchIcon.addEventListener("click", () => {
    //show search icon
    if (ilustraHeader.style.display === "none") {
        ilustraHeader.style.display = "block";
        sectionSearch.style.marginTop = "0px";
        sectionResults.style.display = "none";
        searchInput.value = '';
        searchGif.innerHTML = '';
    //show X icon
    } else {
        ilustraHeader.style.display = "none";
        sectionSearch.style.marginTop = "41.2px";
        sectionResults.style.display = "block";
        searchInput.focus();
    }
    iconsUpdate();
});

//END SEARCH SECTION -----------------------------------------------

//RESULT SECTION ---------------------------------------------------
const URL_BASE_SEARCH = 'https://api.giphy.com/v1/gifs/search?api_key=4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx&limit=20&offset=';
let offset = 0; //for button SHOW MORE in orden to show 'offset' elements more

let searchInput = document.getElementById('searchInput'); //gets input node where the user puts the search
let searchGif = document.getElementById('searchGif'); // gets the DIV node where the searched gifs appear
let btnShowMore = document.getElementById("btnShowMore"); //get "Show More" button node

//function that shows search gifs
async function showSearch(word, start) {
    try {
        const URL = URL_BASE_SEARCH + start + '&q=' + word; //url base + offset + word to search
        const response  = await fetch(URL);
        const info = await response.json();

        //here we have each trending gif through iteration
        info.data.forEach(element => {
            searchGif.innerHTML += `
                <img src="${element.images.fixed_height.url}">
            `;
        });
    } catch (error) {
        console.log(error);
    }
}

//search gifs when the usr press Enter
searchInput.addEventListener('keypress' , (event) => {
    if(event.key === 'Enter') {
        offset = 0;
        searchGif.innerHTML = '';
        titleSearch.textContent = searchInput.value;
        showSearch(searchInput.value,offset);
    }
});

//search gifs when the usr press "Show More" button
btnShowMore.addEventListener('click' , () => {
    offset += 20;
    showSearch(searchInput.value, offset);
});

//for hover efect in "Show More"button ------
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
// API KEY: 4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx
// URL TRENDING: https://api.giphy.com/v1/gifs/trending?api_key=4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx&limit=25&rating=g

const URL_BASE_TRENDING = 'https://api.giphy.com/v1/gifs/trending?api_key=4SgwG4zh1E8ChFfX2AFRCifOP8Y1bXGx&limit=25';
let trendingGif = document.getElementById('trendingGif'); //get DIV node where show the trending gifs

//function that shows trending gifs
async function showTrendign () {
    try {
        const response  = await fetch(URL_BASE_TRENDING);
        const info = await response.json();

        //here we have each trending gif through iteration
        info.data.forEach(element => {
            trendingGif.innerHTML += `
                <img src="${element.images.fixed_height.url}">
            `;
        });
    } catch (error) {
        console.log(error);
    }
}

showTrendign(); //run the function





//END TRENDING SECTION ---------------------------------------------------

//FOOTER ----------------------------------------------------------

//for hovers on social media icons ----------------
let facebook = document.getElementById("facebook"); // get facebook icon node 
let twitter = document.getElementById("twitter"); // get twitter icon node 
let instagram = document.getElementById("instagram"); // get instagram icon node 

facebook.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
    ? (event.target.src = './images/icon-face-hover-noct.svg')
    : (event.target.src = './images/icon-face-hover.svg');
});
facebook.addEventListener("mouseout", (event) => event.target.src = './images/icon-face-normal.svg');

twitter.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
    ? (event.target.src = './images/icon-twitter-hover-noct.svg')
    : (event.target.src = './images/icon-twitter-hover.svg');
});
twitter.addEventListener("mouseout", (event) => event.target.src = './images/icon-twitter-normal.svg');

instagram.addEventListener("mouseover", (event) => {
    themeName === "theme-dark"
    ? (event.target.src = './images/icon-instagram-hover-noct.svg')
    : (event.target.src = './images/icon-instagram-hover.svg');
});
instagram.addEventListener("mouseout", (event) => event.target.src = './images/icon-instagram-normal.svg');
//END for hovers on social media icons ----------------

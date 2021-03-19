//FOR THEMES
let themeName= ''; //create theme name variable global for use later

// FOR BURGER MENU IN MOBILE MODE -------------
let navIcon = document.getElementById("navIcon"); //burger or X image
let navMenu = document.getElementById("navMenu"); //options menu
let searchIcon = document.getElementById("searchIcon"); // search icon
let navIconImageClose = "";
let navIconImageBurger = "";
let searchIconImage = "";

//FOR SECTION SEARCH
let sectionSearch = document.getElementById('sectionSearch');
let search = document.getElementById('search');
let searchContainer = document.getElementById('searchContainer');
let ilustraHeader = document.getElementById('ilustraHeader');

navIcon.addEventListener("click", () => {
    changeIconBurger();
});

//function to change the burger menu icon when the user clicks on it
function changeIconBurger() {
    if (navMenu.style.display === "none") {
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
    console.log(themeName);
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
    console.log('entre en ilustra header');
    console.log(ilustraHeader.style.display);
    ilustraHeader.style.display === 'none' 
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

// END THEMES ------------------------------------------------

//SEARCH BAR -----------------------------------------------
searchIcon.addEventListener('click' , () => {
    console.log(ilustraHeader.style.display === '' );
    if(ilustraHeader.style.display === 'none') {    
        ilustraHeader.style.display = 'block';
        sectionSearch.style.marginTop = '0px' ;
    } else {
        ilustraHeader.style.display = 'none';
        console.log(sectionSearch);
        sectionSearch.style.marginTop = '41.2px' ;
    }
    iconsUpdate();
});

//SEARCH BAR -----------------------------------------------
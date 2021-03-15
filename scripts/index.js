// FOR BURGER MENU IN MOBILE MODE -------------
let navIcon = document.getElementById('navIcon');
let navMenu = document.getElementById('navMenu');

navIcon.addEventListener(('click'),() => {
    if(navMenu.style.display === 'none') {
        navIcon.src = './images/close.svg';
        navMenu.style.display = 'block';
    } else {
        navIcon.src ='./images/burger.svg';
        navMenu.style.display = 'none';
    }
});
// END FOR BURGER MENU IN MOBILE MODE ---------
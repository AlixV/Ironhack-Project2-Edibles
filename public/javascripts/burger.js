const burger = document.getElementById("iconBurger");
const navMobile = document.getElementById("nav-mobile");

function handleBurger(event){
 navMobile.classList.toggle("is-active")
}

burger.onclick = handleBurger
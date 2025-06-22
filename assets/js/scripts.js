/* Menu */
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-button");
    const menuContainer = document.querySelector(".menu-container");
    const isMenuHidden = () => menuContainer.classList.contains("hidden"); 
    const hideMenu = () => {
        if (!isMenuHidden()) {
            menuContainer.classList.add("hidden");
        }
    }
    const showMenu = () => {
        if (isMenuHidden()) {
            menuContainer.classList.remove("hidden");
        }
    }
    const toggleMenu = () => {
        if (isMenuHidden()) {
            showMenu();
        } else {
            hideMenu();
        }
    }
    document.addEventListener("click", function (event) {
        if (menuButton.contains(event.target)) {
            toggleMenu();
        } else if (!menuContainer.contains(event.target)) {
            hideMenu();
        }
    });
});

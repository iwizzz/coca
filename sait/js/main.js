const burgerButton = document.querySelector(".header__burger-button");
const nav = document.querySelector(".header__nav");

burgerButton.addEventListener("click", (event) => nav.style.display = "flex")

nav.addEventListener("click", (event) => window.innerWidth <= 768 ? nav.style.display = "none" : "")

// window.addEventListener("resize", () => window.location.reload());


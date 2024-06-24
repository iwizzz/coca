"use strict";
const burgerButton = document.querySelector(".header__burger-button");
const nav = document.querySelector(".header__nav");
const switcher = document.querySelector(".pricing__head-block__switcher");
const questions = document.querySelectorAll(".pricing__questions-block__list-item");


burgerButton.addEventListener("click", (event) => nav.style.display = "flex")

nav.addEventListener("click", (event) => window.innerWidth <= 768 ? nav.style.display = "none" : "")

// window.addEventListener("resize", () => window.location.reload());


if (switcher) {
    switcher.addEventListener("click", () => switcher.classList.toggle("active"));
}

if(questions) {
    for (let i of questions) {
        i.addEventListener("click", () => i.classList.toggle("active"));
    }
}
btnCore.addEventListener("click", () => {
    coreSolutions.classList.remove("hidden");
    ecommerceSolutions.classList.add("hidden");
    btnCore.classList.add("activo");
    btnEcommerce.classList.remove("activo");
});

btnEcommerce.addEventListener("click", () => {
    ecommerceSolutions.classList.remove("hidden");
    coreSolutions.classList.add("hidden");
    btnEcommerce.classList.add("activo");
    btnCore.classList.remove("activo");
});
// x
btnCore.classList.add("activo");

/**
 * SCROLL DEL HEADER
 */

const header = document.querySelector(".side-header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}



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

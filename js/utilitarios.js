/*Servicios begin*/
const btnsolucion = document.getElementById("btnsolucion");
const btnproteccion = document.getElementById("btnproteccion");

const solucionCont = document.getElementById("solucionCont");
const proteccionCont = document.getElementById("proteccionCont");

btnsolucion.addEventListener("click", () => {
    solucionCont.classList.remove("hidden");
    proteccionCont.classList.add("hidden");
    btnsolucion.classList.add("activo");
    btnproteccion.classList.remove("activo");
});

btnproteccion.addEventListener("click", () => {
    proteccionCont.classList.remove("hidden");
    solucionCont.classList.add("hidden");
    btnproteccion.classList.add("activo");
    btnsolucion.classList.remove("activo");
});

btnsolucion.classList.add("activo");

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

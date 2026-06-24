
/*SECCION DE SERVICIOS BEGIN */
const btnCore = document.getElementById("btnCore");
const btnEcommerce = document.getElementById("btnEcommerce");

const coreSolutions = document.getElementById("coreSolutions");
const ecommerceSolutions = document.getElementById("ecommerceSolutions");

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

// estado inicial: "Como Trabajamos" activo
btnCore.classList.add("activo");

/***SECCION DE SERVICIOS END */
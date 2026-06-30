const btnsolucion = document.getElementById("btnSolucion");
const btnproteccion = document.getElementById("btnProteccion");

const solucionCont = document.getElementById("solucionCont");
const proteccionCont = document.getElementById("proteccionCont");

if (btnsolucion && btnproteccion && solucionCont && proteccionCont) {
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
}
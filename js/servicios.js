// ============================================================
// REFERENCIAS DEL DOM
// ============================================================

const contenedorServicios =
    document.getElementById("contenedorServicios");

const mensajeServicios =
    document.getElementById("mensajeServicios");

const filtroTag =
    document.getElementById("filtroTag");

const btnCore =
    document.getElementById("btnCore");

const btnEcommerce =
    document.getElementById("btnEcommerce");

const btnLimpiarFiltros =
    document.getElementById("btnLimpiarFiltros");

// ============================================================
// VARIABLES GLOBALES
// ============================================================

let servicios = [];
let categoriaSeleccionada = "";

// ============================================================
// CARGA DEL JSON
// ============================================================

async function cargarServicios() {

    const respuesta =
        await fetch("../json/servicios.json");

    servicios =
        await respuesta.json();

    servicios.forEach(function (servicio) {
        servicio.destacado =
            servicio.ventas >= 50000;
    });

    filtrarServicios();
}

// ============================================================
// HELPERS
// ============================================================

function obtenerServiciosDisponibles() {

    return servicios.filter(function (servicio) {
        return servicio.disponible;
    });

}

function formatearPrecio(numero) {

    return "₡" + numero.toLocaleString("es-CR");

}

// ============================================================
// CREACIÓN DE TARJETAS
// ============================================================

function crearTarjetaServicio(servicio) {

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add("contenedor-servicios");

    if (servicio.destacado) {
        tarjeta.classList.add("destacado");
    }

    tarjeta.innerHTML = `
        <div class="servicio-icono">
            <i class="${servicio.icono}"></i>
        </div>

        <div class="servicio-contenido">

            <span class="servicio-categoria">
                ${servicio.categoria}
            </span>

            <h4>
                ${servicio.nombre}
            </h4>

            <p class="servicio-precio">
                ${formatearPrecio(servicio.precio)}
                <span>/mes</span>
            </p>

            <p class="desc-corta">
                ${servicio.desc_corta}
            </p>

            <p class="desc-ext">
                ${servicio.desc_ext}
            </p>

            <div class="servicio-tags">
                ${servicio.tags.map(function(tag){
                    return `
                        <span class="tag">
                            ${tag}
                        </span>
                    `;
                }).join("")}
            </div>

        </div>
    `;

    return tarjeta;
}

// ============================================================
// RENDERIZADO
// ============================================================

function renderizarServicios(listaServicios) {

    contenedorServicios.innerHTML = "";

    if (listaServicios.length === 0) {

        mensajeServicios.textContent =
            "No hay servicios disponibles con los filtros seleccionados.";

        contenedorServicios.innerHTML = `
            <div class="empty-state">
                <h3>Sin resultados</h3>
                <p>
                    Probá con otros filtros para ver más servicios.
                </p>
            </div>
        `;

        return;
    }

    mensajeServicios.textContent =
        `Mostrando ${listaServicios.length} servicio(s).`;

    for (const servicio of listaServicios) {

        const tarjeta =
            crearTarjetaServicio(servicio);

        contenedorServicios.appendChild(tarjeta);

    }

}

// ============================================================
// FILTRADO
// ============================================================

function filtrarServicios() {

    const tagSeleccionado =
        filtroTag.value;

    const serviciosFiltrados =
        servicios.filter(function(servicio){

            const cumpleDisponible =
                servicio.disponible;

            const cumpleCategoria =
                categoriaSeleccionada === "" ||
                servicio.categoria === categoriaSeleccionada;

            const cumpleTag =
                tagSeleccionado === "" ||
                servicio.tags.includes(tagSeleccionado);

            return (
                cumpleDisponible &&
                cumpleCategoria &&
                cumpleTag
            );

        });

    renderizarServicios(serviciosFiltrados);

}

// ============================================================
// LIMPIAR FILTROS
// ============================================================

function limpiarFiltros() {

    categoriaSeleccionada = "";

    filtroTag.value = "";

    filtrarServicios();

}

// ============================================================
// INICIALIZACIÓN
// ============================================================

function iniciarServicios() {

    btnCore.addEventListener("click", function(){

        categoriaSeleccionada = "core";

        filtrarServicios();

    });

    btnEcommerce.addEventListener("click", function(){

        categoriaSeleccionada = "ecommerce";

        filtrarServicios();

    });

    filtroTag.addEventListener(
        "change",
        filtrarServicios
    );

    btnLimpiarFiltros.addEventListener(
        "click",
        limpiarFiltros
    );

    cargarServicios();

}

// ============================================================
// PUNTO DE ENTRADA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    iniciarServicios
);
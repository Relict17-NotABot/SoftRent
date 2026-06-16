// ============================================================
//  servicios.js — Lógica de la sección de Servicios
// ============================================================

/**
 * Inicializa todos los eventos de la sección de servicios.
 * Llamar cuando el DOM esté listo.
 */
function iniciarServicios() {
    // TODO: conectar los botones de filtro y cargar las tarjetas
}

/**
 * Filtra las tarjetas de servicio según la categoría seleccionada.
 * @param {string} categoria - El valor del atributo data-filtro del botón clickeado.
 */
function filtrarServicios(categoria) {
    // TODO: mostrar/ocultar .tarjeta-servicio según data-categoria
}

/**
 * Marca el botón de filtro activo y desactiva los demás.
 * @param {HTMLElement} botonActivo - El botón que fue clickeado.
 */
function actualizarFiltroActivo(botonActivo) {
    // TODO: quitar .activo de todos los .filtro-btn y ponerlo en botonActivo
}

/**
 * Carga dinámicamente las tarjetas de servicio en el grid.
 * Útil cuando se quiera manejar los servicios desde un array en vez de HTML estático.
 * @param {Array} listaServicios - Array de objetos con la info de cada servicio.
 */
function cargarServicios(listaServicios) {
    // TODO: generar y renderizar .tarjeta-servicio desde listaServicios
}

// ─── Punto de entrada ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', iniciarServicios);

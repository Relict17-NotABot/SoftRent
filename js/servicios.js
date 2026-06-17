// ============================================================
//  servicios.js — Lógica de la sección de Servicios
// ============================================================

// ─── Variable global ─────────────────────────────────────────
// Empieza vacía. Se llena cuando cargarServicios() resuelve el fetch.
let servicios = []

// ─── Referencias al DOM ──────────────────────────────────────
// Se obtienen una sola vez al cargar el script y se reutilizan en todo el archivo.
const contenedorServicios = document.getElementById("contenedorServicios")
const mensajeServicios    = document.getElementById("mensajeServicios")
const botonesFiltroCat    = document.querySelectorAll(".filtro-btn[data-filtro-cat]")
const botonesFiltroTag    = document.querySelectorAll(".filtro-btn[data-filtro-tag]")
const btnLimpiarFiltros   = document.getElementById("btnLimpiarFiltros")

// ─── Estado de filtros activos ───────────────────────────────
// Guardan qué filtro está seleccionado en cada momento.
// Vacío ("") significa que no hay filtro aplicado para esa categoría.
let categoriaActiva = ""
let tagActivo       = ""

// ============================================================
//  CARGA DE DATOS
// ============================================================

/**
 * Hace el fetch del JSON, llena la variable global `servicios`
 * y dispara la primera renderización.
 * Es async porque usa await para esperar la respuesta del servidor.
 */
async function cargarServicios() {
    // Primer await: espera a que el archivo llegue desde el servidor.
    // `respuesta` contiene la respuesta HTTP, pero el contenido aún no es legible.
    const respuesta = await fetch("../json/servicios.json")

    // Segundo await: convierte el texto crudo del body a un array de objetos JS.
    // Solo después de esto `servicios` tiene los datos reales.
    servicios = await respuesta.json()

    servicios.forEach(function(servicio){
    servicio.destacado =
        servicio.ventas >= 50000;
    });

    console.log(servicios);

    // Recién aquí es seguro llamar a filtrarServicios(), porque servicios ya está lleno.
    filtrarServicios()
}

// ============================================================
//  HELPERS
// ============================================================

/**
 * Devuelve solo los servicios con disponible: true.
 * Centraliza este chequeo para no repetirlo en varios lados.
 */
function obtenerServiciosDisponibles() {
    return servicios.filter(function(srv) {
        return srv.disponible
    })
}

/**
 * Convierte un número a formato de precio en colones.
 * Ejemplo: 25000 → "₡25.000"
 * toLocaleString("es-CR") aplica el formato de miles de Costa Rica (punto como separador).
 */
function formatearPrecio(numero) {
    return "₡" + numero.toLocaleString("es-CR")
}

// ============================================================
//  CREACIÓN DE TARJETAS
// ============================================================

/**
 * Recibe un objeto servicio y construye su tarjeta HTML.
 * Crea el elemento en memoria con createElement (aún no está en la página).
 * Lo agrega al DOM recién cuando renderizarServicios() llama a appendChild().
 */
function crearTarjetaServicio(servicio) {
    const tarjeta = document.createElement("article")
    tarjeta.classList.add("contenedor-servicios")

    // Si el servicio tiene destacado: true, se le agrega una clase extra para estilizarlo diferente.
    if (servicio.destacado) tarjeta.classList.add("destacado")

    tarjeta.innerHTML = `
        <div class="servicio-imagen">
            <img src="${servicio.icono}" alt="${servicio.nombre}">
        </div>
        <div class="servicio-contenido">
            <span class="servicio-categoria">${servicio.categoria}</span>
            <h4>${servicio.nombre}</h4>
            <p class="desc-corta">${servicio.desc_corta}</p>
            <p class="desc-ext">${servicio.desc_ext}</p>
            <div class="servicio-tags">
                ${servicio.tags.map(function(tag) {
                    // map() convierte cada string del array en un <span>.
                    // join("") une el array resultante en un solo string sin separadores.
                    return `<span class="tag">${tag}</span>`
                }).join("")}
            </div>
            <p class="servicio-precio">${formatearPrecio(servicio.precio)}<span>/mes</span></p>
        </div>
    `
    return tarjeta
}

// ============================================================
//  RENDERIZADO
// ============================================================

/**
 * Limpia el contenedor y renderiza la lista de servicios recibida.
 * Si la lista está vacía, muestra el estado vacío en su lugar.
 */
function renderizarServicios(listaServicios) {
    // Limpia las tarjetas anteriores para no acumularlas con cada filtro.
    contenedorServicios.innerHTML = ""

    if (listaServicios.length === 0) {
        mensajeServicios.textContent = "No hay servicios disponibles con los filtros seleccionados."
        contenedorServicios.innerHTML = `
            <div class="empty-state">
                <h3>Sin resultados</h3>
                <p>Probá con otros filtros para ver más servicios.</p>
            </div>
        `
        // return corta la función acá para no ejecutar el bloque de abajo.
        return
    }

    mensajeServicios.textContent = `Mostrando ${listaServicios.length} servicio(s).`

    for (const servicio of listaServicios) {
        // crearTarjetaServicio construye el elemento en memoria.
        const tarjeta = crearTarjetaServicio(servicio)
        // appendChild lo inserta en el DOM, haciéndolo visible en la página.
        contenedorServicios.appendChild(tarjeta)
    }
}

// ============================================================
//  FILTROS
// ============================================================

/**
 * Aplica los filtros activos (categoría + tag) y renderiza el resultado.
 * Es el centro de la lógica de filtrado: todas las acciones del usuario terminan acá.
 */
function filtrarServicios() {
    const disponibles = obtenerServiciosDisponibles()

    const filtrados = disponibles.filter(function(srv) {
        // Si categoriaActiva está vacía, la condición es true para todos (sin filtro).
        // Si tiene valor, el servicio tiene que coincidir exactamente.
        const cumpleCategoria =
            categoriaActiva === "" ||
            srv.categoria === categoriaActiva

        // includes() revisa si el array de tags del servicio contiene el tag activo.
        const cumpleTag =
            tagActivo === "" ||
            srv.tags.includes(tagActivo)

        // El servicio pasa solo si cumple AMBAS condiciones a la vez.
        return cumpleCategoria && cumpleTag
    })

    renderizarServicios(filtrados)
}

/**
 * Quita la clase "activo" de todos los botones del grupo
 * y se la pone solo al que fue clickeado.
 * Garantiza que haya máximo un botón activo por grupo.
 */
function actualizarBotonesActivos(botonActivo, grupoCompleto) {
    for (const btn of grupoCompleto) {
        btn.classList.remove("activo")
    }
    botonActivo.classList.add("activo")
}

/**
 * Resetea los dos filtros a vacío, saca la clase activo de todos los botones
 * y vuelve a renderizar todos los servicios disponibles.
 */
function limpiarFiltros() {
    categoriaActiva = ""
    tagActivo       = ""

    for (const btn of botonesFiltroCat) btn.classList.remove("activo")
    for (const btn of botonesFiltroTag) btn.classList.remove("activo")

    filtrarServicios()
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================

/**
 * Asigna los listeners a todos los controles y dispara la carga inicial.
 * Se llama solo cuando el DOM está listo (ver punto de entrada abajo).
 */
function iniciarServicios() {

    // Botones de categoría: actualizan categoriaActiva con el valor de su data-filtro-cat.
    // dataset.filtroCat es la forma JS de acceder al atributo data-filtro-cat (kebab → camelCase).
    for (const btn of botonesFiltroCat) {
        btn.addEventListener("click", function() {
            categoriaActiva = btn.dataset.filtroCat
            actualizarBotonesActivos(btn, botonesFiltroCat)
            filtrarServicios()
        })
    }

    // Botones de tag: igual pero actualizan tagActivo con data-filtro-tag.
    for (const btn of botonesFiltroTag) {
        btn.addEventListener("click", function() {
            tagActivo = btn.dataset.filtroTag
            actualizarBotonesActivos(btn, botonesFiltroTag)
            filtrarServicios()
        })
    }

    btnLimpiarFiltros.addEventListener("click", limpiarFiltros)

    // Dispara el fetch y la primera renderización.
    cargarServicios()
}

// ─── Punto de entrada ────────────────────────────────────────
// DOMContentLoaded garantiza que el HTML esté listo antes de que
// iniciarServicios() intente acceder a los elementos del DOM.
document.addEventListener("DOMContentLoaded", iniciarServicios)
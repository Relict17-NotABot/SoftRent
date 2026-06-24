// ============================================================
// DATOS GLOBALES
// ============================================================

let servicios = [];
let planes = [];

// ============================================================
// FUNCIONES DE CARGA
// ============================================================

async function cargarServicios() {
    try {
        const respuesta = await fetch("json/servicios.json");
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        servicios = await respuesta.json();
    } catch (error) {
        console.error("Error al cargar servicios:", error);
    }
}

async function cargarPlanes() {
    try {
        const respuesta = await fetch("json/planes.json");
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        planes = await respuesta.json();
    } catch (error) {
        console.error("Error al cargar planes:", error);
    }
}

// ============================================================
// ORQUESTADOR CENTRAL
// Carga ambos JSON en paralelo y luego llama a los módulos.
// Todos los scripts dependen de esta Promise en vez de tener
// sus propios DOMContentLoaded compitiendo entre sí.
// ============================================================

const datosListos = new Promise(function (resolve) {
    document.addEventListener("DOMContentLoaded", async function () {
        await Promise.all([cargarPlanes(), cargarServicios()]);
        resolve();
    });
});
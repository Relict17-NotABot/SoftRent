

let servicios = [];
let planes = [];


// Cargar Serv

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

// Esto es para que Cargar Planes y Servicios al mismo tiempo

const datosListos = new Promise(function (resolve) {
    document.addEventListener("DOMContentLoaded", async function () {
        await Promise.all([cargarPlanes(), cargarServicios()]);
        resolve();
    });
});
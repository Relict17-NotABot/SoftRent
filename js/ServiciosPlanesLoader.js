async function cargarServicios() {
    try {
        const respuesta = await fetch("json/servicios.json");
        servicios = await respuesta.json();
    } catch(error) {
        console.error("Error al cargar servicios");
    }
}

async function cargarPlanes() {
    try {
        const respuesta = await fetch("json/planes.json");
        planes = await respuesta.json();
    } catch(error) {
        console.error("Error al cargar planes");
    }
}
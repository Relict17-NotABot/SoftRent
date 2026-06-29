// Carga Inicial de la pagina


document.addEventListener("DOMContentLoaded",function(){

const compraJSON = localStorage.getItem("softrent_ultima_compra")

if(compraJSON) {

const compra = JSON.parse(compraJSON);
mostrarVista(compra);

} else {

    mostrarVistaSinCompra();

}

})

function mostrarVista(compra){
    document.querySelector(".sin-plan").classList.add("oculto");
    document.querySelector(".con-plan").classList.remove("oculto");

    // Llenar datos del plan
    document.querySelector(".sub-nombre").textContent = compra.plan.nombre;
    document.querySelector(".sub-modalidad").textContent = compra.plan.periodicidad;
    document.querySelector(".dato-numero").textContent = formatearPrecio(compra.total);

    // Contar servicios activos (fijos + elegidos + adicionales)
    const totalServicios = compra.serviciosElegidos.length + compra.serviciosAdicionales.length;
    document.querySelectorAll(".dato-numero")[1].textContent = totalServicios;

    // Renderizar servicios contratados
    renderizarServiciosContratados(compra);
}

function renderizarServiciosContratados(compra) {
    const grid = document.querySelector(".servicios-grid");
    grid.innerHTML = "";

    // Servicios fijos del plan
    const plan = buscarPlan(compra.plan.id);
    if (plan && plan.servicios_fijos) {
        plan.servicios_fijos.forEach(function(id) {
            const srv = buscarServicio(id);
            if (srv) {
                grid.appendChild(crearTarjetaServicioContratado(srv));
            }
        });
    }

    // Servicios elegidos
    compra.serviciosElegidos.forEach(function(srv) {
        grid.appendChild(crearTarjetaServicioContratado(srv));
    });

    // Servicios adicionales
    compra.serviciosAdicionales.forEach(function(srv) {
        grid.appendChild(crearTarjetaServicioContratado(srv));
    });
}

function crearTarjetaServicioContratado(srv) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "servicio-tarjeta";
    tarjeta.innerHTML = `
        <div class="servicio-icono">
            <i class="${srv.icono}"></i>
        </div>
        <div class="servicio-info">
            <h3>${srv.nombre}</h3>
            <span class="servicio-categoria">Servicio</span>
        </div>
    `;
    return tarjeta;
}

function formatearPrecio(numero) {
    return "₡" + numero.toLocaleString("es-CR");
}

// Buscadores en los catálogos cargados por ServiciosPlanesLoader.js.
// servicios.js (donde viven originalmente) no se carga en esta página,
// así que los redefinimos aquí para modalPago.js y mostrarVista().
function buscarPlan(idPlan) {
    return planes.find(function (plan) {
        return plan.id === idPlan;
    });
}

function buscarServicio(idServicio) {
    return servicios.find(function (servicio) {
        return servicio.id === idServicio;
    });
}

function mostrarVistaSinCompra() {

    document.querySelector(".sub-tarjeta").classList.add("oculto");
    document.querySelector(".sin-plan").classList.remove("oculto");

}

document.getElementById("btn-abrir-eliminar").addEventListener("click", () => {
    localStorage.clear();
});



/* ---- MODAL: EDITAR PLAN ---- */






var modalEditar = document.getElementById('modal-editar');
var btnAbrirEditar = document.getElementById('btn-abrir-editar');
var btnCerrarEditar = document.getElementById('btn-cerrar-editar');

/* Abre el modal de editar plan usando el modal de pago */
btnAbrirEditar.addEventListener('click', function () {
    const compraJSON = localStorage.getItem("softrent_ultima_compra");
    if (compraJSON) {
        const compra = JSON.parse(compraJSON);
        abrirModalPago(compra.plan.id);
    }
});

/* Cierra el modal de editar plan */
btnCerrarEditar.addEventListener('click', function () {
    modalEditar.classList.add('oculto');
});

/* Cierra el modal si el usuario hace clic en el fondo oscuro */
modalEditar.addEventListener('click', function (e) {
    if (e.target === modalEditar) {
        modalEditar.classList.add('oculto');
    }
});


/* ---- MINI MODAL: ELIMINAR SUBSCRIPCIÓN ---- */

var modalEliminar = document.getElementById('modal-eliminar');
var btnAbrirEliminar = document.getElementById('btn-abrir-eliminar');
var btnCerrarEliminar = document.getElementById('btn-cerrar-eliminar');
var btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');

/* Abre el mini modal de confirmación */
btnAbrirEliminar.addEventListener('click', function () {
    modalEliminar.classList.remove('oculto');
});

/* Cierra el mini modal (botón X) */
btnCerrarEliminar.addEventListener('click', function () {
    modalEliminar.classList.add('oculto');
});

/* Cierra el mini modal (botón Cancelar) */
btnCancelarEliminar.addEventListener('click', function () {
    modalEliminar.classList.add('oculto');
});

/* Cierra si el usuario hace clic en el fondo oscuro */
modalEliminar.addEventListener('click', function (e) {
    if (e.target === modalEliminar) {
        modalEliminar.classList.add('oculto');
    }
});


/* ---- FORMULARIO: VALIDACIÓN DE DATOS DEL NEGOCIO ---- */

var form = document.getElementById('form-negocio');

/* Función que muestra u oculta un mensaje de error debajo de un campo */
function mostrarError(idError, mensaje) {
    document.getElementById(idError).textContent = mensaje;
}

/* Validación al guardar */
form.addEventListener('submit', function (e) {
    e.preventDefault(); /* evita que la página se recargue */

    var nombre = document.getElementById('negocio-nombre').value.trim();
    var correo = document.getElementById('negocio-correo').value.trim();
    var modalidad = document.getElementById('negocio-modalidad').value;

    var valido = true;

    /* Limpiar errores anteriores */
    mostrarError('error-nombre', '');
    mostrarError('error-correo', '');
    mostrarError('error-modalidad', '');

    /* Validar nombre */
    if (nombre === '') {
        mostrarError('error-nombre', 'El nombre del negocio es obligatorio.');
        valido = false;
    }

    /* Validar correo: formato básico con @ y punto */
    var formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo === '') {
        mostrarError('error-correo', 'El correo es obligatorio.');
        valido = false;
    } else if (!formatoCorreo.test(correo)) {
        mostrarError('error-correo', 'El formato del correo no es válido.');
        valido = false;
    }

    /* Validar modalidad */
    if (modalidad === '') {
        mostrarError('error-modalidad', 'Seleccioná una modalidad de pago.');
        valido = false;
    }

    /* Si todo está bien, aquí iría el guardado real (backend / JSON) */
    if (valido) {
        alert('Datos guardados correctamente.');
        /* TODO: conectar con backend */
    }
});

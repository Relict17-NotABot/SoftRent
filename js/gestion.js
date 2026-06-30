// Carga Inicial de la pagina


document.addEventListener("DOMContentLoaded",function(){

const compraJSON = localStorage.getItem("softrent_ultima_compra")

if(compraJSON) {

const compra = JSON.parse(compraJSON);
mostrarVista(compra);

} else {

    mostrarVistaSinCompra();

}

// Restaurar nombre y correo guardados previamente
restaurarDatosNegocio();

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

    // Precargar la modalidad de pago con la de la última compra
    const selModalidad = document.getElementById("negocio-modalidad");
    if (selModalidad) {
        selModalidad.value = compra.plan.periodicidad;
    }
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

const btnConfirmarEliminar = document.querySelector(".btn-confirmar-eliminar");
if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener("click", () => {
        // 1. borra solo la suscripción
        localStorage.removeItem("softrent_ultima_compra");

        // 2. cierra el mini modal
        modalEliminar.classList.add("oculto");

        // 3. cambia de vista en vivo, sin recargar
        document.querySelector(".con-plan").classList.add("oculto");
        document.querySelector(".sin-plan").classList.remove("oculto");
    });
}


/* ---- MODAL: EDITAR PLAN ---- */






var modalEditar = document.getElementById('modal-editar');
var btnAbrirEditar = document.getElementById('btn-abrir-editar');
var btnCerrarEditar = document.getElementById('btn-cerrar-editar');

/* Abre el modal de editar plan usando el modal de pago */
btnAbrirEditar.addEventListener('click', function () {
    const compraJSON = localStorage.getItem("softrent_ultima_compra");
    if (compraJSON) {
        const compra = JSON.parse(compraJSON);
        // Modo edición: precargar el plan + servicios ya guardados
        abrirModalPago(compra.plan.id, compra);
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

    /* Si todo está bien, guardar los datos del negocio en localStorage */
    if (valido) {
        localStorage.setItem("softrent_datos_negocio", JSON.stringify({
            nombre: nombre,
            correo: correo,
            modalidad: modalidad
        }));
    }
});


/* ---- DATOS DEL NEGOCIO: persistencia + cambio de modalidad ---- */

/* Restaura nombre y correo desde localStorage al cargar la página */
function restaurarDatosNegocio() {
    const datosJSON = localStorage.getItem("softrent_datos_negocio");
    if (!datosJSON) {
        return;
    }
    const datos = JSON.parse(datosJSON);
    const inNombre = document.getElementById("negocio-nombre");
    const inCorreo = document.getElementById("negocio-correo");
    if (inNombre && datos.nombre) {
        inNombre.value = datos.nombre;
    }
    if (inCorreo && datos.correo) {
        inCorreo.value = datos.correo;
    }
}

/* Recalcula el total de la compra para una periodicidad dada
   (mismo criterio que modalPago.js: base del plan + adicionales + descuento) */
function calcularTotalCompra(compra, periodicidad) {
    const plan = buscarPlan(compra.plan.id);
    if (!plan) {
        return compra.total;
    }

    let total = periodicidad === "anual" ? plan.precio_anual : plan.precio_mensual;

    (compra.serviciosAdicionales || []).forEach(function (s) {
        const srv = buscarServicio(s.id);
        if (srv) {
            total += periodicidad === "anual" ? srv.precio * 10 : srv.precio;
        }
    });

    if (compra.descuentoAplicado > 0) {
        total = total * (1 - compra.descuentoAplicado / 100);
    }

    return Math.round(total);
}

/* Al cambiar la modalidad de pago, actualiza el precio mostrado en la
   sección del plan en vivo y persiste el cambio en la compra */
var selectModalidad = document.getElementById("negocio-modalidad");
if (selectModalidad) {
    selectModalidad.addEventListener("change", function () {
        const valor = this.value;
        if (valor !== "mensual" && valor !== "anual") {
            return;
        }

        const compraJSON = localStorage.getItem("softrent_ultima_compra");
        if (!compraJSON) {
            return;
        }
        const compra = JSON.parse(compraJSON);

        const nuevoTotal = calcularTotalCompra(compra, valor);

        // Actualizar precio y badge de modalidad en la sección del plan
        document.querySelector(".dato-numero").textContent = formatearPrecio(nuevoTotal);
        document.querySelector(".sub-modalidad").textContent = valor;

        // Persistir el cambio
        compra.plan.periodicidad = valor;
        compra.total = nuevoTotal;
        localStorage.setItem("softrent_ultima_compra", JSON.stringify(compra));
    });
}

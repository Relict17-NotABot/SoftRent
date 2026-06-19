/* ============================================================
   GESTION.JS — Lógica básica de la página de gestión
   ============================================================ */


/* ---- MODAL: EDITAR PLAN ---- */

var modalEditar = document.getElementById('modal-editar');
var btnAbrirEditar = document.getElementById('btn-abrir-editar');
var btnCerrarEditar = document.getElementById('btn-cerrar-editar');

/* Abre el modal de editar plan */
btnAbrirEditar.addEventListener('click', function () {
    modalEditar.classList.remove('oculto');
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

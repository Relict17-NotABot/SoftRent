// Las referencias DOM se asignan en iniciarServicios() para
// garantizar que el DOM ya esté listo cuando se usen.
let contenedorServicios;
let mensajeServicios;
let filtroTag;
let btnCore;
let btnEcommerce;
let btnLimpiarFiltros;

// ============================================================
// VARIABLES GLOBALES
// ============================================================

let categoriaSeleccionada = "";

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

function crearTarjetaServicio(servicio){

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add("tarjeta-servicio");

    tarjeta.innerHTML = `
        <div class="servicio-icono">
            <i class="${servicio.icono} icons"></i>
        </div>

        <div class="servicio-contenido">

            <span class="servicio-categoria">
                ${servicio.categoria}
            </span>

            <h3>
                ${servicio.nombre}
            </h3>

            <p class="servicio-precio">
                ${formatearPrecio(servicio.precio)}
                <span>/mes</span>
            </p>

            <p class="desc-corta">
                ${servicio.desc_corta}
            </p>

            <button class="btn-expandir">
                <i class="fa-solid fa-angle-down"></i>
            </button>

            <div class="descripcion-expandida hidden">
                <p>
                    ${servicio.desc_ext}
                </p>
            </div>

            <div class="servicio-tags">
                ${servicio.tags.map(function(tag){
                    return `
                        <span class="tag">
                            ${tag}
                        </span>
                    `
                }).join("")}
            </div>

        </div>
    `;

    const boton =
        tarjeta.querySelector(".btn-expandir");

    const icono =
        boton.querySelector("i");

    const descripcion =
        tarjeta.querySelector(".descripcion-expandida");

    boton.addEventListener("click", function(){

        descripcion.classList.toggle("hidden");

        if(
            descripcion.classList.contains("hidden")
        ){
            icono.classList.remove("fa-angle-up");
            icono.classList.add("fa-angle-down");
        }
        else{
            icono.classList.remove("fa-angle-down");
            icono.classList.add("fa-angle-up");
        }

    });

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

    // Quitar estado activo de los botones de categoría
    btnCore.classList.remove("activo");
    btnEcommerce.classList.remove("activo");

    filtrarServicios();

}

// ============================================================
// INICIALIZACIÓN
// ============================================================

async function iniciarServicios() {

    // Asignar referencias DOM aquí, con DOM ya cargado
    contenedorServicios  = document.getElementById("contenedorServicios");
    mensajeServicios     = document.getElementById("mensajeServicios");
    filtroTag            = document.getElementById("filtroTag");
    btnCore              = document.getElementById("btnCore");
    btnEcommerce         = document.getElementById("btnEcommerce");
    btnLimpiarFiltros    = document.getElementById("btnLimpiarFiltros");

    btnCore.addEventListener("click", function(){
        categoriaSeleccionada = "core";
        btnCore.classList.add("activo");
        btnEcommerce.classList.remove("activo");
        filtrarServicios();
    });

    btnEcommerce.addEventListener("click", function(){
        categoriaSeleccionada = "ecommerce";
        btnEcommerce.classList.add("activo");
        btnCore.classList.remove("activo");
        filtrarServicios();
    });

    filtroTag.addEventListener("change", filtrarServicios);

    btnLimpiarFiltros.addEventListener("click", limpiarFiltros);

    renderizarServicios(
        obtenerServiciosDisponibles()
    );
}


// ============================================================
// BUSQUEDA
// ============================================================

function buscarPlan(idPlan){

    return planes.find(function(plan){
        return plan.id === idPlan;
    });

}

function buscarServicio(idServicio){

    return servicios.find(function(servicio){
        return servicio.id === idServicio;
    });

}


// ============================================================
// PUNTO DE ENTRADA
// ============================================================

// datosListos garantiza que planes[] y servicios[] ya estén
// cargados antes de llamar a cualquier módulo.
datosListos.then(function () {
    iniciarServicios();
});


// ============================================================
// FORMULARIO
// ============================================================

//Seleccion elementos DOM

const formInfo = document.getElementById("form-masInfo");

const rbEmprendimiento = document.getElementById("rb-empredimiento");
const rbNegocio = document.getElementById("rb-negocio");
const rbEmpresa = document.getElementById("rb-empresa");

const nombreUsuario = document.getElementById("nombreUsuario");
const nombreNegocio = document.getElementById("nombreNegocio");
const correoUsuario = document.getElementById("correoUsuario");

const errorNombre = document.getElementById("errorNombre");
const errorNegocio = document.getElementById("errorNegocio");
const errorCorreo = document.getElementById("errorCorreo");
const errorRdButton = document.getElementById("errorRdButton")

const btnEnviarDatos = document.getElementById("btnEnviarDatos");

const InfoPorTipoNegocio = document.getElementById("InfoPorTipoNegocio");

/**Validaciones */

function mostrarError(input, elementoError, mensaje){
    elementoError.textContent = mensaje

    input.classList.add("input-error")
    input.classList.remove("input-success")
}

function mostrarExito(input, elementoError){
    elementoError.textContent = ""

    input.classList.remove("input-error")
    input.classList.add("input-success")
}

function validarNombre(){
    const nombre = nombreUsuario.value.trim()
    if(nombre === "" ){
        mostrarError(nombreUsuario, errorNombre, "El nombre es obligatorio")
        return false;
    }
    

    if(nombre.length < 3){
        mostrarError(nombreUsuario,errorNombre, "El nombre debe ser mayor a 3 caractéres")
        return false;
    }

    mostrarExito(nombreUsuario, errorNombre)
    return true
    
}

function validarNegocio(){

    const nombre =
        nombreNegocio.value.trim();

    if(nombre === ""){
        mostrarError(
            nombreNegocio,
            errorNegocio,
            "El nombre del negocio es necesario"
        );
        return false;
    }

    if(nombre.length < 3){
        mostrarError(
            nombreNegocio,
            errorNegocio,
            "El nombre debe tener al menos 3 caracteres"
        );
        return false;
    }

    mostrarExito(nombreNegocio, errorNegocio);

    return true;
}

function validarCorreo(){
    const correo = correoUsuario.value.trim()
    if(correo === ""){
        mostrarError(correoUsuario, errorCorreo, "El correo es necesario.")
        return false
    }
    if(!correo.includes("@") || !correo.includes(".")){
        mostrarError(correoUsuario, errorCorreo, "Ingrese un correo válido")
        return false
    }

    mostrarExito(correoUsuario, errorCorreo)
    return true
}

function validarTipoNegocio(){
    if(!rbEmprendimiento.checked &&
       !rbNegocio.checked        &&
       !rbEmpresa.checked
    ){
        mostrarError(rbEmprendimiento, errorRdButton, "")
        mostrarError(rbNegocio, errorRdButton, "")
        mostrarError(rbEmpresa, errorRdButton, "elegir una opción.")
        return false
    }
    
    mostrarExito(rbEmprendimiento, errorRdButton)
    mostrarExito(rbNegocio, errorRdButton)
    mostrarExito(rbEmpresa, errorRdButton)
    return true
}

function validarForm(){
    const nombreValido = validarNombre();
    const correoValido = validarCorreo();
    const rbValido = validarTipoNegocio();
    const negocioValido = validarNegocio();

    return nombreValido && correoValido && rbValido && negocioValido
}


/**Mostrar información dentro del article */

function mostrarServicio(idServicio){

    const servicio =
        servicios.find(function(servicio){
            return servicio.id === idServicio;
        });

    return `
        <div class="tarjeta-recomendacion">
            <i class="${servicio.icono}"></i>
            <p>${servicio.nombre}</p>
        </div>
    `;
}

function MostrarPlan(idPlan){

    const plan = planes.find(function(plan){
        return plan.id === idPlan;
    });

     const serviciosHTML =
        plan.servicios_fijos.map(function(idServicio){

            const servicio =
                servicios.find(function(servicio){
                    return servicio.id === idServicio;
                });

            return `
                <li class="list-form-servicios">
                    <i class="${servicio.icono}"></i>
                    ${servicio.nombre}
                </li>
            `;

        }).join("");

    return `
        <div class="tarjeta-planForm destacado inter">

            <div>
                <img src="assets/img/${plan.icono}" alt="">
                <h2>${plan.nombre}</h2>
            </div>

            <div>
                <ul>
                    ${serviciosHTML}
                </ul>
            </div>

            <button>CONSEGUIR</button>

        </div>
    `;


}



function mostrarInformacion(){
    
    if(rbEmprendimiento.checked){
        InfoPorTipoNegocio.innerHTML = ""
        InfoPorTipoNegocio.innerHTML =
        `
        <h3>Si estás empezando tu emprendimiento, te recomendamos estos servicios:</h3>

        <div class="contenido-detalle1">
        ${mostrarServicio("srv-003")}
        ${mostrarServicio("srv-008")}
        ${mostrarServicio("srv-010")}
        </div>
        `
        return;
    }
     if(rbNegocio.checked){
        InfoPorTipoNegocio.innerHTML = ""
        InfoPorTipoNegocio.innerHTML = `
        <h3>Este es el plan indicado si tienes un negocio en crecimiento:</h3>

       ${MostrarPlan("PLAN-INTERMEDIO")}

        `
        return;
    }

    if(rbEmpresa.checked){
         InfoPorTipoNegocio.innerHTML = ""
         InfoPorTipoNegocio.innerHTML = `
         <h3>Conoce más sobre nuestros servicios en el siguiente link:</h3>

         <a target="_blank" href = "https://youtu.be/dQw4w9WgXcQ">Video Informativo</a>
         `
         return;
    }
}

/**
 * FUNCION GUARDAR USUARIO LOCAL STORAGE
 */

function guardarUsuario(){
    const usuario = {
        nombre: nombreUsuario.value,
        negocio: nombreNegocio.value,
        correo: correoUsuario.value,
        tipoNegocio: document.querySelector ('input[name="tipo-negocio"]:checked').value
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
}

/**
 * guardar la información del usuario
 */

formInfo.addEventListener(
    "submit",
    function(event){

        event.preventDefault();

        if(validarForm()){

            guardarUsuario();

            alert("Información guardada");

        }

    }
);

/**
 * cambiar la información mostrada en el detalle
 */

rbEmprendimiento.addEventListener(
    "change",
    mostrarInformacion
);

rbNegocio.addEventListener(
    "change",
    mostrarInformacion
)

rbEmpresa.addEventListener(
    "change",
    mostrarInformacion
)


/**
 * trasladarse de manera smooth a la seccion de servicios
 */

window.addEventListener("load", function(){

    if(location.hash === "#seccion-servicios"){

        document
            .getElementById("seccion-servicios")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

});



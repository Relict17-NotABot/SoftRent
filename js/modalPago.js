// ============================================================
// MODAL DE PAGO - SoftRent
// ============================================================

// ============================================================
// DATOS DE PLANES
// ============================================================

const PLANES = [
    {
        id: "PLAN-BASICO",
        nombre: "Plan Básico",
        desc: "Para empresas que quieren dar el primer paso sin riesgos",
        precio_mensual: 25480,
        precio_anual: 244400,
        porc_desc_anual: 20,
        servicios_incluidos: ["srv-008", "srv-009", "srv-010"],
        icono: "robot1.png"
    },
    {
        id: "PLAN-INTERMEDIO",
        nombre: "Plan Intermedio",
        desc: "Para emprendimientos en crecimiento que necesitan más capacidad",
        precio_mensual: 61880,
        precio_anual: 557000,
        porc_desc_anual: 25,
        servicios_incluidos: ["srv-008", "srv-011"],
        icono: "robot2.png"
    },
    {
        id: "PLAN-PROFESIONAL",
        nombre: "Plan Profesional",
        desc: "Para empresas comprometidas con la eficiencia operativa",
        precio_mensual: 119080,
        precio_anual: 1285000,
        porc_desc_anual: 10,
        servicios_incluidos: ["srv-028", "srv-011", "srv-013"],
        icono: "robot3.png"
    },
    {
        id: "PLAN-VIP",
        nombre: "Plan VIP",
        desc: "Acceso total al catálogo con atención prioritaria y seguimiento personalizado",
        precio_mensual: 233480,
        precio_anual: 2522000,
        porc_desc_anual: 10,
        servicios_incluidos: ["srv-012", "srv-013", "srv-014"],
        icono: "robotVIP.png"
    }
];

// ============================================================
// ESTADO GLOBAL DEL MODAL
// ============================================================

let estadoModal = {
    planElegido: null,
    periodicidad: "mensual",       // "mensual" | "anual"
    serviciosExtra: [],            // IDs de servicios adicionales agregados
    codigoDescuento: "",
    descuentoAplicado: 0           // porcentaje 0-100
};

// ============================================================
// HELPERS DE FORMATO
// ============================================================

function formatearPrecio(numero) {
    return "₡" + numero.toLocaleString("es-CR");
}

function obtenerServicioPorId(id) {
    if (typeof SERVICIOS !== "undefined") {
        return SERVICIOS.find(function (s) { return s.id === id; }) || null;
    }
    return null;
}

// ============================================================
// CÁLCULO DEL TOTAL
// ============================================================

function calcularTotal() {
    if (!estadoModal.planElegido) return 0;

    const plan = estadoModal.planElegido;
    let total = estadoModal.periodicidad === "mensual"
        ? plan.precio_mensual
        : plan.precio_anual;

    // Sumar servicios extra (siempre en precio mensual por unidad)
    estadoModal.serviciosExtra.forEach(function (id) {
        const srv = obtenerServicioPorId(id);
        if (srv) {
            total += estadoModal.periodicidad === "mensual"
                ? srv.precio
                : srv.precio * 10; // precio anual ≈ 10 meses
        }
    });

    // Aplicar código de descuento al total
    if (estadoModal.descuentoAplicado > 0) {
        total = total * (1 - estadoModal.descuentoAplicado / 100);
    }

    return Math.round(total);
}

// ============================================================
// RENDERIZADO DEL DETALLE DE FACTURA (panel derecho)
// ============================================================

function renderizarDetalle() {
    const plan = estadoModal.planElegido;
    if (!plan) return;

    // --- Encabezado del plan elegido ---
    const encabezadoEl = document.getElementById("mp-plan-encabezado");
    const precioPlanBase = estadoModal.periodicidad === "mensual"
        ? plan.precio_mensual
        : plan.precio_anual;

    encabezadoEl.innerHTML = `
        <img src="assets/img/${plan.icono}" alt="${plan.nombre}" class="mp-plan-icon">
        <div>
            <span class="mp-plan-nombre">${plan.nombre}</span>
            <span class="mp-plan-periodo">${estadoModal.periodicidad === "mensual" ? "/ mes" : "/ año"}</span>
        </div>
        <span class="mp-plan-precio-base">${formatearPrecio(precioPlanBase)}</span>
    `;

    // --- Servicios incluidos (no removibles) ---
    const incluidosEl = document.getElementById("mp-servicios-incluidos");
    incluidosEl.innerHTML = "";

    plan.servicios_incluidos.forEach(function (id) {
        const srv = obtenerServicioPorId(id);
        const nombre = srv ? srv.nombre : id;
        const icono = srv ? srv.icono : "fa-solid fa-circle-check";

        const item = document.createElement("div");
        item.classList.add("mp-item-incluido");
        item.innerHTML = `
            <i class="${icono} mp-srv-icon"></i>
            <span>${nombre}</span>
            <span class="mp-incluido-badge">Incluido</span>
        `;
        incluidosEl.appendChild(item);
    });

    // --- Servicios extra agregados (removibles) ---
    const extrasEl = document.getElementById("mp-servicios-extra-factura");
    extrasEl.innerHTML = "";

    if (estadoModal.serviciosExtra.length === 0) {
        extrasEl.innerHTML = `<p class="mp-sin-extras">Sin servicios adicionales agregados.</p>`;
    } else {
        estadoModal.serviciosExtra.forEach(function (id) {
            const srv = obtenerServicioPorId(id);
            if (!srv) return;

            const precioSrv = estadoModal.periodicidad === "mensual"
                ? srv.precio
                : srv.precio * 10;

            const item = document.createElement("div");
            item.classList.add("mp-item-extra");
            item.innerHTML = `
                <button class="mp-btn-quitar" data-id="${id}" title="Quitar servicio">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <i class="${srv.icono} mp-srv-icon"></i>
                <span>${srv.nombre}</span>
                <span class="mp-extra-precio">${formatearPrecio(precioSrv)}</span>
            `;

            item.querySelector(".mp-btn-quitar").addEventListener("click", function () {
                quitarServicioExtra(id);
            });

            extrasEl.appendChild(item);
        });
    }

    // --- Descuento aplicado ---
    const descEl = document.getElementById("mp-linea-descuento");
    if (estadoModal.descuentoAplicado > 0) {
        descEl.style.display = "flex";
        descEl.querySelector(".mp-desc-texto").textContent =
            `Código de descuento (${estadoModal.descuentoAplicado}%)`;
    } else {
        descEl.style.display = "none";
    }

    // --- Total ---
    const total = calcularTotal();
    document.getElementById("mp-total-numero").textContent = formatearPrecio(total);
}

// ============================================================
// RENDERIZADO DE SERVICIOS ADICIONALES DISPONIBLES (paso 2)
// ============================================================

function renderizarCatalogoExtras() {
    const contenedor = document.getElementById("mp-catalogo-extras");
    contenedor.innerHTML = "";

    if (typeof SERVICIOS === "undefined" || SERVICIOS.length === 0) {
        contenedor.innerHTML = `<p class="mp-sin-extras">No hay servicios adicionales disponibles.</p>`;
        return;
    }

    const plan = estadoModal.planElegido;
    const excluidos = new Set(plan.servicios_incluidos);

    // Mostrar solo disponibles y que no estén en el plan
    const disponibles = SERVICIOS.filter(function (s) {
        return s.disponible && !excluidos.has(s.id);
    });

    if (disponibles.length === 0) {
        contenedor.innerHTML = `<p class="mp-sin-extras">Todos los servicios ya están incluidos en tu plan.</p>`;
        return;
    }

    disponibles.forEach(function (srv) {
        const yaAgregado = estadoModal.serviciosExtra.includes(srv.id);
        const card = document.createElement("div");
        card.classList.add("mp-extra-card");
        if (yaAgregado) card.classList.add("mp-extra-card--agregado");

        card.innerHTML = `
            <i class="${srv.icono} mp-srv-icon-lg"></i>
            <div class="mp-extra-info">
                <span class="mp-extra-nombre">${srv.nombre}</span>
                <span class="mp-extra-precio-cat">${formatearPrecio(srv.precio)}/mes</span>
            </div>
            <button class="mp-btn-agregar ${yaAgregado ? "mp-btn-agregado" : ""}" data-id="${srv.id}">
                ${yaAgregado
                    ? '<i class="fa-solid fa-check"></i> Agregado'
                    : '<i class="fa-solid fa-plus"></i> Agregar'}
            </button>
        `;

        card.querySelector(".mp-btn-agregar").addEventListener("click", function () {
            if (!yaAgregado) {
                agregarServicioExtra(srv.id);
            }
        });

        contenedor.appendChild(card);
    });
}

// ============================================================
// ACCIONES SOBRE SERVICIOS EXTRA
// ============================================================

function agregarServicioExtra(id) {
    if (!estadoModal.serviciosExtra.includes(id)) {
        estadoModal.serviciosExtra.push(id);
        renderizarDetalle();
        renderizarCatalogoExtras();
    }
}

function quitarServicioExtra(id) {
    estadoModal.serviciosExtra = estadoModal.serviciosExtra.filter(function (s) {
        return s !== id;
    });
    renderizarDetalle();
    renderizarCatalogoExtras();
}

// ============================================================
// MODAL PRINCIPAL - ABRIR / CERRAR
// ============================================================

function abrirModalPago(planId) {
    const plan = PLANES.find(function (p) { return p.id === planId; });
    if (!plan) return;

    // Resetear estado
    estadoModal = {
        planElegido: plan,
        periodicidad: "mensual",
        serviciosExtra: [],
        codigoDescuento: "",
        descuentoAplicado: 0
    };

    // Resetear UI del radio
    const radioMensual = document.getElementById("mp-radio-mensual");
    const radioAnual = document.getElementById("mp-radio-anual");
    if (radioMensual) radioMensual.checked = true;
    if (radioAnual) radioAnual.checked = false;

    // Resetear código de descuento
    const inputCodigo = document.getElementById("mp-codigo-descuento");
    if (inputCodigo) inputCodigo.value = "";
    const msgCodigo = document.getElementById("mp-mensaje-codigo");
    if (msgCodigo) { msgCodigo.textContent = ""; msgCodigo.className = "mp-msg-codigo"; }

    // Renderizar
    renderizarDetalle();
    renderizarCatalogoExtras();

    // Mostrar modal
    const overlay = document.getElementById("mp-overlay");
    overlay.classList.add("mp-overlay--visible");
    document.body.style.overflow = "hidden";
}

function cerrarModalPago() {
    const overlay = document.getElementById("mp-overlay");
    overlay.classList.remove("mp-overlay--visible");
    document.body.style.overflow = "";
}

// ============================================================
// MODAL DE CONFIRMACIÓN (paso final)
// ============================================================

function abrirModalConfirmacion() {
    const plan = estadoModal.planElegido;
    if (!plan) return;

    const total = calcularTotal();
    const precioPlan = estadoModal.periodicidad === "mensual"
        ? plan.precio_mensual
        : plan.precio_anual;

    // --- Construir lista de ítems ---
    let itemsHTML = `
        <div class="mpc-item">
            <span>${plan.nombre} (${estadoModal.periodicidad === "mensual" ? "Mensual" : "Anual"})</span>
            <span>${formatearPrecio(precioPlan)}</span>
        </div>
    `;

    estadoModal.serviciosExtra.forEach(function (id) {
        const srv = obtenerServicioPorId(id);
        if (!srv) return;
        const precio = estadoModal.periodicidad === "mensual" ? srv.precio : srv.precio * 10;
        itemsHTML += `
            <div class="mpc-item">
                <span>${srv.nombre}</span>
                <span>${formatearPrecio(precio)}</span>
            </div>
        `;
    });

    if (estadoModal.descuentoAplicado > 0) {
        itemsHTML += `
            <div class="mpc-item mpc-item--descuento">
                <span>Descuento (${estadoModal.descuentoAplicado}%)</span>
                <span>-${estadoModal.descuentoAplicado}%</span>
            </div>
        `;
    }

    // Inyectar en modal de confirmación
    document.getElementById("mpc-items").innerHTML = itemsHTML;
    document.getElementById("mpc-total").textContent = formatearPrecio(total);

    // Mostrar
    document.getElementById("mp-confirmacion-overlay").classList.add("mp-overlay--visible");
}

function cerrarModalConfirmacion() {
    document.getElementById("mp-confirmacion-overlay").classList.remove("mp-overlay--visible");
}

// ============================================================
// GUARDAR EN LOCALSTORAGE
// ============================================================

function guardarCompraEnLocalStorage() {
    const plan = estadoModal.planElegido;
    const total = calcularTotal();

    const compra = {
        fecha: new Date().toISOString(),
        plan: {
            id: plan.id,
            nombre: plan.nombre,
            periodicidad: estadoModal.periodicidad,
            precio: estadoModal.periodicidad === "mensual" ? plan.precio_mensual : plan.precio_anual
        },
        serviciosExtra: estadoModal.serviciosExtra.map(function (id) {
            const srv = obtenerServicioPorId(id);
            return srv
                ? {
                    id: srv.id,
                    nombre: srv.nombre,
                    precio: estadoModal.periodicidad === "mensual" ? srv.precio : srv.precio * 10
                  }
                : { id: id, nombre: id, precio: 0 };
        }),
        descuentoAplicado: estadoModal.descuentoAplicado,
        codigoDescuento: estadoModal.codigoDescuento,
        total: total
    };

    // Guardar historial (array de compras)
    let historial = JSON.parse(localStorage.getItem("softrent_compras") || "[]");
    historial.push(compra);
    localStorage.setItem("softrent_compras", JSON.stringify(historial));

    // Guardar última compra por separado para acceso rápido
    localStorage.setItem("softrent_ultima_compra", JSON.stringify(compra));

    return compra;
}

// ============================================================
// VALIDACIÓN DE CÓDIGO DE DESCUENTO
// ============================================================

const CODIGOS_DESCUENTO = {
    "SOFTRENT10": 10,
    "SOFTRENT20": 20,
    "UTN2026": 15,
    "PROMO50": 50
};

function validarCodigoDescuento() {
    const inputCodigo = document.getElementById("mp-codigo-descuento");
    const msgEl = document.getElementById("mp-mensaje-codigo");
    const codigo = inputCodigo.value.trim().toUpperCase();

    if (!codigo) {
        msgEl.textContent = "Ingresá un código.";
        msgEl.className = "mp-msg-codigo mp-msg-codigo--error";
        return;
    }

    if (CODIGOS_DESCUENTO[codigo] !== undefined) {
        estadoModal.codigoDescuento = codigo;
        estadoModal.descuentoAplicado = CODIGOS_DESCUENTO[codigo];
        msgEl.textContent = `¡Código válido! ${CODIGOS_DESCUENTO[codigo]}% de descuento aplicado.`;
        msgEl.className = "mp-msg-codigo mp-msg-codigo--exito";
    } else {
        estadoModal.codigoDescuento = "";
        estadoModal.descuentoAplicado = 0;
        msgEl.textContent = "Código inválido. Intentá con otro.";
        msgEl.className = "mp-msg-codigo mp-msg-codigo--error";
    }

    renderizarDetalle();
}

// ============================================================
// CONSTRUCCIÓN DEL HTML DEL MODAL (se inyecta al body)
// ============================================================

function inyectarHTMLModal() {
    const html = `
    <!-- ===== OVERLAY MODAL PRINCIPAL ===== -->
    <div id="mp-overlay" class="mp-overlay">
        <div class="mp-modal" role="dialog" aria-modal="true" aria-labelledby="mp-titulo">

            <!-- Botón cerrar -->
            <button class="mp-btn-cerrar" id="mp-btn-cerrar" title="Cerrar">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- ===== PANEL IZQUIERDO: Pasos 2 y 3 ===== -->
            <div class="mp-panel-izq">

                <!-- PASO 2: Servicios adicionales -->
                <div class="mp-seccion">
                    <h3 class="mp-seccion-titulo">
                        <span class="mp-paso-badge">2</span>
                        Servicios adicionales
                    </h3>
                    <p class="mp-seccion-sub">Agregá servicios del catálogo que no están en tu plan</p>
                    <div id="mp-catalogo-extras" class="mp-catalogo-extras"></div>
                </div>

                <!-- PASO 3: Periodicidad -->
                <div class="mp-seccion mp-seccion--periodicidad">
                    <h3 class="mp-seccion-titulo">
                        <span class="mp-paso-badge">3</span>
                        Modalidad de pago
                    </h3>
                    <div class="mp-radios">
                        <label class="mp-radio-label" for="mp-radio-mensual">
                            <input type="radio" id="mp-radio-mensual" name="mp-periodicidad" value="mensual" checked>
                            <span class="mp-radio-custom"></span>
                            Mensual
                        </label>
                        <label class="mp-radio-label" for="mp-radio-anual">
                            <input type="radio" id="mp-radio-anual" name="mp-periodicidad" value="anual">
                            <span class="mp-radio-custom"></span>
                            Anual
                            <span class="mp-badge-ahorro" id="mp-badge-ahorro"></span>
                        </label>
                    </div>
                </div>

            </div>

            <!-- ===== PANEL DERECHO: Paso 1 - Detalle de factura ===== -->
            <div class="mp-panel-der">

                <h3 class="mp-seccion-titulo">
                    <span class="mp-paso-badge">1</span>
                    Detalle de tu compra
                </h3>

                <!-- Plan elegido -->
                <div id="mp-plan-encabezado" class="mp-plan-encabezado"></div>

                <hr class="mp-divisor">

                <!-- Servicios incluidos -->
                <p class="mp-label-grupo">Servicios incluidos en el plan</p>
                <div id="mp-servicios-incluidos" class="mp-servicios-incluidos"></div>

                <hr class="mp-divisor">

                <!-- Servicios extra en factura -->
                <p class="mp-label-grupo">Servicios adicionales</p>
                <div id="mp-servicios-extra-factura" class="mp-servicios-extra-factura"></div>

                <!-- Línea de descuento (oculta por defecto) -->
                <div id="mp-linea-descuento" class="mp-linea-descuento" style="display:none;">
                    <span class="mp-desc-texto"></span>
                    <span class="mp-desc-valor">-${estadoModal ? estadoModal.descuentoAplicado : 0}%</span>
                </div>

                <hr class="mp-divisor">

                <!-- Código de descuento -->
                <div class="mp-codigo-area">
                    <label class="mp-label-grupo" for="mp-codigo-descuento">Código de descuento</label>
                    <div class="mp-codigo-input-grupo">
                        <input type="text" id="mp-codigo-descuento" class="mp-input-codigo" placeholder="Ej: SOFTRENT10">
                        <button id="mp-btn-aplicar-codigo" class="mp-btn-codigo">Aplicar</button>
                    </div>
                    <p id="mp-mensaje-codigo" class="mp-msg-codigo"></p>
                </div>

                <hr class="mp-divisor">

                <!-- Total -->
                <div class="mp-total-area">
                    <span class="mp-total-label">Total:</span>
                    <span id="mp-total-numero" class="mp-total-numero">₡0</span>
                </div>

                <button id="mp-btn-siguiente" class="mp-btn-siguiente">
                    SIGUIENTE <i class="fa-solid fa-arrow-right"></i>
                </button>

            </div>

        </div>
    </div>

    <!-- ===== OVERLAY MODAL CONFIRMACIÓN ===== -->
    <div id="mp-confirmacion-overlay" class="mp-overlay mp-overlay--confirmacion">
        <div class="mp-modal mp-modal--confirmacion" role="dialog" aria-modal="true">

            <button class="mp-btn-cerrar" id="mpc-btn-cerrar" title="Cerrar">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="mpc-contenido">
                <h2 class="mpc-titulo">Resumen de tu compra</h2>
                <p class="mpc-subtitulo">Revisá los detalles antes de confirmar</p>

                <div class="mpc-lista" id="mpc-items"></div>

                <hr class="mp-divisor">

                <div class="mpc-total-area">
                    <span>Total a pagar:</span>
                    <span id="mpc-total" class="mpc-total-precio"></span>
                </div>

                <div class="mpc-botones">
                    <button id="mpc-btn-volver" class="mpc-btn mpc-btn--volver">
                        <i class="fa-solid fa-arrow-left"></i> Volver
                    </button>
                    <button id="mpc-btn-comprar" class="mpc-btn mpc-btn--comprar">
                        Comprar <i class="fa-solid fa-bag-shopping"></i>
                    </button>
                </div>
            </div>

        </div>
    </div>

    <!-- ===== OVERLAY ÉXITO ===== -->
    <div id="mp-exito-overlay" class="mp-overlay mp-overlay--exito">
        <div class="mp-modal mp-modal--exito">
            <div class="mp-exito-contenido">
                <i class="fa-solid fa-circle-check mp-exito-icon"></i>
                <h2>¡Compra realizada!</h2>
                <p id="mp-exito-resumen"></p>
                <button id="mp-exito-cerrar" class="mp-btn-siguiente">Cerrar</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
}

// ============================================================
// VINCULAR EVENTOS DEL MODAL
// ============================================================

function vincularEventosModal() {
    // Cerrar modal principal
    document.getElementById("mp-btn-cerrar").addEventListener("click", cerrarModalPago);
    document.getElementById("mp-overlay").addEventListener("click", function (e) {
        if (e.target === this) cerrarModalPago();
    });

    // Periodicidad
    document.querySelectorAll("input[name='mp-periodicidad']").forEach(function (radio) {
        radio.addEventListener("change", function () {
            estadoModal.periodicidad = this.value;
            actualizarBadgeAhorro();
            renderizarDetalle();
        });
    });

    // Código de descuento
    document.getElementById("mp-btn-aplicar-codigo").addEventListener("click", validarCodigoDescuento);
    document.getElementById("mp-codigo-descuento").addEventListener("keydown", function (e) {
        if (e.key === "Enter") validarCodigoDescuento();
    });

    // Botón siguiente → abrir confirmación
    document.getElementById("mp-btn-siguiente").addEventListener("click", abrirModalConfirmacion);

    // Modal confirmación
    document.getElementById("mpc-btn-cerrar").addEventListener("click", cerrarModalConfirmacion);
    document.getElementById("mpc-btn-volver").addEventListener("click", cerrarModalConfirmacion);
    document.getElementById("mp-confirmacion-overlay").addEventListener("click", function (e) {
        if (e.target === this) cerrarModalConfirmacion();
    });

    // Botón comprar
    document.getElementById("mpc-btn-comprar").addEventListener("click", function () {
        const compra = guardarCompraEnLocalStorage();
        cerrarModalConfirmacion();
        cerrarModalPago();
        mostrarExito(compra);
    });

    // Cerrar éxito
    document.getElementById("mp-exito-cerrar").addEventListener("click", function () {
        document.getElementById("mp-exito-overlay").classList.remove("mp-overlay--visible");
    });
    document.getElementById("mp-exito-overlay").addEventListener("click", function (e) {
        if (e.target === this) this.classList.remove("mp-overlay--visible");
    });
}

// ============================================================
// BADGE DE AHORRO EN PLAN ANUAL
// ============================================================

function actualizarBadgeAhorro() {
    const plan = estadoModal.planElegido;
    const badge = document.getElementById("mp-badge-ahorro");
    if (!badge || !plan) return;

    if (estadoModal.periodicidad === "anual" && plan.porc_desc_anual) {
        badge.textContent = `Ahorrás ${plan.porc_desc_anual}%`;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}

// ============================================================
// MOSTRAR PANTALLA DE ÉXITO
// ============================================================

function mostrarExito(compra) {
    const resumen = document.getElementById("mp-exito-resumen");
    resumen.textContent = `${compra.plan.nombre} (${compra.plan.periodicidad}) — Total: ${formatearPrecio(compra.total)}`;
    document.getElementById("mp-exito-overlay").classList.add("mp-overlay--visible");
}

// ============================================================
// VINCULAR BOTONES DE PLANES EN LAS TARJETAS
// ============================================================

function vincularBotonesPlan() {
    // Tarjetas existentes en planes.html
    const mapaBotones = {
        ".tarjeta-plan.basic":     "PLAN-BASICO",
        ".tarjeta-plan.inter":     "PLAN-INTERMEDIO",
        ".tarjeta-plan.pro":       "PLAN-PROFESIONAL"
    };

    Object.entries(mapaBotones).forEach(function (entrada) {
        const selector = entrada[0];
        const planId = entrada[1];
        const tarjeta = document.querySelector(selector);
        if (!tarjeta) return;

        const boton = tarjeta.querySelector("button");
        if (boton) {
            boton.addEventListener("click", function () {
                abrirModalPago(planId);
            });
        }
    });

    // Plan VIP (sección aparte si existe como tarjeta con botón)
    const btnVIP = document.querySelector(".tarjeta-plan.vip button");
    if (btnVIP) {
        btnVIP.addEventListener("click", function () {
            abrirModalPago("PLAN-VIP");
        });
    }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    inyectarHTMLModal();
    vincularEventosModal();
    vincularBotonesPlan();
});

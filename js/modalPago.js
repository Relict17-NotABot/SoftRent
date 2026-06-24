// ============================================================
// ESTADO GLOBAL DEL MODAL
// ============================================================

let estadoModal = {
    planElegido: null,
    periodicidad: "mensual",
    serviciosElegidos: [], 
    serviciosAdicionales: [],
    codigoDescuento: "",
    descuentoAplicado: 0
};

// ============================================================
// Obtener el limite de servicios por plan
// ============================================================


function obtenerLimiteSistemas() {
    const plan = estadoModal.planElegido;
    if (!plan) return 0;
    
    return plan.sistemas_elegibles;
}

// ============================================================
// CÁLCULO DEL TOTAL
// ============================================================

function calcularTotal() {
    if (!estadoModal.planElegido) {
        return 0;
    }

    const plan = estadoModal.planElegido;
    let total = 0;

    // Precio base del plan
    if (estadoModal.periodicidad === "mensual") {
        total = plan.precio_mensual;
    } else {
        total = plan.precio_anual;
    }

    // Agregar servicios adicionales (los que superan el límite)
    estadoModal.serviciosAdicionales.forEach(function (id) {
        const servicio = buscarServicio(id);

        if (servicio) {
            let precioServicio;

            if (estadoModal.periodicidad === "mensual") {
                precioServicio = servicio.precio;
            } else {
                precioServicio = servicio.precio * 10;
            }

            total += precioServicio;
        }
    });

    // Aplicar descuento
    if (estadoModal.descuentoAplicado > 0) {
        total = total * (1 - estadoModal.descuentoAplicado / 100);
    }

    return Math.round(total);
}



// ============================================================
// OBTENER LÍMITE DE SISTEMAS DEL PLAN
// ============================================================

function obtenerLimiteSistemas() {
    const plan = estadoModal.planElegido;
    if (!plan) {
        return 0;
    }
    
    return plan.sistemas_elegibles;
}

// ============================================================
// RENDERIZAR DETALLE DE FACTURA (ACTUALIZADO)
// ============================================================

function renderizarDetalle() {
    const plan = estadoModal.planElegido;
    if (!plan) {
        return;
    }

    // Encabezado del plan
    const encabezadoEl = document.getElementById("mp-plan-encabezado");
    let precioPlanBase;

    if (estadoModal.periodicidad === "mensual") {
        precioPlanBase = plan.precio_mensual;
    } else {
        precioPlanBase = plan.precio_anual;
    }

    const periodo = estadoModal.periodicidad === "mensual" ? "/ mes" : "/ año";

    encabezadoEl.innerHTML = `
        <img src="assets/img/${plan.icono}" alt="${plan.nombre}" class="mp-plan-icon">
        <div>
            <span class="mp-plan-nombre">${plan.nombre}</span>
            <span class="mp-plan-periodo">${periodo}</span>
        </div>
        <span class="mp-plan-precio-base">${formatearPrecio(precioPlanBase)}</span>
    `;

    // ============================================================
    // SERVICIOS FIJOS (NO removibles)
    // ============================================================

    const fijosEl = document.getElementById("mp-servicios-fijos");
    fijosEl.innerHTML = "";

    if (plan.servicios_fijos && plan.servicios_fijos.length > 0) {
        plan.servicios_fijos.forEach(function (id) {
            const srv = buscarServicio(id);
            const nombre = srv ? srv.nombre : id;
            const icono = srv ? srv.icono : "fa-solid fa-circle-check";

            const item = document.createElement("div");
            item.classList.add("mp-item-fijo");
            item.innerHTML = `
                <i class="${icono} mp-srv-icon"></i>
                <span>${nombre}</span>
                <span class="mp-fijo-badge">Incluido</span>
            `;
            fijosEl.appendChild(item);
        });
    } else {
        fijosEl.innerHTML = `<p class="mp-sin-extras">Sin servicios fijos en este plan.</p>`;
    }

    // ============================================================
    // SERVICIOS ELEGIDOS (removibles, dentro del límite)
    // ============================================================

    const elegidosEl = document.getElementById("mp-servicios-elegidos");
    elegidosEl.innerHTML = "";

    if (estadoModal.serviciosElegidos.length === 0) {
        elegidosEl.innerHTML = `
            <p class="mp-sin-extras">
                Aún no has seleccionado sistemas. 
                Tienes ${obtenerLimiteSistemas()} disponibles.
            </p>
        `;
    } else {
        estadoModal.serviciosElegidos.forEach(function (id) {
            const srv = buscarServicio(id);
            if (!srv) {
                return;
            }

            const item = document.createElement("div");
            item.classList.add("mp-item-elegido");
            item.innerHTML = `
                <button class="mp-btn-quitar" data-id="${id}" title="Quitar sistema">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <i class="${srv.icono} mp-srv-icon"></i>
                <span>${srv.nombre}</span>
                <span class="mp-elegido-estado">Incluido (sin costo)</span>
            `;

            item.querySelector(".mp-btn-quitar").addEventListener("click", function () {
                quitarServicioElegido(id);
            });

            elegidosEl.appendChild(item);
        });
    }

    // ============================================================
    // SERVICIOS ADICIONALES (fuera del límite - CON COSTO)
    // ============================================================

    const extrasEl = document.getElementById("mp-servicios-extra-factura");
    extrasEl.innerHTML = "";

    if (estadoModal.serviciosAdicionales.length === 0) {
        extrasEl.innerHTML = `<p class="mp-sin-extras">Sin servicios adicionales.</p>`;
    } else {
        estadoModal.serviciosAdicionales.forEach(function (id) {
            const srv = buscarServicio(id);
            if (!srv) {
                return;
            }

            let precioSrv;

            if (estadoModal.periodicidad === "mensual") {
                precioSrv = srv.precio;
            } else {
                precioSrv = srv.precio * 10;
            }

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
                quitarServicioAdicional(id);
            });

            extrasEl.appendChild(item);
        });
    }

    // Descuento
    const descEl = document.getElementById("mp-linea-descuento");
    if (estadoModal.descuentoAplicado > 0) {
        descEl.style.display = "flex";
        descEl.querySelector(".mp-desc-texto").textContent =
            `Código de descuento (${estadoModal.descuentoAplicado}%)`;
    } else {
        descEl.style.display = "none";
    }

    // Total
    const total = calcularTotal();
    document.getElementById("mp-total-numero").textContent = formatearPrecio(total);
}

// ============================================================
// RENDERIZAR CATÁLOGO DE SISTEMAS ELEGIBLES
// ============================================================

function renderizarCatalogoElegibles() {
    const contenedor = document.getElementById("mp-catalogo-elegibles");
    if (!contenedor) {
        return;
    }

    const plan = estadoModal.planElegido;
    const limite = obtenerLimiteSistemas();

    // Servicios que ya no se pueden elegir
    const excluidos = new Set([]);
    
    if (plan.servicios_fijos) {
        plan.servicios_fijos.forEach(function (id) {
            excluidos.add(id);
        });
    }

    estadoModal.serviciosElegidos.forEach(function (id) {
        excluidos.add(id);
    });

    estadoModal.serviciosAdicionales.forEach(function (id) {
        excluidos.add(id);
    });

    // Filtrar servicios disponibles
    const disponibles = servicios.filter(function (s) {
        return s.disponible && !excluidos.has(s.id);
    });

    contenedor.innerHTML = "";

    // Mostrar mensaje del límite
    const usados = estadoModal.serviciosElegidos.length;
    const restantes = limite - usados;

    const msgLimite = document.getElementById("mp-limite-mensaje");
    
    if (restantes > 0) {
        msgLimite.className = "mp-limite-mensaje";
        msgLimite.textContent = `Has seleccionado ${usados}/${limite} sistemas. Te quedan ${restantes} disponibles.`;
    } else {
        msgLimite.className = "mp-limite-mensaje mp-limite-alcanzado";
        msgLimite.textContent = `Límite alcanzado: ${limite}/${limite}. Los adicionales tendrán costo extra.`;
    }

    if (disponibles.length === 0) {
        contenedor.innerHTML = `<p class="mp-sin-extras">No hay más sistemas disponibles.</p>`;
        return;
    }

    // Renderizar tarjetas
    disponibles.forEach(function (srv) {
        const card = document.createElement("div");
        card.classList.add("mp-extra-card");

        const btnTexto = '<i class="fa-solid fa-plus"></i> Agregar';

        card.innerHTML = `
            <i class="${srv.icono} mp-srv-icon-lg"></i>
            <div class="mp-extra-info">
                <span class="mp-extra-nombre">${srv.nombre}</span>
                <span class="mp-extra-precio-cat">${formatearPrecio(srv.precio)}/mes</span>
            </div>
            <button class="mp-btn-agregar" data-id="${srv.id}">
                ${btnTexto}
            </button>
        `;

        card.querySelector(".mp-btn-agregar").addEventListener("click", function () {
            agregarServicio(srv.id);
        });

        contenedor.appendChild(card);
    });
}

// ============================================================
// AGREGAR SERVICIO (sistema decide si va elegido o adicional)
// ============================================================

function agregarServicio(id) {
    const plan = estadoModal.planElegido;
    const limite = obtenerLimiteSistemas();
    const usados = estadoModal.serviciosElegidos.length;

    if (usados < limite) {
        // Hay espacio → va como elegido (sin costo)
        if (!estadoModal.serviciosElegidos.includes(id)) {
            estadoModal.serviciosElegidos.push(id);
        }
    } else {
        // Límite alcanzado → va como adicional (con costo)
        if (!estadoModal.serviciosAdicionales.includes(id)) {
            estadoModal.serviciosAdicionales.push(id);
        }
    }

    renderizarDetalle();
    renderizarCatalogoElegibles();
}

// ============================================================
// QUITAR SERVICIO ELEGIDO (dentro del límite)
// ============================================================

function quitarServicioElegido(id) {
    estadoModal.serviciosElegidos = estadoModal.serviciosElegidos.filter(function (s) {
        return s !== id;
    });
    renderizarDetalle();
    renderizarCatalogoElegibles();
}

// ============================================================
// QUITAR SERVICIO ADICIONAL (fuera del límite)
// ============================================================

function quitarServicioAdicional(id) {
    estadoModal.serviciosAdicionales = estadoModal.serviciosAdicionales.filter(function (s) {
        return s !== id;
    });
    renderizarDetalle();
    renderizarCatalogoElegibles();
}

// ============================================================
// RENDERIZAR MODAL DE CONFIRMACIÓN (ACTUALIZADO)
// ============================================================

function abrirModalConfirmacion() {
    const plan = estadoModal.planElegido;
    if (!plan) {
        return;
    }

    const total = calcularTotal();
    let precioPlan;

    if (estadoModal.periodicidad === "mensual") {
        precioPlan = plan.precio_mensual;
    } else {
        precioPlan = plan.precio_anual;
    }

    const periodoTexto = estadoModal.periodicidad === "mensual" ? "Mensual" : "Anual";

    const mpcItems = document.getElementById("mpc-items");
    mpcItems.innerHTML = "";

    // Plan base
    const itemPlan = document.createElement("div");
    itemPlan.className = "mpc-item";
    itemPlan.innerHTML = `
        <span>${plan.nombre} (${periodoTexto})</span>
        <span>${formatearPrecio(precioPlan)}</span>
    `;
    mpcItems.appendChild(itemPlan);

    // Servicios fijos
    if (plan.servicios_fijos && plan.servicios_fijos.length > 0) {
        const subtituloFijo = document.createElement("div");
        subtituloFijo.className = "mpc-subtitulo";
        subtituloFijo.textContent = "✓ Servicios incluidos:";
        mpcItems.appendChild(subtituloFijo);

        plan.servicios_fijos.forEach(function (id) {
            const srv = buscarServicio(id);
            if (srv) {
                const item = document.createElement("div");
                item.className = "mpc-item mpc-item--incluido";
                item.innerHTML = `
                    <span>${srv.nombre}</span>
                    <span>Incluido</span>
                `;
                mpcItems.appendChild(item);
            }
        });
    }

    // Servicios elegidos
    if (estadoModal.serviciosElegidos.length > 0) {
        const subtituloElegido = document.createElement("div");
        subtituloElegido.className = "mpc-subtitulo";
        subtituloElegido.textContent = "★ Sistemas elegidos (sin costo):";
        mpcItems.appendChild(subtituloElegido);

        estadoModal.serviciosElegidos.forEach(function (id) {
            const srv = buscarServicio(id);
            if (srv) {
                const item = document.createElement("div");
                item.className = "mpc-item mpc-item--elegido";
                item.innerHTML = `
                    <span>${srv.nombre}</span>
                    <span>Sin costo</span>
                `;
                mpcItems.appendChild(item);
            }
        });
    }

    // Servicios adicionales
    if (estadoModal.serviciosAdicionales.length > 0) {
        const subtituloAdicional = document.createElement("div");
        subtituloAdicional.className = "mpc-subtitulo";
        subtituloAdicional.textContent = "+ Servicios adicionales:";
        mpcItems.appendChild(subtituloAdicional);

        estadoModal.serviciosAdicionales.forEach(function (id) {
            const srv = buscarServicio(id);
            if (!srv) {
                return;
            }

            let precio;
            if (estadoModal.periodicidad === "mensual") {
                precio = srv.precio;
            } else {
                precio = srv.precio * 10;
            }

            const item = document.createElement("div");
            item.className = "mpc-item";
            item.innerHTML = `
                <span>${srv.nombre}</span>
                <span>${formatearPrecio(precio)}</span>
            `;
            mpcItems.appendChild(item);
        });
    }

    // Descuento
    if (estadoModal.descuentoAplicado > 0) {
        const itemDescuento = document.createElement("div");
        itemDescuento.className = "mpc-item mpc-item--descuento";
        itemDescuento.innerHTML = `
            <span>Descuento (${estadoModal.descuentoAplicado}%)</span>
            <span>-${estadoModal.descuentoAplicado}%</span>
        `;
        mpcItems.appendChild(itemDescuento);
    }

    document.getElementById("mpc-total").textContent = formatearPrecio(total);
    document.getElementById("mp-confirmacion-overlay").classList.add("mp-overlay--visible");
}

function cerrarModalConfirmacion() {
    document.getElementById("mp-confirmacion-overlay").classList.remove("mp-overlay--visible");
}

// ============================================================
// GUARDAR COMPRA (ACTUALIZADO)
// ============================================================

function guardarCompraEnLocalStorage() {
    const plan = estadoModal.planElegido;
    const total = calcularTotal();

    let precioPlan;
    if (estadoModal.periodicidad === "mensual") {
        precioPlan = plan.precio_mensual;
    } else {
        precioPlan = plan.precio_anual;
    }

    // Servicios elegidos por el usuario (incluidos en el plan)
    const serviciosElegidosDetalle = estadoModal.serviciosElegidos.map(function (id) {
        const srv = buscarServicio(id);
        if (srv) {
            return {
                id: srv.id,
                nombre: srv.nombre,
                precio: 0
            };
        }
        return { id: id, nombre: id, precio: 0 };
    });

    // Servicios adicionales (pagan extra)
    const serviciosAdicionalesDetalle = estadoModal.serviciosAdicionales.map(function (id) {
        const srv = buscarServicio(id);
        let precioExtra;
        if (estadoModal.periodicidad === "mensual") {
            precioExtra = srv.precio;
        } else {
            precioExtra = srv.precio * 10;
        }

        if (srv) {
            return {
                id: srv.id,
                nombre: srv.nombre,
                precio: precioExtra
            };
        }
        return { id: id, nombre: id, precio: 0 };
    });

    const compra = {
        fecha: new Date().toISOString(),
        plan: {
            id: plan.id,
            nombre: plan.nombre,
            periodicidad: estadoModal.periodicidad,
            precio: precioPlan
        },
        serviciosElegidos: serviciosElegidosDetalle,
        serviciosAdicionales: serviciosAdicionalesDetalle,
        descuentoAplicado: estadoModal.descuentoAplicado,
        codigoDescuento: estadoModal.codigoDescuento,
        total: total
    };

    let historial = JSON.parse(localStorage.getItem("softrent_compras") || "[]");
    historial.push(compra);
    localStorage.setItem("softrent_compras", JSON.stringify(historial));
    localStorage.setItem("softrent_ultima_compra", JSON.stringify(compra));

    return compra;
}
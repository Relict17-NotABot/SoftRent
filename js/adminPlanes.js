const modal = document.getElementById('modal-plan');
const btnNuevo = document.getElementById('btn-nuevo-plan');
const btnCerrar = document.getElementById('btn-cerrar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const modalTitulo = document.getElementById('modal-titulo');
const formPlan = document.getElementById('form-plan');

function abrirModal(titulo = 'Nuevo Plan') {
    modalTitulo.textContent = titulo;
    modal.hidden = false;
}

function cerrarModal() {
    modal.hidden = true;
    formPlan.reset();
}

btnNuevo.addEventListener('click', () => abrirModal('Nuevo Plan'));
btnCerrar.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
});

document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', () => abrirModal('Editar Plan'));
});

document.querySelectorAll('.btn-eliminar').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (confirm('¿Eliminar este plan?')) {
            btn.closest('tr').remove();
        }
    });
});

formPlan.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: conectar con backend / JSON
    cerrarModal();
});

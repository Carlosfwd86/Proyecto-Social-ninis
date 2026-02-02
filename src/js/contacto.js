/**
 * Archivo de JavaScript para la página de Contacto.
 * Gestiona el formulario de contacto y muestra una alerta personalizada.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('correo').value.trim();
            const asunto = document.getElementById('asunto').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !asunto || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            mostrarConfirmacion(nombre, email, asunto, mensaje, contactForm);
        });
    }

    /**
     * Crea y muestra una alerta personalizada (modal) usando el DOM API y clases CSS.
     */
    function mostrarConfirmacion(nombre, email, asunto, mensaje, form) {
        // Contenedor principal del modal (overlay)
        const overlay = document.createElement('div');
        overlay.classList.add('support-modal-overlay');

        // Caja del modal
        const modal = document.createElement('div');
        modal.classList.add('support-modal-content');

        // Título
        const titulo = document.createElement('h2');
        titulo.classList.add('support-modal-title');
        titulo.textContent = 'Confirmación de Envío';

        // Contenido de los datos
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('support-modal-info');

        const createDataRow = (label, value) => {
            const row = document.createElement('div');
            row.classList.add('support-modal-row');

            const labelSpan = document.createElement('span');
            labelSpan.classList.add('support-modal-label');
            labelSpan.textContent = label + ':';

            const valueSpan = document.createElement('span');
            valueSpan.textContent = value;

            row.appendChild(labelSpan);
            row.appendChild(valueSpan);
            return row;
        };

        infoContainer.appendChild(createDataRow('Nombre', nombre));
        infoContainer.appendChild(createDataRow('Email', email));
        infoContainer.appendChild(createDataRow('Asunto', asunto));
        infoContainer.appendChild(createDataRow('Mensaje', mensaje));

        // Disclaimer (Aviso de Privacidad)
        const disclaimer = document.createElement('div');
        disclaimer.classList.add('support-disclaimer');
        disclaimer.textContent = 'IMPORTANTE: Al enviar este formulario, usted autoriza el tratamiento de sus datos personales únicamente para fines de soporte técnico y resolución de dudas sobre su trámite, conforme a nuestro Aviso de Privacidad.';

        // Contenedor de botones
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('support-modal-actions');

        // Botón Enviar
        const btnEnviar = document.createElement('button');
        btnEnviar.textContent = 'Confirmar y Enviar';
        btnEnviar.classList.add('btn-modal', 'btn-modal-send');

        // Botón Cancelar
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.classList.add('btn-modal', 'btn-modal-delete');

        // Lógica de botones
        btnEnviar.addEventListener('click', () => {
            // Cambiar estado visual del botón
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';

            // Simular envío guardando en localStorage
            setTimeout(() => {
                const solicitudes = JSON.parse(localStorage.getItem('support_requests')) || [];
                const nuevaSolicitud = {
                    id: Date.now(),
                    nombre,
                    email,
                    asunto,
                    mensaje,
                    fecha: new Date().toLocaleString(),
                    status: 'Pendiente'
                };
                solicitudes.push(nuevaSolicitud);
                localStorage.setItem('support_requests', JSON.stringify(solicitudes));

                mostrarAlertaExito();
                form.reset();
                document.body.removeChild(overlay);
                document.body.classList.remove('modal-open');
            }, 1000);
        });

        btnCancelar.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.classList.remove('modal-open');
        });

        // Ensamblar modal
        buttonContainer.appendChild(btnCancelar);
        buttonContainer.appendChild(btnEnviar);

        modal.appendChild(titulo);
        modal.appendChild(infoContainer);
        modal.appendChild(disclaimer);
        modal.appendChild(buttonContainer);

        overlay.appendChild(modal);

        // Añadir al body
        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');

        // Cerrar al hacer clic fuera del modal
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                document.body.classList.remove('modal-open');
            }
        });
    }

    /**
     * Muestra una alerta de éxito personalizada tras el envío.
     */
    function mostrarAlertaExito() {
        const overlay = document.createElement('div');
        overlay.classList.add('support-modal-overlay');
        overlay.style.zIndex = '2000'; // Asegurar que esté por encima de todo

        const modal = document.createElement('div');
        modal.classList.add('support-modal-content');
        modal.style.textAlign = 'center';
        modal.style.padding = '30px';

        const icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-circle-check');
        icon.style.fontSize = '4rem';
        icon.style.color = '#22c55e';
        icon.style.marginBottom = '20px';
        icon.style.display = 'block';

        const title = document.createElement('h2');
        title.classList.add('support-modal-title');
        title.textContent = '¡Enviado con Éxito!';
        title.style.margin = '0 0 10px 0';

        const message = document.createElement('p');
        message.textContent = 'Su solicitud ha sido recibida correctamente. Un administrador revisará su caso a la brevedad.';
        message.style.color = '#64748b';
        message.style.marginBottom = '25px';

        const btnClose = document.createElement('button');
        btnClose.textContent = 'Entendido';
        btnClose.classList.add('btn-modal', 'btn-modal-send');
        btnClose.style.width = '100%';

        btnClose.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.classList.remove('modal-open');
        });

        modal.appendChild(icon);
        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(btnClose);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');
    }
});

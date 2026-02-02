/**
 * Archivo de JavaScript para la página de Ayuda.
 * Gestiona el formulario de contacto y muestra una alerta personalizada.
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = contactForm.querySelector('.submit-btn');

    // Habilitar el botón de envío
    if (submitBtn) {
        submitBtn.disabled = false;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            mostrarConfirmacion(nombre, email, mensaje, contactForm);
        });
    }

    /**
     * Crea y muestra una alerta personalizada (modal) sin usar etiquetas HTML en strings.
     */
    function mostrarConfirmacion(nombre, email, mensaje, form) {
        // Contenedor principal del modal (overlay)
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '99999',
            backdropFilter: 'blur(8px)',
            overflowY: 'auto',
            padding: '20px'
        });

        // Caja del modal
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxWidth: '500px',
            width: '90%',
            fontFamily: 'sans-serif',
            color: '#333'
        });

        // Título
        const titulo = document.createElement('h2');
        titulo.textContent = 'Confirmación de Envío';
        titulo.style.marginTop = '0';
        titulo.style.color = '#1a237e'; // Color institucional azul oscuro

        // Contenido de los datos
        const infoContaier = document.createElement('div');
        infoContaier.style.margin = '20px 0';
        infoContaier.style.lineHeight = '1.6';

        const createDataRow = (label, value) => {
            const p = document.createElement('p');
            const b = document.createElement('strong');
            b.textContent = label + ': ';
            p.appendChild(b);
            const span = document.createElement('span');
            span.textContent = value;
            p.appendChild(span);
            return p;
        };

        infoContaier.appendChild(createDataRow('Nombre', nombre));
        infoContaier.appendChild(createDataRow('Email', email));
        infoContaier.appendChild(createDataRow('Mensaje', mensaje));

        // Contenedor de botones
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex',
            gap: '15px',
            marginTop: '25px',
            justifyContent: 'flex-end'
        });

        // Botón Enviar
        const btnEnviar = document.createElement('button');
        btnEnviar.textContent = 'Enviar';
        Object.assign(btnEnviar.style, {
            padding: '10px 20px',
            backgroundColor: '#2e7d32', // Verde éxito
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        });
        btnEnviar.onmouseover = () => btnEnviar.style.backgroundColor = '#1b5e20';
        btnEnviar.onmouseout = () => btnEnviar.style.backgroundColor = '#2e7d32';

        // Botón Eliminar (Limpiar)
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        Object.assign(btnEliminar.style, {
            padding: '10px 20px',
            backgroundColor: '#d32f2f', // Rojo cancelar
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        });
        btnEliminar.onmouseover = () => btnEliminar.style.backgroundColor = '#b71c1c';
        btnEliminar.onmouseout = () => btnEliminar.style.backgroundColor = '#d32f2f';

        // Lógica de botones
        btnEnviar.onclick = () => {
            const solicitudes = JSON.parse(localStorage.getItem('support_requests')) || [];
            const nuevaSolicitud = {
                id: Date.now(),
                nombre,
                email,
                mensaje,
                fecha: new Date().toLocaleString(),
                status: 'Pendiente'
            };
            solicitudes.push(nuevaSolicitud);
            localStorage.setItem('support_requests', JSON.stringify(solicitudes));

            alert('¡Mensaje enviado con éxito! Un administrador revisará tu solicitud.');
            form.reset();
            document.body.removeChild(overlay);
        };

        btnEliminar.onclick = () => {
            if (confirm('¿Estás seguro de que deseas eliminar los datos y limpiar el formulario?')) {
                form.reset();
                document.body.removeChild(overlay);
            }
        };

        // Ensamblar modal
        buttonContainer.appendChild(btnEliminar);
        buttonContainer.appendChild(btnEnviar);
        modal.appendChild(titulo);
        modal.appendChild(infoContaier);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);

        // Añadir al body
        document.body.appendChild(overlay);
    }
});


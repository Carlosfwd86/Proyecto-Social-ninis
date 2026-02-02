/**
 * Gestión de sesión compartida para todas las páginas del portal.
 * Transforma el header según el estado del usuario.
 */
document.addEventListener('DOMContentLoaded', () => {
    const navList = document.querySelector('.nav-list');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && navList) {
        const navItems = navList.querySelectorAll('li');

        navItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                // Estandarizar link de Resultados
                const text = link.textContent.toLowerCase();
                if (text === 'resultados' || text === 'solicitud') {
                    link.setAttribute('href', 'solicitud.html');
                }

                // Transformar Login según rol
                if (link.classList.contains('btn-login')) {
                    // Limpiar el item actual
                    item.textContent = '';

                    const panelLink = document.createElement('a');
                    panelLink.classList.add('nav-link');

                    if (currentUser.role === 'evaluador') {
                        panelLink.setAttribute('href', 'evaluador.html');
                        panelLink.textContent = 'Panel Evaluador';
                        item.appendChild(panelLink);
                    } else if (currentUser.role === 'admin') {
                        panelLink.setAttribute('href', 'admin.html');
                        panelLink.textContent = 'Panel Admin';
                        item.appendChild(panelLink);
                    } else {
                        // Para postulantes, quitamos el botón de login
                        item.remove();
                    }

                    // Siempre añadimos el botón de Salir al final si hay sesión
                    const logoutLi = document.createElement('li');
                    const logoutA = document.createElement('a');
                    logoutA.setAttribute('href', '#');
                    logoutA.classList.add('nav-link', 'btn-login', 'btn-logout');
                    logoutA.id = 'btn-logout-common';
                    logoutA.textContent = 'Cerrar Sesión';

                    logoutLi.appendChild(logoutA);
                    navList.appendChild(logoutLi);

                    // Lógica de Cerrar Sesión
                    logoutA.addEventListener('click', (e) => {
                        e.preventDefault();
                        localStorage.removeItem('currentUser');
                        window.location.href = 'index.html';
                    });
                }
            }
        });
    }
});

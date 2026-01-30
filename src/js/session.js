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
                if (link.textContent.toLowerCase() === 'resultados' || link.textContent.toLowerCase() === 'solicitud') {
                    link.setAttribute('href', 'solicitud.html');
                }

                // CORRECCIÓN: No creamos "Mi Panel". Solo transformamos el Login en "Salir"
                if (link.classList.contains('btn-login')) {
                    // Si es un evaluador o admin, les damos un link a su panel, pero para postulantes NO.
                    if (currentUser.role === 'evaluador') {
                        item.innerHTML = `<a href="evaluador.html" class="nav-link">Panel Evaluador</a>`;
                    } else if (currentUser.role === 'admin') {
                        item.innerHTML = `<a href="admin.html" class="nav-link">Panel Admin</a>`;
                    } else {
                        // Para postulantes, quitamos el botón de login y solo dejamos el de salir
                        item.remove();
                    }

                    // Siempre añadimos el botón de Salir al final
                    const logoutLi = document.createElement('li');
                    logoutLi.innerHTML = `<a href="#" class="nav-link btn-login" id="btn-logout-common" style="background-color: #ffffff; color: #1a365d !important; border-radius: 30px; font-weight: bold;">Cerrar Sesión</a>`;
                    navList.appendChild(logoutLi);
                }
            }
        });

        // Lógica de Cerrar Sesión
        const logoutBtn = document.getElementById('btn-logout-common');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }
    }
});

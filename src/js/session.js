/**
 * Gestión de sesión compartida para todas las páginas del portal.
 * Transforma el header según el estado del usuario y centraliza el cierre de sesión.
 */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // 1. Manejar elementos en el Header (Main Nav y Utility Links)
    function handleSeccion() {
        if (!currentUser) return;

        // Buscar contenedores de navegación
        const utilityLinks = document.querySelector('.utility-links'); // Top Bar
        const navMenu = document.querySelector('.nav-menu'); // Main Nav (ul)
        const primaryNav = document.querySelector('.primary-nav'); // Nav container

        // --- Caso A: Utility Links (Login Link en el Top Bar) ---
        if (utilityLinks) {
            const loginLink = utilityLinks.querySelector('.login-link');
            if (loginLink) {
                // Cambiar "Iniciar Sesión" por "Mi Panel"
                let panelPath = 'postulante.html';
                let panelText = 'Mi Panel';

                if (currentUser.role === 'admin') {
                    panelPath = 'admin.html';
                    panelText = 'Panel Admin';
                } else if (currentUser.role === 'evaluador') {
                    panelPath = 'evaluador.html';
                    panelText = 'Panel Evaluador';
                }

                loginLink.setAttribute('href', panelPath);
                loginLink.textContent = panelText;

                // Añadir botón de Cerrar Sesión al lado
                if (!document.getElementById('btn-logout-common')) {
                    const logoutA = document.createElement('a');
                    logoutA.setAttribute('href', '#');
                    logoutA.classList.add('utility-link', 'logout-global');
                    logoutA.id = 'btn-logout-common';
                    logoutA.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Salir';
                    logoutA.style.marginLeft = '15px';
                    logoutA.style.color = '#ff4444';

                    utilityLinks.appendChild(logoutA);
                    logoutA.addEventListener('click', cerrarSesion);
                }
            }
        }

        // --- Caso C: Otros Headers específicos (eval-nav, etc) ---
        // Muchos ya traen su propio botón, pero vinculamos el evento si existe por ID
        const specificLogout = document.getElementById('btn-logout-eval') ||
            document.getElementById('btn-logout-panel') ||
            document.getElementById('btn-logout-admin');
        if (specificLogout) {
            specificLogout.addEventListener('click', cerrarSesion);
        }
    }

    function cerrarSesion(e) {
        if (e) e.preventDefault();
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    }

    // Ejecutar lógica
    handleSeccion();
});

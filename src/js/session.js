/**
 * Gestión de sesión compartida para todas las páginas del portal.
 * Transforma el header según el estado del usuario y centraliza el cierre de sesión.
 */

// Función global para verificar permisos (puede llamarse antes de que cargue el DOM)
function checkAuth(requiredRole) {
    let user = null;
    try {
        const stored = localStorage.getItem('currentUser');
        if (stored) user = JSON.parse(stored);
    } catch (err) {
        console.error("Error al leer la sesión del localStorage:", err);
    }

    if (!user) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname) + '&msg=session_required';
        return false;
    }

    // Normalizar roles
    const userRole = (user.role || 'postulante').toString().trim().toLowerCase();
    const reqRole = (requiredRole || '').toString().trim().toLowerCase();

    // Diagnóstico en consola (Ayuda a depurar sin ver el código)
    console.log(`[Auth Check] Usuario: ${user.fullname} | Rol: ${userRole} | Requerido: ${reqRole}`);

    // Un administrador tiene acceso total
    if (userRole === 'admin') return true;

    // Un evaluador tiene acceso a su panel y a la vista básica de postulante
    if (userRole === 'evaluador' && (reqRole === 'evaluador' || reqRole === 'postulante' || !reqRole)) {
        return true;
    }

    // Un postulante (o cualquier otro) solo tiene acceso si coincide el rol exacto o no hay requisito
    if (userRole === reqRole || !reqRole) {
        return true;
    }

    // Si llegamos aquí, el acceso es denegado
    console.warn(`ACCESO DENEGADO: Rol "${userRole}" insuficiente para "${reqRole}"`);
    window.location.href = 'login.html?msg=access_denied&redirect=' + encodeURIComponent(window.location.pathname);
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // 1. Manejar elementos en el Header (Main Nav y Utility Links)
    function handleSeccion() {
        if (!currentUser) return;

        // Buscar contenedores de navegación
        const utilityLinks = document.querySelector('.utility-links'); // Top Bar
        const navMenu = document.querySelector('.nav-menu'); // Main Nav (ul)

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
            document.getElementById('btn-logout-admin') ||
            document.getElementById('nav-logout-li'); // Agregado por seguridad si existiera

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

    // Ejecutar lógica de UI
    handleSeccion();
});

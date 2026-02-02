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

    // 2. Sistema Global de Modales de Confirmación y Alertas Estéticas
    const injectModalStyles = () => {
        if (document.getElementById('custom-modal-styles')) return;
        const style = document.createElement('style');
        style.id = 'custom-modal-styles';
        style.innerHTML = `
            .custom-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(6, 78, 59, 0.4); backdrop-filter: blur(8px);
                display: flex; justify-content: center; align-items: center;
                z-index: 100000; opacity: 0; transition: opacity 0.4s ease;
            }
            .custom-modal-overlay.active { opacity: 1; }
            .custom-modal-content {
                background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);
                max-width: 440px; width: 90%; padding: 40px; border-radius: 28px;
                text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5);
                transform: scale(0.9) translateY(20px); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .custom-modal-overlay.active .custom-modal-content { transform: scale(1) translateY(0); }
            .modal-icon-container {
                width: 75px; height: 75px; border-radius: 50%; display: flex;
                align-items: center; justify-content: center; margin: 0 auto 24px;
                font-size: 32px; color: white;
            }
            .type-primary .modal-icon-container { background: linear-gradient(135deg, #10b981, #064e3b); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3); }
            .type-danger .modal-icon-container { background: linear-gradient(135deg, #ef4444, #991b1b); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3); }
            .custom-modal-content h2 { font-family: 'Poppins', sans-serif; color: #064e3b; margin-bottom: 12px; font-size: 24px; }
            .custom-modal-content p { color: #4b5563; line-height: 1.6; margin-bottom: 32px; font-size: 16px; }
            .modal-buttons { display: flex; gap: 16px; }
            .modal-btn { 
                flex: 1; padding: 14px; border: none; border-radius: 12px; 
                font-weight: 600; cursor: pointer; transition: all 0.3s ease; font-family: inherit;
            }
            .btn-cancel { background: #f3f4f6; color: #4b5563; }
            .btn-cancel:hover { background: #e5e7eb; transform: translateY(-2px); }
            .btn-confirm { color: white; }
            .type-primary .btn-confirm { background: #064e3b; }
            .type-primary .btn-confirm:hover { background: #043a2c; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(6, 78, 59, 0.3); }
            .type-danger .btn-confirm { background: #991b1b; }
            .type-danger .btn-confirm:hover { background: #7f1d1d; transform: translateY(-2px); box-shadow: 0 6px 15px rgba(153, 27, 27, 0.3); }
        `;
        document.head.appendChild(style);
    };

    window.mostrarConfirmacion = function ({ title, message, onConfirm, type = 'primary', icon = 'fa-circle-question', confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
        injectModalStyles();
        const overlay = document.createElement('div');
        overlay.className = `custom-modal-overlay type-${type}`;
        overlay.innerHTML = `
            <div class="custom-modal-content">
                <div class="modal-icon-container"><i class="fa-solid ${icon}"></i></div>
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="modal-buttons">
                    ${cancelText ? `<button class="modal-btn btn-cancel">${cancelText}</button>` : ''}
                    <button class="modal-btn btn-confirm">${confirmText}</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        overlay.offsetHeight;
        overlay.classList.add('active');

        const close = () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(overlay)) document.body.removeChild(overlay);
            }, 400);
        };

        if (cancelText) overlay.querySelector('.btn-cancel').onclick = close;
        overlay.querySelector('.btn-confirm').onclick = () => {
            if (onConfirm) onConfirm();
            close();
        };
        overlay.onclick = (e) => e.target === overlay && close();
    };

    window.mostrarAlerta = function ({ title, message, type = 'primary', icon = 'fa-circle-info', btnText = 'Entendido' }) {
        window.mostrarConfirmacion({
            title, message, type, icon, confirmText: btnText, cancelText: '', onConfirm: () => { }
        });
    };

    window.cerrarSesion = function (e) {
        if (e) e.preventDefault();
        window.mostrarConfirmacion({
            title: '¿Vas a salir?',
            message: 'Tu sesión se cerrará y tendrás que volver a ingresar para continuar con tus trámites.',
            icon: 'fa-right-from-bracket',
            confirmText: 'Cerrar Sesión',
            onConfirm: () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    };

    // Ejecutar lógica de UI
    handleSeccion();
});

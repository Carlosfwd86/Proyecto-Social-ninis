// Lógica para la página de Inicio de Sesión
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;

            // 1. Obtener usuarios de localStorage
            const storedUsers = JSON.parse(localStorage.getItem('scholarship_users')) || [];

            // 2. Intentar encontrar el usuario con búsquedas seguras (case-insensitive y sin espacios)
            const user = storedUsers.find(u => {
                const storedUsername = (u.username || '').toString().toLowerCase().trim();
                const storedEmail = (u.email || '').toString().toLowerCase().trim();
                return (storedUsername === usernameInput || storedEmail === usernameInput) && u.password === passwordInput;
            });

            // 3. Caso especial: Administrador hardcoded
            if (usernameInput === "admin" && passwordInput === "1234") {
                showMessage("Sesión de administrador iniciada. Redirigiendo...", "success");
                localStorage.setItem('currentUser', JSON.stringify({ fullname: "Administrador General", role: "admin", email: "admin@sistema.com" }));
                setTimeout(() => {
                    const pendingRedirect = localStorage.getItem('redirectAfterLogin');
                    if (pendingRedirect && pendingRedirect.includes('admin.html')) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "admin.html";
                    }
                }, 1500);
            }
            // 3.1 Caso especial: Evaluador hardcoded
            else if (usernameInput === "evaluador" && passwordInput === "1234") {
                showMessage("Sesión de Evaluador iniciada. Preparando expedientes...", "success");
                localStorage.setItem('currentUser', JSON.stringify({ fullname: "Evaluador Académico", role: "evaluador", email: "eval@sistema.com" }));
                setTimeout(() => {
                    const pendingRedirect = localStorage.getItem('redirectAfterLogin');
                    if (pendingRedirect && pendingRedirect.includes('evaluador.html')) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = "evaluador.html";
                    } else {
                        window.location.href = "evaluador.html";
                    }
                }, 1500);
            }
            // 4. Verificar usuario de la base de datos
            else if (user) {
                // Clonar y asegurar que tenga el rol (Reparar usuarios legacy)
                const userSession = {
                    ...user,
                    role: (user.role || 'postulante').toString().toLowerCase().trim()
                };

                showMessage(`¡Bienvenido de nuevo, ${userSession.fullname}! Entrando...`, "success");
                localStorage.setItem('currentUser', JSON.stringify(userSession));

                const pendingRedirect = localStorage.getItem('redirectAfterLogin');

                setTimeout(() => {
                    if (pendingRedirect) {
                        localStorage.removeItem('redirectAfterLogin');

                        // SEGURIDAD: Solo redirigir si el rol tiene permiso para esa página
                        const isRestricted = pendingRedirect.includes('admin.html') || pendingRedirect.includes('evaluador.html');
                        const isAdmin = userSession.role === 'admin';
                        const isEval = userSession.role === 'evaluador';

                        if (!isRestricted || isAdmin || (isEval && !pendingRedirect.includes('admin.html'))) {
                            window.location.href = pendingRedirect;
                            return;
                        }
                    }

                    // Redirección por defecto según rol
                    window.location.href = userSession.role === 'admin' ? "admin.html" :
                        userSession.role === 'evaluador' ? "evaluador.html" : "postulante.html";
                }, 1500);
            }
            else {
                showMessage("Usuario o contraseña incorrectos. Inténtalo de nuevo.", "error");
            }
        });
    }

    // --- Manejo de mensajes desde el URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    const redirect = urlParams.get('redirect');

    if (redirect) {
        localStorage.setItem('redirectAfterLogin', redirect);
    }

    if (msg === 'session_required') {
        showMessage("Por favor, inicia sesión para acceder a esta área.", "error");
    } else if (msg === 'access_denied') {
        showMessage("No tienes permisos suficientes para acceder a esa página. Inicia sesión con la cuenta adecuada.", "error");
    }

    /**
     * Muestra un mensaje en el área de notificaciones
     * @param {string} text - El texto a mostrar
     * @param {string} type - 'success' o 'error'
     */
    function showMessage(text, type) {
        messageArea.textContent = text;
        if (type === "success") {
            messageArea.className = "message-box message-success";
        } else {
            messageArea.className = "message-box message-error";
        }
    }
});

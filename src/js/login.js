// Lógica para la página de Inicio de Sesión
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageArea = document.getElementById('message-area');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;

            // 1. Obtener usuarios de localStorage
            const storedUsers = JSON.parse(localStorage.getItem('scholarship_users')) || [];

            // 2. Intentar encontrar el usuario por username O email (flexibilidad para el usuario)
            const user = storedUsers.find(u =>
                (u.username === usernameInput || u.email === usernameInput) && u.password === passwordInput
            );

            // 3. Caso especial: Administrador hardcoded
            if (usernameInput === "admin" && passwordInput === "1234") {
                showMessage("Sesión de administrador iniciada. Redirigiendo...", "success");
                setTimeout(() => {
                    window.location.href = "admin.html";
                }, 1500);
            }
            // 4. Verificar usuario de la base de datos (localStorage)
            else if (user) {
                showMessage(`Bienvenido de nuevo, ${user.fullname}. Accediendo a resultados...`, "success");

                // Guardar usuario actual en sesión (localStorage)
                localStorage.setItem('currentUser', JSON.stringify(user));

                setTimeout(() => {
                    // Redirigimos a la página de resultados como solicitaste
                    window.location.href = "resultados.html";
                }, 1500);
            }
            else {
                showMessage("Usuario o contraseña incorrectos. Inténtalo de nuevo.", "error");
            }
        });
    }

    /**
     * Muestra un mensaje en el área de notificaciones
     * @param {string} text - El texto a mostrar
     * @param {string} type - 'success' o 'error'
     */
    function showMessage(text, type) {
        messageArea.textContent = text;
        messageArea.className = ""; // Limpiar clases anteriores
        messageArea.style.padding = "10px";
        messageArea.style.marginBottom = "15px";
        messageArea.style.borderRadius = "5px";

        if (type === "success") {
            messageArea.style.color = "#155724";
            messageArea.style.backgroundColor = "#d4edda";
            messageArea.style.border = "1px solid #c3e6cb";
        } else {
            messageArea.style.color = "#721c24";
            messageArea.style.backgroundColor = "#f8d7da";
            messageArea.style.border = "1px solid #f5c6cb";
        }
    }
});

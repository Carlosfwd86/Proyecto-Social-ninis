// Lógica para la página de Registro
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form');
    const messageArea = document.getElementById('message-area');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener los datos del formulario de manera segura
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            // 1. Obtener usuarios existentes de localStorage
            const existingUsers = JSON.parse(localStorage.getItem('scholarship_users')) || [];

            // 2. Verificar duplicados
            const userExists = existingUsers.some(user =>
                (user.email && user.email.toLowerCase() === email) ||
                (user.username && user.username.toLowerCase() === username)
            );

            if (userExists) {
                showError("El nombre de usuario o el correo electrónico ya están registrados.");
                return;
            }

            // 3. Crear el nuevo objeto de usuario
            const newUser = {
                fullname,
                email: email.toLowerCase(),
                username: username.toLowerCase(),
                password,
                role: 'postulante' // Asegurar que sea literal para evitar fallos de comparación
            };

            // 4. Agregar y guardar
            existingUsers.push(newUser);
            localStorage.setItem('scholarship_users', JSON.stringify(existingUsers));

            // Auto-login: Guardar sesión actual
            localStorage.setItem('currentUser', JSON.stringify(newUser));

            // Simulación de éxito
            showSuccess(`¡Registro exitoso! Bienvenido/a, ${fullname}. Entrando a tu panel...`);

            // Redirigir directamente al panel del postulante
            setTimeout(() => {
                window.location.href = "postulante.html";
            }, 1500);
        });
    }

    function showSuccess(message) {
        if (!messageArea) return;
        messageArea.textContent = message;
        messageArea.className = "message-box message-success";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showError(message) {
        if (!messageArea) return;
        messageArea.textContent = message;
        messageArea.className = "message-box message-error";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

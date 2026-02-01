    const registrationForm = document.getElementById('registration-form');
// Lógica para la página de Registro
document.addEventListener('DOMContentLoaded', () => {

    const messageArea = document.getElementById('message-area');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Obtener los datos del formulario
            const formData = new FormData(registrationForm);
            const userData = Object.fromEntries(formData.entries());

            // 1. Obtener usuarios existentes de localStorage
            const existingUsers = JSON.parse(localStorage.getItem('scholarship_users')) || [];

            // 2. Verificar si el usuario o email ya existen
            const userExists = existingUsers.some(user => user.username === userData.username || user.email === userData.email);

            if (userExists) {
                showError("El nombre de usuario o el correo electrónico ya están registrados.");
                return;
            }

            // 3. Agregar nuevo usuario a la lista
            existingUsers.push(userData);

            // 4. Guardar en localStorage
            localStorage.setItem('scholarship_users', JSON.stringify(existingUsers));

            console.log('Usuario registrado y guardado:', userData);

            // Simulación de guardado exitoso
            showSuccess(`¡Registro exitoso! Bienvenido/a, ${userData.fullname}. Redirigiendo al login...`);

            // Redirigir después de un tiempo
            setTimeout(() => {
                window.location.href = "login.html";
            }, 3000);
        });
    }

    function showSuccess(message) {
        messageArea.textContent = message;
        messageArea.className = "success-message";
        messageArea.style.color = "green";
        messageArea.style.padding = "10px";
        messageArea.style.marginBottom = "15px";
        messageArea.style.borderRadius = "5px";
        messageArea.style.backgroundColor = "#d4edda";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showError(message) {
        messageArea.textContent = message;
        messageArea.className = "error-message";
        messageArea.style.color = "red";
        messageArea.style.padding = "10px";
        messageArea.style.marginBottom = "15px";
        messageArea.style.borderRadius = "5px";
        messageArea.style.backgroundColor = "#f8d7da";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

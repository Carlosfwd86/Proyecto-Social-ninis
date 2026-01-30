/**
 * Lógica de protección para la página de Solicitudes
 * Verifica que el usuario esté logueado antes de permitir ver la página.
 */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Guardar la intención de visitar esta página para redirigir después del login si se desea
        localStorage.setItem('redirectAfterLogin', 'solicitud.html');

        // Redirigir al login informando al usuario (opcionalmente vía URL)
        window.location.href = 'login.html?message=auth_required';
    }
});

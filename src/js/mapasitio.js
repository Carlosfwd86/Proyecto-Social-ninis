/**
 * Archivo JavaScript para Mapa del Sitio
 * Gestiona la visibilidad y redirección de las Áreas Privadas según el rol del usuario.
 */
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const privateLinks = document.querySelectorAll('.sitemap-category:nth-child(3) .category-links a');

    if (currentUser) {
        privateLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Si el link NO corresponde al rol del usuario, lo marcamos o redirigimos
            // Pero el usuario ya pidió que si no es de su nivel, le pida login de nuevo.
            // Para "Panel de Postulante", si ya estoy logueado (como cualquier rol), 
            // debería funcionar gracias a los nuevos permisos en session.js.

            if (href === 'admin.html' && currentUser.role !== 'admin') {
                link.style.opacity = '0.6';
                link.title = 'Requiere privilegios de administrador';
            } else if (href === 'evaluador.html' && currentUser.role !== 'evaluador' && currentUser.role !== 'admin') {
                link.style.opacity = '0.6';
                link.title = 'Requiere privilegios de evaluador';
            }
        });
    }
});

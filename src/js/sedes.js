/**
 * Lógica para visualizar las Sedes de forma dinámica
 */
document.addEventListener('DOMContentLoaded', () => {
    const sedesContainer = document.getElementById('sedes-container');

    function renderPublicSedes() {
        const sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];

        // Si no hay sedes registradas por el admin, las estáticas del HTML se quedan como respaldo.
        if (sedes.length === 0) return;

        // Si hay sedes en el sistema de administración, reemplazamos el contenido
        sedesContainer.innerHTML = '';

        sedes.forEach((sede, index) => {
            const article = document.createElement('article');
            article.className = 'sede-card';

            // Colores e imágenes aleatorias para variedad visual
            const imgId = 10 + index;
            const fallbackImg = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80`;

            article.innerHTML = `
                <div class="sede-img-wrapper">
                    <span class="sede-badge">Verificada</span>
                    <img src="${fallbackImg}" alt="${sede.nombre}" class="sede-img">
                </div>
                <div class="sede-info">
                    <h3>${sede.nombre}</h3>
                    <ul class="sede-details">
                        <li>
                            <div class="icono-box">📍</div>
                            <span>${sede.direccion}</span>
                        </li>
                        <li>
                            <div class="icono-box">👤</div>
                            <span><strong>Encargado:</strong> ${sede.encargado}</span>
                        </li>
                        <li>
                            <div class="icono-box">⏰</div>
                            <span>Atención: Lunes a Viernes (09:00 - 18:00)</span>
                        </li>
                    </ul>
                    <button class="map-btn">
                        <span>🗺️ Localizar Sede</span>
                    </button>
                </div>
            `;
            sedesContainer.appendChild(article);
        });
    }

    renderPublicSedes();
});

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

            // Imagen fallback
            const fallbackImg = `https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80`;

            // Estructura de imagen
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('sede-img-wrapper');

            const badge = document.createElement('span');
            badge.classList.add('sede-badge');
            badge.textContent = 'Verificada';

            const img = document.createElement('img');
            img.setAttribute('src', fallbackImg);
            img.setAttribute('alt', sede.nombre);
            img.classList.add('sede-img');

            imgWrapper.appendChild(badge);
            imgWrapper.appendChild(img);

            // Información
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('sede-info');

            const h3 = document.createElement('h3');
            h3.textContent = sede.nombre;

            const ul = document.createElement('ul');
            ul.classList.add('sede-details');

            const createLi = (icon, text, isStrong = false) => {
                const li = document.createElement('li');
                const iconBox = document.createElement('div');
                iconBox.classList.add('icono-box');
                iconBox.textContent = icon;

                const span = document.createElement('span');
                if (isStrong) {
                    const strong = document.createElement('strong');
                    strong.textContent = text.split(':')[0] + ':';
                    span.appendChild(strong);
                    span.append(' ' + text.split(':')[1]);
                } else {
                    span.textContent = text;
                }

                li.appendChild(iconBox);
                li.appendChild(span);
                return li;
            };

            ul.appendChild(createLi('📍', sede.direccion));
            ul.appendChild(createLi('👤', `Encargado: ${sede.encargado}`, true));
            ul.appendChild(createLi('⏰', 'Atención: Lunes a Viernes (09:00 - 18:00)'));

            const btnMap = document.createElement('button');
            btnMap.classList.add('map-btn');
            const spanMap = document.createElement('span');
            spanMap.textContent = '🗺️ Localizar Sede';
            btnMap.appendChild(spanMap);

            infoDiv.appendChild(h3);
            infoDiv.appendChild(ul);
            infoDiv.appendChild(btnMap);

            article.appendChild(imgWrapper);
            article.appendChild(infoDiv);

            sedesContainer.appendChild(article);
        });
    }

    renderPublicSedes();
});

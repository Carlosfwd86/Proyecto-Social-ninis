/* Lógica específica para becas.html */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Becas loaded');

    const container = document.querySelector('.cards-grid') || document.querySelector('#becas-container') || document.body.querySelector('main .container');
    // If we can't find a specific container, let's identify where the cards should go. 
    // Usually it's a grid container. In becas.html (viewed earlier), we didn't inspect the full structure but it should have a grid.

    // Let's assume there's a container. If not, we append to a new one. 
    // Best effort: find the grid.
    const gridDiv = document.getElementById('becas-container') || document.querySelector('.cards-grid') || document.querySelector('.becas-grid');

    function renderAllBecas() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];

        if (gridDiv) {
            gridDiv.innerHTML = '';

            scholarships.forEach(beca => {
                const card = document.createElement('article');
                card.className = 'beca-card'; // Using the class expected by filters
                card.setAttribute('data-category', beca.category.toLowerCase()); // For filtering

                // Construct Card HTML
                card.innerHTML = `
                    <div class="card-header">
                        <span class="badge ${beca.category === 'Nacional' ? 'bg-green' : 'bg-purple'}">${beca.category}</span>
                    </div>
                    <div class="card-body">
                        <h3>${beca.name}</h3>
                        <p>${beca.description.substring(0, 100)}...</p>
                        <ul class="card-details">
                            <li><strong>Financiamiento:</strong> ${beca.funding}</li>
                             <li><strong>Cierre:</strong> ${beca.deadline}</li>
                        </ul>
                        
                        <div class="beca-more-details" style="display: none; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                            <p><strong>Requisitos:</strong> ${beca.minAvg ? 'Promedio mín: ' + beca.minAvg : 'Consultar bases'}</p>
                            <p><strong>Descripción completa:</strong> ${beca.description}</p>
                            <a href="postulante.html" class="btn-primary" style="margin-top: 10px; width: 100%; text-align: center;">Postular</a>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn-secondary btn-details" style="width: 100%;">Más detalles</button>
                    </div>
                `;

                gridDiv.appendChild(card);
            });
        }
    }

    renderAllBecas();

    // 1. Filtrado de Categorías
    const filterButtons = document.querySelectorAll('.filter-list button');

    // We need to re-select cards because they are dynamic now
    const getBecaCards = () => document.querySelectorAll('.beca-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const cards = getBecaCards();

            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                // Normalize for comparison
                if (filterValue === 'todos' || cardCat === filterValue.toLowerCase()) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 2. Toggle "Más detalles" - Delegation is better for dynamic content
    if (gridDiv) {
        gridDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-details')) {
                const btn = e.target;
                const card = btn.closest('.beca-card');
                const detailsDiv = card.querySelector('.beca-more-details');

                if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
                    detailsDiv.style.display = 'block';
                    btn.textContent = 'Menos detalles';
                } else {
                    detailsDiv.style.display = 'none';
                    btn.textContent = 'Más detalles';
                }
            }
        });
    }
});

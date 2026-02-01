    const cardsGrid = document.querySelector('.cards-grid');
    const modal = document.getElementById('beca-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('btn-close-text')];
    const navList = document.querySelector('.nav-list');
    const modalPostularBtn = document.getElementById('btn-modal-postular');
// Lógica principal del Sistema de Gestión de Becas (Index)
document.addEventListener('DOMContentLoaded', () => {


    // 0. Gestión de Sesión en el Header
    // 0. Gestión de Sesión para el Modal (El header se maneja con session.js)
    function updateModalForSession() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (modalPostularBtn) {
                modalPostularBtn.setAttribute('href', 'postulante.html');
                modalPostularBtn.textContent = 'Ir a mi panel';
            }
        }
    }

    updateModalForSession();

    // 1. Semilla de datos (Solo si no hay becas creadas)
    const seedScholarships = [
        {
            id: 1,
            name: 'Beca Excelencia Global',
            category: 'Internacional',
            funding: '100% (Matrícula + Manutención)',
            deadline: '15 de Marzo',
            description: 'Esta prestigiosa beca está diseñada para apoyar a los estudiantes con el mejor promedio académico que deseen realizar estudios de posgrado en el extranjero.',
            requisitos: ['Promedio superior a 9.5', 'Nivel de inglés C1', 'Carta de aceptación']
        },
        {
            id: 2,
            name: 'Apoyo Talento Regional',
            category: 'Nacional',
            funding: '70% de la matrícula',
            deadline: '30 de Abril',
            description: 'Programa enfocado en reducir la brecha educativa en zonas rurales, apoyando a jóvenes talentosos para estudiar en capitales estatales.',
            requisitos: ['Residencia en zona rural', 'Promedio mínimo de 8.5']
        }
    ];

    if (!localStorage.getItem('scholarships')) {
        localStorage.setItem('scholarships', JSON.stringify(seedScholarships));
    }

    // 2. Renderizar Becas dinámicamente desde LocalStorage
    function renderIndexCards() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        if (cardsGrid) {
            cardsGrid.innerHTML = '';
            scholarships.forEach(beca => {
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">
                        <span class="badge ${beca.category === 'Internacional' ? '' : (beca.category === 'Nacional' ? 'bg-green' : 'bg-purple')}">${beca.category}</span>
                    </div>
                    <div class="card-body">
                        <h3>${beca.name}</h3>
                        <p>${beca.description.substring(0, 80)}...</p>
                        <ul class="card-details">
                            <li><strong>Financiamiento:</strong> ${beca.funding}</li>
                            <li><strong>Cierre:</strong> ${beca.deadline}</li>
                        </ul>
                    </div>
                    <div class="card-footer">
                        <button class="btn-secondary" onclick="openBecaModal(${beca.id})">Más detalles</button>
                    </div>
                `;
                cardsGrid.appendChild(card);
            });
        }
    }

    renderIndexCards();

    // 3. Lógica del Modal
    window.openBecaModal = function (id) {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        const beca = scholarships.find(b => b.id === id);

        if (beca) {
            modalBody.innerHTML = `
                <span class="badge ${beca.category === 'Internacional' ? '' : (beca.category === 'Nacional' ? 'bg-green' : 'bg-purple')}">${beca.category}</span>
                <h2>${beca.name}</h2>
                <p>${beca.description}</p>
                <div class="modal-info-grid">
                    <div class="info-item">
                        <h4>Financiamiento</h4>
                        <p>${beca.funding}</p>
                    </div>
                    <div class="info-item">
                        <h4>Fecha de Cierre</h4>
                        <p>${beca.deadline}</p>
                    </div>
                </div>
                <h4>Pasos para aplicar:</h4>
                <ul class="requirements-list">
                    <li>Inicia sesión con tu cuenta de postulante.</li>
                    <li>Sube tu documentación oficial en formato PDF.</li>
                    <li>Espera el dictamen del evaluador académico.</li>
                </ul>
            `;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    // Botones de cerrar modal
    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Buscador interactivo
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = e.target.querySelector('input').value.toLowerCase();
            const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
            const filtered = scholarships.filter(b =>
                b.name.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query)
            );

            // Simular búsqueda filtrando visualmente
            alert(`Se encontraron ${filtered.length} becas relacionadas.`);
        });
    }
});

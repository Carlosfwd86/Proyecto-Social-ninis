/**
 * Lógica principal del Sistema de Gestión de Becas (Index)
 */
document.addEventListener('DOMContentLoaded', () => {
    const cardsGrid = document.querySelector('.cards-grid');
    const modal = document.getElementById('beca-modal');
    const modalBody = document.getElementById('modal-body-content');
    const closeModalBtns = [document.getElementById('close-modal'), document.getElementById('btn-close-text')];
    const modalPostularBtn = document.getElementById('btn-modal-postular');

    // 0. Gestión de Sesión para el Modal
    function updateModalForSession() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && modalPostularBtn) {
            modalPostularBtn.setAttribute('href', 'postulante.html');
            modalPostularBtn.textContent = 'Ir a mi panel';
        }
    }

    updateModalForSession();

    // 1. Semilla de datos
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

    // 2. Renderizar Becas dinámicamente
    function renderIndexCards() {
        // Get all and reverse to show newest first, then take top 3
        const allScholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        const scholarships = allScholarships.slice(-3).reverse();

        if (!cardsGrid) return;
        cardsGrid.innerHTML = '';

        scholarships.forEach(beca => {
            const card = document.createElement('article');
            card.className = 'card';

            const header = document.createElement('div');
            header.classList.add('card-header');
            const badge = document.createElement('span');
            badge.classList.add('badge');
            if (beca.category === 'Nacional') badge.classList.add('bg-green');
            else if (beca.category !== 'Internacional') badge.classList.add('bg-purple');
            badge.textContent = beca.category;
            header.appendChild(badge);

            const bodyCard = document.createElement('div');
            bodyCard.classList.add('card-body');
            const h3 = document.createElement('h3');
            h3.textContent = beca.name;
            const p = document.createElement('p');
            p.textContent = beca.description.substring(0, 80) + '...';

            const ul = document.createElement('ul');
            ul.classList.add('card-details');

            const liFund = document.createElement('li');
            const strongFund = document.createElement('strong');
            strongFund.textContent = 'Financiamiento:';
            liFund.appendChild(strongFund);
            liFund.append(` ${beca.funding}`);

            const liDead = document.createElement('li');
            const strongDead = document.createElement('strong');
            strongDead.textContent = 'Cierre:';
            liDead.appendChild(strongDead);
            liDead.append(` ${beca.deadline}`);

            ul.appendChild(liFund);
            ul.appendChild(liDead);

            bodyCard.appendChild(h3);
            bodyCard.appendChild(p);
            bodyCard.appendChild(ul);

            const footer = document.createElement('div');
            footer.classList.add('card-footer');
            const btnDetails = document.createElement('button');
            btnDetails.classList.add('btn-secondary');
            btnDetails.textContent = 'Más detalles';
            btnDetails.onclick = () => openBecaModal(beca.id);
            footer.appendChild(btnDetails);

            card.appendChild(header);
            card.appendChild(bodyCard);
            card.appendChild(footer);
            cardsGrid.appendChild(card);
        });
    }

    renderIndexCards();

    // 3. Lógica del Modal
    window.openBecaModal = function (id) {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        const beca = scholarships.find(b => b.id === id);

        if (beca && modal && modalBody) {
            modalBody.innerHTML = ''; // Limpiar previo

            const badge = document.createElement('span');
            badge.classList.add('badge');
            if (beca.category === 'Nacional') badge.classList.add('bg-green');
            else if (beca.category !== 'Internacional') badge.classList.add('bg-purple');
            badge.textContent = beca.category;

            const h2 = document.createElement('h2');
            h2.textContent = beca.name;

            const pDesc = document.createElement('p');
            pDesc.textContent = beca.description;

            const grid = document.createElement('div');
            grid.classList.add('modal-info-grid');

            const createInfoItem = (title, value) => {
                const item = document.createElement('div');
                item.classList.add('info-item');
                const h4 = document.createElement('h4');
                h4.textContent = title;
                const p = document.createElement('p');
                p.textContent = value;
                item.appendChild(h4);
                item.appendChild(p);
                return item;
            };

            grid.appendChild(createInfoItem('Financiamiento', beca.funding));
            grid.appendChild(createInfoItem('Fecha de Cierre', beca.deadline));

            const h4Steps = document.createElement('h4');
            h4Steps.textContent = 'Pasos para aplicar:';

            const ulSteps = document.createElement('ul');
            ulSteps.classList.add('requirements-list');
            const steps = [
                'Inicia sesión con tu cuenta de postulante.',
                'Sube tu documentación oficial en formato PDF.',
                'Espera el dictamen del evaluador académico.'
            ];
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                ulSteps.appendChild(li);
            });

            modalBody.appendChild(badge);
            modalBody.appendChild(h2);
            modalBody.appendChild(pDesc);
            modalBody.appendChild(grid);
            modalBody.appendChild(h4Steps);
            modalBody.appendChild(ulSteps);

            modal.classList.add('modal-visible'); // Usar clases en lugar de .style.display
            document.body.classList.add('no-scroll');
        }
    };

    // Cerrar modal
    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    modal.classList.remove('modal-visible');
                    document.body.classList.remove('no-scroll');
                });
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('modal-visible');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Buscador
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            const query = input ? input.value.toLowerCase() : '';
            const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
            const filtered = scholarships.filter(b =>
                b.name.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query)
            );
            alert(`Se encontraron ${filtered.length} becas relacionadas.`);
        });
    }
});

const assignmentsTable = document.getElementById('assignments-table-body');
const evaluationSection = document.getElementById('evaluation-details');
const evaluationForm = document.getElementById('evaluation-form');
const btnCerrarEval = document.getElementById('btn-cerrar-eval');
const btnLogout = document.getElementById('btn-logout-eval');
const statEvalAsignaciones = document.getElementById('stat-eval-asignaciones');
const statEvalSoporte = document.getElementById('stat-eval-soporte');

// Lógica para el Panel del Evaluador
document.addEventListener('DOMContentLoaded', () => {
    let currentFolio = null;

    // Helper para crear etiquetas de estado
    function createStatusTag(status) {
        const span = document.createElement('span');
        span.classList.add('status-tag');
        switch (status) {
            case 'Aprobado': span.classList.add('status-approved'); break;
            case 'Rechazado': span.classList.add('status-rejected'); break;
            case 'Pendiente': span.classList.add('status-pending'); break;
            default: span.classList.add('process');
        }
        span.textContent = status;
        return span;
    }

    // 1. Cargar solicitudes reales
    function renderAssignments() {
        if (!assignmentsTable) return;

        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        assignmentsTable.innerHTML = '';

        if (applications.length === 0) {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '6');
            td.classList.add('text-center');
            td.textContent = 'No hay expedientes registrados en el sistema.';
            row.appendChild(td);
            assignmentsTable.appendChild(row);
            return;
        }

        applications.forEach(app => {
            const row = document.createElement('tr');

            const tdFolio = document.createElement('td');
            const strongFolio = document.createElement('strong');
            strongFolio.textContent = app.folio;
            tdFolio.appendChild(strongFolio);

            const tdName = document.createElement('td');
            tdName.textContent = app.applicantName;

            const tdBeca = document.createElement('td');
            tdBeca.textContent = app.scholarship;

            const tdDate = document.createElement('td');
            tdDate.textContent = app.date;

            const tdStatus = document.createElement('td');
            tdStatus.appendChild(createStatusTag(app.status));

            const tdActions = document.createElement('td');
            if (app.status === 'Pendiente') {
                const btnEval = document.createElement('button');
                btnEval.classList.add('btn-eval-action');
                btnEval.textContent = 'Evaluar';
                btnEval.onclick = () => openEvaluation(app.folio);
                tdActions.appendChild(btnEval);
            } else {
                const spanComp = document.createElement('span');
                spanComp.classList.add('text-muted-small'); // Usaremos clase CSS
                spanComp.textContent = 'Completado';
                tdActions.appendChild(spanComp);
            }

            row.appendChild(tdFolio);
            row.appendChild(tdName);
            row.appendChild(tdBeca);
            row.appendChild(tdDate);
            row.appendChild(tdStatus);
            row.appendChild(tdActions);

            assignmentsTable.appendChild(row);
        });
    }

    // 2. Abrir formulario de dictamen
    window.openEvaluation = function (folio) {
        currentFolio = folio;
        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const app = applications.find(a => a.folio === folio);

        if (app) {
            document.getElementById('eval-title').innerText = `Evaluando Folio: ${folio}`;
            document.getElementById('info-folio').innerText = app.folio;
            document.getElementById('info-nombre').innerText = app.applicantName;
            document.getElementById('info-telefono').innerText = app.phone || 'No registrado';
            document.getElementById('info-institucion').innerText = app.institution || 'No especificada';
            document.getElementById('info-carrera').innerText = app.grade || 'No especificado';
            document.getElementById('info-promedio').innerText = app.average || 'N/A';
            document.getElementById('info-ingresos').innerText = app.income ? `$${app.income}` : 'No declarado';
            document.getElementById('info-vivienda').innerText = app.housingStatus || 'No especificada';
            document.getElementById('info-motivos').innerText = app.reason;

            evaluationSection.classList.remove('hidden');
            evaluationSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (btnCerrarEval) btnCerrarEval.addEventListener('click', () => evaluationSection.classList.add('hidden'));

    // 3. Procesar Evaluación
    if (evaluationForm) {
        evaluationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const scoreValue = document.getElementById('score').value;
            const outcomeValue = document.getElementById('outcome').value;
            const obsValue = document.getElementById('observations').value;

            let applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
            const index = applications.findIndex(app => app.folio === currentFolio);

            if (index !== -1) {
                applications[index].status = outcomeValue;
                applications[index].evalInfo = {
                    score: scoreValue,
                    observations: obsValue,
                    evalDate: new Date().toLocaleDateString()
                };

                localStorage.setItem('scholarship_applications', JSON.stringify(applications));
                alert(`Dictamen guardado exitosamente: El trámite ha sido ${outcomeValue}.`);

                evaluationForm.reset();
                evaluationSection.classList.add('hidden');
                renderAssignments();
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    function updateStats() {
        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const pending = applications.filter(a => a.status === 'Pendiente');
        const soporte = JSON.parse(localStorage.getItem('support_requests')) || [];

        if (statEvalAsignaciones) statEvalAsignaciones.innerText = pending.length;
        if (statEvalSoporte) statEvalSoporte.innerText = soporte.length;
    }

    // Inicialización
    renderAssignments();
    updateStats();
});

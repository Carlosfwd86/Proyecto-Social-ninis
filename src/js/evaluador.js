// Lógica para el Panel del Evaluador
document.addEventListener('DOMContentLoaded', () => {
    const assignmentsTable = document.getElementById('assignments-table-body');
    const evaluationSection = document.getElementById('evaluation-details');
    const evaluationForm = document.getElementById('evaluation-form');
    const btnCerrarEval = document.getElementById('btn-cerrar-eval');
    const btnLogout = document.getElementById('btn-logout-eval');

    let currentFolio = null;

    // 1. Cargar solicitudes reales
    function renderAssignments() {
        if (!assignmentsTable) return;

        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        assignmentsTable.innerHTML = '';

        if (applications.length === 0) {
            assignmentsTable.innerHTML = '<tr><td colspan="6" class="text-center">No hay expedientes registrados en el sistema.</td></tr>';
            return;
        }

        applications.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>${app.applicantName}</td>
                <td>${app.scholarship}</td>
                <td>${app.date}</td>
                <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
                <td>
                    ${app.status === 'Pendiente' ?
                    `<button class="btn-eval-action" onclick="openEvaluation('${app.folio}')">Evaluar</button>` :
                    '<span style="color: grey; font-size: 0.8rem;">Completado</span>'
                }
                </td>
            `;
            assignmentsTable.appendChild(row);
        });
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'Rechazado': return 'status-rejected';
            case 'Pendiente': return 'status-pending';
            default: return 'process';
        }
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

            const score = document.getElementById('score').value;
            const status = document.getElementById('outcome').value;
            const observations = document.getElementById('observations').value;

            let applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
            const index = applications.findIndex(app => app.folio === currentFolio);

            if (index !== -1) {
                applications[index].status = status;
                applications[index].evalInfo = {
                    score: score,
                    observations: observations,
                    evalDate: new Date().toLocaleDateString()
                };

                localStorage.setItem('scholarship_applications', JSON.stringify(applications));
                alert(`Dictamen guardado exitosamente: El trámite ha sido ${status}.`);

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

    // Inicialización
    renderAssignments();
});

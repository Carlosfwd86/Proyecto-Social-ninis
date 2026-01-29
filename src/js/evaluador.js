// Lógica para el Panel del Evaluador
document.addEventListener('DOMContentLoaded', () => {
    const assignmentsTable = document.getElementById('assignments-table-body');
    const evaluationSection = document.getElementById('evaluation-details');
    const evaluationForm = document.getElementById('evaluation-form');
    let currentFolio = null;

    // Cargar trámites enviados por los alumnos
    renderAssignments();

    if (evaluationForm) {
        evaluationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const score = document.getElementById('score').value;
            const status = document.getElementById('outcome').value;
            const observations = document.getElementById('observations').value;

            // 1. Obtener trámites de localStorage
            let applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];

            // 2. Buscar el trámite en edición y actualizarlo
            const index = applications.findIndex(app => app.folio === currentFolio);
            if (index !== -1) {
                applications[index].status = status;
                applications[index].score = score;
                applications[index].observations = observations;

                // 3. Guardar cambios
                localStorage.setItem('scholarship_applications', JSON.stringify(applications));

                alert(`Dictamen procesado: El folio ${currentFolio} ahora está ${status}`);
                evaluationSection.style.display = 'none';
                renderAssignments();
            }
        });
    }

    function renderAssignments() {
        if (!assignmentsTable) return;

        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        assignmentsTable.innerHTML = '';

        if (applications.length === 0) {
            assignmentsTable.innerHTML = '<tr><td colspan="5" class="text-center">No hay expedientes pendientes de evaluación.</td></tr>';
            return;
        }

        applications.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>${app.applicantName}</td>
                <td>${app.scholarship}</td>
                <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
                <td>
                    <button class="btn-eval" onclick="openEvaluation('${app.folio}')">Evaluar</button>
                </td>
            `;
            assignmentsTable.appendChild(row);
        });
    }

    window.openEvaluation = function (folio) {
        currentFolio = folio;
        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const app = applications.find(a => a.folio === folio);

        if (app) {
            // Llenar datos informativos
            document.querySelector('.evaluation-header h3').innerText = `Evaluando Folio: ${folio}`;
            document.getElementById('observations').value = app.observations || '';

            // Mostrar formulario
            evaluationSection.style.display = 'block';
            evaluationSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'En Revisión': return 'status-pending';
            case 'Rechazado': return 'status-rejected';
            default: return '';
        }
    }
});

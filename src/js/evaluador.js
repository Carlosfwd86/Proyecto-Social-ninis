const assignmentsTable = document.getElementById('assignments-table-body');
const supportTable = document.getElementById('support-table-body');
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
            case 'Aprobado':
            case 'Resuelto':
            case 'Atendido':
                span.classList.add('status-approved');
                break;
            case 'Rechazado':
                span.classList.add('status-rejected');
                break;
            case 'Pendiente':
                span.classList.add('status-pending');
                break;
            default:
                span.classList.add('process');
        }
        span.textContent = status;
        return span;
    }

    // 1. Cargar solicitudes reales (Becas)
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
                spanComp.classList.add('text-muted-small');
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

    // 2. Cargar solicitudes de Soporte y Ayuda
    function renderSupportRequests() {
        if (!supportTable) return;

        const supportRequests = JSON.parse(localStorage.getItem('support_requests')) || [];
        supportTable.innerHTML = '';

        if (supportRequests.length === 0) {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '6');
            td.classList.add('text-center');
            td.textContent = 'No hay solicitudes de soporte pendientes.';
            row.appendChild(td);
            supportTable.appendChild(row);
            return;
        }

        supportRequests.forEach(req => {
            const row = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = req.id.toString().slice(-6);

            const tdName = document.createElement('td');
            const nameDiv = document.createElement('div');
            nameDiv.style.fontWeight = 'bold';
            nameDiv.textContent = req.nombre;
            const emailDiv = document.createElement('div');
            emailDiv.style.fontSize = '0.8rem';
            emailDiv.style.color = '#666';
            emailDiv.textContent = req.email;
            tdName.appendChild(nameDiv);
            tdName.appendChild(emailDiv);

            const tdMsg = document.createElement('td');
            const asuntoDiv = document.createElement('div');
            asuntoDiv.style.fontWeight = 'bold';
            asuntoDiv.textContent = req.asunto || 'Consulta';
            const msgDiv = document.createElement('div');
            msgDiv.style.fontSize = '0.85rem';
            msgDiv.textContent = req.mensaje.length > 50 ? req.mensaje.substring(0, 50) + '...' : req.mensaje;
            tdMsg.appendChild(asuntoDiv);
            tdMsg.appendChild(msgDiv);

            const tdDate = document.createElement('td');
            tdDate.textContent = req.fecha;

            const tdStatus = document.createElement('td');
            tdStatus.appendChild(createStatusTag(req.status));

            const tdActions = document.createElement('td');
            const actionsContainer = document.createElement('div');
            actionsContainer.style.display = 'flex';
            actionsContainer.style.gap = '5px';

            if (req.status === 'Pendiente') {
                const btnAccept = document.createElement('button');
                btnAccept.classList.add('btn-modal-send');
                btnAccept.style.padding = '5px 10px';
                btnAccept.style.fontSize = '0.8rem';
                btnAccept.style.background = '#10b981';
                btnAccept.textContent = 'Aceptar';
                btnAccept.onclick = () => acceptSupportRequest(req.id);
                actionsContainer.appendChild(btnAccept);

                const btnDeny = document.createElement('button');
                btnDeny.classList.add('btn-modal-delete');
                btnDeny.style.padding = '5px 10px';
                btnDeny.style.fontSize = '0.8rem';
                btnDeny.style.background = '#f44336';
                btnDeny.style.color = 'white';
                btnDeny.textContent = 'Denegar';
                btnDeny.onclick = () => denySupportRequest(req.id);
                actionsContainer.appendChild(btnDeny);
            }

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn-modal-delete');
            btnDelete.style.padding = '5px 10px';
            btnDelete.style.fontSize = '0.8rem';
            btnDelete.textContent = 'Eliminar';
            btnDelete.onclick = () => deleteSupportRequest(req.id);
            actionsContainer.appendChild(btnDelete);

            tdActions.appendChild(actionsContainer);

            row.appendChild(tdId);
            row.appendChild(tdName);
            row.appendChild(tdMsg);
            row.appendChild(tdDate);
            row.appendChild(tdStatus);
            row.appendChild(tdActions);

            supportTable.appendChild(row);
        });
    }

    // Acciones de soporte
    window.acceptSupportRequest = function (id) {
        let supportRequests = JSON.parse(localStorage.getItem('support_requests')) || [];
        const index = supportRequests.findIndex(r => r.id === id);
        if (index !== -1) {
            supportRequests[index].status = 'Atendido';
            localStorage.setItem('support_requests', JSON.stringify(supportRequests));
            renderSupportRequests();
            updateStats();
        }
    };

    window.denySupportRequest = function (id) {
        if (confirm('¿Estás seguro de que deseas denegar esta solicitud?')) {
            let supportRequests = JSON.parse(localStorage.getItem('support_requests')) || [];
            const index = supportRequests.findIndex(r => r.id === id);
            if (index !== -1) {
                supportRequests[index].status = 'Rechazado';
                localStorage.setItem('support_requests', JSON.stringify(supportRequests));
                renderSupportRequests();
                updateStats();
            }
        }
    };

    window.deleteSupportRequest = function (id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
            let supportRequests = JSON.parse(localStorage.getItem('support_requests')) || [];
            supportRequests = supportRequests.filter(r => r.id !== id);
            localStorage.setItem('support_requests', JSON.stringify(supportRequests));
            renderSupportRequests();
            updateStats();
        }
    };

    // 3. Abrir formulario de dictamen (Becas)
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

    // 4. Procesar Evaluación (Becas)
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
                updateStats();
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
        const pendingApplications = applications.filter(a => a.status === 'Pendiente');
        const supportRequests = JSON.parse(localStorage.getItem('support_requests')) || [];
        const pendingSupport = supportRequests.filter(r => r.status === 'Pendiente');

        if (statEvalAsignaciones) statEvalAsignaciones.innerText = pendingApplications.length;
        if (statEvalSoporte) statEvalSoporte.innerText = pendingSupport.length;
    }

    // Inicialización
    renderAssignments();
    renderSupportRequests();
    updateStats();
});

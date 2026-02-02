// Lógica para el Panel del Postulante
document.addEventListener('DOMContentLoaded', () => {
    const applyForm = document.getElementById('apply-form');
    const applicationTable = document.getElementById('application-table-body');
    const scholarshipSelect = document.getElementById('scholarship-select');
    const applicationModule = document.getElementById('application-module');
    const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud');
    const btnCerrarForm = document.getElementById('btn-cerrar-form');
    const btnCancelarForm = document.getElementById('btn-cancelar-postulacion');
    const btnLogout = document.getElementById('btn-logout-panel');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) return;

    // 1. Cargar Becas en el Select
    function loadScholarships() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        if (scholarshipSelect) {
            scholarshipSelect.innerHTML = '';
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            defaultOpt.textContent = 'Elige una beca...';
            scholarshipSelect.appendChild(defaultOpt);

            scholarships.forEach(beca => {
                const option = document.createElement('option');
                option.value = beca.name;
                option.textContent = beca.name;
                scholarshipSelect.appendChild(option);
            });
        }
    }

    // Helper para estados
    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'Rechazado': return 'status-rejected';
            case 'Pendiente': return 'status-pending';
            default: return 'process';
        }
    }

    // 2. Renderizar historial
    function renderApplications() {
        if (!applicationTable) return;

        const allApplications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const myApps = allApplications.filter(app => app.applicantEmail === currentUser.email);

        applicationTable.innerHTML = '';

        if (myApps.length === 0) {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '6');
            td.classList.add('text-center');
            td.textContent = 'No tienes solicitudes enviadas aún.';
            row.appendChild(td);
            applicationTable.appendChild(row);
            return;
        }

        myApps.forEach(app => {
            const row = document.createElement('tr');

            const tdFolio = document.createElement('td');
            const strongFolio = document.createElement('strong');
            strongFolio.textContent = app.folio;
            tdFolio.appendChild(strongFolio);

            const tdScho = document.createElement('td');
            tdScho.textContent = app.scholarship;

            const tdDate = document.createElement('td');
            tdDate.textContent = app.date;

            const tdStatus = document.createElement('td');
            const spanStatus = document.createElement('span');
            spanStatus.classList.add('status-tag', getStatusClass(app.status));
            spanStatus.textContent = app.status;
            tdStatus.appendChild(spanStatus);

            const tdObs = document.createElement('td');
            if (app.evalInfo && app.evalInfo.observations) {
                const divObs = document.createElement('div');
                divObs.classList.add('obs-text'); // Nueva clase en CSS
                divObs.textContent = `"${app.evalInfo.observations}"`;
                tdObs.appendChild(divObs);
            } else {
                const spanNone = document.createElement('span');
                spanNone.classList.add('text-muted-italic'); // Nueva clase
                spanNone.textContent = 'Sin observaciones';
                tdObs.appendChild(spanNone);
            }

            const tdActions = document.createElement('td');
            const btnEdit = document.createElement('button');
            btnEdit.classList.add('btn-icon', 'edit');
            btnEdit.title = 'Editar Solicitud';
            btnEdit.textContent = '✏️';
            tdActions.appendChild(btnEdit);

            row.appendChild(tdFolio);
            row.appendChild(tdScho);
            row.appendChild(tdDate);
            row.appendChild(tdStatus);
            row.appendChild(tdObs);
            row.appendChild(tdActions);

            applicationTable.appendChild(row);
        });
    }

    // 3. Eventos de UI
    if (btnNuevaSolicitud) {
        btnNuevaSolicitud.addEventListener('click', () => {
            applicationModule.classList.remove('hidden');
            applicationModule.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnCerrarForm) btnCerrarForm.addEventListener('click', () => applicationModule.classList.add('hidden'));
    if (btnCancelarForm) btnCancelarForm.addEventListener('click', () => applicationModule.classList.add('hidden'));

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // 4. Envío de Formulario
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newApplication = {
                folio: 'B-' + Math.floor(Math.random() * 90000 + 10000),
                applicantName: currentUser.fullname,
                applicantEmail: currentUser.email,
                scholarship: scholarshipSelect.value,
                date: new Date().toLocaleDateString(),
                status: 'Pendiente',
                phone: document.getElementById('phone').value,
                average: document.getElementById('average').value,
                institution: document.getElementById('institution').value,
                grade: document.getElementById('career').value,
                income: document.getElementById('income').value,
                housingStatus: document.getElementById('housing').value,
                reason: document.getElementById('reason').value,
                evalInfo: null
            };

            const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
            applications.push(newApplication);
            localStorage.setItem('scholarship_applications', JSON.stringify(applications));

            alert('¡Solicitud enviada con éxito! El folio de tu trámite es: ' + newApplication.folio);
            applyForm.reset();
            applicationModule.classList.add('hidden');
            renderApplications();
        });
    }

    // Inicialización
    loadScholarships();
    renderApplications();
});

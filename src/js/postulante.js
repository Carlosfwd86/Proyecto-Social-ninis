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

            const scholarship = scholarshipSelect ? scholarshipSelect.value : (document.getElementById('beca-select')?.value || document.getElementById('ayuda-select')?.value);

            const applicationData = {
                folio: 'B-' + Math.floor(Math.random() * 90000 + 10000),
                applicantName: currentUser.fullname,
                applicantEmail: currentUser.email,
                scholarship: scholarship,
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

            mostrarConfirmacionPostulacion(applicationData, applyForm);
        });
    }

    /**
     * Modal de Confirmación previo al envío
     */
    function mostrarConfirmacionPostulacion(data, form) {
        const overlay = document.createElement('div');
        overlay.classList.add('support-modal-overlay');

        const modal = document.createElement('div');
        modal.classList.add('support-modal-content');

        const titulo = document.createElement('h2');
        titulo.classList.add('support-modal-title');
        titulo.textContent = 'Confirmar Postulación';

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('support-modal-info');

        const createDataRow = (label, value) => {
            const row = document.createElement('div');
            row.classList.add('support-modal-row');
            const lSpan = document.createElement('span');
            lSpan.classList.add('support-modal-label');
            lSpan.textContent = label + ':';
            const vSpan = document.createElement('span');
            vSpan.textContent = value;
            row.appendChild(lSpan);
            row.appendChild(vSpan);
            return row;
        };

        infoContainer.appendChild(createDataRow('Beca/Ayuda', data.scholarship));
        infoContainer.appendChild(createDataRow('Institución', data.institution));
        infoContainer.appendChild(createDataRow('Promedio', data.average));
        infoContainer.appendChild(createDataRow('Teléfono', data.phone));

        const disclaimer = document.createElement('div');
        disclaimer.classList.add('support-disclaimer');
        disclaimer.textContent = 'Al confirmar, su solicitud será enviada al comité evaluador. Asegúrese de haber cargado la documentación correcta.';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('support-modal-actions');

        const btnEnviar = document.createElement('button');
        btnEnviar.textContent = 'Confirmar y Enviar';
        btnEnviar.classList.add('btn-modal', 'btn-modal-send');

        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Regresar';
        btnCancelar.classList.add('btn-modal', 'btn-modal-delete');

        btnEnviar.addEventListener('click', () => {
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';

            setTimeout(() => {
                const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
                applications.push(data);
                localStorage.setItem('scholarship_applications', JSON.stringify(applications));

                document.body.removeChild(overlay);
                document.body.classList.remove('modal-open');

                mostrarAlertaExitoPostulacion(data.folio);
                form.reset();
                applicationModule.classList.add('hidden');
                renderApplications();
            }, 1000);
        });

        btnCancelar.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.classList.remove('modal-open');
        });

        buttonContainer.appendChild(btnCancelar);
        buttonContainer.appendChild(btnEnviar);
        modal.appendChild(titulo);
        modal.appendChild(infoContainer);
        modal.appendChild(disclaimer);
        modal.appendChild(buttonContainer);
        overlay.appendChild(modal);

        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');
    }

    /**
     * Alerta de éxito post-envío
     */
    function mostrarAlertaExitoPostulacion(folio) {
        const overlay = document.createElement('div');
        overlay.classList.add('support-modal-overlay');
        overlay.style.zIndex = '10000';

        const modal = document.createElement('div');
        modal.classList.add('support-modal-content');
        modal.style.textAlign = 'center';

        const icon = document.createElement('div');
        icon.innerHTML = '✅';
        icon.style.fontSize = '3rem';
        icon.style.marginBottom = '20px';

        const title = document.createElement('h2');
        title.classList.add('support-modal-title');
        title.textContent = '¡Solicitud Recibida!';

        const message = document.createElement('p');
        message.innerHTML = `Tu postulación se ha registrado con éxito.<br>Folio de seguimiento: <strong>${folio}</strong>`;
        message.style.marginBottom = '20px';

        const btnCerrar = document.createElement('button');
        btnCerrar.textContent = 'Finalizar';
        btnCerrar.classList.add('btn-modal', 'btn-modal-send');
        btnCerrar.style.width = '100%';

        btnCerrar.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.classList.remove('modal-open');
        });

        modal.appendChild(icon);
        modal.appendChild(title);
        modal.appendChild(message);
        modal.appendChild(btnCerrar);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        document.body.classList.add('modal-open');
    }

    // 5. Renderizar consultas de soporte
    function renderSupportRequests() {
        const supportTable = document.getElementById('support-table-body');
        if (!supportTable) return;

        const allSupport = JSON.parse(localStorage.getItem('support_requests')) || [];
        const mySupport = allSupport.filter(req => req.email === currentUser.email);

        supportTable.innerHTML = '';

        if (mySupport.length === 0) {
            const row = document.createElement('tr');
            const td = document.createElement('td');
            td.setAttribute('colspan', '3');
            td.classList.add('text-center');
            td.textContent = 'No has enviado consultas de soporte aún.';
            row.appendChild(td);
            supportTable.appendChild(row);
            return;
        }

        mySupport.forEach(req => {
            const row = document.createElement('tr');

            const tdDate = document.createElement('td');
            tdDate.textContent = req.fecha;

            const tdMsg = document.createElement('td');
            tdMsg.textContent = req.mensaje.length > 50 ? req.mensaje.substring(0, 50) + '...' : req.mensaje;
            tdMsg.title = req.mensaje;

            const tdStatus = document.createElement('td');
            const spanStatus = document.createElement('span');
            spanStatus.classList.add('status-tag', getStatusClass(req.status));
            spanStatus.textContent = req.status;
            tdStatus.appendChild(spanStatus);

            row.appendChild(tdDate);
            row.appendChild(tdMsg);
            row.appendChild(tdStatus);

            supportTable.appendChild(row);
        });
    }

    // Inicialización
    loadScholarships();
    renderApplications();
    renderSupportRequests();
});

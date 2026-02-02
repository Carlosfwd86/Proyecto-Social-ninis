const scholarshipForm = document.getElementById('scholarship-form');
const scholarshipTable = document.getElementById('scholarship-table-body');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit-form');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const hiddenId = document.getElementById('scholarship-id');
const evaluatorForm = document.getElementById('evaluator-form');
const evaluadoresContainer = document.getElementById('evaluadores-container');
const sedeForm = document.getElementById('sede-form');
const sedeTableBody = document.getElementById('sede-table-body');
const hiddenSedeId = document.getElementById('sede-id');
const btnCancelSede = document.getElementById('btn-cancel-sede');
const btnSaveSede = document.getElementById('btn-save-sede');
const statBecas = document.getElementById('stat-becas');
const statSolicitudes = document.getElementById('stat-solicitudes');
const statAprobados = document.getElementById('stat-aprobados');
const statSoporte = document.getElementById('stat-soporte');
const btnLogout = document.getElementById('btn-logout-admin');

// Lógica Integral para el Panel de Administración
document.addEventListener('DOMContentLoaded', () => {

    // Helper para crear botones de icono
    function createIconButton(icon, className, title, onClick) {
        const btn = document.createElement('button');
        btn.classList.add('btn-icon', className);
        btn.textContent = icon;
        btn.title = title;
        if (onClick) btn.onclick = onClick;
        return btn;
    }


    // --- 1. GESTIÓN DE BECAS ---

    function renderScholarships() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        if (!scholarshipTable) return;
        scholarshipTable.innerHTML = '';

        scholarships.forEach(beca => {
            const row = document.createElement('tr');

            const tdName = document.createElement('td');
            const strongName = document.createElement('strong');
            strongName.textContent = beca.name;
            tdName.appendChild(strongName);

            const tdCategory = document.createElement('td');
            const badgeCat = document.createElement('span');
            badgeCat.classList.add('badge');
            if (beca.category === 'Nacional') badgeCat.classList.add('bg-green');
            else if (beca.category !== 'Internacional') badgeCat.classList.add('bg-purple');
            badgeCat.textContent = beca.category;
            tdCategory.appendChild(badgeCat);

            const tdFunding = document.createElement('td');
            tdFunding.textContent = beca.funding;

            const tdDeadline = document.createElement('td');
            tdDeadline.textContent = beca.deadline;

            const tdStatus = document.createElement('td');
            const statusTag = document.createElement('span');
            statusTag.classList.add('status-tag');
            statusTag.classList.add(beca.status === 'Abierta' ? 'status-active' : 'status-closed');
            statusTag.textContent = beca.status;
            tdStatus.appendChild(statusTag);

            const tdActions = document.createElement('td');
            tdActions.appendChild(createIconButton('✏️', 'edit', 'Editar', () => prepareEditScholarship(beca.id)));
            tdActions.appendChild(createIconButton('🗑️', 'delete', 'Eliminar', () => deleteScholarship(beca.id)));

            row.appendChild(tdName);
            row.appendChild(tdCategory);
            row.appendChild(tdFunding);
            row.appendChild(tdDeadline);
            row.appendChild(tdStatus);
            row.appendChild(tdActions);

            scholarshipTable.appendChild(row);
        });
        updateStats();
    }

    if (scholarshipForm) {
        scholarshipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = hiddenId.value;
            const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];

            const becaData = {
                id: id ? parseInt(id) : Date.now(),
                name: document.getElementById('scholarship-name').value,
                category: document.getElementById('scholarship-category').value,
                funding: document.getElementById('scholarship-funding').value,
                deadline: document.getElementById('scholarship-deadline').value,
                status: document.getElementById('scholarship-status').value,
                minAvg: document.getElementById('scholarship-min-avg').value,
                description: document.getElementById('scholarship-description').value
            };

            if (id) {
                const index = scholarships.findIndex(b => b.id === parseInt(id));
                scholarships[index] = becaData;
                window.mostrarAlerta({
                    title: '¡Actualizado!',
                    message: 'La convocatoria ha sido actualizada exitosamente.',
                    icon: 'fa-check-circle'
                });
            } else {
                scholarships.push(becaData);
                window.mostrarAlerta({
                    title: '¡Publicado!',
                    message: 'La nueva convocatoria ya se encuentra disponible en el portal.',
                    icon: 'fa-bullhorn'
                });
            }

            localStorage.setItem('scholarships', JSON.stringify(scholarships));
            resetBecaForm();
            renderScholarships();
        });
    }

    window.prepareEditScholarship = function (id) {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        const beca = scholarships.find(b => b.id === id);

        if (beca) {
            hiddenId.value = beca.id;
            document.getElementById('scholarship-name').value = beca.name;
            document.getElementById('scholarship-category').value = beca.category;
            document.getElementById('scholarship-funding').value = beca.funding;
            document.getElementById('scholarship-deadline').value = beca.deadline;
            document.getElementById('scholarship-status').value = beca.status;
            document.getElementById('scholarship-min-avg').value = beca.minAvg || "";
            document.getElementById('scholarship-description').value = beca.description;

            formTitle.innerText = "Editando Convocatoria";
            btnSubmit.innerText = "Guardar Cambios";
            btnCancelEdit.classList.remove('hidden-element');
            btnCancelEdit.classList.add('visible-inline');
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    if (btnCancelEdit) btnCancelEdit.addEventListener('click', resetBecaForm);

    function resetBecaForm() {
        scholarshipForm.reset();
        hiddenId.value = "";
        formTitle.innerText = "Añadir Nueva Convocatoria";
        btnSubmit.innerText = "Publicar Beca";
        btnCancelEdit.classList.remove('visible-inline');
    }

    window.deleteScholarship = function (id) {
        window.mostrarConfirmacion({
            title: '¿Eliminar Convocatoria?',
            message: '¿Estás seguro de que deseas eliminar esta beca permanentemente? Esta acción no se puede deshacer.',
            type: 'danger',
            icon: 'fa-trash-can',
            confirmText: 'Eliminar',
            onConfirm: () => {
                let scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
                scholarships = scholarships.filter(b => b.id !== id);
                localStorage.setItem('scholarships', JSON.stringify(scholarships));
                renderScholarships();
            }
        });
    };

    // --- 2. GESTIÓN DE EVALUADORES ---

    function renderEvaluators() {
        const users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
        const evaluators = users.filter(u => u.role === 'evaluador' || u.username === 'evaluador');

        if (!evaluadoresContainer) return;
        evaluadoresContainer.innerHTML = '';
        evaluators.forEach(evaluator => {
            const card = document.createElement('article');
            card.className = 'evaluador-card';

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('eval-info');

            const h3 = document.createElement('h3');
            h3.textContent = evaluator.fullname || evaluator.username;

            const p = document.createElement('p');
            p.textContent = `Acceso: ${evaluator.username}`;

            const spanBadge = document.createElement('span');
            spanBadge.classList.add('badge-eval');
            spanBadge.textContent = 'Evaluador Activo';

            infoDiv.appendChild(h3);
            infoDiv.appendChild(p);
            infoDiv.appendChild(spanBadge);

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('eval-actions');

            const btnDelete = document.createElement('button');
            btnDelete.classList.add('btn-text-danger');
            btnDelete.textContent = 'Dar de baja';
            btnDelete.onclick = () => deleteEvaluator(evaluator.username);

            actionsDiv.appendChild(btnDelete);

            card.appendChild(infoDiv);
            card.appendChild(actionsDiv);
            evaluadoresContainer.appendChild(card);
        });
    }

    if (evaluatorForm) {
        evaluatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newUser = {
                fullname: document.getElementById('eval-name').value,
                username: document.getElementById('eval-user').value,
                password: document.getElementById('eval-pass').value,
                role: 'evaluador',
                email: `${document.getElementById('eval-user').value}@sistema.com`
            };

            const users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
            if (users.find(u => u.username === newUser.username)) {
                window.mostrarAlerta({
                    title: 'Error de Usuario',
                    message: 'El nombre de usuario ya existe en el sistema.',
                    type: 'danger',
                    icon: 'fa-circle-xmark'
                });
                return;
            }

            users.push(newUser);
            localStorage.setItem('scholarship_users', JSON.stringify(users));
            window.mostrarAlerta({
                title: 'Registro Exitoso',
                message: 'El nuevo evaluador ha sido registrado correctamente.',
                icon: 'fa-user-check'
            });
            evaluatorForm.reset();
            renderEvaluators();
        });
    }

    window.deleteEvaluator = function (username) {
        window.mostrarConfirmacion({
            title: '¿Sueldo de Baja?',
            message: `¿Estás seguro de que deseas dar de baja al evaluador ${username}? Sus accesos serán revocados.`,
            type: 'danger',
            icon: 'fa-user-minus',
            confirmText: 'Confirmar Baja',
            onConfirm: () => {
                let users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
                users = users.filter(u => u.username !== username);
                localStorage.setItem('scholarship_users', JSON.stringify(users));
                renderEvaluators();
            }
        });
    };

    // --- 3. GESTIÓN DE SEDES ---

    function renderSedes() {
        const sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];
        if (!sedeTableBody) return;
        sedeTableBody.innerHTML = '';

        sedes.forEach(sede => {
            const row = document.createElement('tr');

            const tdSede = document.createElement('td');
            const strongSede = document.createElement('strong');
            strongSede.textContent = sede.nombre;
            tdSede.appendChild(strongSede);

            const tdDir = document.createElement('td');
            tdDir.textContent = sede.direccion;

            const tdEnc = document.createElement('td');
            tdEnc.textContent = sede.encargado;

            const tdActions = document.createElement('td');
            tdActions.appendChild(createIconButton('✏️', 'edit', 'Editar', () => prepareEditSede(sede.id)));
            tdActions.appendChild(createIconButton('🗑️', 'delete', 'Eliminar', () => deleteSede(sede.id)));

            row.appendChild(tdSede);
            row.appendChild(tdDir);
            row.appendChild(tdEnc);
            row.appendChild(tdActions);

            sedeTableBody.appendChild(row);
        });
    }

    if (sedeForm) {
        sedeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = hiddenSedeId.value;
            const sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];

            const sedeData = {
                id: id ? parseInt(id) : Date.now(),
                nombre: document.getElementById('sede-nombre').value,
                direccion: document.getElementById('sede-direccion').value,
                encargado: document.getElementById('sede-encargado').value
            };

            if (id) {
                const index = sedes.findIndex(s => s.id === parseInt(id));
                sedes[index] = sedeData;
                window.mostrarAlerta({
                    title: 'Sede Actualizada',
                    message: 'Los cambios en la sede se han guardado correctamente.',
                    icon: 'fa-building-circle-check'
                });
            } else {
                sedes.push(sedeData);
                window.mostrarAlerta({
                    title: 'Sede Registrada',
                    message: 'La nueva sede ha sido añadida exitosamente.',
                    icon: 'fa-map-location-dot'
                });
            }

            localStorage.setItem('scholarship_sedes', JSON.stringify(sedes));
            resetSedeForm();
            renderSedes();
        });
    }

    window.prepareEditSede = function (id) {
        const sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];
        const sede = sedes.find(s => s.id === id);
        if (sede) {
            hiddenSedeId.value = sede.id;
            document.getElementById('sede-nombre').value = sede.nombre;
            document.getElementById('sede-direccion').value = sede.direccion;
            document.getElementById('sede-encargado').value = sede.encargado;

            btnSaveSede.innerText = "Actualizar Sede";
            btnCancelSede.classList.add('visible-inline');
        }
    };

    if (btnCancelSede) btnCancelSede.addEventListener('click', resetSedeForm);

    function resetSedeForm() {
        sedeForm.reset();
        hiddenSedeId.value = "";
        btnSaveSede.innerText = "Guardar Sede";
        btnCancelSede.classList.remove('visible-inline');
    }

    window.deleteSede = function (id) {
        window.mostrarConfirmacion({
            title: '¿Eliminar Sede?',
            message: '¿Estás seguro de que deseas eliminar esta sede del sistema?',
            type: 'danger',
            icon: 'fa-building-circle-xmark',
            confirmText: 'Eliminar',
            onConfirm: () => {
                let sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];
                sedes = sedes.filter(s => s.id !== id);
                localStorage.setItem('scholarship_sedes', JSON.stringify(sedes));
                renderSedes();
            }
        });
    };

    // --- 4. ESTADÍSTICAS ---

    function updateStats() {
        const becas = JSON.parse(localStorage.getItem('scholarships')) || [];
        const solicitudes = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const aprobados = solicitudes.filter(s => s.status === 'Aprobado');
        const soporte = JSON.parse(localStorage.getItem('support_requests')) || [];

        if (statBecas) statBecas.innerText = becas.length;
        if (statSolicitudes) statSolicitudes.innerText = solicitudes.length;
        if (statAprobados) statAprobados.innerText = aprobados.length;
        if (statSoporte) statSoporte.innerText = soporte.length;
    }

    // --- 5. GESTIÓN DE SOLICITUDES DE BECAS ---

    let currentAppFolio = null;
    const applicationsTableBody = document.getElementById('applications-table-body');
    const evaluationPanelAdmin = document.getElementById('evaluation-details-admin');
    const evaluationFormAdmin = document.getElementById('evaluation-form-admin');

    function renderApplications() {
        if (!applicationsTableBody) return;
        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        applicationsTableBody.innerHTML = '';

        if (applications.length === 0) {
            applicationsTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay solicitudes registradas.</td></tr>';
            return;
        }

        applications.forEach(app => {
            const row = document.createElement('tr');
            const statusClass = app.status === 'Aprobado' ? 'status-active' : (app.status === 'Rechazado' ? 'status-closed' : 'bg-yellow');

            row.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>${app.applicantName}</td>
                <td>${app.scholarship}</td>
                <td>${app.date}</td>
                <td><span class="status-tag ${statusClass}">${app.status}</span></td>
                <td>
                    <div style="display:flex; gap: 8px;">
                        <button class="btn-icon edit" title="Evaluar/Ver" onclick="openApplicationDetails('${app.folio}')">🔍</button>
                        <button class="btn-icon delete" title="Eliminar" onclick="deleteApplication('${app.folio}')">🗑️</button>
                    </div>
                </td>
            `;
            applicationsTableBody.appendChild(row);
        });
    }

    window.openApplicationDetails = function (folio) {
        currentAppFolio = folio;
        const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        const app = applications.find(a => a.folio === folio);

        if (app) {
            document.getElementById('info-folio-admin').innerText = app.folio;
            document.getElementById('info-nombre-admin').innerText = app.applicantName;
            document.getElementById('info-telefono-admin').innerText = app.phone || 'N/A';
            document.getElementById('info-institucion-admin').innerText = app.institution || 'N/A';
            document.getElementById('info-carrera-admin').innerText = app.grade || 'N/A';
            document.getElementById('info-promedio-admin').innerText = app.average || 'N/A';
            document.getElementById('info-ingresos-admin').innerText = app.income ? `$${app.income}` : 'N/A';
            document.getElementById('info-vivienda-admin').innerText = app.housingStatus || 'N/A';
            document.getElementById('info-motivos-admin').innerText = app.reason || 'Sin exposición de motivos.';

            const linkId = document.getElementById('link-doc-id-admin');
            const linkKardex = document.getElementById('link-doc-kardex-admin');

            if (app.documents && app.documents.id) {
                linkId.href = app.documents.id;
                linkId.classList.remove('hidden-element');
            } else {
                linkId.classList.add('hidden-element');
            }

            if (app.documents && app.documents.kardex) {
                linkKardex.href = app.documents.kardex;
                linkKardex.classList.remove('hidden-element');
            } else {
                linkKardex.classList.add('hidden-element');
            }

            document.getElementById('score-admin').value = app.evalInfo?.score || '';
            document.getElementById('outcome-admin').value = app.status || 'Pendiente';
            document.getElementById('observations-admin').value = app.evalInfo?.observations || '';

            evaluationPanelAdmin.classList.remove('hidden-element');
            evaluationPanelAdmin.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (evaluationFormAdmin) {
        evaluationFormAdmin.addEventListener('submit', (e) => {
            e.preventDefault();
            const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
            const index = applications.findIndex(a => a.folio === currentAppFolio);

            if (index !== -1) {
                const outcome = document.getElementById('outcome-admin').value;
                applications[index].status = outcome;
                applications[index].evalInfo = {
                    score: document.getElementById('score-admin').value,
                    observations: document.getElementById('observations-admin').value,
                    evalDate: new Date().toLocaleDateString(),
                    evalBy: 'Admin'
                };

                localStorage.setItem('scholarship_applications', JSON.stringify(applications));
                window.mostrarAlerta({
                    title: 'Dictamen Guardado',
                    message: `La solicitud con folio ${currentAppFolio} ha sido marcada como ${outcome}.`,
                    icon: 'fa-clipboard-check'
                });

                evaluationPanelAdmin.classList.add('hidden-element');
                renderApplications();
                updateStats();
            }
        });
    }

    document.getElementById('btn-cerrar-eval-admin')?.addEventListener('click', () => {
        evaluationPanelAdmin.classList.add('hidden-element');
    });

    window.deleteApplication = function (folio) {
        window.mostrarConfirmacion({
            title: '¿Eliminar Solicitud?',
            message: `¿Estás seguro de que deseas eliminar permanentemente el expediente con folio ${folio}?`,
            type: 'danger',
            icon: 'fa-file-circle-xmark',
            confirmText: 'Eliminar',
            onConfirm: () => {
                let applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
                applications = applications.filter(a => a.folio !== folio);
                localStorage.setItem('scholarship_applications', JSON.stringify(applications));
                renderApplications();
                updateStats();
            }
        });
    };

    // --- 6. GESTIÓN DE SOPORTE ---

    window.renderSupportRequests = function () {
        const supportTable = document.getElementById('support-table-body');
        if (!supportTable) return;

        const requests = JSON.parse(localStorage.getItem('support_requests')) || [];
        supportTable.innerHTML = '';

        requests.forEach(req => {
            const row = document.createElement('tr');

            const tdFecha = document.createElement('td');
            const smallFecha = document.createElement('small');
            smallFecha.textContent = req.fecha;
            tdFecha.appendChild(smallFecha);

            const tdUser = document.createElement('td');
            const strongUser = document.createElement('strong');
            strongUser.textContent = req.nombre;
            const br = document.createElement('br');
            const smallEmail = document.createElement('small');
            smallEmail.classList.add('text-muted');
            smallEmail.textContent = req.email;
            tdUser.appendChild(strongUser);
            tdUser.appendChild(br);
            tdUser.appendChild(smallEmail);

            const tdMsg = document.createElement('td');
            tdMsg.classList.add('text-truncate');
            const divMsg = document.createElement('div');
            divMsg.classList.add('msg-content');
            divMsg.textContent = req.mensaje;
            tdMsg.appendChild(divMsg);

            const tdStatus = document.createElement('td');
            const statusTag = document.createElement('span');
            statusTag.classList.add('status-tag');
            if (req.status === 'Aceptada') statusTag.classList.add('status-active');
            else if (req.status === 'Denegada') statusTag.classList.add('bg-red');
            else statusTag.classList.add('bg-yellow');
            statusTag.textContent = req.status;
            tdStatus.appendChild(statusTag);

            const tdActions = document.createElement('td');
            if (req.status === 'Pendiente') {
                tdActions.appendChild(createIconButton('✅', 'edit', 'Aceptar', () => updateSupportStatus(req.id, 'Aceptada')));
                tdActions.appendChild(createIconButton('❌', 'delete', 'Denegar', () => updateSupportStatus(req.id, 'Denegada')));
            } else {
                const btnDel = document.createElement('button');
                btnDel.classList.add('btn-text-danger');
                btnDel.textContent = 'Eliminar';
                btnDel.onclick = () => deleteSupportRequest(req.id);
                tdActions.appendChild(btnDel);
            }

            row.appendChild(tdFecha);
            row.appendChild(tdUser);
            row.appendChild(tdMsg);
            row.appendChild(tdStatus);
            row.appendChild(tdActions);

            supportTable.appendChild(row);
        });
    };

    window.updateSupportStatus = function (id, newStatus) {
        let requests = JSON.parse(localStorage.getItem('support_requests')) || [];
        const index = requests.findIndex(r => r.id === id);
        if (index !== -1) {
            requests[index].status = newStatus;
            localStorage.setItem('support_requests', JSON.stringify(requests));
            renderSupportRequests();
            window.mostrarAlerta({
                title: 'Estado Actualizado',
                message: `La solicitud de soporte ha sido ${newStatus.toLowerCase()} correctamente.`,
                icon: newStatus === 'Aceptada' ? 'fa-circle-check' : 'fa-circle-xmark',
                type: newStatus === 'Aceptada' ? 'primary' : 'danger'
            });
            updateStats();
        }
    };

    window.deleteSupportRequest = function (id) {
        window.mostrarConfirmacion({
            title: '¿Eliminar Registro?',
            message: '¿Estás seguro de que deseas eliminar este registro de soporte?',
            type: 'danger',
            icon: 'fa-file-circle-xmark',
            confirmText: 'Eliminar',
            onConfirm: () => {
                let requests = JSON.parse(localStorage.getItem('support_requests')) || [];
                requests = requests.filter(r => r.id !== id);
                localStorage.setItem('support_requests', JSON.stringify(requests));
                renderSupportRequests();
                updateStats();
            }
        });
    };

    // Inicialización Global
    renderScholarships();
    renderEvaluators();
    renderSedes();
    renderSupportRequests();
    renderApplications();

    if (btnLogout) btnLogout.addEventListener('click', (e) => window.cerrarSesion(e));
});

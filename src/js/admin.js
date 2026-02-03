const scholarshipForm = document.getElementById('form-beca');
const scholarshipTable = document.getElementById('tabla-becas');
const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit-form');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const hiddenId = document.getElementById('scholarship-id');
const evaluatorForm = document.getElementById('form-evaluador');
const evaluadoresContainer = document.getElementById('tabla-evaluadores');
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
                name: document.getElementById('nombre-beca').value,
                category: document.getElementById('tipo-beca').value,
                funding: document.getElementById('monto-beca').value,
                deadline: document.getElementById('fecha-cierre').value,
                status: 'Abierta', // Default or derived from date
                minAvg: document.getElementById('promedio-minimo').value,
                description: document.getElementById('descripcion-beca').value
            };

            if (id) {
                const index = scholarships.findIndex(b => b.id === parseInt(id));
                scholarships[index] = becaData;
                alert('Convocatoria actualizada exitosamente.');
            } else {
                scholarships.push(becaData);
                alert('Nueva convocatoria publicada.');
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
            document.getElementById('nombre-beca').value = beca.name;
            document.getElementById('descripcion-beca').value = beca.description;
            document.getElementById('tipo-beca').value = beca.category;
            document.getElementById('monto-beca').value = beca.funding;
            // document.getElementById('duracion-beca').value = beca.duration; // Field exists in HTML
            document.getElementById('fecha-cierre').value = beca.deadline;
            document.getElementById('promedio-minimo').value = beca.minAvg || "";

            formTitle.innerText = "Editando Convocatoria";
            btnSubmit.innerText = "Guardar Cambios";
            btnCancelEdit.classList.remove('hidden-element'); // Usar clase en lugar de .style
            // Para mantener compatibilidad si no existe la clase, usaremos toggle o similar si se define, 
            // pero el usuario pidió NO usar CSS en JS.
            // Asumiremos que el CSS maneja la visibilidad si aplicamos una clase.
            // Por ahora, para no romper funcionalidad si no hay CSS de visibilidad, 
            // usaré una clase que el usuario pueda ver.
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
        if (confirm('¿Eliminar esta beca permanentemente?')) {
            let scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
            scholarships = scholarships.filter(b => b.id !== id);
            localStorage.setItem('scholarships', JSON.stringify(scholarships));
            renderScholarships();
        }
    };

    // --- 2. GESTIÓN DE EVALUADORES ---

    function renderEvaluators() {
        const users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
        const evaluators = users.filter(u => u.role === 'evaluador' || u.role === 'coordinador');

        if (!evaluadoresContainer) return;
        evaluadoresContainer.innerHTML = '';

        if (evaluators.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="4" style="text-align: center; color: #6b7280;">No hay evaluadores registrados</td>';
            evaluadoresContainer.appendChild(emptyRow);
            return;
        }

        evaluators.forEach(evaluator => {
            const row = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = evaluator.fullname || evaluator.username;

            const tdEmail = document.createElement('td');
            tdEmail.textContent = evaluator.email || '-';

            const tdRole = document.createElement('td');
            const badgeRole = document.createElement('span');
            badgeRole.classList.add('status-tag', 'status-active');
            badgeRole.textContent = evaluator.role === 'coordinador' ? 'Coordinador' : 'Evaluador';
            tdRole.appendChild(badgeRole);

            const tdActions = document.createElement('td');
            tdActions.appendChild(createIconButton('✏️', 'edit', 'Editar', () => prepareEditEvaluator(evaluator.username)));
            tdActions.appendChild(createIconButton('🗑️', 'delete', 'Eliminar', () => deleteEvaluator(evaluator.username)));

            row.appendChild(tdName);
            row.appendChild(tdEmail);
            row.appendChild(tdRole);
            row.appendChild(tdActions);

            evaluadoresContainer.appendChild(row);
        });
    }

    let editingEvaluatorUser = null;

    if (evaluatorForm) {
        evaluatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('nombre-evaluador').value;
            const email = document.getElementById('email-evaluador').value;
            const role = document.getElementById('rol-evaluador').value;

            // Simple user generation strategy or use exist
            const username = editingEvaluatorUser || email.split('@')[0];

            let users = JSON.parse(localStorage.getItem('scholarship_users')) || [];

            if (editingEvaluatorUser) {
                // Update existing
                const index = users.findIndex(u => u.username === editingEvaluatorUser);
                if (index !== -1) {
                    users[index] = { ...users[index], fullname, email, role };
                    alert('Usuario actualizado correctamente.');
                }
            } else {
                // Create New
                if (users.find(u => u.username === username)) {
                    alert('El usuario ya existe (basado en el correo).');
                    return;
                }
                const newUser = {
                    fullname,
                    username,
                    password: 'password123', // Default password
                    role,
                    email
                };
                users.push(newUser);
                alert('Evaluador registrado correctamente. Contraseña temporal: password123');
            }

            localStorage.setItem('scholarship_users', JSON.stringify(users));
            renderEvaluators();

            // Reset form
            evaluatorForm.reset();
            editingEvaluatorUser = null;
            document.querySelector('#form-evaluador legend').textContent = 'Crear / Editar Evaluador';
            const btn = evaluatorForm.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Guardar Evaluador';
        });
    }

    window.prepareEditEvaluator = function (username) {
        const users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
        const user = users.find(u => u.username === username);
        if (user) {
            editingEvaluatorUser = username;
            document.getElementById('nombre-evaluador').value = user.fullname || '';
            document.getElementById('email-evaluador').value = user.email || '';
            document.getElementById('rol-evaluador').value = user.role || 'evaluador';

            document.querySelector('#form-evaluador legend').textContent = 'Editando a: ' + user.fullname;
            const btn = evaluatorForm.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Actualizar Usuario';

            evaluatorForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    window.deleteEvaluator = function (username) {
        if (confirm(`¿Eliminar al evaluador ${username}?`)) {
            let users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
            users = users.filter(u => u.username !== username);
            localStorage.setItem('scholarship_users', JSON.stringify(users));
            renderEvaluators();
        }
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
                alert('Sede actualizada.');
            } else {
                sedes.push(sedeData);
                alert('Nueva sede registrada.');
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
        if (confirm('¿Eliminar esta sede?')) {
            let sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];
            sedes = sedes.filter(s => s.id !== id);
            localStorage.setItem('scholarship_sedes', JSON.stringify(sedes));
            renderSedes();
        }
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

    // --- 5. GESTIÓN DE SOPORTE ---

    function renderSupportRequests() {
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
    }

    window.updateSupportStatus = function (id, newStatus) {
        let requests = JSON.parse(localStorage.getItem('support_requests')) || [];
        const index = requests.findIndex(r => r.id === id);
        if (index !== -1) {
            requests[index].status = newStatus;
            localStorage.setItem('support_requests', JSON.stringify(requests));
            renderSupportRequests();
            alert(`Solicitud ${newStatus.toLowerCase()} correctamente.`);
        }
    };

    window.deleteSupportRequest = function (id) {
        if (confirm('¿Eliminar este registro de soporte?')) {
            let requests = JSON.parse(localStorage.getItem('support_requests')) || [];
            requests = requests.filter(r => r.id !== id);
            localStorage.setItem('support_requests', JSON.stringify(requests));
            renderSupportRequests();
        }
    };

    // --- LOGOUT ---
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Inicialización Global
    renderScholarships();
    renderEvaluators();
    renderSedes();
    renderSupportRequests();
});

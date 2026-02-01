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
    const btnLogout = document.getElementById('btn-logout-admin');
    
    


// Lógica Integral para el Panel de Administración
document.addEventListener('DOMContentLoaded', () => {
 
    // --- 1. GESTIÓN DE BECAS ---

    function renderScholarships() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        scholarshipTable.innerHTML = '';

        scholarships.forEach(beca => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${beca.name}</strong></td>
                <td><span class="badge ${beca.category === 'Internacional' ? '' : (beca.category === 'Nacional' ? 'bg-green' : 'bg-purple')}">${beca.category}</span></td>
                <td>${beca.funding}</td>
                <td>${beca.deadline}</td>
                <td><span class="status-tag ${beca.status === 'Abierta' ? 'status-active' : 'status-closed'}">${beca.status}</span></td>
                <td>
                    <button class="btn-icon edit" onclick="prepareEditScholarship(${beca.id})">✏️</button>
                    <button class="btn-icon delete" onclick="deleteScholarship(${beca.id})">🗑️</button>
                </td>
            `;
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
                minAvg: document.getElementById('scholarship-min-avg').value, // NUEVO
                description: document.getElementById('scholarship-description').value
            };

            if (id) {
                // Modo Edición
                const index = scholarships.findIndex(b => b.id === parseInt(id));
                scholarships[index] = becaData;
                alert('Convocatoria actualizada exitosamente.');
            } else {
                // Modo Creación
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
            document.getElementById('scholarship-name').value = beca.name;
            document.getElementById('scholarship-category').value = beca.category;
            document.getElementById('scholarship-funding').value = beca.funding;
            document.getElementById('scholarship-deadline').value = beca.deadline;
            document.getElementById('scholarship-status').value = beca.status;
            document.getElementById('scholarship-min-avg').value = beca.minAvg || ""; // NUEVO
            document.getElementById('scholarship-description').value = beca.description;

            formTitle.innerText = "Editando Convocatoria";
            btnSubmit.innerText = "Guardar Cambios";
            btnCancelEdit.style.display = "inline-block";
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    if (btnCancelEdit) btnCancelEdit.addEventListener('click', resetBecaForm);

    function resetBecaForm() {
        scholarshipForm.reset();
        hiddenId.value = "";
        formTitle.innerText = "Añadir Nueva Convocatoria";
        btnSubmit.innerText = "Publicar Beca";
        btnCancelEdit.style.display = "none";
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
        const evaluators = users.filter(u => u.role === 'evaluador' || u.username === 'evaluador');

        evaluadoresContainer.innerHTML = '';
        evaluators.forEach(evaluator => {
            const card = document.createElement('article');
            card.className = 'evaluador-card';
            card.innerHTML = `
                <div class="eval-info">
                    <h3>${evaluator.fullname || evaluator.username}</h3>
                    <p>Acceso: ${evaluator.username}</p>
                    <span class="badge-eval">Evaluador Activo</span>
                </div>
                <div class="eval-actions">
                    <button class="btn-text-danger" onclick="deleteEvaluator('${evaluator.username}')">Dar de baja</button>
                </div>
            `;
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
                alert('El nombre de usuario ya existe.');
                return;
            }

            users.push(newUser);
            localStorage.setItem('scholarship_users', JSON.stringify(users));
            alert('Evaluador registrado correctamente.');
            evaluatorForm.reset();
            renderEvaluators();
        });
    }

    window.deleteEvaluator = function (username) {
        if (confirm(`¿Eliminar al evaluador ${username}?`)) {
            let users = JSON.parse(localStorage.getItem('scholarship_users')) || [];
            users = users.filter(u => u.username !== username);
            localStorage.setItem('scholarship_users', JSON.stringify(users));
            renderEvaluators();
        }
    };

    // --- 3. GESTIÓN DE SEDES (NUEVO CRUD) ---

    function renderSedes() {
        const sedes = JSON.parse(localStorage.getItem('scholarship_sedes')) || [];
        if (!sedeTableBody) return;
        sedeTableBody.innerHTML = '';

        sedes.forEach(sede => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${sede.nombre}</strong></td>
                <td>${sede.direccion}</td>
                <td>${sede.encargado}</td>
                <td>
                    <button class="btn-icon edit" onclick="prepareEditSede(${sede.id})">✏️</button>
                    <button class="btn-icon delete" onclick="deleteSede(${sede.id})">🗑️</button>
                </td>
            `;
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
            btnCancelSede.style.display = "inline-block";
        }
    };

    if (btnCancelSede) btnCancelSede.addEventListener('click', resetSedeForm);

    function resetSedeForm() {
        sedeForm.reset();
        hiddenSedeId.value = "";
        btnSaveSede.innerText = "Guardar Sede";
        btnCancelSede.style.display = "none";
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

        if (statBecas) statBecas.innerText = becas.length;
        if (statSolicitudes) statSolicitudes.innerText = solicitudes.length;
        if (statAprobados) statAprobados.innerText = aprobados.length;
    }

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
    renderSedes(); // NUEVO
});

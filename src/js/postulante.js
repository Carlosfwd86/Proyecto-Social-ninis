    const applyForm = document.getElementById('apply-form');
    const applicationTable = document.getElementById('application-table-body');
    const scholarshipSelect = document.getElementById('scholarship-select');
    const applicationModule = document.getElementById('application-module');
    const btnNuevaSolicitud = document.getElementById('btn-nueva-solicitud');
    const btnCerrarForm = document.getElementById('btn-cerrar-form');
    const btnCancelarForm = document.getElementById('btn-cancelar-postulacion');
    const btnLogout = document.getElementById('btn-logout-panel');
// Lógica para el Panel del Postulante
document.addEventListener('DOMContentLoaded', () => {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // 0. Redirigir si no hay sesión (Ahora se maneja centralizado o no es necesario si la página es compartida)
    if (!currentUser) return;

    // 1. Cargar Becas en el Select
    function loadScholarships() {
        const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
        if (scholarshipSelect) {
            scholarshipSelect.innerHTML = '<option value="" disabled selected>Elige una beca...</option>';
            scholarships.forEach(beca => {
                const option = document.createElement('option');
                option.value = beca.name;
                option.textContent = beca.name;
                scholarshipSelect.appendChild(option);
            });
        }
    }

    // 2. Renderizar historial
    function renderApplications() {
        if (!applicationTable) return;

        const allApplications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];
        // Filtrar solo las del usuario actual
        const myApps = allApplications.filter(app => app.applicantEmail === currentUser.email);

        applicationTable.innerHTML = '';

        if (myApps.length === 0) {
            applicationTable.innerHTML = '<tr><td colspan="4" class="text-center">No tienes solicitudes enviadas aún.</td></tr>';
            return;
        }

        myApps.forEach(app => {
            const row = document.createElement('tr');
            const observations = app.evalInfo && app.evalInfo.observations ?
                `<div style="font-size: 0.85rem; color: #666; max-width: 250px;">"${app.evalInfo.observations}"</div>` :
                '<span style="color: #999; font-style: italic;">Sin observaciones</span>';

            row.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>${app.scholarship}</td>
                <td>${app.date}</td>
                <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
                <td>${observations}</td>
                <td>
                    <button class="btn-icon edit" title="Editar Solicitud">✏️</button>
                </td>
            `;
            applicationTable.appendChild(row);
        });
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'Rechazado': return 'status-rejected';
            case 'Pendiente': return 'status-pending';
            default: return 'process'; // 'En Revisión' o similar
        }
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

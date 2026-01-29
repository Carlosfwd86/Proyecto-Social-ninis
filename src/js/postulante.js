// Lógica para el Panel del Postulante
document.addEventListener('DOMContentLoaded', () => {
    const applyForm = document.getElementById('apply-form');
    const applicationTable = document.getElementById('application-table-body');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Si no hay usuario logueado, redirigir al login
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Mostrar nombre del usuario logueado si existe un elemento para ello
    const welcomeMsg = document.querySelector('.section-title');
    if (welcomeMsg) welcomeMsg.innerText = `Bienvenido/a, ${currentUser.fullname}`;

    // Cargar historial de trámites
    renderApplications();

    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Generar nuevo trámite/folio
            const newApplication = {
                folio: 'B-' + Math.floor(Math.random() * 90000 + 10000),
                applicantName: currentUser.fullname,
                applicantEmail: currentUser.email,
                scholarship: document.getElementById('scholarship-select').value,
                date: new Date().toLocaleDateString(),
                status: 'En Revisión',
                reason: document.getElementById('reason').value,
                score: null, // Lo llenará el evaluador
                observations: '' // Lo llenará el evaluador
            };

            // 1. Obtener trámites de localStorage
            const applications = JSON.parse(localStorage.getItem('scholarship_applications')) || [];

            // 2. Guardar trámite
            applications.push(newApplication);
            localStorage.setItem('scholarship_applications', JSON.stringify(applications));

            // Notificar y limpiar
            alert('¡Tu solicitud ha sido enviada con éxito!');
            applyForm.reset();
            renderApplications();

            // Cerrar el formulario (simulando UI)
            document.getElementById('application-module').style.display = 'none';
        });
    }

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
            row.innerHTML = `
                <td><strong>${app.folio}</strong></td>
                <td>${app.scholarship}</td>
                <td>${app.date}</td>
                <td><span class="status-tag ${getStatusClass(app.status)}">${app.status}</span></td>
            `;
            applicationTable.appendChild(row);
        });
    }

    function getStatusClass(status) {
        switch (status) {
            case 'Aprobado': return 'status-approved';
            case 'En Revisión': return 'status-pending';
            case 'Rechazado': return 'status-rejected';
            default: return '';
        }
    }
});

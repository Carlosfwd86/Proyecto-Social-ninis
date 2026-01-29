// Lógica para el Panel de Administración
document.addEventListener('DOMContentLoaded', () => {
    const scholarshipForm = document.getElementById('scholarship-form');
    const scholarshipTable = document.getElementById('scholarship-table-body');

    // Cargar becas existentes al iniciar
    renderScholarships();

    if (scholarshipForm) {
        scholarshipForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturar datos del formulario
            const newScholarship = {
                id: Date.now(),
                name: document.getElementById('scholarship-name').value,
                category: document.getElementById('scholarship-category').value,
                funding: document.getElementById('scholarship-funding').value,
                deadline: document.getElementById('scholarship-deadline').value,
                status: 'Abierta',
                description: 'Descripción básica generada por el administrador.'
            };

            // 1. Obtener becas de localStorage
            const scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];

            // 2. Agregar la nueva beca
            scholarships.push(newScholarship);

            // 3. Guardar en localStorage
            localStorage.setItem('scholarships', JSON.stringify(scholarships));

            // Limpiar formulario y refrescar tabla
            scholarshipForm.reset();
            renderScholarships();
            alert('¡Beca creada y publicada correctamente!');
        });
    }

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
                <td><span class="status-tag status-active">Abierta</span></td>
                <td>
                    <button class="btn-action btn-edit" title="Editar">✏️</button>
                    <button class="btn-action btn-delete" onclick="deleteScholarship(${beca.id})" title="Eliminar">🗑️</button>
                </td>
            `;
            scholarshipTable.appendChild(row);
        });
    }

    // Función global para que funcione con el onclick
    window.deleteScholarship = function (id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta convocatoria?')) {
            let scholarships = JSON.parse(localStorage.getItem('scholarships')) || [];
            scholarships = scholarships.filter(b => b.id !== id);
            localStorage.setItem('scholarships', JSON.stringify(scholarships));
            renderScholarships();
        }
    };
});

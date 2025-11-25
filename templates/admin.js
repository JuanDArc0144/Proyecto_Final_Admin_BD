
// Funcionalidad para el panel de administración

document.addEventListener('DOMContentLoaded', function() {
    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Navegación entre pestañas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Aquí podrías agregar lógica para cambiar el contenido
            // según la pestaña seleccionada
        });
    });

    // Simular datos dinámicos (en una aplicación real esto vendría de una API)
    simulateDataUpdates();
});

function simulateDataUpdates() {
    // Simular actualizaciones periódicas de datos
    setInterval(() => {
        // Esto es solo para demostración
        // En una aplicación real, aquí harías peticiones a una API
        console.log('Actualizando datos del dashboard...');
    }, 30000); // Cada 30 segundos
}
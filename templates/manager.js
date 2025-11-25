// Funcionalidad para el panel de gerencia

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

    // Botones de reabastecimiento
    const restockBtns = document.querySelectorAll('.restock-btn');
    restockBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.closest('.alert-card').querySelector('h4').textContent;
            alert(`Solicitud de reabastecimiento enviada para: ${productName}`);
            
            // Aquí podrías agregar lógica para enviar la solicitud al servidor
            this.innerHTML = '<i class="fas fa-check"></i> Solicitado';
            this.disabled = true;
            this.style.background = '#27ae60';
        });
    });

    // Botones de reportes
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.textContent.trim();
            alert(`Generando reporte: ${reportType}`);
            
            // Aquí podrías agregar lógica para generar el reporte
            // Por ejemplo, abrir una nueva ventana o descargar un archivo
        });
    });

    // Simular datos en tiempo real
    simulateRealTimeUpdates();
});

function simulateRealTimeUpdates() {
    // Simular actualizaciones periódicas de datos
    setInterval(() => {
        // En una aplicación real, aquí harías peticiones a una API
        // para obtener datos actualizados del servidor
        updateStockLevels();
    }, 30000); // Cada 30 segundos
}

function updateStockLevels() {
    // Simular cambios menores en los niveles de stock
    const stockElements = document.querySelectorAll('.category-value');
    stockElements.forEach(element => {
        const currentValue = parseInt(element.textContent);
        const randomChange = Math.floor(Math.random() * 3) - 1; // -1, 0, o +1
        const newValue = Math.max(0, currentValue + randomChange);
        element.textContent = newValue;
        
        // Animación suave del cambio
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    });
    
    console.log('Datos actualizados automáticamente');
}
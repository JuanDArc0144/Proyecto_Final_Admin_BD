// Funcionalidad para el panel de empleado

document.addEventListener('DOMContentLoaded', function() {
    // Navegación entre pestañas
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remover clase active de todas las pestañas y contenidos
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada y su contenido
            this.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });

    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                window.location.href = 'index.html';
            }
        });
    }

    // Botón de notificar al gerente
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function() {
            alert('Notificación enviada al gerente sobre los productos con stock bajo');
            
            // Cambiar el texto del botón temporalmente
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Notificado';
            this.disabled = true;
            this.style.background = '#27ae60';
            
            // Restaurar después de 3 segundos
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                this.style.background = '#3498db';
            }, 3000);
        });
    }

    // Funcionalidad de búsqueda
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = document.getElementById('search-term').value;
            const category = document.getElementById('search-category').value;
            const status = document.getElementById('search-status').value;
            
            // Simular búsqueda
            simulateSearch(searchTerm, category, status);
        });
    }

    // Simular datos en tiempo real
    simulateRealTimeUpdates();
});

function simulateSearch(term, category, status) {
    const resultsPlaceholder = document.querySelector('.results-placeholder');
    
    if (!term && !category && !status) {
        resultsPlaceholder.innerHTML = `
            <i class="fas fa-search"></i>
            <h4>Realiza una búsqueda para ver resultados</h4>
            <p>Usa los filtros arriba para encontrar productos específicos</p>
        `;
        return;
    }
    
    // Simular resultados de búsqueda
    resultsPlaceholder.innerHTML = `
        <i class="fas fa-search"></i>
        <h4>Búsqueda realizada</h4>
        <p>Término: ${term || 'Ninguno'}</p>
        <p>Categoría: ${category || 'Todas'}</p>
        <p>Estado: ${status || 'Todos'}</p>
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
            <strong>2 productos encontrados</strong>
        </div>
    `;
}

function simulateRealTimeUpdates() {
    // Simular actualizaciones periódicas de datos
    setInterval(() => {
        // En una aplicación real, aquí harías peticiones a una API
        updateStockCounters();
    }, 45000); // Cada 45 segundos
}

function updateStockCounters() {
    // Simular cambios menores en los contadores
    const stockNumbers = document.querySelectorAll('.stat-number');
    stockNumbers.forEach(element => {
        const currentValue = parseInt(element.textContent);
        const randomChange = Math.floor(Math.random() * 2); // 0 o +1
        const newValue = Math.max(0, currentValue + randomChange);
        
        if (newValue !== currentValue) {
            element.textContent = newValue;
            
            // Animación suave del cambio
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 300);
        }
    });
    
    console.log('Datos actualizados automáticamente para empleado');
}
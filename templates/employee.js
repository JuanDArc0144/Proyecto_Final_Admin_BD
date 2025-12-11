// ==================== 1. VARIABLES GLOBALES ====================
let products = [];
let categoriesMap = {}; // Diccionario: { id: "Nombre Categoria" }
let suppliersMap = {};  // Diccionario: { id: "Nombre Proveedor" }

// ==================== 2. INICIALIZACIÓN Y SESIÓN ====================

document.addEventListener('DOMContentLoaded', function() {
    checkSession().then(isLoggedIn => {
        if (isLoggedIn) {
            employeeInit();
        }
    });
});

function employeeInit() {
    console.log("Iniciando sistema de empleado...");

    // 1. Configurar UI básica
    setupTabs();
    setupLogout();
    setupNotifyButton();

    // 2. Cargar Datos en Orden
    // Primero Catálogos (para tener los nombres listos)
    loadCatalogs().then(() => {
        // Una vez tenemos los nombres, cargamos los datos
        loadDashboardStats(); // Tarjetas del resumen
        loadAllProducts();    // Descarga productos una vez y alimenta a Inventario, Búsqueda y Alertas
        
        // Llenar los selectores que dependen de los catálogos
        populateInventoryFilters(); // Filtros de la pestaña Inventario
        setupSearchTab();           // Filtros de la pestaña Búsqueda
    });
}

// ==================== 3. GESTIÓN DE DATOS (CARGA) ====================

function loadCatalogs() {
    return fetch('../endpoints/obtener_catalogos.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Llenamos los mapas globales
                data.data.categorias.forEach(c => categoriesMap[c.id_categoria] = c.nombre);
                data.data.proveedores.forEach(p => suppliersMap[p.id_proveedor] = p.nombre);
                console.log("Catálogos cargados.");
            }
        })
        .catch(err => console.error("Error cargando catálogos:", err));
}

function loadAllProducts() {
    fetch('../endpoints/obtener_productos.php')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                products = data.data; // Guardamos en global
                
                // Actualizar todas las secciones que dependen de productos
                // A. Pestaña Resumen
                renderStockAlerts(products);
                renderCategoryDistribution(products);
                
                // B. Pestaña Inventario
                renderInventoryTable(products);
                
                // C. Pestaña Búsqueda (Limpiar resultados previos)
                const searchContainer = document.getElementById('searchResultsContainer');
                if(searchContainer) {
                    searchContainer.innerHTML = `
                        <div class="results-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #95a5a6;">
                            <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                            <h4>Realiza una búsqueda</h4>
                            <p>Usa los filtros para encontrar productos.</p>
                        </div>`;
                }
            }
        })
        .catch(err => console.error("Error cargando productos:", err));
}

function loadDashboardStats() {
    fetch('../endpoints/dashboard_stats.php')
        .then(res => res.json())
        .then(data => {
            const elTotal = document.getElementById('statTotalProducts');
            const elStock = document.getElementById('statTotalStock');
            const elLow = document.getElementById('statLowStock'); // Corregido ID vs HTML anterior

            if (elTotal) elTotal.textContent = data.total_productos;
            if (elStock) elStock.textContent = data.total_stock;
            if (elLow) elLow.textContent = data.stock_bajo;
        })
        .catch(err => console.error("Error stats:", err));
}

// ==================== 4. PESTAÑA RESUMEN (DASHBOARD) ====================

function renderStockAlerts(productsList) {
    const container = document.getElementById('empAlertsList');
    if (!container) return;
    
    container.innerHTML = '';
    const lowStock = productsList.filter(p => parseInt(p.stock) < parseInt(p.stock_minimo));

    if (lowStock.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:#27ae60;"><i class="fas fa-check-circle"></i> Todo óptimo</div>';
        return;
    }

    lowStock.forEach(p => {
        container.innerHTML += `
            <div class="alert-item">
                <div class="product-info">
                    <h4 style="margin:0; color:#2c3e50;">${p.nombre}</h4>
                    <p class="stock-details" style="margin:5px 0 0 0; font-size:0.9em;">
                        Stock: <strong style="color:#e74c3c">${p.stock}</strong> / Mín: ${p.stock_minimo}
                    </p>
                </div>
                <div class="alert-badge low">Bajo</div>
            </div>`;
    });
}

function renderCategoryDistribution(productsList) {
    const container = document.getElementById('empCategoriesList');
    if (!container) return;
    container.innerHTML = '';

    const counts = {};
    let totalStock = 0;

    productsList.forEach(p => {
        const catName = getCategoryName(p.id_categoria);
        const stock = parseInt(p.stock);
        counts[catName] = (counts[catName] || 0) + stock;
        totalStock += stock;
    });

    for (const [cat, count] of Object.entries(counts)) {
        const percent = totalStock > 0 ? ((count / totalStock) * 100).toFixed(1) : 0;
        container.innerHTML += `
            <div class="category-item">
                <div class="category-header">
                    <span class="category-name">${cat}</span>
                    <span class="category-stats">${count} uds (${percent}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%"></div>
                </div>
            </div>`;
    }
}

// ==================== 5. PESTAÑA INVENTARIO ====================

function populateInventoryFilters() {
    // Llenar Categorías
    const catSelect = document.getElementById('filterCategory');
    if (catSelect) {
        catSelect.innerHTML = '<option value="">Todas las Categorías</option>';
        for (const [id, name] of Object.entries(categoriesMap)) {
            catSelect.innerHTML += `<option value="${id}">${name}</option>`;
        }
    }
    
    // Llenar Proveedores
    const provSelect = document.getElementById('filterSupplier');
    if (provSelect) {
        provSelect.innerHTML = '<option value="">Todos los Proveedores</option>';
        for (const [id, name] of Object.entries(suppliersMap)) {
            provSelect.innerHTML += `<option value="${id}">${name}</option>`;
        }
    }
}

function filterInventory() {
    const catFilter = document.getElementById('filterCategory').value;
    const provFilter = document.getElementById('filterSupplier') ? document.getElementById('filterSupplier').value : "";
    const statusFilter = document.getElementById('filterStatus').value;

    const filtered = products.filter(p => {
        const catMatch = catFilter === "" || p.id_categoria == catFilter;
        const provMatch = provFilter === "" || p.id_proveedor == provFilter;
        
        let statusMatch = true;
        const stock = parseInt(p.stock);
        const min = parseInt(p.stock_minimo);
        
        if (statusFilter === 'low') statusMatch = stock < min;
        else if (statusFilter === 'normal') statusMatch = stock >= min;

        return catMatch && provMatch && statusMatch;
    });

    renderInventoryTable(filtered);
}

function renderInventoryTable(productsList) {
    const container = document.getElementById('inventoryTableBody');
    if (!container) return;
    container.innerHTML = '';

    if (productsList.length === 0) {
        container.innerHTML = '<div style="padding:30px; text-align:center; color:#7f8c8d;">No se encontraron productos.</div>';
        return;
    }

    productsList.forEach(p => {
        const stock = parseInt(p.stock);
        const min = parseInt(p.stock_minimo);
        let statusClass = 'normal';
        let statusText = 'Normal';

        if (stock < min) { statusClass = 'low'; statusText = 'Bajo Stock'; }
        else if (stock === 0) { statusClass = 'low'; statusText = 'Agotado'; }

        container.innerHTML += `
            <div class="table-row">
                <div class="col-name">
                    <strong style="color:#2c3e50;">${p.nombre}</strong>
                    <span style="font-size:0.85em; color:#7f8c8d;">${p.descripcion || ''}</span>
                </div>
                <div class="col-category">${getCategoryName(p.id_categoria)}</div>
                <div class="col-stock" style="font-weight:bold;">${stock}</div>
                <div class="col-min">${min}</div>
                <div class="col-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>`;
    });
}

function toggleFilters() {
    const panel = document.getElementById('filterPanel');
    if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
    }
}

// ==================== 6. PESTAÑA BÚSQUEDA ====================

function setupSearchTab() {
    const select = document.getElementById('search-category');
    if (!select) return;

    select.innerHTML = '<option value="">Todas las categorías</option>';
    for (const [id, name] of Object.entries(categoriesMap)) {
        select.innerHTML += `<option value="${id}">${name}</option>`;
    }
}

function performSearch() {
    const term = document.getElementById('search-term').value.toLowerCase();
    const catFilter = document.getElementById('search-category').value;
    const statusFilter = document.getElementById('search-status').value;
    const container = document.getElementById('searchResultsContainer');

    if (term === '' && catFilter === '' && statusFilter === '') {
        // Restaurar estado inicial
        if(container) {
             container.innerHTML = `
                <div class="results-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #95a5a6;">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <h4>Realiza una búsqueda</h4>
                    <p>Usa los filtros para encontrar productos.</p>
                </div>`;
        }
        return;
    }

    const results = products.filter(p => {
        const textMatch = p.nombre.toLowerCase().includes(term) || (p.descripcion || '').toLowerCase().includes(term);
        const catMatch = catFilter === "" || p.id_categoria == catFilter;
        
        let statusMatch = true;
        const stock = parseInt(p.stock);
        const min = parseInt(p.stock_minimo);
        if (statusFilter === 'low') statusMatch = stock < min;
        else if (statusFilter === 'normal') statusMatch = stock >= min;

        return textMatch && catMatch && statusMatch;
    });

    renderSearchResults(results);
}

function renderSearchResults(results) {
    const container = document.getElementById('searchResultsContainer');
    if (!container) return;
    container.innerHTML = '';

    if (results.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">
                <i class="far fa-times-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h4>No se encontraron resultados</h4>
            </div>`;
        return;
    }

    results.forEach(p => {
        const stock = parseInt(p.stock);
        const min = parseInt(p.stock_minimo);
        const isLow = stock < min;
        const catName = getCategoryName(p.id_categoria);
        const provName = suppliersMap[p.id_proveedor] || 'Desconocido';

        container.innerHTML += `
            <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); border-left: 5px solid ${isLow ? '#e74c3c' : '#2ecc71'}; transition: transform 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <div>
                        <h4 style="margin: 0; color: #2c3e50; font-size: 1.1em;">${p.nombre}</h4>
                        <span style="font-size: 0.85em; color: #7f8c8d; background: #f1f2f6; padding: 2px 8px; border-radius: 4px;">${catName}</span>
                    </div>
                    <span style="font-weight: bold; color: #2c3e50; font-size: 1.2em;">$${parseFloat(p.precio_venta).toFixed(2)}</span>
                </div>
                <p style="color: #666; font-size: 0.9em; margin-bottom: 15px; height: 40px; overflow: hidden; text-overflow: ellipsis;">
                    ${p.descripcion || 'Sin descripción disponible.'}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #eee;">
                    <div style="text-align: left;">
                        <span style="display: block; font-size: 0.75em; color: #999;">PROVEEDOR</span>
                        <span style="font-size: 0.9em; color: #333;">${provName}</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="display: block; font-size: 0.75em; color: #999;">STOCK</span>
                        <span style="font-size: 1.1em; font-weight: bold; color: ${isLow ? '#e74c3c' : '#27ae60'};">
                            ${stock} <small style="font-weight: normal; color: #ccc;">/ ${min}</small>
                        </span>
                    </div>
                </div>
            </div>`;
    });
}

// ==================== 7. UTILIDADES (AUTH, TABS, ETC) ====================

function getCategoryName(id) {
    return categoriesMap[id] || 'Desconocido';
}

function checkSession() {
    return fetch('../endpoints/check_session.php')
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                const nameEl = document.getElementById('employeeHeaderUsername');
                const roleEl = document.getElementById('employeeHeaderRole');
                if (nameEl) nameEl.textContent = data.nombre;
                if (roleEl) roleEl.textContent = data.puesto;
                return true;
            } else {
                alert('Sesión expirada.');
                window.location.href = '../templates/index.html';
                return false;
            }
        })
        .catch(err => {
            console.error("Error sesión:", err);
            return false;
        });
}

function setupLogout() {
    const btn = document.querySelector('.logout-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (confirm('¿Cerrar sesión?')) {
                fetch('../endpoints/logout.php')
                    .then(() => window.location.href = '../templates/index.html');
            }
        });
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab') + '-content';
            const target = document.getElementById(contentId);
            if(target) target.classList.add('active');
        });
    });
}

function setupNotifyButton() {
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.onclick = function() {
            alert("Notificación enviada al gerente.");
            this.innerHTML = '<i class="fas fa-check"></i> Notificado';
            this.disabled = true;
            this.style.background = '#27ae60';
        };
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}
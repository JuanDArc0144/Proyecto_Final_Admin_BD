// ==================== VARIABLES GLOBALES ====================
let products = [];
let activityLog = [];
let backups = [];
let currentProductId = 1;

// ==================== FUNCIONES DE NAVEGACIÓN ====================
function showTab(tabName) {
    console.log('Cambiando a pestaña:', tabName);
    
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos los botones
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar la pestaña seleccionada
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        
        // Activar el botón correspondiente
        const buttons = document.querySelectorAll('.tab');
        buttons.forEach(btn => {
            if (btn.textContent.includes(getTabTitle(tabName))) {
                btn.classList.add('active');
            }
        });
        
        // Cargar datos específicos de la pestaña
        loadTabData(tabName);
    }
}

function getTabTitle(tabName) {
    const titles = {
        'dashboard': 'Resumen',
        'products': 'Productos',
        'analysis': 'Análisis',
        'backups': 'Respaldos',
        'security': 'Seguridad',
        'activity': 'Actividad'
    };
    return titles[tabName] || tabName;
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'products':
            loadProducts();
            break;
        case 'backups':
            loadBackups();
            break;
        case 'activity':
            loadActivity();
            break;
        case 'analysis':
            loadAnalysis();
            break;
    }
}

// ==================== FUNCIONES DE PRODUCTOS ====================
function loadProducts() {
    if (products.length === 0) {
        initializeProducts();
    }
    
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        const isLowStock = product.stock < product.minStock;
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.supplier}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td class="${isLowStock ? 'low-stock' : ''}">${product.stock}</td>
            <td>${product.minStock}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Actualizar contador
    updateProductCount();
    updateDashboardStats();
}

function initializeProducts() {
    products = [
        {
            id: 1,
            name: "Monitor Samsung 21\"",
            category: "Electrónica",
            supplier: "Samsung",
            price: 350.00,
            stock: 15,
            minStock: 5,
            addedDate: "2025-11-20"
        },
        {
            id: 2,
            name: "Teclado Mecánico RGB",
            category: "Periféricos",
            supplier: "Logitech",
            price: 89.99,
            stock: 45,
            minStock: 10,
            addedDate: "2025-11-22"
        },
        {
            id: 3,
            name: "Mouse Inalámbrico G Pro",
            category: "Periféricos",
            supplier: "Logitech",
            price: 79.99,
            stock: 78,
            minStock: 15,
            addedDate: "2025-11-18"
        },
        {
            id: 4,
            name: "Laptop Dell XPS 15",
            category: "Electrónica",
            supplier: "Dell Inc.",
            price: 1499.99,
            stock: 8,
            minStock: 3,
            addedDate: "2025-11-25"
        },
        {
            id: 5,
            name: "Router WiFi AC1200",
            category: "Redes",
            supplier: "TP-Link",
            price: 79.99,
            stock: 22,
            minStock: 5,
            addedDate: "2025-11-21"
        },
        {
            id: 6,
            name: "Impresora LaserJet",
            category: "Impresión",
            supplier: "HP",
            price: 199.99,
            stock: 12,
            minStock: 4,
            addedDate: "2025-11-19"
        },
        {
            id: 7,
            name: "Memoria RAM 16GB DDR4",
            category: "Almacenamiento",
            supplier: "Corsair",
            price: 89.99,
            stock: 35,
            minStock: 10,
            addedDate: "2025-11-23"
        },
        {
            id: 8,
            name: "SSD 1TB NVMe",
            category: "Almacenamiento",
            supplier: "Samsung",
            price: 129.99,
            stock: 25,
            minStock: 8,
            addedDate: "2025-11-24"
        },
        {
            id: 9,
            name: "Monitor Samsung 27\"",
            category: "Electrónica",
            supplier: "Samsung",
            price: 450.00,
            stock: 8,
            minStock: 15,
            addedDate: "2025-12-01"
        },
        {
            id: 10,
            name: "SSD Samsung 1TB",
            category: "Almacenamiento",
            supplier: "Samsung",
            price: 129.99,
            stock: 5,
            minStock: 25,
            addedDate: "2025-12-02"
        }
    ];
    
    currentProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function updateProductCount() {
    const countElement = document.querySelector('.table-count');
    if (countElement) {
        countElement.textContent = `${products.length} productos en total`;
    }
}

function addProduct(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productCategory = document.getElementById('productCategory').value;
    const productSupplier = document.getElementById('productSupplier').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value) || 0;
    const productStock = parseInt(document.getElementById('productStock').value) || 0;
    const productMinStock = parseInt(document.getElementById('productMinStock').value) || 0;
    
    if (!productName || !productCategory || !productSupplier) {
        alert('Por favor, completa los campos obligatorios (*)');
        return;
    }
    
    const newProduct = {
        id: currentProductId++,
        name: productName,
        category: getCategoryName(productCategory),
        supplier: getSupplierName(productSupplier),
        price: productPrice,
        stock: productStock,
        minStock: productMinStock,
        addedDate: new Date().toISOString().split('T')[0]
    };
    
    products.push(newProduct);
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Reload products
    loadProducts();
    
    // Add activity log
    addActivity('Producto Agregado', `Nuevo producto: ${productName}`, 'admin');
    
    // Show notification
    showNotification('Producto agregado exitosamente', 'success');
    
    // Switch to products tab
    showTab('products');
}

function getCategoryName(categoryValue) {
    const categories = {
        'electronica': 'Electrónica',
        'perifericos': 'Periféricos',
        'impresion': 'Impresión',
        'redes': 'Redes',
        'almacenamiento': 'Almacenamiento'
    };
    return categories[categoryValue] || categoryValue;
}

function getSupplierName(supplierValue) {
    const suppliers = {
        'dell': 'Dell Inc.',
        'samsung': 'Samsung',
        'logitech': 'Logitech',
        'hp': 'HP',
        'tp-link': 'TP-Link',
        'corsair': 'Corsair'
    };
    return suppliers[supplierValue] || supplierValue;
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Producto';
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="updateProduct(event, ${productId})" class="product-form">
            <div class="form-group">
                <label for="editName">Nombre del Producto *</label>
                <input type="text" id="editName" value="${product.name}" required>
            </div>
            
            <div class="form-group">
                <label for="editCategory">Categoría *</label>
                <select id="editCategory" required>
                    <option value="electronica" ${product.category === 'Electrónica' ? 'selected' : ''}>Electrónica</option>
                    <option value="perifericos" ${product.category === 'Periféricos' ? 'selected' : ''}>Periféricos</option>
                    <option value="impresion" ${product.category === 'Impresión' ? 'selected' : ''}>Impresión</option>
                    <option value="redes" ${product.category === 'Redes' ? 'selected' : ''}>Redes</option>
                    <option value="almacenamiento" ${product.category === 'Almacenamiento' ? 'selected' : ''}>Almacenamiento</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="editSupplier">Proveedor *</label>
                <select id="editSupplier" required>
                    <option value="dell" ${product.supplier === 'Dell Inc.' ? 'selected' : ''}>Dell Inc.</option>
                    <option value="samsung" ${product.supplier === 'Samsung' ? 'selected' : ''}>Samsung</option>
                    <option value="logitech" ${product.supplier === 'Logitech' ? 'selected' : ''}>Logitech</option>
                    <option value="hp" ${product.supplier === 'HP' ? 'selected' : ''}>HP</option>
                    <option value="tp-link" ${product.supplier === 'TP-Link' ? 'selected' : ''}>TP-Link</option>
                    <option value="corsair" ${product.supplier === 'Corsair' ? 'selected' : ''}>Corsair</option>
                </select>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editPrice">Precio ($)</label>
                    <input type="number" id="editPrice" value="${product.price}" step="0.01" min="0">
                </div>
                <div class="form-group">
                    <label for="editStock">Stock</label>
                    <input type="number" id="editStock" value="${product.stock}" min="0">
                </div>
                <div class="form-group">
                    <label for="editMinStock">Stock Mínimo</label>
                    <input type="number" id="editMinStock" value="${product.minStock}" min="0">
                </div>
            </div>
            
            <button type="submit" class="submit-btn">
                <i class="fas fa-save"></i> Guardar Cambios
            </button>
        </form>
    `;
    
    openModal();
}

function updateProduct(event, productId) {
    event.preventDefault();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    product.name = document.getElementById('editName').value;
    product.category = getCategoryName(document.getElementById('editCategory').value);
    product.supplier = getSupplierName(document.getElementById('editSupplier').value);
    product.price = parseFloat(document.getElementById('editPrice').value) || 0;
    product.stock = parseInt(document.getElementById('editStock').value) || 0;
    product.minStock = parseInt(document.getElementById('editMinStock').value) || 0;
    
    loadProducts();
    closeModal();
    addActivity('Producto Editado', `Producto modificado: ${product.name}`, 'admin');
    showNotification('Producto actualizado exitosamente', 'success');
}

function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const productName = products[productIndex].name;
    products.splice(productIndex, 1);
    
    loadProducts();
    addActivity('Producto Eliminado', `Producto eliminado: ${productName}`, 'admin');
    showNotification('Producto eliminado exitosamente', 'success');
}

// ==================== FUNCIONES DEL DASHBOARD ====================
function updateDashboardStats() {
    // Calcular estadísticas
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    
    // Calcular productos con stock bajo
    const lowStockCount = products.filter(p => p.stock < p.minStock).length;
    
    // Actualizar contadores
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = totalProducts;
        statNumbers[1].textContent = `$${totalValue.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        statNumbers[2].textContent = lowStockCount;
        statNumbers[3].textContent = totalStock;
    }
    
    // Actualizar alertas
    updateStockAlerts();
}

function updateStockAlerts() {
    const lowStockProducts = products.filter(p => p.stock < p.minStock)
        .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock));
    
    const alertsList = document.querySelector('.alerts-list');
    if (!alertsList) return;
    
    alertsList.innerHTML = '';
    
    // Mostrar máximo 3 alertas
    const displayProducts = lowStockProducts.slice(0, 3);
    
    displayProducts.forEach(product => {
        const stockPercentage = (product.stock / product.minStock) * 100;
        const isCritical = stockPercentage < 60;
        
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${isCritical ? 'critical' : 'warning'}`;
        
        alertItem.innerHTML = `
            <div class="alert-header">
                <h5>${product.name}</h5>
                <span class="alert-badge">${isCritical ? 'Crítico' : 'Advertencia'}</span>
            </div>
            <div class="alert-details">
                <span class="stock-info">
                    <i class="fas fa-box"></i>
                    Stock actual: <strong>${product.stock}</strong> (Mínimo: ${product.minStock})
                </span>
                <div class="stock-progress">
                    <div class="progress-bar">
                        <div class="progress-fill ${isCritical ? '' : 'warning'}" style="width: ${stockPercentage}%;"></div>
                    </div>
                    <span class="progress-text">${Math.round(stockPercentage)}% del mínimo</span>
                </div>
            </div>
            <button class="alert-action-btn" onclick="reorderProduct(${product.id})">
                <i class="fas fa-shopping-cart"></i> ${isCritical ? 'Reabastecer' : 'Notificar'}
            </button>
        `;
        
        alertsList.appendChild(alertItem);
    });
    
    // Si no hay alertas
    if (displayProducts.length === 0) {
        alertsList.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-check-circle"></i>
                <p>No hay productos con stock bajo</p>
            </div>
        `;
    }
}

function reorderProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const reorderAmount = Math.max(product.minStock * 2, product.minStock + 10);
    
    if (confirm(`¿Deseas reabastecer "${product.name}" con ${reorderAmount} unidades?`)) {
        product.stock += reorderAmount;
        loadProducts();
        addActivity('Reabastecimiento', `Producto reabastecido: ${product.name} (${reorderAmount} unidades)`, 'admin');
        showNotification(`Producto "${product.name}" reabastecido exitosamente`, 'success');
    }
}

// ==================== FUNCIONES DE RESPALDOS ====================
function loadBackups() {
    if (backups.length === 0) {
        initializeBackups();
    }
    
    const backupList = document.getElementById('backupList');
    if (!backupList) return;
    
    backupList.innerHTML = '';
    
    backups.forEach(backup => {
        const date = new Date(backup.date);
        const formattedDate = formatDateTime(date);
        
        const item = document.createElement('div');
        item.className = `backup-item ${backup.isRecent ? 'recent' : ''}`;
        item.innerHTML = `
            <div class="backup-header">
                <span class="backup-title">${backup.name}</span>
                ${backup.isRecent ? '<span class="backup-badge">Más reciente</span>' : ''}
            </div>
            <div class="backup-details">
                <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                <span><i class="fas fa-user"></i> ${backup.user}</span>
                <span><i class="fas fa-box"></i> ${backup.products} productos</span>
                <span><i class="fas fa-hdd"></i> ${backup.size}</span>
            </div>
            <div class="backup-actions">
                <button class="action-btn restore-btn" onclick="restoreBackup(${backup.id})">
                    <i class="fas fa-redo"></i> Restaurar
                </button>
                <button class="action-btn download-btn" onclick="downloadBackup(${backup.id})">
                    <i class="fas fa-download"></i> Descargar
                </button>
            </div>
        `;
        
        backupList.appendChild(item);
    });
    
    updateBackupStats();
}

function initializeBackups() {
    backups = [
        {
            id: 1,
            name: "Respaldo #1",
            date: "2025-11-28T10:30:00",
            user: "admin",
            products: 8,
            size: "1.8 MB",
            isRecent: false
        },
        {
            id: 2,
            name: "Respaldo #2",
            date: "2025-11-30T14:15:00",
            user: "admin",
            products: 9,
            size: "2.0 MB",
            isRecent: false
        },
        {
            id: 3,
            name: "Respaldo #3",
            date: "2025-12-02T09:45:00",
            user: "admin",
            products: 10,
            size: "2.1 MB",
            isRecent: false
        },
        {
            id: 4,
            name: "Respaldo #4",
            date: "2025-12-03T16:20:00",
            user: "admin",
            products: 11,
            size: "2.3 MB",
            isRecent: false
        },
        {
            id: 5,
            name: "Respaldo #5",
            date: "2025-12-04T18:35:00",
            user: "admin",
            products: 11,
            size: "2.4 MB",
            isRecent: true
        }
    ];
}

function createBackup() {
    if (confirm('¿Deseas crear un nuevo respaldo de la base de datos?')) {
        const btn = document.getElementById('createBackupBtn');
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
        
        setTimeout(() => {
            // Crear nuevo respaldo
            const newBackup = {
                id: backups.length + 1,
                name: `Respaldo #${backups.length + 1}`,
                date: new Date().toISOString(),
                user: 'admin',
                products: products.length,
                size: `${(2.0 + Math.random() * 0.5).toFixed(1)} MB`,
                isRecent: true
            };
            
            // Marcar el anterior como no reciente
            backups.forEach(b => b.isRecent = false);
            
            // Agregar nuevo respaldo
            backups.push(newBackup);
            
            // Actualizar lista
            loadBackups();
            
            // Restaurar botón
            btn.disabled = false;
            btn.innerHTML = originalText;
            
            // Registrar actividad
            addActivity('Respaldo Creado', `Nuevo respaldo: ${newBackup.name}`, 'admin');
            
            showNotification('Respaldo creado exitosamente', 'success');
        }, 2000);
    }
}

function restoreBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    if (confirm(`¿Estás seguro de restaurar el respaldo "${backup.name}"?\n\nEsta acción sobrescribirá los datos actuales.`)) {
        showNotification(`Restaurando respaldo ${backup.name}...`, 'info');
        
        setTimeout(() => {
            addActivity('Respaldo Restaurado', `Respaldo restaurado: ${backup.name}`, 'admin');
            showNotification('Respaldo restaurado exitosamente', 'success');
        }, 1500);
    }
}

function downloadBackup(backupId) {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    showNotification(`Descargando respaldo ${backup.name}...`, 'info');
    addActivity('Respaldo Descargado', `Respaldo descargado: ${backup.name}`, 'admin');
}

function updateBackupStats() {
    const totalBackups = backups.length;
    const lastBackup = backups.find(b => b.isRecent) || backups[backups.length - 1];
    const totalSize = backups.reduce((sum, backup) => {
        const size = parseFloat(backup.size);
        return sum + (isNaN(size) ? 0 : size);
    }, 0);
    
    // Actualizar estadísticas
    const statBoxes = document.querySelectorAll('.stat-box .stat-number, .stat-box .stat-date, .stat-box .stat-size');
    if (statBoxes.length >= 3) {
        statBoxes[0].textContent = totalBackups;
        statBoxes[1].textContent = lastBackup ? formatDate(new Date(lastBackup.date)) : 'N/A';
        statBoxes[2].textContent = `${totalSize.toFixed(1)} MB`;
    }
}

// ==================== FUNCIONES DE ACTIVIDAD ====================
function loadActivity() {
    if (activityLog.length === 0) {
        initializeActivity();
    }
    
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    // Ordenar por fecha (más reciente primero)
    const sortedLogs = [...activityLog].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    sortedLogs.forEach(log => {
        const date = new Date(log.timestamp);
        const formattedTime = formatDateTime(date);
        
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-marker ${log.type.toLowerCase()}"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4>${log.type}</h4>
                    <span class="timeline-time">${log.user} • ${formattedTime}</span>
                </div>
                <p>${log.description}</p>
                ${log.details ? `<small class="timeline-details">${log.details}</small>` : ''}
            </div>
        `;
        
        timeline.appendChild(item);
    });
    
    updateActivityIndicators();
    updateResultsCount();
}

function initializeActivity() {
    activityLog = [
        {
            id: 1,
            type: "Login",
            description: "Inicio de sesión exitoso",
            user: "admin",
            timestamp: "2025-12-05T18:35:52",
            details: "IP: 192.168.1.100"
        },
        {
            id: 2,
            type: "Login",
            description: "Inicio de sesión exitoso",
            user: "customer1",
            timestamp: "2025-12-05T18:38:05",
            details: "IP: 192.168.1.101"
        },
        {
            id: 3,
            type: "Logout",
            description: "Cierre de sesión",
            user: "customer1",
            timestamp: "2025-12-05T18:56:51",
            details: "Duración: 18 minutos"
        },
        {
            id: 4,
            type: "Login",
            description: "Inicio de sesión exitoso",
            user: "admin",
            timestamp: "2025-12-05T18:57:04",
            details: "IP: 192.168.1.100"
        }
    ];
}

function addActivity(type, description, user, details = '') {
    const newLog = {
        id: activityLog.length + 1,
        type: type,
        description: description,
        user: user,
        timestamp: new Date().toISOString(),
        details: details
    };
    
    activityLog.unshift(newLog); // Agregar al inicio
    
    // Actualizar si estamos en la pestaña de actividad
    if (document.getElementById('activity').classList.contains('active')) {
        loadActivity();
    }
    
    return newLog;
}

function searchActivity() {
    const searchTerm = document.getElementById('activitySearch').value.toLowerCase();
    const items = document.querySelectorAll('.timeline-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            item.style.display = 'flex';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    document.getElementById('resultsCount').textContent = 
        `Mostrando ${visibleCount} de ${activityLog.length} registros`;
}

function updateActivityIndicators() {
    // Contar actividades por tipo
    const addedProducts = activityLog.filter(log => 
        log.type.includes('Producto') && log.type.includes('Agregado')
    ).length;
    
    const updates = activityLog.filter(log => 
        log.type.includes('Editado') || log.type.includes('Actualizado')
    ).length;
    
    const backupCount = activityLog.filter(log => 
        log.type.includes('Respaldo')
    ).length;
    
    // Actualizar indicadores
    document.getElementById('productsAdded').textContent = addedProducts;
    document.getElementById('updatesCount').textContent = updates;
    document.getElementById('backupsCount').textContent = backupCount;
}

function updateResultsCount() {
    document.getElementById('resultsCount').textContent = 
        `Mostrando ${activityLog.length} de ${activityLog.length} registros`;
}

// ==================== FUNCIONES DE SEGURIDAD ====================
function editUser(username) {
    showNotification(`Editando usuario: ${username}`, 'info');
    addActivity('Usuario Editado', `Edición de usuario: ${username}`, 'admin');
}

function resetPassword(username) {
    if (confirm(`¿Reiniciar contraseña de ${username}?`)) {
        showNotification(`Contraseña reiniciada para: ${username}`, 'success');
        addActivity('Contraseña Reiniciada', `Contraseña reiniciada para: ${username}`, 'admin');
    }
}

function addUser() {
    showNotification('Funcionalidad: Agregar nuevo usuario', 'info');
    addActivity('Usuario Nuevo', 'Intento de agregar nuevo usuario', 'admin');
}

// ==================== FUNCIONES DE ANÁLISIS ====================
function loadAnalysis() {
    // Esta función se llama cuando se muestra la pestaña de análisis
    // Podrías agregar gráficos dinámicos aquí
    console.log('Cargando análisis...');
}

// ==================== FUNCIONES AUXILIARES ====================
function openModal() {
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

function formatDateTime(date) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Panel de Administración cargado');
    
    // Inicializar datos
    initializeProducts();
    initializeActivity();
    initializeBackups();
    
    // Cargar productos iniciales
    loadProducts();
    updateDashboardStats();
    
    // Configurar formulario
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addProduct);
    }
    
    // Configurar logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                addActivity('Logout', 'Cierre de sesión del sistema', 'admin');
                showNotification('Sesión cerrada exitosamente', 'success');
                
                // Simular redirección
                setTimeout(() => {
                    // window.location.href = 'login.html'; // En producción
                    console.log('Redirigiendo a login...');
                }, 1000);
            }
        });
    }
    
    // Cargar respaldos si estamos en esa pestaña
    if (document.getElementById('backups').classList.contains('active')) {
        loadBackups();
    }
    
    // Cargar actividad si estamos en esa pestaña
    if (document.getElementById('activity').classList.contains('active')) {
        loadActivity();
    }
    
    console.log('Sistema inicializado correctamente');
});
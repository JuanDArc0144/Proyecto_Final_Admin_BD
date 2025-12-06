// ==================== VARIABLES GLOBALES ====================
let products = [];
let currentProductId = 9; // Comenzamos en 9 porque ya tenemos 8 productos

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
        const tabButtons = document.querySelectorAll('.tab');
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Cargar datos específicos de la pestaña
        loadTabData(tabName);
    }
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'resumen':
            updateDashboardStats();
            updateStockAlerts();
            break;
        case 'productos':
            loadProducts();
            break;
        case 'inventario':
            // Datos ya están cargados estáticamente
            break;
        case 'reportes':
            // Datos ya están cargados estáticamente
            break;
        case 'proveedores':
            // Datos ya están cargados estáticamente
            break;
        case 'agregar':
            // Preparar formulario
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
        const status = isLowStock ? 
            '<span style="color: #e74c3c; font-weight: 500; background: rgba(231, 76, 60, 0.1); padding: 4px 8px; border-radius: 4px;">Bajo</span>' : 
            '<span style="color: #2ecc71; font-weight: 500; background: rgba(46, 204, 113, 0.1); padding: 4px 8px; border-radius: 4px;">Óptimo</span>';
        
        row.innerHTML = `
            <td>${product.name}<br><small>ID: ${product.id}</small></td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td style="${isLowStock ? 'color: #e74c3c; font-weight: bold;' : ''}">${product.stock}</td>
            <td>${product.minStock}</td>
            <td>${product.supplier}</td>
            <td>${status}</td>
            <td>
                <button class="btn-edit" onclick="editProduct(${product.id})" title="Editar producto">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateProductCount();
    updateTopProducts();
}

function initializeProducts() {
    products = [
        {
            id: 1,
            name: "Laptop Dell XPS 15",
            category: "Electrónica",
            supplier: "Dell Inc.",
            price: 1299.99,
            stock: 45,
            minStock: 10,
            addedDate: "2025-11-25",
            totalValue: 58499.55 // 45 * 1299.99
        },
        {
            id: 2,
            name: "Mouse Logitech MX Master",
            category: "Periféricos",
            supplier: "Logitech",
            price: 89.99,
            stock: 120,
            minStock: 30,
            addedDate: "2025-11-22",
            totalValue: 10798.80 // 120 * 89.99
        },
        {
            id: 3,
            name: "Monitor Samsung 27\"",
            category: "Electrónica",
            supplier: "Samsung",
            price: 349.99,
            stock: 8,
            minStock: 15,
            addedDate: "2025-12-01",
            totalValue: 2799.92 // 8 * 349.99
        },
        {
            id: 4,
            name: "Teclado Mecánico Corsair",
            category: "Periféricos",
            supplier: "Corsair",
            price: 129.99,
            stock: 67,
            minStock: 20,
            addedDate: "2025-11-28",
            totalValue: 8709.33 // 67 * 129.99
        },
        {
            id: 5,
            name: "Impresora HP LaserJet",
            category: "Impresión",
            supplier: "HP",
            price: 299.99,
            stock: 12,
            minStock: 8,
            addedDate: "2025-11-20",
            totalValue: 3599.88 // 12 * 299.99
        },
        {
            id: 6,
            name: "SSD Samsung 1TB",
            category: "Almacenamiento",
            supplier: "Samsung",
            price: 129.99,
            stock: 5,
            minStock: 25,
            addedDate: "2025-12-02",
            totalValue: 649.95 // 5 * 129.99
        },
        {
            id: 7,
            name: "Router TP-Link AC1750",
            category: "Redes",
            supplier: "TP-Link",
            price: 69.99,
            stock: 42,
            minStock: 10,
            addedDate: "2025-11-21",
            totalValue: 2939.58 // 42 * 69.99
        },
        {
            id: 8,
            name: "Monitor Samsung 24\"",
            category: "Electrónica",
            supplier: "Samsung",
            price: 249.99,
            stock: 15,
            minStock: 10,
            addedDate: "2025-11-23",
            totalValue: 3749.85 // 15 * 249.99
        }
    ];
    
    // Calcular valor total para cada producto
    products.forEach(product => {
        product.totalValue = product.price * product.stock;
    });
    
    currentProductId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

function updateProductCount() {
    const countElement = document.querySelector('.table-count');
    if (countElement) {
        countElement.textContent = `${products.length} productos en total`;
    }
}

function updateTopProducts() {
    // Ordenar productos por valor total (stock * precio)
    const topProducts = [...products]
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5); // Top 5 productos
    
    const topProductsContainer = document.querySelector('.top-products-grid');
    if (!topProductsContainer) return;
    
    topProductsContainer.innerHTML = '';
    
    topProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'top-product-card';
        productCard.innerHTML = `
            <div class="product-rank">${index + 1}</div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-value">$${product.totalValue.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
        `;
        topProductsContainer.appendChild(productCard);
    });
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Crear modal de edición
    const modalHTML = `
        <div class="modal" id="editModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Editar Producto</h3>
                    <button class="close-modal" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editProductForm" class="product-form">
                        <div class="form-group">
                            <label for="editProductName">Nombre del Producto *</label>
                            <input type="text" id="editProductName" value="${product.name}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editProductCategory">Categoría *</label>
                                <select id="editProductCategory" required>
                                    <option value="electronica" ${product.category === 'Electrónica' ? 'selected' : ''}>Electrónica</option>
                                    <option value="perifericos" ${product.category === 'Periféricos' ? 'selected' : ''}>Periféricos</option>
                                    <option value="impresion" ${product.category === 'Impresión' ? 'selected' : ''}>Impresión</option>
                                    <option value="redes" ${product.category === 'Redes' ? 'selected' : ''}>Redes</option>
                                    <option value="almacenamiento" ${product.category === 'Almacenamiento' ? 'selected' : ''}>Almacenamiento</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="editProductSupplier">Proveedor *</label>
                                <select id="editProductSupplier" required>
                                    <option value="dell" ${product.supplier === 'Dell Inc.' ? 'selected' : ''}>Dell Inc.</option>
                                    <option value="logitech" ${product.supplier === 'Logitech' ? 'selected' : ''}>Logitech</option>
                                    <option value="corsair" ${product.supplier === 'Corsair' ? 'selected' : ''}>Corsair</option>
                                    <option value="hp" ${product.supplier === 'HP' ? 'selected' : ''}>HP</option>
                                    <option value="tp-link" ${product.supplier === 'TP-Link' ? 'selected' : ''}>TP-Link</option>
                                    <option value="samsung" ${product.supplier === 'Samsung' ? 'selected' : ''}>Samsung</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editProductPrice">Precio ($)</label>
                                <input type="number" id="editProductPrice" value="${product.price}" step="0.01" min="0">
                            </div>
                            
                            <div class="form-group">
                                <label for="editProductStock">Stock</label>
                                <input type="number" id="editProductStock" value="${product.stock}" min="0">
                            </div>
                            
                            <div class="form-group">
                                <label for="editProductMinStock">Stock Mínimo</label>
                                <input type="number" id="editProductMinStock" value="${product.minStock}" min="0">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-secondary" onclick="closeModal()">
                                <i class="fas fa-times"></i>
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-save"></i>
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Configurar formulario de edición
    const editForm = document.getElementById('editProductForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProduct(productId);
        });
    }
    
    // Mostrar modal
    document.getElementById('editModal').style.display = 'flex';
}

function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productName = document.getElementById('editProductName').value;
    const productCategory = document.getElementById('editProductCategory').value;
    const productSupplier = document.getElementById('editProductSupplier').value;
    const productPrice = parseFloat(document.getElementById('editProductPrice').value) || 0;
    const productStock = parseInt(document.getElementById('editProductStock').value) || 0;
    const productMinStock = parseInt(document.getElementById('editProductMinStock').value) || 0;
    
    if (!productName || !productCategory || !productSupplier) {
        alert('Por favor, completa los campos obligatorios (*)');
        return;
    }
    
    // Actualizar producto
    product.name = productName;
    product.category = getCategoryName(productCategory);
    product.supplier = getSupplierName(productSupplier);
    product.price = productPrice;
    product.stock = productStock;
    product.minStock = productMinStock;
    product.totalValue = productPrice * productStock;
    
    // Cerrar modal
    closeModal();
    
    // Recargar datos
    loadProducts();
    updateDashboardStats();
    updateStockAlerts();
    
    showNotification('Producto actualizado exitosamente', 'success');
}

function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return;
    
    const productName = products[productIndex].name;
    products.splice(productIndex, 1);
    
    // Recargar datos
    loadProducts();
    updateDashboardStats();
    updateStockAlerts();
    
    showNotification(`Producto "${productName}" eliminado exitosamente`, 'success');
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
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
    
    // Actualizar datos de inventario
    updateInventoryData();
}

function updateInventoryData() {
    // Calcular distribución por categoría
    const categories = {
        'Periféricos': 0,
        'Electrónica': 0,
        'Impresión': 0,
        'Redes': 0,
        'Almacenamiento': 0
    };
    
    products.forEach(product => {
        if (categories.hasOwnProperty(product.category)) {
            categories[product.category] += product.stock;
        }
    });
    
    // Actualizar valores en el DOM si existen
    const categoryItems = document.querySelectorAll('.category-item .category-value');
    if (categoryItems.length >= 5) {
        categoryItems[0].textContent = categories['Periféricos'] || 221;
        categoryItems[1].textContent = categories['Electrónica'] || 53;
        categoryItems[2].textContent = categories['Impresión'] || 12;
        categoryItems[3].textContent = categories['Redes'] || 42;
        categoryItems[4].textContent = categories['Almacenamiento'] || 5;
    }
    
    // Actualizar valor por categoría
    const valueItems = document.querySelectorAll('.value-item .value-amount');
    if (valueItems.length >= 5) {
        // Calcular valores por categoría
        const categoryValues = {
            'Electrónica': products.filter(p => p.category === 'Electrónica').reduce((sum, p) => sum + p.totalValue, 0),
            'Periféricos': products.filter(p => p.category === 'Periféricos').reduce((sum, p) => sum + p.totalValue, 0),
            'Impresión': products.filter(p => p.category === 'Impresión').reduce((sum, p) => sum + p.totalValue, 0),
            'Redes': products.filter(p => p.category === 'Redes').reduce((sum, p) => sum + p.totalValue, 0),
            'Almacenamiento': products.filter(p => p.category === 'Almacenamiento').reduce((sum, p) => sum + p.totalValue, 0)
        };
        
        valueItems[0].textContent = `$${categoryValues['Electrónica'].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        valueItems[1].textContent = `$${categoryValues['Periféricos'].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        valueItems[2].textContent = `$${categoryValues['Impresión'].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        valueItems[3].textContent = `$${categoryValues['Redes'].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        valueItems[4].textContent = `$${categoryValues['Almacenamiento'].toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Actualizar total del inventario
    const totalValue = products.reduce((sum, product) => sum + product.totalValue, 0);
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    
    const totalAmount = document.querySelector('.total-amount');
    const totalUnits = document.querySelector('.total-units');
    
    if (totalAmount) {
        totalAmount.textContent = `$${totalValue.toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    if (totalUnits) {
        totalUnits.textContent = `${totalStock} unidades en stock`;
    }
}

function updateStockAlerts() {
    const lowStockProducts = products.filter(p => p.stock < p.minStock)
        .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock));
    
    const alertsList = document.querySelector('.alerts-list');
    if (!alertsList) return;
    
    alertsList.innerHTML = '';
    
    // Mostrar máximo 2 alertas (como en el diseño)
    const displayProducts = lowStockProducts.slice(0, 2);
    
    displayProducts.forEach(product => {
        const stockPercentage = (product.stock / product.minStock) * 100;
        const isCritical = stockPercentage < 50;
        
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${isCritical ? 'critical' : 'warning'}`;
        
        alertItem.innerHTML = `
            <div class="alert-header">
                <h5>${product.name}</h5>
                <span class="alert-badge">${isCritical ? 'Crítico' : 'Bajo'}</span>
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
                <i class="fas fa-shopping-cart"></i> Reabastecer
            </button>
        `;
        
        alertsList.appendChild(alertItem);
    });
    
    // Si no hay alertas
    if (displayProducts.length === 0) {
        alertsList.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-check-circle" style="font-size: 2rem; color: #2ecc71; margin-bottom: 10px;"></i>
                <p style="color: #7f8c8d;">No hay productos con stock bajo</p>
            </div>
        `;
    }
    
    // Actualizar contador de alertas
    const alertCount = document.querySelector('.stat-number:nth-child(3)');
    if (alertCount) {
        alertCount.textContent = lowStockProducts.length;
    }
}

function reorderProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const reorderAmount = Math.max(product.minStock * 2, product.minStock + 10);
    const suggestedReorder = Math.max(reorderAmount - product.stock, product.minStock);
    
    if (confirm(`¿Deseas reabastecer "${product.name}"?\n\nStock actual: ${product.stock}\nStock mínimo: ${product.minStock}\nSugerencia: ${suggestedReorder} unidades`)) {
        // Simular proceso de reabastecimiento
        const reorderBtn = event.target.closest('.alert-action-btn');
        if (reorderBtn) {
            reorderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solicitando...';
            reorderBtn.disabled = true;
            
            setTimeout(() => {
                // Incrementar stock (en una aplicación real, esto vendría del servidor)
                product.stock += suggestedReorder;
                product.totalValue = product.price * product.stock;
                
                // Actualizar datos
                loadProducts();
                updateDashboardStats();
                updateStockAlerts();
                
                showNotification(`Producto "${product.name}" reabastecido exitosamente (+${suggestedReorder} unidades)`, 'success');
            }, 1500);
        }
    }
}

// ==================== FUNCIONES DEL FORMULARIO ====================
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
        addedDate: new Date().toISOString().split('T')[0],
        totalValue: productPrice * productStock
    };
    
    products.push(newProduct);
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Actualizar datos
    loadProducts();
    updateDashboardStats();
    updateStockAlerts();
    
    // Mostrar notificación
    showNotification('Producto agregado exitosamente', 'success');
    
    // Cambiar a pestaña de productos
    showTab('productos');
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
        'logitech': 'Logitech',
        'corsair': 'Corsair',
        'hp': 'HP',
        'tp-link': 'TP-Link',
        'samsung': 'Samsung'
    };
    return suppliers[supplierValue] || supplierValue;
}

// ==================== FUNCIONES DE REPORTES ====================
function generateReport(reportType) {
    const generateBtn = event.target;
    const originalText = generateBtn.innerHTML;
    
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        showNotification(`Reporte de ${reportType} generado exitosamente`, 'success');
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        // Simular descarga del reporte
        console.log(`Reporte de ${reportType} generado:`, {
            fecha: new Date().toLocaleString('es-ES'),
            productos: products.length,
            valorTotal: products.reduce((sum, p) => sum + p.totalValue, 0),
            stockTotal: products.reduce((sum, p) => sum + p.stock, 0)
        });
    }, 2000);
}

// ==================== FUNCIONES DE PROVEEDORES ====================
function updateSuppliersData() {
    // Calcular stock por proveedor
    const suppliersData = {};
    
    products.forEach(product => {
        if (!suppliersData[product.supplier]) {
            suppliersData[product.supplier] = {
                stock: 0,
                products: 0,
                value: 0
            };
        }
        suppliersData[product.supplier].stock += product.stock;
        suppliersData[product.supplier].products += 1;
        suppliersData[product.supplier].value += product.totalValue;
    });
    
    // Ordenar proveedores por stock
    const sortedSuppliers = Object.entries(suppliersData)
        .sort((a, b) => b[1].stock - a[1].stock);
    
    // Actualizar lista de proveedores si existe
    const suppliersList = document.querySelector('.suppliers-list');
    if (suppliersList) {
        suppliersList.innerHTML = '';
        
        sortedSuppliers.forEach(([supplier, data]) => {
            const supplierItem = document.createElement('div');
            supplierItem.className = 'supplier-item';
            supplierItem.innerHTML = `
                <span class="supplier-name">${supplier}</span>
                <span class="supplier-stock">${data.stock} unidades</span>
            `;
            suppliersList.appendChild(supplierItem);
        });
    }
}

// ==================== FUNCIONES AUXILIARES ====================
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
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: white; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Agregar animación CSS si no existe
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification.fade-out {
                animation: slideOut 0.3s ease forwards;
            }
        `;
        document.head.appendChild(style);
    }
}

function simulateDataUpdates() {
    // Simular actualizaciones periódicas de datos
    setInterval(() => {
        // Simular cambios menores en el stock
        products.forEach(product => {
            if (Math.random() > 0.7) { // 30% de probabilidad
                const change = Math.floor(Math.random() * 3) - 1; // -1, 0, o +1
                product.stock = Math.max(0, product.stock + change);
                product.totalValue = product.price * product.stock;
            }
        });
        
        // Actualizar datos si estamos en la pestaña de resumen
        if (document.getElementById('resumen').classList.contains('active')) {
            updateDashboardStats();
            updateStockAlerts();
        }
        
        // Actualizar productos si estamos en esa pestaña
        if (document.getElementById('productos').classList.contains('active')) {
            loadProducts();
        }
        
        console.log('Datos actualizados automáticamente - ' + new Date().toLocaleTimeString());
    }, 30000); // Cada 30 segundos
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Panel de Gerencia cargado');
    
    // Inicializar datos
    initializeProducts();
    
    // Configurar pestañas
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Configurar formulario de agregar producto
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', addProduct);
    }
    
    // Configurar botón de limpiar formulario
    const resetBtn = addProductForm ? addProductForm.querySelector('button[type="reset"]') : null;
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            showNotification('Formulario limpiado', 'info');
        });
    }
    
    // Configurar logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                showNotification('Sesión cerrada exitosamente', 'success');
                setTimeout(() => {
                    console.log('Redirigiendo a login...');
                    // window.location.href = 'login.html'; // En producción
                }, 1000);
            }
        });
    }
    
    // Configurar botones de generación de reportes
    const generateBtns = document.querySelectorAll('.generate-btn');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportName = this.closest('.report-card').querySelector('h4').textContent;
            generateReport(reportName);
        });
    });
    
    // Cargar datos iniciales
    loadProducts();
    updateDashboardStats();
    updateStockAlerts();
    updateSuppliersData();
    
    // Iniciar actualizaciones automáticas
    simulateDataUpdates();
    
    console.log('Sistema inicializado correctamente');
});
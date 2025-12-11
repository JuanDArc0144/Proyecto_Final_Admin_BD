// ==================== VARIABLES GLOBALES ====================
let products = [];
// Estas variables guardarán la "traducción" de ID a Nombre, las categorías y proveedores
let categoriesMap = {}; 
let suppliersMap = {};
let allCategories = [];
let allSuppliers = [];
// ==================== FUNCIONES DE ANÁLISIS AVANZADO ====================

function loadAnalysis() {
    console.log('Cargando análisis...');
    
    // 1. Reutilizamos las gráficas que ya funcionan (Stock y Valor)
    updateStockAlerts(); 
    updateCategoryChart();
    updateCategoryValues(); 

    // 2. Cargamos los datos nuevos (Proveedores y Top Modelos)
    fetch('../endpoints/obtener_analisis.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderSuppliersChart(data.proveedores);
                renderTopProducts(data.top_productos);
            }
        })
        .catch(error => console.error('Error cargando análisis:', error));
}

function renderSuppliersChart(data) {
    const container = document.querySelector('.supplier-list');
    if (!container) return;
    
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="color:#999;">No hay datos de proveedores</p>';
        return;
    }

    // Encontrar el valor máximo para calcular el ancho de las barras (regla de 3)
    const maxVal = Math.max(...data.map(item => parseInt(item.total)), 1);
    
    // Colores para las barras
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'];

    data.forEach((item, index) => {
        const percentage = (item.total / maxVal) * 100;
        const color = colors[index % colors.length];

        const html = `
            <div class="supplier-item" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <span class="supplier-name" style="width: 120px; font-weight: 500; color: #2c3e50;">${item.nombre}</span>
                <div class="supplier-bar" style="flex: 1; height: 10px; background: #ecf0f1; border-radius: 5px; overflow: hidden;">
                    <div class="bar-fill" style="width: ${percentage}%; height: 100%; background: ${color}; border-radius: 5px; transition: width 1s ease;"></div>
                </div>
                <span class="supplier-count" style="width: 30px; text-align: right; font-weight: bold; color: ${color};">${item.total}</span>
            </div>
        `;
        container.innerHTML += html;
    });
}

function renderTopProducts(data) {
    const container = document.querySelector('.model-list');
    if (!container) return;
    
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="color:#999;">No hay productos destacados</p>';
        return;
    }

    data.forEach(item => {
        const html = `
            <div class="model-item" style="display: flex; align-items: center; gap: 15px; padding: 12px; border-bottom: 1px solid #f8f9fa;">
                <i class="fas fa-star" style="color: #f39c12;"></i>
                <div class="model-info" style="flex:1;">
                    <strong style="color: #2c3e50; display:block;">${item.nombre}</strong>
                    <small style="color: #7f8c8d;">Stock: ${item.stock} unidades</small>
                </div>
                <span style="font-weight: bold; color: #2ecc71;">$${parseFloat(item.precio_venta).toFixed(2)}</span>
            </div>
        `;
        container.innerHTML += html;
    });
}
// ==================== FUNCIONES DE ACTIVIDAD (REAL) ====================

function loadActivity() {
    console.log("Cargando bitácora de actividad...");
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    fetch('../endpoints/obtener_actividad.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 1. Llenar Línea de Tiempo
                timeline.innerHTML = '';
                
                if (data.data.length === 0) {
                    timeline.innerHTML = '<p style="padding:20px; color:#999;">No hay actividad registrada aún.</p>';
                } else {
                    data.data.forEach(log => {
                        // Determinar icono y color según acción
                        let iconClass = 'info';
                        let markerClass = 'login'; // por defecto
                        
                        if (log.tipo_accion.includes('LOGIN')) { markerClass = 'login'; }
                        else if (log.tipo_accion.includes('PRODUCTO')) { markerClass = 'update'; } // Reutilizando estilo update (azul)
                        else if (log.tipo_accion.includes('RESPALDO')) { markerClass = 'backup'; } // Reutilizando estilo backup (morado)
                        else if (log.tipo_accion.includes('ELIMINAR')) { markerClass = 'logout'; } // Rojo

                        const date = new Date(log.fecha).toLocaleString();

                        const html = `
                            <div class="timeline-item">
                                <div class="timeline-marker ${markerClass}"></div>
                                <div class="timeline-content">
                                    <div class="timeline-header">
                                        <h4>${log.tipo_accion}</h4>
                                        <span class="timeline-time">${log.usuario} • ${date}</span>
                                    </div>
                                    <p>${log.descripcion}</p>
                                </div>
                            </div>
                        `;
                        timeline.innerHTML += html;
                    });
                }

                // 2. Actualizar Indicadores Numéricos
                document.getElementById('productsAdded').textContent = data.stats.productos || 0;
                document.getElementById('updatesCount').textContent = data.stats.actualizaciones || 0;
                document.getElementById('backupsCount').textContent = data.stats.respaldos || 0;
                
                // Actualizar contador de resultados
                const countLabel = document.getElementById('resultsCount');
                if(countLabel) countLabel.textContent = `Mostrando últimos ${data.data.length} registros`;
            }
        })
        .catch(err => console.error("Error cargando actividad:", err));
}

// ==================== GESTIÓN DE USUARIOS (SEGURIDAD) ====================
function loadUsers() {
    console.log("Cargando usuarios...");
    const container = document.getElementById('usersListContainer');
    
    fetch('../endpoints/obtener_usuarios.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                container.innerHTML = '';
                
                if (data.data.length === 0) {
                    container.innerHTML = '<p>No hay usuarios registrados.</p>';
                    return;
                }

                data.data.forEach(user => {
                    // Formatear último acceso
                    const lastLogin = user.ultimo_acceso 
                        ? new Date(user.ultimo_acceso).toLocaleString() 
                        : 'Nunca';
                    
                    // Estilo diferente para Admin
                    const isAdmin = user.puesto.toLowerCase().includes('admin');
                    const itemClass = isAdmin ? 'user-item admin' : 'user-item';
                    const icon = isAdmin ? 'user-shield' : 'user';

                    const html = `
                        <div class="${itemClass}">
                            <div class="user-avatar">
                                <i class="fas fa-${icon}"></i>
                            </div>
                            <div class="user-info">
                                <h4>${user.nombre}</h4>
                                <span class="user-role">${user.puesto} • ${user.email}</span>
                                <span class="user-last-login">Último acceso: ${lastLogin}</span>
                            </div>
                            <div class="user-actions">
                                <button class="icon-btn" title="Editar" onclick='editUser(${JSON.stringify(user)})'>
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="icon-btn" title="Eliminar" onclick="deleteUser(${user.id_empleado})" style="color:#e74c3c; border-color:#e74c3c;">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    container.innerHTML += html;
                });
            }
        })
        .catch(err => console.error(err));
}

// Abrir modal para CREAR usuario
function openUserModal() {
    document.getElementById('modalTitle').textContent = 'Registrar Nuevo Usuario';
    
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveUserBackend(event)" class="product-form">
            <input type="hidden" name="id_empleado" value="">
            
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" required placeholder="Ej: Juan Pérez">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="correo@ejemplo.com">
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" placeholder="10 dígitos">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Puesto / Rol</label>
                    <select name="puesto" required>
                        <option value="Empleado">Empleado</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" name="password" required placeholder="Mínimo 6 caracteres">
                </div>
            </div>
            
            <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Guardar Usuario</button>
        </form>
    `;
    openModal();
}

// Abrir modal para EDITAR usuario
function editUser(user) { // Recibe el objeto usuario completo
    document.getElementById('modalTitle').textContent = 'Editar Usuario: ' + user.nombre;
    
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveUserBackend(event)" class="product-form">
            <input type="hidden" name="id_empleado" value="${user.id_empleado}">
            
            <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre" value="${user.nombre}" required>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="${user.email}" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value="${user.telefono}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Puesto / Rol</label>
                    <select name="puesto" id="userRoleSelect" required>
                        <option value="Empleado">Empleado</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contraseña (Dejar vacío para no cambiar)</label>
                    <input type="password" name="password" placeholder="Nueva contraseña (opcional)">
                </div>
            </div>
            
            <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Actualizar Usuario</button>
        </form>
    `;
    
    // Seleccionar el rol actual
    document.getElementById('userRoleSelect').value = user.puesto;
    openModal();
}

// Guardar (Insertar o Actualizar)
function saveUserBackend(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    fetch('../endpoints/guardar_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Usuario guardado exitosamente', 'success');
            closeModal();
            loadUsers(); // Recargar lista
        } else {
            alert('Error: ' + data.message);
        }
    });
}

// Eliminar Usuario
function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción es irreversible.')) return;
    
    fetch('../endpoints/eliminar_usuario.php', {
        method: 'POST',
        body: JSON.stringify({ id: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Usuario eliminado', 'success');
            loadUsers();
        } else {
            alert('Error: ' + data.message);
        }
    });
}
// ==================== FUNCIONES DE RESPALDOS (REALES) ====================
function restoreBackup(fileName) {
    // Confirmación doble por seguridad
    if (!confirm(`¡ALERTA, ALERTA, ALERTA! \n\nEstás a punto de restaurar el respaldo: "${fileName}".\n\nEsto BORRARÁ TODOS los datos actuales y los reemplazará con los de este respaldo.\n\n¿Estás absolutamente seguro?`)) {
        return;
    }

    showNotification('Restaurando base de datos, por favor espera...', 'info');
    
    fetch('../endpoints/restaurar_respaldo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ archivo: fileName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('¡Sistema restaurado exitosamente!', 'success');
            // Recargamos todo para ver los datos antiguos que volvieron
            setTimeout(() => {
                loadProducts();
                updateDashboardStats();
                loadAnalysis();
            }, 1000);
        } else {
            alert('Error al restaurar: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión al intentar restaurar.');
    });
}

function loadBackups() {
    console.log("Cargando lista de respaldos...");
    const listContainer = document.getElementById('backupList');
    
    fetch('../endpoints/listar_respaldos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 1. Actualizar Estadísticas
                document.getElementById('totalBackups').textContent = data.stats.count;
                document.getElementById('lastBackupDate').textContent = data.stats.last_backup;
                document.getElementById('totalBackupSize').textContent = formatBytes(data.stats.total_size);
                document.getElementById('backupsCount').textContent = data.stats.count; // Indicador pestaña actividad

                // 2. Llenar la lista
                listContainer.innerHTML = '';
                
                if (data.data.length === 0) {
                    listContainer.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">No hay respaldos creados aún.</p>';
                    return;
                }

                data.data.forEach((backup, index) => {
                    const isRecent = index === 0; // El primero es el más reciente
                    const html = `
                        <div class="backup-item ${isRecent ? 'recent' : ''}">
                            <div class="backup-header">
                                <span class="backup-title">${backup.nombre}</span>
                                ${isRecent ? '<span class="backup-badge">Más reciente</span>' : ''}
                            </div>
                            <div class="backup-details">
                                <span><i class="far fa-calendar"></i> ${backup.fecha}</span>
                                <span><i class="fas fa-hdd"></i> ${formatBytes(backup.size)}</span>
                            </div>
                            <div class="backup-actions">
                                <a href="../respaldos/${backup.nombre}" download class="action-btn download-btn" style="text-decoration:none;">
                                    <i class="fas fa-download"></i> Descargar
                                </a>
                                <button class="action-btn restore-btn" onclick="restoreBackup('${backup.nombre}')">
                                    <i class="fas fa-redo"></i> Restaurar
                                </button>
                            </div>
                        </div>
                    `;
                    listContainer.innerHTML += html;
                });
            }
        })
        .catch(err => console.error("Error cargando respaldos:", err));
}

function createBackup() {
    if (!confirm('¿Deseas crear un nuevo respaldo de la base de datos ahora?')) return;

    const btn = document.getElementById('createBackupBtn');
    const originalText = btn.innerHTML;
    
    // UI de carga
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

    fetch('../endpoints/crear_respaldo.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Respaldo creado exitosamente', 'success');
                loadBackups(); // Recargar la lista para ver el nuevo
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error de conexión al crear respaldo.');
        })
        .finally(() => {
            // Restaurar botón
            btn.disabled = false;
            btn.innerHTML = originalText;
        });
}

// Función auxiliar para convertir bytes a MB/KB
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// ==================== GESTIÓN DE SESIÓN ====================
function saveUserBackend(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Validación rápida de contraseña para nuevos usuarios
    const id = formData.get('id_empleado');
    const pass = formData.get('password');
    if (!id && (!pass || pass.length < 6)) {
        alert("La contraseña es obligatoria y debe tener al menos 6 caracteres.");
        return;
    }

    fetch('../endpoints/guardar_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Usuario guardado exitosamente', 'success');
            closeModal();
            loadUsers(); // Recargar la lista para ver al nuevo
        } else {
            alert('Error al guardar: ' + data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error de conexión al guardar usuario.');
    });
}

function addUser() {
    document.getElementById('modalTitle').textContent = 'Registrar Nuevo Usuario';
    
    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="saveUserBackend(event)" class="product-form">
            <input type="hidden" name="id_empleado" value="">
            
            <div class="form-group">
                <label>Nombre Completo *</label>
                <input type="text" name="nombre" required placeholder="Ej: Juan Pérez">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required placeholder="correo@ejemplo.com">
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" placeholder="10 dígitos">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Puesto / Rol *</label>
                    <select name="puesto" required>
                        <option value="Empleado">Empleado</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Admin">Administrador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Contraseña *</label>
                    <input type="password" name="password" required placeholder="Mínimo 6 caracteres">
                </div>
            </div>
            
            <button type="submit" class="submit-btn">
                <i class="fas fa-save"></i> Guardar Usuario
            </button>
        </form>
    `;
    openModal();
}

function checkSession() {
    return fetch('../endpoints/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                // Si está logueado, actualizamos el header
                document.getElementById('headerUsername').textContent = data.nombre;
                document.getElementById('headerRole').textContent = data.puesto;
                console.log(`Sesión activa: ${data.nombre} (${data.puesto})`);
                return true; // Continuar carga
            } else {
                // Si NO está logueado, lo mandamos al login inmediatamente
                alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
                globalThis.location.href = '../templates/index.html'; // Ajusta la ruta si tu login está en otro lado
                return false; // Detener carga
            }
        })
        .catch(error => {
            console.error('Error verificando sesión:', error);
            return false;
        });
}

function logout() {
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;

    fetch('../endpoints/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../templates/index.html'; // Redirigir al login
            }
        })
        .catch(error => console.error('Error al cerrar sesión:', error));
}
// ==================== FUNCIONES AUXILIARES DE MODAL ====================

function openModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'flex';
        // Puedes agregar una clase para animación si usas CSS
        // modal.classList.add('active'); 
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        // modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Opcional: Limpiar el contenido del modal cuando se cierra
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
             modalBody.innerHTML = '';
        }
    }
}

// ==================== FUNCIONES DE NAVEGACIÓN ====================
function showTab(tabName) {
    // 1. Ocultar todos los contenidos y desactivar todos los botones
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
    
    // 2. Mostrar el contenido seleccionado
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // 3. Activar el botón correspondiente (CORRECCIÓN: Mapeo completo)
    const buttons = document.querySelectorAll('.tab');
    
    // Este objeto dice qué índice de botón corresponde a cada pestaña
    // Basado en el orden de tu HTML: Resumen(0), Productos(1), Análisis(2), Respaldos(3), Seguridad(4), Actividad(5)
    const tabIndices = {
        'dashboard': 0,
        'products': 1,
        'analysis': 2,
        'backups': 3,
        'security': 4,
        'activity': 5
    };

    // Si la pestaña existe en el mapa, activamos ese botón
    if (tabIndices[tabName] !== undefined && buttons[tabIndices[tabName]]) {
        buttons[tabIndices[tabName]].classList.add('active');
    }
    
    // 4. Cargar datos específicos según la pestaña
    if (tabName === 'security') loadUsers();
    if (tabName === 'products') loadProducts();
    if (tabName === 'dashboard') updateDashboardStats();
    if (tabName === 'analysis') loadAnalysis();
    // Si tienes funciones para las otras pestañas, agrégalas aquí:
    if (tabName === 'backups' && typeof loadBackups === 'function') loadBackups();
    if (tabName === 'activity' && typeof loadActivity === 'function') loadActivity();
}

// ==================== FUNCIONES DE PRODUCTOS ====================

function addProduct(event) {
    event.preventDefault();
    
    const formData = new FormData();
    
    // 1. Recolectar datos del formulario HTML actualizado
    formData.append('nombre', document.getElementById('productName').value);
    formData.append('categoria', document.getElementById('productCategory').value); // Envía el ID
    formData.append('proveedor', document.getElementById('productSupplier').value); // Envía el ID
    
    // Nuevos campos que coinciden con tu DB
    formData.append('descripcion', document.getElementById('productDescription').value);
    formData.append('precio_compra', document.getElementById('productPurchasePrice').value);
    formData.append('precio_venta', document.getElementById('productSalePrice').value);
    
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('stock_minimo', document.getElementById('productMinStock').value);
    
    // 2. Enviar a PHP
    fetch('../endpoints/guardar_producto.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Producto guardado exitosamente', 'success');
            // Limpiar formulario
            document.getElementById('addProductForm').reset();
            
            // Recargar datos para ver el nuevo producto
            loadProducts(); 
            updateDashboardStats();
            
            // Cambiar a la pestaña de lista para verlo
            showTab('products'); 
        } else {
            alert('Error al guardar: ' + data.message);
            console.error(data);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error de conexión al intentar guardar.');
    });
}

function loadProducts() {
    fetch('../endpoints/obtener_productos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                products = data.data;
                
                // Renderizar tablas y contadores
                renderProductsTable(products);
                updateProductCount(); 
                
                // Actualizar las secciones del Dashboard
                updateStockAlerts();      // Alertas de stock
                updateCategoryChart();    // Gráfica de barras (si la usas)
                updateCategoryValues();   // <--- ¡AGREGA ESTA LÍNEA NUEVA!
                
            } else {
                console.error('Error cargando productos');
            }
        })
        .catch(error => console.error('Error de red:', error));
}

function renderProductsTable(productsList) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (productsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay productos</td></tr>';
        return;
    }
    
    productsList.forEach(product => {
        // Convertimos a números para evitar errores de comparación
        const stock = Number.parseInt(product.stock);
        const minStock = Number.parseInt(product.stock_minimo);
        // Usamos precio_venta según tu imagen
        const precio = Number.parseFloat(product.precio_venta); 
        const isLowStock = stock < minStock;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${product.nombre}
                <br><small style="color:#666; font-size:0.8em;">${product.descripcion || ''}</small>
            </td>
            <td>${getCategoryName(product.id_categoria)}</td>
            <td>${getSupplierName(product.id_proveedor)}</td>
            <td>$${precio.toFixed(2)}</td>
            <td style="${isLowStock ? 'color:red; font-weight:bold;' : ''}">${stock}</td>
            <td>${minStock}</td>
            <td>
                <button class="btn-delete" onclick="deleteProduct(${product.id_producto})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateProductCount();
}

// Función que faltaba y causaba el error ReferenceError
function updateProductCount() {
    const countElement = document.querySelector('.table-count');
    if (countElement) {
        countElement.textContent = `${products.length} productos en total`;
    }
}

// ==================== FUNCIONES DE MAPEO (IDS a NOMBRES) ====================
// Aquí convertimos los números 1, 2, 3 de tu BD a Nombres Reales
function getCategoryName(id) {
    // Busca en el mapa dinámico, si no existe devuelve el ID
    return categoriesMap[id] || 'Desconocido (ID: ' + id + ')';
}

function getSupplierName(id) {
    // Busca en el mapa dinámico
    return suppliersMap[id] || 'Desconocido (ID: ' + id + ')';
}
// ==================== FUNCIONES DEL DASHBOARD ====================

function updateDashboardStats() {
    fetch('../endpoints/dashboard_stats.php')
    .then(res => {
        if (!res.ok) throw new Error('Error 500 en servidor');
        return res.json();
    })
    .then(data => {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].textContent = data.total_productos;
            statNumbers[1].textContent = `$${parseFloat(data.valor_inventario).toLocaleString('es-ES', {minimumFractionDigits: 2})}`;
            statNumbers[2].textContent = data.stock_bajo;
            statNumbers[3].textContent = data.total_stock;
        }
    })
    .catch(err => console.error("Error Dashboard:", err));
}

// ==================== ELIMINAR ====================
function deleteProduct(productId) {
    if (!confirm('¿Borrar producto?')) return;
    
    fetch('../endpoints/eliminar_producto.php', {
        method: 'POST',
        body: JSON.stringify({ id: productId })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            loadProducts();
            updateDashboardStats();
        } else {
            alert('Error al eliminar');
        }
    });
}

// ==================== LÓGICA DE ALERTAS Y GRÁFICAS ====================
// ===================FUNCIÓN PARA CARGAR CATÁLOGOS====================
//función para editar producto
function editProduct(productId) {
    const product = products.find(p => p.id_producto == productId);
    if (!product) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Producto #' + productId;
    
    // Generamos las opciones de categoría dinámicamente 
    let categoryOptions = '';
    allCategories.forEach(cat => {
        // Marcamos como 'selected' si coincide con el producto actual
        const selected = cat.id_categoria == product.id_categoria ? 'selected' : '';
        categoryOptions += `<option value="${cat.id_categoria}" ${selected}>${cat.nombre}</option>`;
    });

    // Generamos las opciones de proveedor dinámicamente
    let supplierOptions = '';
    allSuppliers.forEach(prov => {
        const selected = prov.id_proveedor == product.id_proveedor ? 'selected' : '';
        supplierOptions += `<option value="${prov.id_proveedor}" ${selected}>${prov.nombre}</option>`;
    });

    document.getElementById('modalBody').innerHTML = `
        <form onsubmit="updateProductBackend(event)" class="product-form">
            <input type="hidden" name="id_producto" value="${productId}">
            
            <div class="form-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value="${product.nombre}" required>
            </div>
            
            <div class="form-group">
                <label>Categoría</label>
                <select name="categoria" id="editCategoryModal" required>
                    ${categoryOptions} </select>
            </div>

            <div class="form-group">
                <label>Proveedor</label>
                <select name="proveedor" id="editSupplierModal" required>
                     ${supplierOptions} </select>
            </div>

            <div class="form-group">
                <label>Descripción</label>
                <input type="text" name="descripcion" value="${product.descripcion || ''}">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>P. Compra</label>
                    <input type="number" name="precio_compra" value="${product.precio_compra}" step="0.01">
                </div>
                <div class="form-group">
                    <label>P. Venta</label>
                    <input type="number" name="precio_venta" value="${product.precio_venta}" step="0.01">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" value="${product.stock}">
                </div>
                 <div class="form-group">
                    <label>Mínimo</label>
                    <input type="number" name="stock_minimo" value="${product.stock_minimo}">
                </div>
            </div>
            <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Actualizar</button>
        </form>
    `;
    
    openModal();
}

function populateSelect(elementId, items, valueField, textField) {
    const select = document.getElementById(elementId);
    if (!select) return;

    // Guardar la primera opción (el placeholder "Selecciona...")
    const firstOption = select.options[0];
    select.innerHTML = ''; // Limpiar todo
    select.appendChild(firstOption); // Volver a poner el placeholder

    // Crear las opciones dinámicas
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField]; // El valor será el ID (ej: 6)
        option.textContent = item[textField]; // El texto será el Nombre (ej: Computación)
        select.appendChild(option);
    });
}

function loadCatalogs() {
    return fetch('../endpoints/obtener_catalogos.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 1. Guardamos las listas crudas en variables globales
                allCategories = data.data.categorias;
                allSuppliers = data.data.proveedores;

                // 2. Llenamos los MAPAS (para traducir ID -> Nombre en la tabla)
                allCategories.forEach(cat => { categoriesMap[cat.id_categoria] = cat.nombre; });
                allSuppliers.forEach(prov => { suppliersMap[prov.id_proveedor] = prov.nombre; });

                // 3. LLENAR LOS SELECTS DEL FORMULARIO PRINCIPAL "AGREGAR PRODUCTO"
                populateSelect('productCategory', allCategories, 'id_categoria', 'nombre');
                populateSelect('productSupplier', allSuppliers, 'id_proveedor', 'nombre');
                
                console.log("Catálogos cargados y selects llenos.");
            }
        })
        .catch(error => console.error('Error cargando catálogos:', error));
}


function updateCategoryValues() {
    const container = document.querySelector('.value-categories');
    if (!container) return;

    container.innerHTML = ''; // Limpiar contenido previo

    // 1. Calcular totales agrupando por categoría
    const totals = {};

    products.forEach(product => {
        const catId = product.id_categoria;
        
        // Calculamos: Stock actual * Precio de Compra
        // Nota: Si prefieres ver cuánto ganarías al venderlo, cambia precio_compra por precio_venta
        const totalValue = parseFloat(product.precio_compra) * parseInt(product.stock);

        if (!totals[catId]) {
            totals[catId] = 0;
        }
        totals[catId] += totalValue;
    });

    // 2. Verificar si hay datos
    if (Object.keys(totals).length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">Sin inventario valorizado</p>';
        return;
    }

    // 3. Generar el HTML para cada categoría encontrada
    for (const [id, value] of Object.entries(totals)) {
        const catName = getCategoryName(id); // Usamos tu función auxiliar existente
        const formattedValue = value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

        const html = `
            <div class="value-category" style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span class="value-label" style="color: #666; font-weight: 500;">${catName}</span>
                <span class="value-amount" style="color: #2c3e50; font-weight: bold;">${formattedValue}</span>
            </div>
        `;
        container.innerHTML += html;
    }
}

function updateStockAlerts() {
    const container = document.querySelector('.alerts-list');
    if (!container) return;

    container.innerHTML = ''; // Limpiar cualquier HTML previo

    // Filtrar productos con stock bajo real
    const lowStockProducts = products.filter(p => parseInt(p.stock) < parseInt(p.stock_minimo));

    if (lowStockProducts.length === 0) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #2ecc71;">
                <i class="fas fa-check-circle" style="font-size: 2em; margin-bottom: 10px;"></i>
                <p>Todo el inventario está en niveles óptimos.</p>
            </div>`;
        return;
    }

    lowStockProducts.forEach(product => {
        const stock = parseInt(product.stock);
        const min = parseInt(product.stock_minimo);
        const percentage = Math.min(100, Math.round((stock / min) * 100));
        
        // Determinar si es crítico (menos del 50% del mínimo)
        const isCritical = percentage < 50;
        
        const html = `
            <div class="alert-item ${isCritical ? 'critical' : 'warning'}" style="padding: 15px; border-left: 4px solid ${isCritical ? '#e74c3c' : '#f39c12'}; background: #fff; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div class="alert-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h5 style="margin: 0; font-size: 1.1em;">${product.nombre}</h5>
                    <span class="alert-badge" style="background: ${isCritical ? '#fadbd8' : '#fdebd0'}; color: ${isCritical ? '#c0392b' : '#d35400'}; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">
                        ${isCritical ? 'CRÍTICO' : 'BAJO'}
                    </span>
                </div>
                <div class="alert-details">
                    <span class="stock-info" style="display: block; font-size: 0.9em; color: #666; margin-bottom: 5px;">
                        <i class="fas fa-box"></i> Stock actual: <strong>${stock}</strong> (Mínimo: ${min})
                    </span>
                    <div class="stock-progress" style="height: 6px; background: #eee; border-radius: 3px; overflow: hidden; margin-top: 5px;">
                        <div class="progress-fill" style="width: ${percentage}%; height: 100%; background: ${isCritical ? '#e74c3c' : '#f39c12'};"></div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}
function updateCategoryChart() {
    // ... (Parte 1: Contar productos se queda IGUAL) ...
    const categoryCounts = {};
    products.forEach(p => {
        const catName = getCategoryName(p.id_categoria);
        categoryCounts[catName] = (categoryCounts[catName] || 0) + parseInt(p.stock);
    });

    const barsContainer = document.querySelector('.chart-bars');
    const listContainer = document.querySelector('.category-stats');
    
    if(listContainer) listContainer.innerHTML = '';
    if(barsContainer) {
        barsContainer.innerHTML = '';
        barsContainer.style.overflowX = 'auto'; 
        barsContainer.style.paddingBottom = '30px'; 
    }

    // --- CAMBIO CLAVE AQUÍ ---
    // En lugar de usar el valor máximo directo, usamos Logaritmos para suavizar la curva
    const rawMax = Math.max(...Object.values(categoryCounts), 1);
    const logMax = Math.log(rawMax + 1); // +1 para evitar log(0) o log(1)
    
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
    let colorIndex = 0;

    for (const [category, count] of Object.entries(categoryCounts)) {
        const color = colors[colorIndex % colors.length];
        
        // Agregar a la lista (Se queda igual)
        if (listContainer) {
             listContainer.innerHTML += `
                <div class="category-item" style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px; border-bottom: 1px solid #f0f0f0;">
                    <span class="category-name" style="color: #555; font-size: 0.9em;">${category}</span>
                    <span class="category-value" style="font-weight: bold; color: ${color};">${count}</span>
                </div>
            `;
        }

        // --- CÁLCULO DE ALTURA LOGARÍTMICA ---
        // Esto hace que los valores pequeños (ej. 5) no desaparezcan frente a los grandes (ej. 200)
        const logValue = Math.log(count + 1);
        let percentage = (logValue / logMax) * 100;
        
        // Aseguramos un mínimo visual del 15% para que siempre haya barra
        let displayHeight = Math.max(percentage, 15); 

        if (barsContainer) {
            barsContainer.innerHTML += `
                <div class="bar-wrapper" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; margin: 0 8px; min-width: 45px;">
                    <span style="font-size: 11px; font-weight: bold; color: #333; margin-bottom: 5px;">${count}</span>
                    <div class="bar" style="
                        height: ${displayHeight}%; 
                        background: ${color}; 
                        width: 100%; 
                        border-radius: 6px 6px 0 0; 
                        transition: height 0.5s ease;
                        position: relative;
                        opacity: 0.9;
                    " title="${category}: ${count} unidades">
                    </div>
                    <span style="
                        margin-top: 5px; 
                        font-size: 10px; 
                        color: #666; 
                        transform: rotate(-45deg); 
                        white-space: nowrap; 
                        transform-origin: left top;
                        width: 100%;
                        text-align: right;
                    ">${category.substring(0, 10)}</span>
                </div>
            `;
        }
        colorIndex++;
    }
}
// ==================== FUNCIONES AUXILIARES (NOTIFICACIONES) ====================

function showNotification(message, type = 'info') {
    // Crear el elemento div de la notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Definir colores según el tipo (éxito, error, info)
    const bgColor = type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db';
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';

    // Estilos inline para asegurar que se vea bien sin tocar mucho CSS
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 500;
        animation: slideIn 0.3s ease-out forwards;
    `;

    notification.innerHTML = `
        <i class="fas fa-${icon}" style="font-size: 1.2em;"></i>
        <span>${message}</span>
    `;

    // Agregar al cuerpo del documento
    document.body.appendChild(notification);

    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Agregar estilos de animación al documento si no existen
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);
// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificar Sesión antes de cargar nada
    checkSession().then(isLoggedIn => {
        if (isLoggedIn) {
            // Si la sesión es válida, cargamos el resto del sistema
            
            // Configurar botón de Logout
            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) {
                // Eliminamos eventos anteriores clonando el nodo (truco rápido)
                // O simplemente asignamos el onclick directo:
                logoutBtn.onclick = logout; 
            }

            // Configurar formulario de productos
            const addForm = document.getElementById('addProductForm');
            if (addForm) {
                addForm.addEventListener('submit', addProduct);
            }

            // Cargar datos
            loadCatalogs().then(() => {
                loadProducts();
                updateDashboardStats();
            });
        }
    });
});
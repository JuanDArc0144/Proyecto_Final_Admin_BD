
// Funcionalidad para el panel del cliente

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación del cliente
    initCustomerApp();
});

function initCustomerApp() {
    // Cargar datos del cliente desde localStorage o datos por defecto
    loadCustomerData();
    
    // Configurar navegación entre pestañas
    setupTabNavigation();
    
    // Configurar productos del catálogo
    setupProductsCatalog();
    
    // Configurar carrito de compras
    setupShoppingCart();
    
    // Configurar pedidos
    setupOrders();
    
    // Configurar perfil
    setupProfile();
    
    // Configurar eventos globales
    setupGlobalEvents();
}

function loadCustomerData() {
    // Intentar cargar datos del cliente desde localStorage
    const savedCustomer = localStorage.getItem('customerData');
    
    if (savedCustomer) {
        const customer = JSON.parse(savedCustomer);
        updateCustomerUI(customer);
    } else {
        // Datos por defecto
        const defaultCustomer = {
            username: 'customer1',
            name: 'customer',
            email: 'customer@juanrry.com',
            phone: '+1 (555) 123-4567',
            address: '123 Calle Principal, Ciudad',
            stats: {
                totalOrders: 2,
                completedOrders: 1,
                processingOrders: 1,
                totalSpent: 1549.96
            }
        };
        
        // Guardar datos por defecto
        localStorage.setItem('customerData', JSON.stringify(defaultCustomer));
        updateCustomerUI(defaultCustomer);
    }
    
    // Cargar carrito desde localStorage
    loadCartFromStorage();
}

function updateCustomerUI(customer) {
    // Actualizar elementos de la interfaz
    document.getElementById('customerUsername').textContent = customer.username;
    document.getElementById('customerName').textContent = customer.name;
    document.getElementById('profileName').textContent = customer.username;
    document.getElementById('infoUsername').textContent = customer.username;
    document.getElementById('infoEmail').textContent = customer.email;
    document.getElementById('infoPhone').textContent = customer.phone;
    document.getElementById('infoAddress').textContent = customer.address;
    document.getElementById('totalOrders').textContent = customer.stats.totalOrders;
    document.getElementById('completedOrders').textContent = customer.stats.completedOrders;
    document.getElementById('processingOrders').textContent = customer.stats.processingOrders;
    document.getElementById('totalSpent').textContent = `$${customer.stats.totalSpent.toFixed(2)}`;
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const panes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const pageTitle = this.getAttribute('data-title');
            
            // Actualizar título de la pestaña del navegador
            if (pageTitle) {
                document.title = pageTitle;
            }
            
            // Remover clase active de todas las pestañas y paneles
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const targetPane = document.getElementById(`${targetTab}-content`);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Ejecutar funciones específicas según la pestaña
                executeTabSpecificFunctions(targetTab);
            }
        });
    });
}

function executeTabSpecificFunctions(tabName) {
    switch(tabName) {
        case 'catalogo':
            updateProductsDisplay();
            break;
        case 'carrito':
            updateCartDisplay();
            break;
        case 'pedidos':
            updateOrdersDisplay();
            break;
        case 'perfil':
            updateProfileDisplay();
            break;
    }
}

function setupProductsCatalog() {
    // Productos de ejemplo
    const products = [
        {
            id: 1,
            name: 'Laptop Dell XPS 15',
            category: 'Electrónica',
            price: 1299.99,
            stock: 45,
            icon: 'fas fa-laptop'
        },
        {
            id: 2,
            name: 'Mouse Logitech MX Master',
            category: 'Periféricos',
            price: 89.99,
            stock: 120,
            icon: 'fas fa-mouse'
        },
        {
            id: 3,
            name: 'Monitor Samsung 27"',
            category: 'Electrónica',
            price: 349.99,
            stock: 8,
            icon: 'fas fa-tv'
        },
        {
            id: 4,
            name: 'Teclado Mecánico Corsair',
            category: 'Periféricos',
            price: 129.99,
            stock: 67,
            icon: 'fas fa-keyboard'
        },
        {
            id: 5,
            name: 'SSD Samsung 1TB',
            category: 'Almacenamiento',
            price: 89.99,
            stock: 5,
            icon: 'fas fa-hdd'
        },
        {
            id: 6,
            name: 'Impresora HP LaserJet',
            category: 'Impresión',
            price: 299.99,
            stock: 15,
            icon: 'fas fa-print'
        },
        {
            id: 7,
            name: 'Router Cisco',
            category: 'Redes',
            price: 199.99,
            stock: 42,
            icon: 'fas fa-wifi'
        },
        {
            id: 8,
            name: 'Tablet Samsung Galaxy',
            category: 'Electrónica',
            price: 399.99,
            stock: 23,
            icon: 'fas fa-tablet-alt'
        }
    ];
    
    // Guardar productos en localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Configurar búsqueda
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            updateProductsDisplay(this.value.toLowerCase());
        });
    }
    
    // Configurar filtros por categoría
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Actualizar botones activos
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar productos
            updateProductsDisplay('', category);
        });
    });
}

function updateProductsDisplay(searchTerm = '', category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Obtener productos del localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filtrar productos
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    if (category !== 'all') {
        const categoryMap = {
            'electronica': 'Electrónica',
            'perifericos': 'Periféricos',
            'almacenamiento': 'Almacenamiento',
            'redes': 'Redes',
            'impresion': 'Impresión'
        };
        
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryMap[category]
        );
    }
    
    // Generar HTML de productos
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h4>No se encontraron productos</h4>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    let productsHTML = '';
    filteredProducts.forEach(product => {
        productsHTML += `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <span class="product-category">${product.category}</span>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock">Stock: ${product.stock} unidades</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
    });
    
    productsGrid.innerHTML = productsHTML;
}

function setupShoppingCart() {
    // Inicializar carrito vacío si no existe
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Actualizar contador del carrito
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        if (cartCount === 0) {
            cartCountElement.style.display = 'none';
        } else {
            cartCountElement.style.display = 'flex';
        }
    }
}

function loadCartFromStorage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
    return cart;
}

function addToCart(productId) {
    // Obtener productos y carrito
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Encontrar el producto
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Verificar stock disponible
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            showNotification('No hay suficiente stock disponible', 'error');
            return;
        }
    } else {
        // Verificar stock disponible
        if (product.stock > 0) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                icon: product.icon,
                category: product.category
            });
        } else {
            showNotification('Producto sin stock disponible', 'error');
            return;
        }
    }
    
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar interfaz
    updateCartCount();
    showNotification(`${product.name} agregado al carrito`, 'success');
    
    // Si estamos en la pestaña del carrito, actualizar display
    if (document.querySelector('#carrito-content').classList.contains('active')) {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContainer');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.querySelector('.empty-cart');
    const cartWithItems = document.querySelector('.cart-with-items');
    
    if (!cartContainer || !cartItems) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartWithItems.style.display = 'none';
        return;
    }
    
    // Mostrar carrito con items
    emptyCart.style.display = 'none';
    cartWithItems.style.display = 'block';
    
    // Generar HTML de items del carrito
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <p>${item.category}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, 0, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    
    // Actualizar totales
    const shipping = 5.99;
    const total = subtotal + shipping;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, change, newQuantity = null) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    if (newQuantity !== null) {
        const quantity = parseInt(newQuantity);
        if (quantity >= 1 && quantity <= product.stock) {
            cart[itemIndex].quantity = quantity;
        } else if (quantity > product.stock) {
            showNotification(`Solo hay ${product.stock} unidades disponibles`, 'error');
            cart[itemIndex].quantity = product.stock;
        }
    } else {
        const newQty = cart[itemIndex].quantity + change;
        if (newQty >= 1 && newQty <= product.stock) {
            cart[itemIndex].quantity = newQty;
        } else if (newQty > product.stock) {
            showNotification(`Solo hay ${product.stock} unidades disponibles`, 'error');
            cart[itemIndex].quantity = product.stock;
        }
    }
    
    // Si la cantidad es 0, eliminar del carrito
    if (cart[itemIndex].quantity === 0) {
        cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    updateCartCount();
    updateCartDisplay();
    showNotification('Producto eliminado del carrito', 'success');
}

function setupOrders() {
    // Pedidos de ejemplo
    const orders = [
        {
            id: 'ORD-001',
            date: '30 de noviembre de 2025, 18:38',
            status: 'completed',
            items: [
                { name: 'Mouse Logitech MX Master', quantity: 1, price: 89.99 },
                { name: 'Webcam Logitech C920', quantity: 2, price: 79.99 }
            ],
            total: 249.97
        },
        {
            id: 'ORD-002',
            date: '3 de diciembre de 2025, 18:38',
            status: 'processing',
            items: [
                { name: 'Laptop Dell XPS 15', quantity: 1, price: 1299.99 },
                { name: 'SSD Samsung 1TB', quantity: 1, price: 89.99 }
            ],
            total: 1389.98
        }
    ];
    
    // Guardar pedidos en localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
}

function updateOrdersDisplay() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-clipboard-list"></i>
                <h4>No tienes pedidos aún</h4>
                <p>Realiza tu primer pedido desde el catálogo</p>
            </div>
        `;
        return;
    }
    
    let ordersHTML = '';
    orders.forEach(order => {
        let itemsHTML = '';
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${order.date}</span>
                    <span class="order-status status-${order.status}">
                        ${order.status === 'completed' ? 'Completado' : 'En Proceso'}
                    </span>
                </div>
                <div class="order-items">
                    ${itemsHTML}
                </div>
                <div class="order-total">
                    <span>Total:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = ordersHTML;
}

function setupProfile() {
    // Botón para editar perfil
    const editProfileBtn = document.querySelector('.btn-edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            document.getElementById('editProfileModal').style.display = 'flex';
        });
    }
    
    // Configurar modal de edición
    const modal = document.getElementById('editProfileModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.cancel-edit');
    const editForm = document.getElementById('editProfileForm');
    
    // Cerrar modal
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Cerrar modal haciendo clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Guardar cambios del perfil
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedCustomer = {
            username: document.getElementById('editName').value,
            name: document.getElementById('editName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            address: document.getElementById('editAddress').value,
            stats: JSON.parse(localStorage.getItem('customerData')).stats
        };
        
        // Guardar en localStorage
        localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
        
        // Actualizar interfaz
        updateCustomerUI(updatedCustomer);
        
        // Cerrar modal
        modal.style.display = 'none';
        
        // Mostrar notificación
        showNotification('Perfil actualizado exitosamente', 'success');
    });
}

function updateProfileDisplay() {
    // Actualizar estadísticas si es necesario
    const customerData = JSON.parse(localStorage.getItem('customerData'));
    if (customerData) {
        updateCustomerUI(customerData);
    }
}

function setupGlobalEvents() {
    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Aquí podrías limpiar datos temporales si es necesario
                window.location.href = 'index.html';
            }
        });
    }
    
    // Botón de proceder al pago
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }
            
            if (confirm('¿Deseas proceder con el pago?')) {
                // Simular proceso de pago
                processCheckout();
            }
        });
    }
}

function processCheckout() {
    // Simular procesamiento de pago
    showNotification('Procesando pago...', 'info');
    
    setTimeout(() => {
        // Crear nuevo pedido
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        if (cart.length === 0) return;
        
        // Calcular total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5.99;
        
        // Crear nuevo pedido
        const newOrder = {
            id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
            date: new Date().toLocaleString('es-ES'),
            status: 'processing',
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: total
        };
        
        // Agregar pedido
        orders.unshift(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Vaciar carrito
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Actualizar contador
        updateCartCount();
        updateCartDisplay();
        
        // Actualizar estadísticas del cliente
        const customerData = JSON.parse(localStorage.getItem('customerData'));
        if (customerData) {
            customerData.stats.totalOrders += 1;
            customerData.stats.processingOrders += 1;
            customerData.stats.totalSpent += total;
            localStorage.setItem('customerData', JSON.stringify(customerData));
        }
        
        // Mostrar confirmación
        showNotification('¡Pedido realizado exitosamente!', 'success');
        
        // Si estamos en la pestaña de pedidos, actualizar
        if (document.querySelector('#pedidos-content').classList.contains('active')) {
            updateOrdersDisplay();
        }
    }, 2000);
}

function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Colores según el tipo
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Agregar al documento
    document.body.appendChild(notification);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Agregar estilos CSS para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .status-completed {
        background: #d5f4e6;
        color: #27ae60;
    }
    
    .status-processing {
        background: #fef9e7;
        color: #f39c12;
    }
    
    .no-products, .no-orders {
        text-align: center;
        padding: 40px 20px;
        grid-column: 1 / -1;
    }
    
    .no-products i, .no-orders i {
        font-size: 3rem;
        color: #bdc3c7;
        margin-bottom: 15px;
    }
    
    .no-products h4, .no-orders h4 {
        color: #2c3e50;
        margin-bottom: 10px;
    }
    
    .no-products p, .no-orders p {
        color: #7f8c8d;
    }
`;
document.head.appendChild(notificationStyles);
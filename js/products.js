document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const searchBar = document.getElementById('search-bar');
    const categoryFilters = document.getElementById('category-filters');
    const productGrid = document.getElementById('product-grid');
    const loadingIndicator = document.getElementById('products-loading');
    const errorIndicator = document.getElementById('products-error');
    const noResultsIndicator = document.getElementById('no-results');
    const modalContainer = document.getElementById('modal-detalles-container');

    // Estado de la aplicación
    let allProducts = [];
    let allCategories = [];
    let currentCategory = 'all';
    let searchTerm = '';

    /**
     * Inicializa la página: obtiene datos y configura eventos
     */
    async function init() {
        showLoading();
        try {
            const [productsResponse, categoriesResponse] = await Promise.all([
                fetch('api/productos.php?action=getProductos'),
                fetch('api/productos.php?action=getCategorias')
            ]);

            const productsResult = await productsResponse.json();
            const categoriesResult = await categoriesResponse.json();

            if (productsResult.success) {
                allProducts = productsResult.data;
            } else {
                throw new Error(productsResult.error || 'Error al cargar productos');
            }

            if (categoriesResult.success) {
                allCategories = categoriesResult.data;
            } else {
                throw new Error(categoriesResult.error || 'Error al cargar categorías');
            }

            renderCategories();
            filterAndRender();
            setupEventListeners();

        } catch (error) {
            console.error('Error en la inicialización:', error);
            showError();
        } finally {
            hideLoading();
        }
    }

    /**
     * Configura los event listeners para búsqueda y filtros
     */
    function setupEventListeners() {
        let searchTimeout;
        searchBar.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = e.target.value.toLowerCase();
                filterAndRender();
            }, 300);
        });

        categoryFilters.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                currentCategory = e.target.dataset.category;
                categoryFilters.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                filterAndRender();
            }
        });

        productGrid.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const productId = target.dataset.productId;

            if (target.matches('.btn-add-to-cart')) {
                const itemType = target.dataset.itemType;
                addToCart(productId, itemType);
            } else if (target.matches('.btn-view-details')) {
                openModal(productId);
            }
        });
    }

    /**
     * Agrega un item al carrito y actualiza el UI en tiempo real.
     * @param {string} itemId - El ID del producto o servicio
     * @param {string} itemType - 'product' o 'service'
     */
    async function addToCart(itemId, itemType) {
        const isLoggedIn = localStorage.getItem('usuario_logueado');
        if (!isLoggedIn) {
            showNotification('Debes iniciar sesión para agregar productos al carrito', 'error');
            return;
        }

        try {
            const response = await fetch('api/cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_id: itemId,
                    item_type: itemType,
                    quantity: 1
                }),
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Producto agregado al carrito', 'success');
                if (window.headerManager) {
                    window.headerManager.updateCartCount();
                }
                // Actualización en tiempo real del stock
                if (itemType === 'product' && result.new_stock !== null) {
                    updateProductStockOnPage(itemId, result.new_stock);
                }
            } else {
                throw new Error(result.error || 'Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error en addToCart:', error);
            showNotification(error.message, 'error');
        }
    }
    
    /**
     * Actualiza la tarjeta de un producto en la página para reflejar el nuevo stock.
     * @param {string} productId - El ID del producto a actualizar.
     * @param {number} newStock - El nuevo valor del stock.
     */
    function updateProductStockOnPage(productId, newStock) {
        // 1. Actualizar el estado en el array `allProducts`
        const productInState = allProducts.find(p => p.id_producto == productId);
        if (productInState) {
            productInState.stock = newStock;
        }

        // 2. Actualizar la tarjeta del producto en el DOM
        const productCard = document.querySelector(`.btn-add-to-cart[data-product-id="${productId}"]`)?.closest('.product-card');
        if (!productCard) return;

        const stockStatusEl = productCard.querySelector('.product-stock-status');
        const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
        const imageContainer = productCard.querySelector('.product-image-container');
        const soldOutOverlay = imageContainer.querySelector('.sold-out-overlay');

        const isSoldOut = newStock <= 0;

        if (stockStatusEl) {
            stockStatusEl.innerHTML = isSoldOut
                ? `<span class="stock-sold-out"><i class="fas fa-times-circle"></i> Agotado</span>`
                : `<span class="stock-available"><i class="fas fa-check-circle"></i> ${newStock} en stock</span>`;
        }

        if (isSoldOut) {
            productCard.classList.add('sold-out');
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Agotado';
            }
            if (!soldOutOverlay) {
                const overlay = document.createElement('div');
                overlay.className = 'sold-out-overlay';
                overlay.textContent = 'Agotado';
                imageContainer.appendChild(overlay);
            }
        } else {
            // Esto es útil si en el futuro se puede quitar del carrito desde aquí
            productCard.classList.remove('sold-out');
            if (addToCartBtn) {
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Agregar';
            }
            if (soldOutOverlay) {
                soldOutOverlay.remove();
            }
        }
    }

    /**
     * Filtra los productos y los renderiza.
     */
    function filterAndRender() {
        let filteredProducts = allProducts;

        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.categoria === currentCategory);
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.nombre.toLowerCase().includes(searchTerm) ||
                (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm))
            );
        }

        renderProducts(filteredProducts);
    }

    /**
     * Renderiza las tarjetas de producto en el grid.
     * @param {Array} products - La lista de productos a renderizar.
     */
    function renderProducts(products) {
        productGrid.innerHTML = '';
        if (products.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();
        const productCards = products.map(product => {
            const isSoldOut = product.stock <= 0;
            return `
            <div class="product-card ${isSoldOut ? 'sold-out' : ''}">
                <div class="product-image-container">
                    <img src="${product.imagen || 'https://via.placeholder.com/300'}" alt="${product.nombre}">
                    ${isSoldOut ? '<div class="sold-out-overlay">Agotado</div>' : ''}
                </div>
                <div class="product-info">
                    <span class="product-category">${product.categoria}</span>
                    <h4 class="product-name">${product.nombre}</h4>
                    <div class="product-stock-status">
                        ${isSoldOut
                            ? '<span class="stock-sold-out"><i class="fas fa-times-circle"></i> Agotado</span>'
                            : `<span class="stock-available"><i class="fas fa-check-circle"></i> ${product.stock} en stock</span>`
                        }
                    </div>
                    <p class="product-price">${formatPrice(product.precio_venta)}</p>
                    <div class="product-actions">
                        <button class="btn btn-secondary btn-view-details" data-product-id="${product.id_producto}">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </button>
                        <button 
                            class="btn btn-primary btn-add-to-cart" 
                            data-product-id="${product.id_producto}" 
                            data-item-type="product" 
                            ${isSoldOut ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> ${isSoldOut ? 'Agotado' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        `}).join('');

        productGrid.innerHTML = productCards;
    }

    /**
     * Renderiza los botones de filtro de categoría.
     */
    function renderCategories() {
        let categoryButtons = '<button class="filter-btn active" data-category="all">Todas</button>';
        allCategories.forEach(category => {
            categoryButtons += `<button class="filter-btn" data-category="${category}">${category}</button>`;
        });
        categoryFilters.innerHTML = categoryButtons;
    }

    /**
     * Abre y renderiza el modal con los detalles de un producto.
     * @param {string} productId - El ID del producto a mostrar.
     */
    function openModal(productId) {
        const product = allProducts.find(p => p.id_producto == productId);
        if (!product) {
            console.error('Producto no encontrado');
            return;
        }

        const isSoldOut = product.stock <= 0;

        modalContainer.innerHTML = `
            <div class="modal-detalles show" id="modal-detalles-producto">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${product.nombre}</h2>
                        <button class="modal-close" id="modal-close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-product-layout">
                            <div class="modal-product-image">
                                <img src="${product.imagen || 'https://via.placeholder.com/300'}" alt="${product.nombre}">
                            </div>
                            <div class="modal-product-info">
                                <p class="modal-product-price">${formatPrice(product.precio_venta)}</p>
                                <div class="modal-product-stock">
                                    ${isSoldOut
                                        ? '<span class="stock-sold-out"><i class="fas fa-times-circle"></i> Agotado</span>'
                                        : `<span class="stock-available"><i class="fas fa-check-circle"></i> ${product.stock} unidades en stock</span>`
                                    }
                                </div>
                                <p class="modal-product-description">${product.descripcion || 'No hay descripción disponible.'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="modal-cancel-btn"><i class="fas fa-times"></i> Cerrar</button>
                        <button 
                            class="btn btn-primary btn-add-to-cart-modal" 
                            data-product-id="${product.id_producto}" 
                            data-item-type="product" 
                            ${isSoldOut ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
        modalContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-detalles')) {
                closeModal();
            }
        });

        const addToCartModalBtn = document.querySelector('.btn-add-to-cart-modal');
        if (addToCartModalBtn && !addToCartModalBtn.disabled) {
            addToCartModalBtn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                addToCart(button.dataset.productId, button.dataset.itemType);
                closeModal();
            });
        }
    }

    /**
     * Cierra el modal de detalles.
     */
    function closeModal() {
        const modal = document.getElementById('modal-detalles-producto');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modalContainer.innerHTML = '';
            }, 300);
        }
    }

    // --- Funciones de utilidad ---
    function showLoading() { loadingIndicator.style.display = 'flex'; productGrid.style.display = 'none'; errorIndicator.style.display = 'none'; noResultsIndicator.style.display = 'none'; }
    function hideLoading() { loadingIndicator.style.display = 'none'; productGrid.style.display = 'grid'; }
    function showError() { loadingIndicator.style.display = 'none'; productGrid.style.display = 'none'; errorIndicator.style.display = 'flex'; }
    function showNoResults() { noResultsIndicator.style.display = 'flex'; }
    function hideNoResults() { noResultsIndicator.style.display = 'none'; }

    function formatPrice(price) {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) return '$0';
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(numericPrice);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Iniciar la aplicación
    init();

    // Estilos dinámicos
    const dynamicStyles = `
        <style>
        .notification { position: fixed; top: 90px; left: 50%; transform: translate(-50%, -20px); background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); display: flex; align-items: center; gap: 12px; z-index: 1001; opacity: 0; transition: transform 0.3s ease-out, opacity 0.3s ease-out; max-width: 400px; width: 90%; justify-content: center; }
        .notification.show { opacity: 1; transform: translate(-50%, 0); }
        .notification-success { border-left: 4px solid #10b981; }
        .notification-success i { color: #10b981; }
        .notification-error { border-left: 4px solid #f44336; }
        .notification-error i { color: #f44336; }
        .product-actions { display: flex; gap: 8px; margin-top: 1rem; }
        .product-actions .btn { flex-grow: 1; font-size: 0.875rem; padding: 0.6rem; }
        .modal-product-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
        .modal-product-image img { width: 100%; border-radius: 8px; }
        .modal-product-price { font-size: 2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem; }
        .modal-product-stock { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem; }
        .modal-product-stock span { font-weight: 600; }
        .modal-product-description { font-size: 1rem; line-height: 1.6; }
        .product-card.sold-out { opacity: 0.7; }
        .product-image-container { position: relative; }
        .sold-out-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.5); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: #f44336; border-radius: 8px 8px 0 0; }
        .product-stock-status { font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stock-available { color: #10b981; }
        .stock-sold-out { color: #f44336; font-weight: 600; }
        .btn:disabled { background-color: #ccc; cursor: not-allowed; }
        @media (max-width: 768px) { .modal-product-layout { grid-template-columns: 1fr; } }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', dynamicStyles);
});
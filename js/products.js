document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const searchBar = document.getElementById('search-bar');
    const categoryFilters = document.getElementById('category-filters');
    const productGrid = document.getElementById('product-grid');
    const loadingIndicator = document.getElementById('products-loading');
    const errorIndicator = document.getElementById('products-error');
    const noResultsIndicator = document.getElementById('no-results');

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
            // Obtener productos y categorías en paralelo
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
        // Listener para la barra de búsqueda (con debounce)
        let searchTimeout;
        searchBar.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = e.target.value.toLowerCase();
                filterAndRender();
            }, 300); // Espera 300ms después de que el usuario deja de escribir
        });

        // Listener para los botones de categoría (usando delegación de eventos)
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                currentCategory = e.target.dataset.category;
                // Actualizar clase activa
                categoryFilters.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                filterAndRender();
            }
        });
    }

    /**
     * Filtra los productos según el término de búsqueda y la categoría actual, y los renderiza
     */
    function filterAndRender() {
        let filteredProducts = allProducts;

        // 1. Filtrar por categoría
        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.categoria === currentCategory);
        }

        // 2. Filtrar por término de búsqueda
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.nombre.toLowerCase().includes(searchTerm) ||
                (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm))
            );
        }

        renderProducts(filteredProducts);
    }

    /**
     * Renderiza las tarjetas de producto en el grid
     * @param {Array} products - La lista de productos a renderizar
     */
    function renderProducts(products) {
        productGrid.innerHTML = ''; // Limpiar el grid

        if (products.length === 0) {
            showNoResults();
            return;
        }

        hideNoResults();
        const productCards = products.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.imagen || 'https://via.placeholder.com/300'}" alt="${product.nombre}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.categoria}</span>
                    <h4 class="product-name">${product.nombre}</h4>
                    <p class="product-price">$${formatPrice(product.precio_venta)}</p>
                    <div class="product-action">
                        <button class="btn" data-product-id="${product.id_producto}">Ver Detalles</button>
                    </div>
                </div>
            </div>
        `).join('');

        productGrid.innerHTML = productCards;
    }

    /**
     * Renderiza los botones de filtro de categoría
     */
    function renderCategories() {
        let categoryButtons = '<button class="filter-btn active" data-category="all">Todas</button>';
        
        allCategories.forEach(category => {
            categoryButtons += `<button class="filter-btn" data-category="${category}">${category}</button>`;
        });

        categoryFilters.innerHTML = categoryButtons;
    }

    // --- Funciones de utilidad ---

    function showLoading() {
        loadingIndicator.style.display = 'flex';
        productGrid.style.display = 'none';
        errorIndicator.style.display = 'none';
        noResultsIndicator.style.display = 'none';
    }

    function hideLoading() {
        loadingIndicator.style.display = 'none';
        productGrid.style.display = 'grid';
    }

    function showError() {
        loadingIndicator.style.display = 'none';
        productGrid.style.display = 'none';
        errorIndicator.style.display = 'flex';
    }

    function showNoResults() {
        noResultsIndicator.style.display = 'flex';
    }

    function hideNoResults() {
        noResultsIndicator.style.display = 'none';
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);
    }

    // Iniciar la aplicación
    init();
});
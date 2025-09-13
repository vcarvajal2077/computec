/* ===== COMPUTEC PLATFORM - PRODUCTOS ===== */

class ProductsPage {
    constructor() {
        this.products = [];
        this.currentFilter = 'all';
        this.cart = [];
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadProducts();
        this.loadCart();
    }

    bindElements() {
        this.productsGrid = document.getElementById('products-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.cartCount = document.getElementById('cart-count');
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    async loadProducts() {
        try {
            this.showLoading();
            
            // Simular carga de productos (en producción vendría de una API)
            const mockProducts = [
                {
                    id: 1,
                    name: 'Laptop Gaming Pro',
                    price: 2500000,
                    category: 'laptops',
                    image: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=Laptop+Gaming',
                    description: 'Laptop gaming de alta gama con tarjeta gráfica dedicada',
                    features: ['Intel i7', '16GB RAM', 'GTX 1660', 'SSD 512GB'],
                    stock: 5
                },
                {
                    id: 2,
                    name: 'Mouse Gaming RGB',
                    price: 150000,
                    category: 'accesorios',
                    image: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Mouse+Gaming',
                    description: 'Mouse gaming con iluminación RGB y sensor óptico avanzado',
                    features: ['RGB', 'DPI Ajustable', 'Ergonómico', 'Cable Braided'],
                    stock: 10
                },
                {
                    id: 3,
                    name: 'Teclado Mecánico',
                    price: 200000,
                    category: 'accesorios',
                    image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Teclado+Mecánico',
                    description: 'Teclado mecánico con switches Cherry MX y retroiluminación',
                    features: ['Cherry MX', 'Retroiluminación', 'Anti-ghosting', 'USB-C'],
                    stock: 8
                },
                {
                    id: 4,
                    name: 'Monitor 24" 4K',
                    price: 800000,
                    category: 'perifericos',
                    image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Monitor+4K',
                    description: 'Monitor 4K de 24 pulgadas con tecnología IPS',
                    features: ['4K UHD', 'IPS Panel', 'HDR10', 'USB-C'],
                    stock: 3
                },
                {
                    id: 5,
                    name: 'Procesador Intel i5',
                    price: 600000,
                    category: 'componentes',
                    image: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Intel+i5',
                    description: 'Procesador Intel Core i5 de 10ma generación',
                    features: ['6 Cores', '12 Threads', '4.3GHz', 'LGA 1200'],
                    stock: 12
                },
                {
                    id: 6,
                    name: 'Memoria RAM 16GB',
                    price: 300000,
                    category: 'componentes',
                    image: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=RAM+16GB',
                    description: 'Memoria RAM DDR4 de 16GB a 3200MHz',
                    features: ['DDR4', '3200MHz', 'CL16', 'Dual Channel'],
                    stock: 20
                }
            ];

            this.products = mockProducts;
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Error al cargar productos');
        } finally {
            this.hideLoading();
        }
    }

    renderProducts() {
        if (!this.productsGrid) return;

        const filteredProducts = this.currentFilter === 'all' 
            ? this.products 
            : this.products.filter(product => product.category === this.currentFilter);

        this.productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn btn-primary" onclick="productsPage.viewProduct(${product.id})">
                            <i class="fas fa-eye"></i>
                            <span>Ver Detalles</span>
                        </button>
                    </div>
                </div>
                <div class="product-content">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="product-price">
                        <span class="price">$${product.price.toLocaleString()}</span>
                        <span class="stock">Stock: ${product.stock}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="productsPage.addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            <span>${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                        </button>
                        <button class="btn btn-outline" onclick="productsPage.addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    handleFilter(e) {
        const button = e.currentTarget;
        const category = button.getAttribute('data-category');

        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update current filter
        this.currentFilter = category;

        // Re-render products
        this.renderProducts();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.updateCartUI();
        this.showNotification(`${product.name} agregado al carrito`, 'success');
        this.saveCart();
    }

    addToWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.showNotification(`${product.name} agregado a favoritos`, 'info');
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.showProductModal(product);
        }
    }

    showProductModal(product) {
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${product.name}</h3>
                    <button class="modal-close" onclick="this.closest('.product-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-details">
                        <div class="product-image-large">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <p class="product-description">${product.description}</p>
                            <div class="product-features">
                                <h4>Características:</h4>
                                <ul>
                                    ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="product-price-large">
                                <span class="price">$${product.price.toLocaleString()}</span>
                                <span class="stock">Stock disponible: ${product.stock}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="productsPage.addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        <span>${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}</span>
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.product-modal').remove()">
                        <i class="fas fa-times"></i>
                        <span>Cerrar</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.textContent = totalItems;
        }
    }

    loadCart() {
        const savedCart = localStorage.getItem('computec_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('computec_cart', JSON.stringify(this.cart));
    }

    showLoading() {
        if (this.productsGrid) {
            this.productsGrid.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Cargando productos...</p>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading will be replaced by renderProducts
    }

    showError(message) {
        if (this.productsGrid) {
            this.productsGrid.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error al cargar productos</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="productsPage.loadProducts()">
                        <i class="fas fa-refresh"></i>
                        <span>Reintentar</span>
                    </button>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize products page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        window.productsPage = new ProductsPage();
    }
});

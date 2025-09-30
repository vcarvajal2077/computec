document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cartContainer = document.getElementById('cart-container');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary');
    const cartLoading = document.getElementById('cart-loading');
    const cartError = document.getElementById('cart-error');
    const cartEmpty = document.getElementById('cart-empty');

    // Utility to format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    };

    const showState = (state) => {
        cartLoading.style.display = state === 'loading' ? 'flex' : 'none';
        cartError.style.display = state === 'error' ? 'flex' : 'none';
        cartEmpty.style.display = state === 'empty' ? 'flex' : 'none';
        cartItemsList.style.display = state === 'content' ? 'block' : 'none';
        cartSummary.style.display = state === 'content' ? 'block' : 'none';
    };

    const fetchCartItems = async () => {
        showState('loading');
        try {
            const response = await fetch('api/cart.php');
            if (!response.ok) {
                // Handle non-2xx responses by checking for JSON error message
                const errorData = await response.json().catch(() => null);
                if (response.status === 401 && errorData && errorData.error === 'Usuario no autenticado') {
                     throw new Error('Debes iniciar sesión para ver tu carrito.');
                }
                throw new Error('No se pudo cargar el carrito. Intenta de nuevo.');
            }
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                renderCart(result.data);
            } else {
                throw new Error(result.error || 'La respuesta de la API no tiene el formato esperado.');
            }
        } catch (error) {
            showState('error');
            cartError.querySelector('p').textContent = error.message;
            console.error(error);
        }
    };

    const renderCart = (items) => {
        if (items.length === 0) {
            showState('empty');
            return;
        }

        showState('content');
        let cartHTML = '';
        let subtotal = 0;

        items.forEach(item => {
            const itemPrice = parseFloat(item.item_price);
            const itemTotal = itemPrice * item.quantity;
            subtotal += itemTotal;
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.item_image || 'https://via.placeholder.com/80'}" alt="${item.item_name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.item_name}</p>
                        <p class="cart-item-type">Tipo: ${item.item_type === 'product' ? 'Producto' : 'Servicio'}</p>
                    </div>
                    <div class="cart-item-price">${formatPrice(itemPrice)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change" data-action="decrease" data-cart-item-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" readonly>
                        <button class="quantity-change" data-action="increase" data-cart-item-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">${formatPrice(itemTotal)}</div>
                    <button class="remove-item" data-cart-item-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        cartItemsList.innerHTML = cartHTML;
        renderSummary(subtotal);
    };

    const renderSummary = (subtotal) => {
        const total = subtotal; // Future logic for taxes, shipping, etc.
        cartSummary.innerHTML = `
            <h2>Resumen del Pedido</h2>
            <div class="cart-total">
                <span>Total:</span>
                <span>${formatPrice(total)}</span>
            </div>
            <a href="checkout.html" class="checkout-button ${subtotal === 0 ? 'disabled' : ''}">Proceder al Pago</a>
        `;
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            const response = await fetch('api/cart.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_item_id: cartItemId, quantity: quantity })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Error al actualizar la cantidad' }));
                throw new Error(errorData.error);
            }
            fetchCartItems(); // Reload cart to reflect changes
        } catch (error) {
            console.error(error);
            alert(error.message); // Show specific error to the user
        }
    };

    const removeItem = async (cartItemId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este artículo del carrito?')) {
            return;
        }
        try {
            const response = await fetch('api/cart.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_item_id: cartItemId })
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el artículo');
            }
            fetchCartItems(); // Reload cart
        } catch (error) {
            console.error(error);
        }
    };

    // Event delegation for cart actions
    cartContainer.addEventListener('click', (e) => {
        const target = e.target;

        // Handle quantity changes
        const quantityChangeButton = target.closest('.quantity-change');
        if (quantityChangeButton) {
            const cartItemId = quantityChangeButton.dataset.cartItemId;
            const action = quantityChangeButton.dataset.action;
            const input = quantityChangeButton.parentElement.querySelector('input');
            let quantity = parseInt(input.value);

            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease') {
                quantity = Math.max(1, quantity - 1);
            }

            if (quantity > 0) {
                updateQuantity(cartItemId, quantity);
            } else {
                // If quantity becomes 0, treat it as a removal
                removeItem(cartItemId);
            }
            return;
        }

        // Handle item removal
        const removeItemButton = target.closest('.remove-item');
        if (removeItemButton) {
            const cartItemId = removeItemButton.dataset.cartItemId;
            removeItem(cartItemId);
            return;
        }
    });

    // Initial Load
    fetchCartItems();
});
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const cartSummary = document.getElementById('cart-summary');

    const fetchCartItems = async () => {
        try {
            const response = await fetch('api/cart.php');
            if (!response.ok) {
                throw new Error('Error al obtener el carrito');
            }
            const items = await response.json();
            renderCart(items);
        } catch (error) {
            cartContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    };

    const renderCart = (items) => {
        if (items.length === 0) {
            cartContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            cartSummary.innerHTML = '';
            return;
        }

        let cartHTML = '';
        let subtotal = 0;

        items.forEach(item => {
            const itemTotal = item.item_price * item.quantity;
            subtotal += itemTotal;
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.item_image || 'https://via.placeholder.com/80'}" alt="${item.item_name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.item_name}</p>
                        <p class="cart-item-type">Tipo: ${item.item_type === 'product' ? 'Producto' : 'Servicio'}</p>
                    </div>
                    <div class="cart-item-price">$${parseFloat(item.item_price).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change" data-action="decrease">-</button>
                        <input type="number" value="${item.quantity}" min="1">
                        <button class="quantity-change" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        cartContainer.innerHTML = cartHTML;
        renderSummary(subtotal);
    };

    const renderSummary = (subtotal) => {
        const total = subtotal; // Aquí se podrían añadir impuestos, etc.
        cartSummary.innerHTML = `
            <h2>Resumen del Pedido</h2>
            <div class="cart-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <a href="checkout.html" class="checkout-button">Proceder al Pago</a>
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
                throw new Error('Error al actualizar la cantidad');
            }
            fetchCartItems(); // Recargar carrito
        } catch (error) {
            console.error(error);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            const response = await fetch('api/cart.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_item_id: cartItemId })
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el item');
            }
            fetchCartItems(); // Recargar carrito
        } catch (error) {
            console.error(error);
        }
    };

    // Event listeners para actualizar y eliminar
    cartContainer.addEventListener('click', (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const cartItemId = cartItem.dataset.id;

        if (target.classList.contains('quantity-change')) {
            const input = cartItem.querySelector('input[type="number"]');
            let quantity = parseInt(input.value);
            const action = target.dataset.action;

            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease') {
                quantity = Math.max(1, quantity - 1);
            }
            input.value = quantity;
            updateQuantity(cartItemId, quantity);
        }

        if (target.closest('.remove-item')) {
            removeItem(cartItemId);
        }
    });

    // Carga inicial
    fetchCartItems();
});

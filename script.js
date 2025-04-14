// Cart logic
const updateCart = () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;
    const items = [];

    document.querySelectorAll('.item-checkbox:checked').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const name = item.getAttribute('data-name'); // Fixed syntax error
        items.push(`${name} ($${price})`);
        total += price;
    });

    document.querySelectorAll('.extra:checked').forEach(extra => {
        const price = parseFloat(extra.getAttribute('data-price'));
        const name = extra.getAttribute('data-name');
        items.push(`${name} ($${price})`);
        total += price;
    });

    cartItems.innerHTML = items.length ? items.join('<br>') : 'Aún no hay nada en el carrito';
    cartTotal.textContent = total;
};

// Update cart on checkbox change
document.querySelectorAll('.item-checkbox, .extra').forEach(checkbox => {
    checkbox.addEventListener('change', updateCart);
});

// Payment method toggle
document.getElementById('payment').addEventListener('change', function() {
    const bankDetails = document.getElementById('bank-details');
    bankDetails.style.display = this.value === 'transfer' ? 'block' : 'none';
});

// Form submission
document.getElementById('custom-order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Collect form data
    const parentName = document.getElementById('parent-name').value;
    const kidName = document.getElementById('kid-name').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const payment = document.getElementById('payment').value;

    // Collect selected items
    const items = [];
    let total = 0;
    document.querySelectorAll('.item-checkbox:checked').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const name = item.getAttribute('data-name');
        items.push(`${name} ($${price})`);
        total += price;
    });
    document.querySelectorAll('.extra:checked').forEach(extra => {
        const price = parseFloat(extra.getAttribute('data-price'));
        const name = extra.getAttribute('data-name');
        items.push(`${name} ($${price})`);
        total += price;
    });

    // Google Forms integration
    const formData = new FormData();
    formData.append('entry.1069885003', parentName);
    formData.append('entry.1194295238', kidName);
    formData.append('entry.1139898634', pickupTime);
    formData.append('entry.1652796924', payment);
    formData.append('entry.174677996', items.join(', '));
    formData.append('entry.53053903', total);

    try {
        const response = await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe4hDHCOU5K4VKxVFiU6aihKpjrU1cK3kRcsr3s-29gty8dyQ/formResponse', {
            method: 'POST',
            body: formData
        });

        if (response.ok || response.type === 'opaque') {
            // Show confirmation modal
            const modal = document.getElementById('confirmation-modal');
            const modalMessage = document.getElementById('modal-message');
            modalMessage.innerHTML = `
                ¡Gracias, ${parentName}! <br>
                Pedido pa’l pequeño ${kidName}: <br>
                ${items.join('<br>')} <br>
                Total: $${total} MXN <br>
                Entrega: ${pickupTime} <br>
                Pago: ${payment === 'cash' ? 'En efectivo' : 'Transferencia'}
            `;
            modal.style.display = 'flex';

            // Reset form and cart
            this.reset();
            document.querySelectorAll('.item-checkbox, .extra').forEach(cb => (cb.checked = false));
            updateCart();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('¡Órale! Algo salió mal, revisa tu conexión o intenta de nuevo.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '¡Apedir el lonche!';
    }
});

// Modal close logic
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'none';
});

// Initialize cart
updateCart();

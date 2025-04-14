// Cart logic
const updateCart = () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;
    const items = [];

    document.querySelectorAll('.item-checkbox:checked').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const name = item.getAttribute('data-name'));
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

    // Google Forms integration (replace with your form's action URL and field names)
    const formData = new FormData();
    formData.append('entry.1234567890', parentName); // Replace with your Google Form field ID
    formData.append('entry.0987654321', kidName);   // Replace with your Google Form field ID
    formData.append('entry.1122334455', pickupTime); // Replace with your Google Form field ID
    formData.append('entry.5566778899', payment);    // Replace with your Google Form field ID
    formData.append('entry.6677889900', items.join(', ')); // Replace with your Google Form field ID
    formData.append('entry.7788990011', total);      // Replace with your Google Form field ID

    try {
        await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSfBkr5y8ND2vcdmTLAEbWUyWiTfgU78i79-5MBTz-XpR956zg/formResponse', {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

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
        modal.style.display = 'block';

        // Reset form and cart
        this.reset();
        document.querySelectorAll('.item-checkbox, .extra').forEach(cb => (cb.checked = false));
        updateCart();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('¡Órale! Algo salió mal, intenta de nuevo.');
    }
});

// Modal close logic
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'none';
});

// Initialize cart
updateCart();

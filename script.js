const orderItems = {};

const updateBolsita = () => {
    const bolsitaCount = document.getElementById('bolsita-count');
    const bolsitaTotal = document.getElementById('bolsita-total');
    const previewItems = document.getElementById('preview-items');
    const orderBtn = document.getElementById('order-btn');
    let count = 0;
    let total = 0;
    const items = [];

    // Update UI for each item
    document.querySelectorAll('.item').forEach(item => {
        const baseName = item.querySelector('.order-now-btn').getAttribute('data-name');
        const flavorSelect = item.querySelector('.flavor-select');
        const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
        const fullName = `${baseName}${flavor}`;
        const qtyControls = item.querySelector('.quantity-controls');
        const qtyDisplay = qtyControls.querySelector('.qty-display');
        const orderBtn = item.querySelector('.order-now-btn');

        if (orderItems[fullName]?.quantity > 0) {
            qtyControls.style.display = 'flex';
            orderBtn.style.display = 'none';
            qtyDisplay.textContent = orderItems[fullName].quantity;
        } else {
            qtyControls.style.display = 'none';
            orderBtn.style.display = 'block';
        }
    });

    // Aggregate items
    Object.keys(orderItems).forEach(name => {
        const qty = orderItems[name].quantity;
        if (qty > 0) {
            const price = orderItems[name].price;
            items.push({ name, qty, price });
            count += qty;
            total += qty * price;
        }
    });

    // Update bolsita badge
    bolsitaCount.textContent = count;
    bolsitaTotal.textContent = `$${total}`;

    // Update preview modal
    if (items.length) {
        previewItems.innerHTML = items.map(item => `
            <div class="item-row">
                <span>${item.name} ($${item.price}) x${item.qty}</span>
                <div class="quantity-controls">
                    <button class="qty-btn minus" data-name="${item.name}">-</button>
                    <button class="qty-btn plus" data-name="${item.name}">+</button>
                </div>
            </div>
        `).join('');
    } else {
        previewItems.innerHTML = 'Aún no hay nada en la bolsita';
    }
    document.getElementById('preview-total').textContent = `Total: $${total} MXN`;

    // Update order button state
    orderBtn.disabled = count === 0;
    orderBtn.style.background = count > 0 ? '#2ecc71' : '#7f8c8d';
    orderBtn.style.cursor = count > 0 ? 'pointer' : 'not-allowed';

    // Animate bolsita
    const bolsita = document.getElementById('bolsita');
    bolsita.classList.add('pulse');
    setTimeout(() => bolsita.classList.remove('pulse'), 300);

    return items.map(item => `${item.name} ($${item.price}) x${item.qty}`);
};

// Handle "Ordena Ahora" button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('order-now-btn')) {
        const item = e.target.closest('.item');
        const baseName = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        const flavorSelect = item.querySelector('.flavor-select');
        const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
        const fullName = `${baseName}${flavor}`;

        if (flavorSelect && !flavorSelect.value) {
            alert('Por favor, elige un sabor antes de añadir a la bolsita.');
            return;
        }

        orderItems[fullName] = { quantity: (orderItems[fullName]?.quantity || 0) + 1, price };
        updateBolsita();
    }
});

// Handle quantity buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-btn')) {
        const name = e.target.getAttribute('data-name');
        const isPlus = e.target.classList.contains('plus');
        if (orderItems[name]) {
            orderItems[name].quantity += isPlus ? 1 : -1;
            if (orderItems[name].quantity <= 0) {
                delete orderItems[name];
            }
            updateBolsita();
        }
    }
});

// Toggle between menus
document.getElementById('delivery-toggle').addEventListener('change', (e) => {
    const schoolMenu = document.getElementById('school-menu');
    const deliveryMenu = document.getElementById('delivery-menu');
    const lunchLabel = document.getElementById('lunch-label');
    const deliveryLabel = document.getElementById('delivery-label');

    schoolMenu.style.display = e.target.checked ? 'none' : 'block';
    deliveryMenu.style.display = e.target.checked ? 'block' : 'none';
    lunchLabel.classList.toggle('active', !e.target.checked);
    deliveryLabel.classList.toggle('active', e.target.checked);

    updateBolsita();
});

// Flavor selection
document.querySelectorAll('.flavor-select').forEach(select => {
    select.addEventListener('change', (e) => {
        const item = e.target.closest('.item');
        const baseName = item.querySelector('.order-now-btn').getAttribute('data-name');
        const oldFullName = Object.keys(orderItems).find(key => key.startsWith(baseName));
        if (oldFullName && orderItems[oldFullName]) {
            const qty = orderItems[oldFullName].quantity;
            const price = orderItems[oldFullName].price;
            delete orderItems[oldFullName];
            const newFlavor = e.target.value ? ` (${e.target.value})` : '';
            const newFullName = `${baseName}${newFlavor}`;
            orderItems[newFullName] = { quantity: qty, price };
            updateBolsita();
        }
    });
});

// Modal handling
const openOrderModal = () => {
    const modal = document.getElementById('order-form-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('closing');
    modal.style.display = 'block';
    const items = updateBolsita();
    document.getElementById('items-input').value = items.join(', ');
    document.getElementById('total-input').value = document.getElementById('preview-total').textContent.replace('Total: $', '').replace(' MXN', '');
};

document.getElementById('bolsita').addEventListener('click', () => {
    const modal = document.getElementById('order-preview-modal');
    const modalContent = modal.querySelector('.modal-content');
    modalContent.classList.remove('closing');
    modal.style.display = 'block';
});

document.getElementById('order-btn').addEventListener('click', openOrderModal);

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.classList.add('closing');
            setTimeout(() => {
                modal.style.display = 'none';
                modalContent.classList.remove('closing');
            }, 300);
        });
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            modalContent.classList.add('closing');
            setTimeout(() => {
                modal.style.display = 'none';
                modalContent.classList.remove('closing');
            }, 300);
        });
    }
});


// Form handling
document.getElementById('pickup-time').addEventListener('change', (e) => {
    const customTime = document.getElementById('custom-time');
    customTime.style.display = e.target.value === 'custom' ? 'block' : 'none';
});

document.getElementById('payment').addEventListener('change', (e) => {
    const bankDetails = document.getElementById('bank-details');
    bankDetails.style.display = e.target.value === 'transfer' ? 'block' : 'none';
});

document.getElementById('delivery-location').addEventListener('change', (e) => {
    const deliveryDetails = document.getElementById('delivery-details');
    const deliveryDetailsInput = document.getElementById('delivery-details-input');
    const deliveryDetailsLabel = document.getElementById('delivery-details-label');
    deliveryDetails.style.display = e.target.value ? 'block' : 'none';
    deliveryDetailsInput.required = e.target.value !== '';
    if (e.target.value === 'En la escuela') {
        deliveryDetailsLabel.textContent = '¿En qué escuela?';
        deliveryDetailsInput.placeholder = 'Ej. Escuela Frida Kahlo';
        deliveryDetailsInput.value = '';
    } else if (e.target.value === 'Otro lugar') {
        deliveryDetailsLabel.textContent = '¿Cuál es tu dirección?';
        deliveryDetailsInput.placeholder = 'Ej. Calle 5 de Mayo #123';
        deliveryDetailsInput.value = '';
    } else {
        deliveryDetailsInput.value = '';
    }
});

document.getElementById('custom-order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const pickupTime = document.getElementById('pickup-time').value;
    const customTime = document.getElementById('custom-time-input').value;
    const deliveryLocation = document.getElementById('delivery-location').value;
    const deliveryDetails = document.getElementById('delivery-details-input').value;

    const formData = new FormData(form);
    formData.set('entry.1139898634', pickupTime === 'custom' ? customTime : pickupTime);
    formData.set('entry.1404862194', deliveryDetails);
    try {
        await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe4hDHCOU5K4VKxVFiU6aihKpjrU1cK3kRcsr3s-29gty8dyQ/formResponse', {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        document.getElementById('order-form-modal').style.display = 'none';
        const confirmationModal = document.getElementById('confirmation-modal');
        document.getElementById('modal-message').textContent = `¡Échale! Tu pedido pa’l lonche ya está en camino. Te llegará un mensaje por WhatsApp pa’ confirmar.`;
        confirmationModal.style.display = 'block';

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        Object.keys(orderItems).forEach(key => delete orderItems[key]);
        updateBolsita();
        form.reset();
        document.getElementById('custom-time').style.display = 'none';
        document.getElementById('bank-details').style.display = 'none';
        document.getElementById('delivery-details').style.display = 'none';
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('¡Órale! Algo salió mal. Porfa, intenta de nuevo o márcale al Whats.');
    }
});

// Initialize
updateBolsita();

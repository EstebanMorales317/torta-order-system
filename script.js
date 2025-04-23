const orderItems = {};

const initializeModals = () => {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.classList.remove('active');
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.classList.remove('closing');
        }
    });
};

const updateBolsita = () => {
    const bolsitaCount = document.getElementById('bolsita-count');
    const bolsitaTotal = document.getElementById('bolsita-total');
    const previewItems = document.getElementById('preview-items');
    const orderBtn = document.getElementById('order-btn');
    let count = 0;
    let total = 0;
    const items = [];

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

    Object.keys(orderItems).forEach(name => {
        const qty = orderItems[name].quantity;
        if (qty > 0) {
            const price = orderItems[name].price;
            items.push({ name, qty, price });
            count += qty;
            total += qty * price;
        }
    });

    bolsitaCount.textContent = count;
    bolsitaTotal.textContent = `$${total}`;

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

    orderBtn.disabled = count === 0;
    orderBtn.style.background = count > 0 ? 'linear-gradient(45deg, #e74c3c, #f1c40f)' : '#7f8c8d';
    orderBtn.style.cursor = count > 0 ? 'pointer' : 'not-allowed';

    if (count > 0) {
        const bolsita = document.getElementById('bolsita');
        bolsita.classList.add('pulse');
        setTimeout(() => bolsita.classList.remove('pulse'), 300);
    }

    return items.map(item => `${item.name} ($${item.price}) x${item.qty}`);
};

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

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-btn')) {
        const item = e.target.closest('.item') || e.target.closest('.item-row');
        const baseName = e.target.getAttribute('data-name');
        const isPlus = e.target.classList.contains('plus');
        let fullName = baseName;

        if (item.classList.contains('item')) {
            const flavorSelect = item.querySelector('.flavor-select');
            const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
            fullName = `${baseName}${flavor}`;
        }

        if (orderItems[fullName]) {
            orderItems[fullName].quantity += isPlus ? 1 : -1;
            if (orderItems[fullName].quantity <= 0) {
                delete orderItems[fullName];
            }
            updateBolsita();
        }
    }
});

document.getElementById('delivery-toggle').addEventListener('change', (e) => {
    const schoolMenu = document.getElementById('school-menu');
    const deliveryMenu = document.getElementById('delivery-menu');
    const lunchLabel = document.getElementById('lunch-label');
    const deliveryLabel = document.getElementById('delivery-label');
    const body = document.body;

    schoolMenu.classList.remove('active');
    deliveryMenu.classList.remove('active');

    if (e.target.checked) {
        schoolMenu.style.display = 'none';
        deliveryMenu.style.display = 'block';
        deliveryMenu.classList.add('active');
        body.classList.add('delivery-mode');
    } else {
        schoolMenu.style.display = 'block';
        deliveryMenu.style.display = 'none';
        schoolMenu.classList.add('active');
        body.classList.remove('delivery-mode');
    }

    lunchLabel.classList.toggle('active', !e.target.checked);
    deliveryLabel.classList.toggle('active', e.target.checked);

    updateBolsita();
});

document.querySelectorAll('.flavor-select').forEach(select => {
    select.addEventListener('change', (e) => {
        const item = e.target.closest('.item');
        const baseName = item.querySelector('.order-now-btn').getAttribute('data-name');
        const oldFullName = Object.keys(orderItems).find(key => key.startsWith(baseName));
        const newFlavor = e.target.value ? ` (${e.target.value})` : '';
        const newFullName = `${baseName}${newFlavor}`;

        if (oldFullName && orderItems[oldFullName]) {
            const qty = orderItems[oldFullName].quantity;
            const price = orderItems[oldFullName].price;
            delete orderItems[oldFullName];
            if (e.target.value) {
                orderItems[newFullName] = { quantity: qty, price };
            }
            updateBolsita();
        }
    });
});

const openOrderModal = () => {
    if (Object.keys(orderItems).length === 0) return;
    const modal = document.getElementById('order-form-modal');
    const modalContent = modal.querySelector('.modal-content');
    if (modal.classList.contains('active')) return;
    modalContent.classList.remove('closing');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');
    }, 10);
    const items = updateBolsita();
    document.getElementById('items-input').value = items.join(', ');
    document.getElementById('total-input').value = document.getElementById('preview-total').textContent.replace('Total: $', '').replace(' MXN', '');
};

const closeAllModals = (excludeConfirmation = false) => {
    console.log('closeAllModals called, excludeConfirmation:', excludeConfirmation);
    document.querySelectorAll('.modal').forEach(modal => {
        if (excludeConfirmation && modal.id === 'confirmation-modal') {
            console.log('Skipping confirmation modal');
            return;
        }
        const modalContent = modal.querySelector('.modal-content');
        modalContent.classList.add('closing');
        modal.style.opacity = '0';
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            modalContent.classList.remove('closing');
        }, 300);
    });
};

const openBolsitaModal = () => {
    const modal = document.getElementById('order-preview-modal');
    const modalContent = modal.querySelector('.modal-content');
    if (modal.classList.contains('active')) return;
    modalContent.classList.remove('closing');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');
    }, 10);
};

const openConfirmationModal = () => {
    console.log('Opening confirmation modal');
    const modal = document.getElementById('confirmation-modal');
    const modalContent = modal.querySelector('.modal-content');
    const orderedItemsList = document.getElementById('ordered-items-list');
    const orderTotal = document.getElementById('order-total');

    // Clear previous items
    orderedItemsList.innerHTML = '';

    // Populate ordered items
    let total = 0;
    Object.keys(orderItems).forEach((name, index) => {
        const qty = orderItems[name].quantity;
        if (qty > 0) {
            const price = orderItems[name].price;
            total += qty * price;
            const li = document.createElement('li');
            li.className = 'ordered-item';
            li.style.setProperty('--item-index', index + 1);
            li.innerHTML = `
                <span class="item-name">${name}</span>
                <span class="item-details">x${qty} ($${price * qty})</span>
            `;
            orderedItemsList.appendChild(li);
        }
    });

    // Display total
    orderTotal.textContent = `Total: $${total} MXN`;

    // If no items, show a fallback message
    if (!orderedItemsList.hasChildNodes()) {
        orderedItemsList.innerHTML = '<li class="no-items">No hay elementos en el pedido.</li>';
        orderTotal.textContent = '';
    }

    modalContent.classList.remove('closing');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');
        try {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                zIndex: 998,
                colors: ['#e74c3c', '#2ecc71', '#f1c40f']
            });
            console.log('Confetti triggered');
        } catch (error) {
            console.error('Confetti failed:', error);
        }
    }, 10);
};

document.getElementById('bolsita').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    openBolsitaModal();
});

document.getElementById('order-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!document.getElementById('order-btn').disabled) {
        openOrderModal();
    }
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllModals();
    });
});

window.addEventListener('click', (e) => {
    console.log('Window click:', e.target);
    if (e.target.closest('#bolsita') || e.target.closest('#order-btn')) return;
    const modal = e.target.closest('.modal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (e.target === modal && !modalContent.contains(e.target)) {
            closeAllModals();
        }
    }
});

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
    console.log('Form submitted');
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

        console.log('Form submission successful');
        closeAllModals(true); // Exclude confirmation modal
        openConfirmationModal();

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

document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
    updateBolsita();
    document.getElementById('school-menu').classList.add('active');
});

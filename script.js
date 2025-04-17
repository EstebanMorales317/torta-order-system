const orderItems = {};

const updateBolsita = () => {
    const bolsitaCount = document.getElementById('bolsita-count');
    const bolsitaTotal = document.getElementById('bolsita-total');
    const previewItems = document.getElementById('preview-items');
    const orderBtn = document.getElementById('order-btn');
    let count = 0;
    let total = 0;
    const items = [];

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
    orderBtn.style.background = count > 0 ? '#FF6B6B' : '#7f8c8d';
    orderBtn.style.cursor = count > 0 ? 'pointer' : 'not-allowed';

    const bolsita = document.getElementById('bolsita');
    bolsita.classList.add('pulse');
    setTimeout(() => bolsita.classList.remove('pulse'), 300);

    return items.map(item => `${item.name} ($${item.price}) x${item.qty}`);
};

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('item-checkbox')) {
        const checkbox = e.target;
        const baseName = checkbox.getAttribute('data-name');
        const price = parseFloat(checkbox.getAttribute('data-price'));
        const flavorSelect = checkbox.closest('.item').querySelector('.flavor-select');
        const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
        const name = `${baseName}${flavor}`;

        if (checkbox.checked) {
            if (flavorSelect && !flavor) {
                alert('Por favor, elige un sabor antes de añadir a la bolsita.');
                checkbox.checked = false;
                return;
            }
            orderItems[name] = { quantity: (orderItems[name]?.quantity || 0) + 1, price };
        } else {
            if (orderItems[name]) {
                orderItems[name].quantity = 0;
                delete orderItems[name];
            }
        }
        updateBolsita();
    } else if (e.target.classList.contains('flavor-select')) {
        const baseName = e.target.getAttribute('data-name');
        const flavor = e.target.value;
        const checkbox = e.target.closest('.item').querySelector('.item-checkbox');
        if (checkbox.checked) {
            const oldName = Object.keys(orderItems).find(key => key.startsWith(baseName));
            if (oldName && flavor) {
                const qty = orderItems[oldName].quantity;
                const price = orderItems[oldName].price;
                delete orderItems[oldName];
                orderItems[`${baseName} (${flavor})`] = { quantity: qty, price };
                updateBolsita();
            }
        }
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#bolsita')) {
        const modal = document.getElementById('order-preview-modal');
        modal.style.display = 'flex';
    }
    if (e.target.classList.contains('qty-btn')) {
        const name = e.target.getAttribute('data-name');
        const isPlus = e.target.classList.contains('plus');
        if (orderItems[name]) {
            orderItems[name].quantity += isPlus ? 1 : -1;
            if (orderItems[name].quantity <= 0) {
                delete orderItems[name];
                const checkbox = document.querySelector(`.item-checkbox[data-name="${name.split(' (')[0]}"]`);
                if (checkbox) checkbox.checked = false;
            }
            updateBolsita();
        }
    }
    if (e.target.id === 'order-btn' && !e.target.disabled) {
        const modal = document.getElementById('order-form-modal');
        modal.style.display = 'flex';
    }
    if (e.target.classList.contains('close')) {
        const modal = e.target.closest('.modal');
        modal.style.display = 'none';
    }
});

document.addEventListener('change', (e) => {
    if (e.target.id === 'pickup-time') {
        document.getElementById('custom-time').style.display = e.target.value === 'custom' ? 'block' : 'none';
    }
    if (e.target.id === 'payment') {
        document.getElementById('bank-details').style.display = e.target.value === 'transfer' ? 'block' : 'none';
    }
    if (e.target.id === 'delivery-location') {
        const deliveryDetails = document.getElementById('delivery-details');
        const deliveryInput = document.getElementById('delivery-details-input');
        if (e.target.value === 'En la escuela' || e.target.value === 'Otro lugar') {
            deliveryDetails.style.display = 'block';
            deliveryInput.placeholder = e.target.value === 'En la escuela' ? 'Ej. Escuela Frida Kahlo' : 'Ej. Av. Lomas Verdes 123';
            deliveryInput.required = true;
        } else {
            deliveryDetails.style.display = 'none';
            deliveryInput.required = false;
            deliveryInput.value = '';
        }
    }
});

document.addEventListener('change', (e) => {
    if (e.target.id === 'delivery-toggle') {
        const schoolMenu = document.getElementById('school-menu');
        const deliveryMenu = document.getElementById('delivery-menu');
        const lunchLabel = document.getElementById('lunch-label');
        const deliveryLabel = document.getElementById('delivery-label');
        
        if (e.target.checked) {
            schoolMenu.style.display = 'none';
            deliveryMenu.style.display = 'block';
            lunchLabel.classList.remove('active');
            deliveryLabel.classList.add('active');
        } else {
            schoolMenu.style.display = 'block';
            deliveryMenu.style.display = 'none';
            lunchLabel.classList.add('active');
            deliveryLabel.classList.remove('active');
        }
        updateBolsita();
    }
});

document.addEventListener('submit', (e) => {
    if (e.target.id === 'custom-order-form') {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const parentName = document.getElementById('parent-name').value;
        const specialDetails = document.getElementById('special-details').value || 'Sin detalles';
        let pickupTime = document.getElementById('pickup-time').value;
        if (pickupTime === 'custom') {
            pickupTime = document.getElementById('custom-time-input').value || 'Hora no especificada';
        }
        const payment = document.getElementById('payment').value;
        const deliveryLocation = document.getElementById('delivery-location').value;
        const deliveryDetails = document.getElementById('delivery-details-input').value;
        const phoneNumber = document.getElementById('phone-number').value;

        const deliveryEntry = deliveryLocation && deliveryDetails ? `${deliveryLocation}: ${deliveryDetails}` : '';
        const items = updateBolsita();
        const total = parseFloat(document.getElementById('bolsita-total').textContent.replace('$', ''));

        const formData = new FormData();
        formData.append('entry.1069885003', parentName);
        formData.append('entry.1194295238', specialDetails);
        formData.append('entry.1139898634', pickupTime);
        formData.append('entry.1652796924', payment);
        formData.append('entry.174677996', items.join(', '));
        formData.append('entry.53053903', total);
        formData.append('entry.1404862194', deliveryEntry);
        formData.append('entry.499715070', phoneNumber);

        fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe4hDHCOU5K4VKxVFiU6aihKpjrU1cK3kRcsr3s-29gty8dyQ/formResponse', {
            method: 'POST',
            body: formData
        })
        .then(() => {
            const modal = document.getElementById('confirmation-modal');
            const modalMessage = document.getElementById('modal-message');
            modalMessage.innerHTML = `
                ¡Échale, ${parentName}! <br>
                Tu pedido ya está en camino: <br>
                ${items.join('<br>')} <br>
                Total: $${total} MXN <br>
                Entrega: ${pickupTime} <br>
                Lugar: ${deliveryEntry || 'No especificado'} <br>
                Detalles: ${specialDetails} <br>
                Pago: ${payment === 'cash' ? 'En efectivo' : 'Transferencia'} <br>
                Teléfono: ${phoneNumber} <br>
                ¡La Mimi ya está preparando esas tortas con puro amor!
            `;
            modal.style.display = 'flex';
            document.getElementById('order-form-modal').style.display = 'none';

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#1A3C34', '#FFF8E7']
            });

            e.target.reset();
            Object.keys(orderItems).forEach(key => delete orderItems[key]);
            document.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.flavor-select').forEach(sel => sel.value = '');
            updateBolsita();
            document.getElementById('custom-time').style.display = 'none';
            document.getElementById('bank-details').style.display = 'none';
            document.getElementById('delivery-details').style.display = 'none';
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            const modal = document.getElementById('confirmation-modal');
            const modalMessage = document.getElementById('modal-message');
            modalMessage.innerHTML = `
                ¡Échale, ${parentName}! <br>
                Tu pedido ya está en camino: <br>
                ${items.join('<br>')} <br>
                Total: $${total} MXN <br>
                Entrega: ${pickupTime} <br>
                Lugar: ${deliveryEntry || 'No especificado'} <br>
                Detalles: ${specialDetails} <br>
                Pago: ${payment === 'cash' ? 'En efectivo' : 'Transferencia'} <br>
                Teléfono: ${phoneNumber} <br>
                ¡La Mimi ya está preparando esas tortas con puro amor!
            `;
            modal.style.display = 'flex';
            document.getElementById('order-form-modal').style.display = 'none';

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#1A3C34', '#FFF8E7']
            });

            e.target.reset();
            Object.keys(orderItems).forEach(key => delete orderItems[key]);
            document.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = false);
            document.querySelectorAll('.flavor-select').forEach(sel => sel.value = '');
            updateBolsita();
            document.getElementById('custom-time').style.display = 'none';
            document.getElementById('bank-details').style.display = 'none';
            document.getElementById('delivery-details').style.display = 'none';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '¡Apedir el lonche!';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    updateBolsita();
});

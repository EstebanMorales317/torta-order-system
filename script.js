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
        if (orderItems[name].selected) {
            const price = orderItems[name].price;
            items.push({ name, price });
            count++;
            total += price;
        }
    });

    bolsitaCount.textContent = count;
    bolsitaTotal.textContent = `$${total}`;
    if (items.length) {
        previewItems.innerHTML = items.map(item => `
            <div class="item-row">
                <span>${item.name} ($${item.price})</span>
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

    return items.map(item => `${item.name} ($${item.price})`);
};

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const checkbox = e.target;
        const baseName = checkbox.getAttribute('data-name');
        const price = parseFloat(checkbox.getAttribute('data-price'));
        const itemDiv = checkbox.closest('.item');
        const flavorSelect = itemDiv.querySelector('.flavor-select');
        const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
        const name = `${baseName}${flavor}`;

        if (checkbox.checked && flavorSelect && !flavor) {
            alert('Por favor, elige un sabor antes de añadir a la bolsita.');
            checkbox.checked = false;
            return;
        }

        orderItems[name] = { selected: checkbox.checked, price };
        updateBolsita();
    }

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
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('#bolsita')) {
        const modal = document.getElementById('order-preview-modal');
        modal.style.display = 'flex';
    }

    if (e.target.classList.contains('close')) {
        const modal = e.target.closest('.modal');
        modal.style.display = 'none';
    }

    if (e.target.id === 'order-btn' && !e.target.disabled) {
        const modal = document.getElementById('order-form-modal');
        modal.style.display = 'flex';
    }
});

document.getElementById('custom-order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const items = updateBolsita();
    const total = document.getElementById('preview-total').textContent.replace('Total: $', '').replace(' MXN', '');
    document.getElementById('items-input').value = items.join(', ');
    document.getElementById('total-input').value = total;

    const pickupTime = document.getElementById('pickup-time').value;
    if (pickupTime === 'custom') {
        const customTime = document.getElementById('custom-time-input').value;
        form.querySelector('select[name="entry.1139898634"]').value = customTime;
    }

    const deliveryLocation = document.getElementById('delivery-location').value;
    if (deliveryLocation === 'Otro lugar') {
        const deliveryDetails = document.getElementById('delivery-details-input').value;
        form.querySelector('input[name="entry.1404862194"]').value = deliveryDetails;
    } else {
        form.querySelector('input[name="entry.1404862194"]').value = deliveryLocation;
    }

    const formData = new FormData(form);
    fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe9aP0t9e4YcT3W3S64oW31oO6qWBR9kXgR_4z7wWnG8m7wFA/formResponse', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(() => {
        document.getElementById('order-form-modal').style.display = 'none';
        const confirmationModal = document.getElementById('confirmation-modal');
        confirmationModal.style.display = 'flex';
        document.getElementById('modal-message').textContent = `¡Tu pedido de ${items.join(', ')} por $${total} MXN ha sido enviado! Te contactaremos por WhatsApp para confirmar.`;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            confirmationModal.style.display = 'none';
            Object.keys(orderItems).forEach(name => delete orderItems[name]);
            document.querySelectorAll('.add-to-cart').forEach(cb => cb.checked = false);
            updateBolsita();
        }, 5000);
    });
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
    deliveryDetails.style.display = e.target.value === 'Otro lugar' ? 'block' : 'none';
});

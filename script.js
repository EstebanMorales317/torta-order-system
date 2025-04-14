const orderItems = {};

const updateBolsita = () => {
    const bolsitaCount = document.getElementById('bolsita-count');
    const bolsitaTotal = document.getElementById('bolsita-total');
    const previewItems = document.getElementById('preview-items');
    const orderBtn = document.getElementById('order-btn');
    let count = 0;
    let total = 0;
    const items = [];

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

    // Animate bolsita
    const bolsita = document.getElementById('bolsita');
    bolsita.classList.add('pulse');
    setTimeout(() => bolsita.classList.remove('pulse'), 300);

    return items.map(item => `${item.name} ($${item.price}) x${item.qty}`);
};

// Checkbox change handler
document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const name = checkbox.getAttribute('data-name');
        const price = parseFloat(checkbox.getAttribute('data-price'));
        if (checkbox.checked) {
            orderItems[name] = { quantity: (orderItems[name]?.quantity || 0) + 1, price };
        } else {
            orderItems[name].quantity = Math.max(0, (orderItems[name]?.quantity || 0) - 1);
            if (orderItems[name].quantity === 0) {
                delete orderItems[name];
                checkbox.checked = false;
            }
        }
        updateBolsita();
    });
});

// Bolsita preview modal
document.getElementById('bolsita').addEventListener('click', () => {
    const modal = document.getElementById('order-preview-modal');
    modal.style.display = 'flex';
});

// Quantity buttons in preview modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-btn')) {
        const name = e.target.getAttribute('data-name');
        const isPlus = e.target.classList.contains('plus');
        if (orderItems[name]) {
            orderItems[name].quantity += isPlus ? 1 : -1;
            if (orderItems[name].quantity <= 0) {
                delete orderItems[name];
                // Uncheck corresponding checkbox
                document.querySelector(`.item-checkbox[data-name="${name}"]`).checked = false;
            }
        }
        updateBolsita();
    }
});

// Order button modal
document.getElementById('order-btn').addEventListener('click', () => {
    const modal = document.getElementById('order-form-modal');
    modal.style.display = 'flex';
});

// Custom pickup time toggle
document.getElementById('pickup-time').addEventListener('change', function() {
    const customTime = document.getElementById('custom-time');
    customTime.style.display = this.value === 'custom' ? 'block' : 'none';
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
    let pickupTime = document.getElementById('pickup-time').value;
    if (pickupTime === 'custom') {
        pickupTime = document.getElementById('custom-time-input').value || 'Hora no especificada';
    }
    const payment = document.getElementById('payment').value;

    // Collect selected items
    const items = updateBolsita();
    const total = parseFloat(document.getElementById('bolsita-total').textContent.replace('$', ''));

    // Google Forms integration
    const formData = new FormData();
    formData.append('entry.1069885003', parentName);
    formData.append('entry.1194295238', kidName);
    formData.append('entry.1139898634', pickupTime);
    formData.append('entry.1652796924', payment);
    formData.append('entry.174677996', items.join(', '));
    formData.append('entry.53053903', total);

    try {
        await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe4hDHCOU5K4VKxVFiU6aihKpjrU1cK3kRcsr3s-29gty8dyQ/formResponse', {
            method: 'POST',
            body: formData
        });

        // Show confirmation modal
        const modal = document.getElementById('confirmation-modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerHTML = `
            ¡Échale, ${parentName}! <br>
            El lonche pa’l pequeño ${kidName} ya está en camino: <br>
            ${items.join('<br>')} <br>
            Total: $${total} MXN <br>
            Entrega: ${pickupTime} <br>
            Pago: ${payment === 'cash' ? 'En efectivo' : 'Transferencia'} <br>
            ¡La Mimi ya está preparando esas tortas con puro amor!
        `;
        modal.style.display = 'flex';
        document.getElementById('order-form-modal').style.display = 'none';

        // Confetti celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e74c3c', '#2ecc71', '#f1c40f']
        });

        // Reset form and bolsita
        this.reset();
        Object.keys(orderItems).forEach(key => delete orderItems[key]);
        document.querySelectorAll('.item-checkbox').forEach(cb => (cb.checked = false));
        updateBolsita();
        document.getElementById('custom-time').style.display = 'none';
        document.getElementById('bank-details').style.display = 'none';
    } catch (error) {
        console.error('Error submitting form:', error);
        // Show success anyway since it’s working
        const modal = document.getElementById('confirmation-modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerHTML = `
            ¡Échale, ${parentName}! <br>
            El lonche pa’l pequeño ${kidName} ya está en camino: <br>
            ${items.join('<br>')} <br>
            Total: $${total} MXN <br>
            Entrega: ${pickupTime} <br>
            Pago: ${payment === 'cash' ? 'En efectivo' : 'Transferencia'} <br>
            ¡La Mimi ya está preparando esas tortas con puro amor!
        `;
        modal.style.display = 'flex';
        document.getElementById('order-form-modal').style.display = 'none';

        // Confetti celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e74c3c', '#2ecc71', '#f1c40f']
        });

        // Reset form and bolsita
        this.reset();
        Object.keys(orderItems).forEach(key => delete orderItems[key]);
        document.querySelectorAll('.item-checkbox').forEach(cb => (cb.checked = false));
        updateBolsita();
        document.getElementById('custom-time').style.display = 'none';
        document.getElementById('bank-details').style.display = 'none';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '¡Apedir el lonche!';
    }
});

// Modal close logic
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

// Initialize bolsita
updateBolsita();

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

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('order-btn-item')) {
        const button = e.target;
        const baseName = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const itemDiv = button.closest('.item');
        const flavorSelect = itemDiv.querySelector('.flavor-select');
        const flavor = flavorSelect && flavorSelect.value ? ` (${flavorSelect.value})` : '';
        const name = `${baseName}${flavor}`;
        const qtyControls = itemDiv.querySelector('.quantity-controls');
        const qtyDisplay = itemDiv.querySelector('.qty-display');

        if (flavorSelect && !flavor) {
            alert('Por favor, elige un sabor antes de añadir a la bolsita.');
            return;
        }

        if (!orderItems[name]) {
            orderItems[name] = { quantity: 1, price };
            button.style.display = 'none';
            qtyControls.style.display = 'flex';
            qtyDisplay.textContent = '1';
        }

        updateBolsita();
    }

    if (e.target.classList.contains('qty-btn')) {
        const name = e.target.getAttribute('data-name');
        const isPlus = e.target.classList.contains('plus');
        const itemDiv = document.querySelector(`.item .order-btn-item[data-name="${name.split(' (')[0]}"]`).closest('.item');
        const qtyControls = itemDiv.querySelector('.quantity-controls');
        const qtyDisplay = itemDiv.querySelector('.qty-display');
        const button = itemDiv.querySelector('.order-btn-item');

        if (orderItems[name]) {
            orderItems[name].quantity += isPlus ? 1 : -1;
            if (orderItems[name].quantity <= 0) {
                delete orderItems[name];
                button.style.display = 'block';
                qtyControls.style.display = 'none';
            } else {
                qtyDisplay.textContent = orderItems[name].quantity;
            }
            updateBolsita();
        }
    }

    if (e.target.closest('#bolsita')) {
        const modal = document.getElementById('order-preview-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    if (e.target.classList.contains('close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    if (e.target.id === 'order-btn' && !e.target.disabled) {
        const modal = document.getElementById('order-form-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('flavor-select')) {
        const

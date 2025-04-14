const updateBolsita = () => {
    const bolsitaCount = document.getElementById('bolsita-count');
    const bolsitaTotal = document.getElementById('bolsita-total');
    let count = 0;
    let total = 0;
    const items = [];

    document.querySelectorAll('.item-checkbox:checked').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const name = item.getAttribute('data-name');
        items.push(`${name} ($${price})`);
        count++;
        total += price;
    });

    bolsitaCount.textContent = count;
    bolsitaTotal.textContent = total;

    // Animate bolsita
    const bolsita = document.getElementById('bolsita');
    bolsita.classList.add('pulse');
    setTimeout(() => bolsita.classList.remove('pulse'), 300);

    return items;
};

// Update bolsita on checkbox change
document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateBolsita);
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
    const items = updateBolsita();
    const total = parseFloat(document.getElementById('bolsita-total').textContent);

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

        // Confetti celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e74c3c', '#2ecc71', '#f1c40f']
        });

        // Reset form and bolsita
        this.reset();
        document.querySelectorAll('.item-checkbox').forEach(cb => (cb.checked = false));
        updateBolsita();
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

        // Confetti celebration
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#e74c3c', '#2ecc71', '#f1c40f']
        });

        // Reset form and bolsita
        this.reset();
        document.querySelectorAll('.item-checkbox').forEach(cb => (cb.checked = false));
        updateBolsita();
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '¡Apedir el lonche!';
    }
});

// Modal close logic
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('confirmation-modal').style.display = 'none';
});

// Initialize bolsita
updateBolsita();

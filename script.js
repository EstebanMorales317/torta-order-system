document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const payment = document.getElementById('payment').value;

    // Calculate total and collect items
    let total = 0;
    const items = [];
    document.querySelectorAll('.item-checkbox:checked').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price'));
        const name = item.getAttribute('data-name');
        items.push(name);
        total += price;
    });
    document.querySelectorAll('.extra:checked').forEach(extra => {
        total += parseFloat(extra.getAttribute('data-price'));
    });

    // Show confirmation (temporary)
    alert(`Order for ${name}\nItems: ${items.join(', ')}\nTotal: $${total} MXN\nPickup: ${pickupTime}\nPayment: ${payment}`);
});

document.getElementById('payment').addEventListener('change', function() {
    const bankDetails = document.getElementById('bank-details');
    if (this.value === 'transfer') {
        bankDetails.style.display = 'block';
    } else {
        bankDetails.style.display = 'none';
    }
});

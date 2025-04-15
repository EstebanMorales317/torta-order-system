* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(to bottom, #fff8e1, #fff3e0);
    color: #2c3e50;
    transition: background 0.3s;
}

body.school-theme {
    background: linear-gradient(to bottom, #fff8e1, #fff3e0);
}

body.delivery-theme {
    background: linear-gradient(to bottom, #ffecd2, #fce3c5);
}

header {
    background: linear-gradient(45deg, #2ecc71, #27ae60);
    color: white;
    text-align: center;
    padding: 0.6rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    z-index: 100;
}

header h1 {
    font-size: 1.8rem;
}

header p {
    font-size: 0.9rem;
}

.logo {
    display: block;
    margin: 0 auto;
    width: 80px;
    height: auto;
    padding-top: 0.5rem;
    transition: transform 0.3s;
}

.logo:hover {
    transform: scale(1.1);
}

#bolsita {
    position: fixed;
    top: 4rem;
    right: 0.8rem;
    background: #e74c3c;
    color: white;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 8px rgba(231, 76, 60, 0.5);
    font-size: 0.7rem;
    z-index: 101;
    cursor: pointer;
    transition: transform 0.2s;
}

#bolsita.pulse {
    animation: pulse 0.3s;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

.bolsita-icon {
    font-size: 0.9rem;
}

#bolsita-count, #bolsita-total {
    font-size: 0.6rem;
    line-height: 1.1;
}

main {
    padding: 0.8rem;
    margin-top: 3rem;
}

.toggle-container {
    text-align: center;
    margin: 1rem 0;
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #7f8c8d;
    transition: 0.4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #2ecc71;
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.toggle-labels {
    margin-top: 0.5rem;
    font-size: 1.1rem;
    color: #2c3e50;
}

.toggle-labels span {
    margin: 0 0.5rem;
    transition: color 0.4s;
}

.toggle-labels .active {
    color: #e74c3c;
    font-weight: bold;
}

.menu-section {
    margin: 1.2rem 0;
}

.menu-section h2 {
    color: #e74c3c;
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 0.8rem;
    animation: slideInSection 0.5s;
}

#meals, #desserts, #drinks {
    background: linear-gradient(to bottom, #ffeaa7, #fff8e1);
}

#delivery-meals, #delivery-desserts, #delivery-drinks {
    background: linear-gradient(to bottom, #ffd1a3, #ffecd2);
}

.menu-scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.8rem;
    padding: 0.8rem;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
}

.menu-scroll::-webkit-scrollbar {
    height: 6px;
}

.menu-scroll::-webkit-scrollbar-thumb {
    background: #e74c3c;
    border-radius: 3px;
}

.item {
    flex: 0 0 160px;
    background: white;
    border-radius: 12px;
    padding: 0.8rem;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    scroll-snap-align: center;
    transition: transform 0.3s;
}

.item:hover {
    transform: scale(1.05);
}

.item img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.4rem;
}

.item h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
}

.item p {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-bottom: 0.4rem;
}

.custom-checkbox {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: #e74c3c;
}

.custom-checkbox input {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #e74c3c;
    border-radius: 4px;
    position: relative;
}

.custom-checkbox input:checked {
    background: #e74c3c;
}

.custom-checkbox input:checked::after {
    content: '✔';
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 10px;
}

.order-btn {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: #7f8c8d;
    color: white;
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1.1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 100;
    transition: background 0.3s, transform 0.2s;
}

.order-btn:not(:disabled):hover {
    background: #27ae60;
    transform: translateX(-50%) translateY(-2px);
}

.order-btn:disabled {
    cursor: not-allowed;
}

.btn {
    background: #e74c3c;
    color: white;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
}

.btn:hover {
    background: #c0392b;
    transform: translateY(-2px);
}

.btn:disabled {
    background: #7f8c8d;
    cursor: not-allowed;
}

.btn-whatsapp {
    background: #25D366;
}

.btn-whatsapp:hover {
    background: #1DA851;
}

#whatsapp, #qr-code {
    margin: 1.2rem 0;
    text-align: center;
}

#qr-code img {
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 0.8rem;
    margin-top: 1.2rem;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s;
}

.modal-content {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-50px);
    animation: slideIn 0.3s forwards;
}

.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-top: 1rem;
}

.modal-content label {
    font-size: 0.9rem;
    color: #2c3e50;
    text-align: left;
}

.modal-content input,
.modal-content select {
    padding: 0.6rem;
    font-size: 0.9rem;
    border: 2px solid #dfe6e9;
    border-radius: 6px;
    outline: none;
    width: 100%;
}

.modal-content input:focus,
.modal-content select:focus {
    border-color: #e74c3c;
}

#bank-details, #custom-time, #delivery-details {
    margin-top: 0.4rem;
    font-size: 0.8rem;
    color: #7f8c8d;
}

.close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 1.2rem;
    cursor: pointer;
    color: #2c3e50;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #dfe6e9;
}

.quantity-controls {
    display: flex;
    gap: 0.3rem;
}

.qty-btn {
    background: #e74c3c;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;
}

.qty-btn:hover {
    background: #c0392b;
}

@keyframes slideIn {
    to { transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideInSection {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Sexy delivery field styles */
#delivery-location {
    background: #fff;
    border: 2px solid #e74c3c;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

#delivery-location:hover {
    background: #fce4ec;
    border-color: #c0392b;
}

#delivery-location:focus {
    box-shadow: 0 0 8px rgba(231, 76, 60, 0.5);
}

#delivery-details {
    animation: slideIn 0.3s ease;
}

#delivery-details-input {
    border: 2px solid #2ecc71;
    border-radius: 8px;
    padding: 0.8rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

#delivery-details-input:focus {
    border-color: #27ae60;
    box-shadow: 0 0 8px rgba(46, 204, 113, 0.5);
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    header {
        padding: 0.6rem;
    }

    header h1 {
        font-size: 1.8rem;
    }

    header p {
        font-size: 0.9rem;
    }

    .item {
        flex: 0 0 160px;
    }

    .item img {
        height: 100px;
    }

    .order-btn {
        padding: 0.7rem 1.5rem;
        font-size: 1rem;
    }

    .modal-content {
        max-height: 70vh;
        padding: 0.8rem;
    }

    #bolsita {
        width: 45px;
        height: 45px;
        font-size: 0.7rem;
    }

    .bolsita-icon {
        font-size: 0.9rem;
    }
}

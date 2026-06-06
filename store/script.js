// Store Script
document.addEventListener('DOMContentLoaded', () => {
    const buyBtns = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');
    const modalItemName = document.getElementById('modalItemName');
    const modalItemPrice = document.getElementById('modalItemPrice');
    const paymentInstructions = document.getElementById('paymentInstructions');
    const notification = document.getElementById('notificationToast');

    let currentItem = null;
    let currentPrice = null;

    // Buy button click
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentItem = btn.getAttribute('data-item');
            currentPrice = btn.getAttribute('data-price');
            modalItemName.textContent = currentItem;
            modalItemPrice.textContent = currentPrice;
            modal.style.display = 'flex';
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.onclick = () => modal.style.display = 'none';
    }
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    // Payment options
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            const method = option.getAttribute('data-method');
            showPaymentInstructions(method);
        });
    });

    function showPaymentInstructions(method) {
        let instructions = '';
        if (method === 'bkash') {
            instructions = `
                <h4>📱 bKash Payment Instructions:</h4>
                <p>1. Send money to: <strong>01XXXXXXXXX</strong></p>
                <p>2. Amount: <strong>${currentPrice} TK</strong></p>
                <p>3. Reference: <strong>KNIGHT_${currentItem.replace(/ /g, '_')}</strong></p>
                <p>4. After payment, send transaction ID to Discord: <strong>@server_admin</strong></p>
                <p>5. Your item will be delivered within <strong>30 seconds</strong>!</p>
                <hr style="margin: 10px 0; border-color: rgba(0,225,255,0.3);">
                <p style="color: #00e1ff;"><i class="fas fa-shield-alt"></i> Your transaction is secure & encrypted</p>
                <p style="color: #ff0080; font-size: 0.7rem;"><i class="fas fa-clock"></i> Delivery Time: 30 seconds - 2 minutes</p>
            `;
        } else if (method === 'nagad') {
            instructions = `
                <h4>📱 Nagad Payment Instructions:</h4>
                <p>1. Send money to: <strong>01314726844</strong></p>
                <p>2. Amount: <strong>${currentPrice} TK</strong></p>
                <p>3. Reference: <strong>KNIGHT_${currentItem.replace(/ /g, '_')}</strong></p>
                <p>4. After payment, send transaction ID to Discord: <strong>@server_admin</strong></p>
                <p>5. Your item will be delivered within <strong>30 seconds</strong>!</p>
                <hr style="margin: 10px 0; border-color: rgba(0,225,255,0.3);">
                <p style="color: #00e1ff;"><i class="fas fa-shield-alt"></i> Your transaction is secure & encrypted</p>
                <p style="color: #ff0080; font-size: 0.7rem;"><i class="fas fa-clock"></i> Delivery Time: 30 seconds - 2 minutes</p>
            `;
        } else if (method === 'card') {
            instructions = `
                <h4>💳 Card Payment Instructions:</h4>
                <p>You will be redirected to secure payment gateway.</p>
                <button id="proceedCardBtn" style="background:#00e1ff; border:none; padding:10px; border-radius:8px; margin-top:10px; cursor:pointer; width:100%; font-weight:bold;">Proceed to Payment</button>
                <p style="font-size:0.7rem; margin-top:10px;"><i class="fas fa-lock"></i> SSL Secure Gateway</p>
            `;
            setTimeout(() => {
                const proceedBtn = document.getElementById('proceedCardBtn');
                if (proceedBtn) {
                    proceedBtn.onclick = () => {
                        showNotification('Payment gateway coming soon! Please use bKash or Nagad for now.');
                        modal.style.display = 'none';
                    };
                }
            }, 100);
        } else if (method === 'paypal') {
            instructions = `
                <h4>💙 PayPal Payment Instructions:</h4>
                <p>PayPal ID: <strong>paypal@theknightsofbd.com</strong></p>
                <p>Amount: <strong>$${(currentPrice / 120).toFixed(2)} USD</strong></p>
                <p>After payment, send screenshot to Discord: <strong>@server_admin</strong></p>
                <p style="color: #00e1ff; margin-top:10px;"><i class="fab fa-paypal"></i> PayPal Buyer Protection included</p>
            `;
            setTimeout(() => {
                showNotification(`Please send $${(currentPrice / 120).toFixed(2)} USD to paypal@theknightsofbd.com`);
                modal.style.display = 'none';
            }, 3000);
        }
        paymentInstructions.innerHTML = instructions;
        
        if (method !== 'card' && method !== 'paypal') {
            setTimeout(() => {
                showNotification(`Purchase request sent for ${currentItem}! Please complete payment and contact admin on Discord.`);
                modal.style.display = 'none';
            }, 4000);
        }
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
});
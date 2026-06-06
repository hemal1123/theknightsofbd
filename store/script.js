// Store Script with Manual Payment System (bKash/Nagad)

document.addEventListener('DOMContentLoaded', () => {
    const buyBtns = document.querySelectorAll('.buy-btn');
    const modal = document.getElementById('purchaseModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeModal = document.querySelector('.close-modal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const closeConfirmBtn = document.getElementById('closeConfirmBtn');
    const modalItemName = document.getElementById('modalItemName');
    const modalItemPrice = document.getElementById('modalItemPrice');
    const paymentInstructions = document.getElementById('paymentInstructions');
    const orderSummary = document.getElementById('orderSummary');
    const orderIdSpan = document.getElementById('orderId');
    const confirmOrderId = document.getElementById('confirmOrderId');
    const confirmItem = document.getElementById('confirmItem');
    const confirmAmount = document.getElementById('confirmAmount');
    const notification = document.getElementById('notificationToast');

    let currentItem = null;
    let currentPrice = null;
    let currentOrderId = null;

    // Generate random Order ID
    function generateOrderId() {
        const prefix = 'KBD';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Save order to localStorage
    function saveOrder(orderData) {
        let orders = JSON.parse(localStorage.getItem('knight_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('knight_orders', JSON.stringify(orders));
    }

    // Buy button click
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentItem = btn.getAttribute('data-item');
            currentPrice = btn.getAttribute('data-price');
            modalItemName.textContent = currentItem;
            modalItemPrice.textContent = currentPrice;
            orderSummary.style.display = 'none';
            paymentInstructions.innerHTML = '';
            modal.style.display = 'flex';
        });
    });

    // Close modals
    if (closeModal) closeModal.onclick = () => modal.style.display = 'none';
    if (closeConfirmationModal) closeConfirmationModal.onclick = () => confirmationModal.style.display = 'none';
    if (closeConfirmBtn) closeConfirmBtn.onclick = () => confirmationModal.style.display = 'none';
    
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === confirmationModal) confirmationModal.style.display = 'none';
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
        let orderId = generateOrderId();
        currentOrderId = orderId;
        
        if (method === 'bkash') {
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fas fa-mobile-alt"></i> bKash Payment Instructions</h4>
                    <div class="merchant-info">
                        <p><strong>bKash Merchant Number:</strong> <span class="highlight">018XXXXXXXX</span></p>
                        <p><strong>Reference:</strong> <span class="highlight">${orderId}</span></p>
                        <p><strong>Amount:</strong> <span class="highlight">${currentPrice} TK</span></p>
                    </div>
                    <div class="steps">
                        <p>📌 <strong>Step 1:</strong> Open bKash app → Send Money</p>
                        <p>📌 <strong>Step 2:</strong> Enter merchant number: <strong>018XXXXXXXX</strong></p>
                        <p>📌 <strong>Step 3:</strong> Enter amount: <strong>${currentPrice} TK</strong></p>
                        <p>📌 <strong>Step 4:</strong> Enter reference: <strong>${orderId}</strong></p>
                        <p>📌 <strong>Step 5:</strong> Enter your bKash PIN to confirm</p>
                    </div>
                    <div class="warning">
                        <i class="fas fa-info-circle"></i>
                        After successful payment, save the Transaction ID and send it to our Discord server.
                    </div>
                </div>
            `;
        } else if (method === 'nagad') {
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fas fa-mobile-alt"></i> Nagad Payment Instructions</h4>
                    <div class="merchant-info">
                        <p><strong>Nagad Merchant Number:</strong> <span class="highlight">019XXXXXXXX</span></p>
                        <p><strong>Reference:</strong> <span class="highlight">${orderId}</span></p>
                        <p><strong>Amount:</strong> <span class="highlight">${currentPrice} TK</span></p>
                    </div>
                    <div class="steps">
                        <p>📌 <strong>Step 1:</strong> Open Nagad app → Send Money</p>
                        <p>📌 <strong>Step 2:</strong> Enter merchant number: <strong>019XXXXXXXX</strong></p>
                        <p>📌 <strong>Step 3:</strong> Enter amount: <strong>${currentPrice} TK</strong></p>
                        <p>📌 <strong>Step 4:</strong> Enter reference: <strong>${orderId}</strong></p>
                        <p>📌 <strong>Step 5:</strong> Enter your Nagad PIN to confirm</p>
                    </div>
                    <div class="warning">
                        <i class="fas fa-info-circle"></i>
                        After successful payment, save the Transaction ID and send it to our Discord server.
                    </div>
                </div>
            `;
        } else if (method === 'card') {
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fab fa-cc-visa"></i> Card Payment</h4>
                    <p>Card payment gateway coming soon!</p>
                    <p>Currently please use bKash or Nagad.</p>
                    <p class="highlight">You can also contact admin for alternative payment methods.</p>
                </div>
            `;
        } else if (method === 'paypal') {
            const usdAmount = (currentPrice / 120).toFixed(2);
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fab fa-paypal"></i> PayPal Payment</h4>
                    <div class="merchant-info">
                        <p><strong>PayPal Email:</strong> <span class="highlight">paypal@theknightsofbd.com</span></p>
                        <p><strong>Amount:</strong> <span class="highlight">$${usdAmount} USD</span></p>
                        <p><strong>Reference:</strong> <span class="highlight">${orderId}</span></p>
                    </div>
                    <div class="steps">
                        <p>📌 Send payment to paypal@theknightsofbd.com</p>
                        <p>📌 Include Order ID: ${orderId} in notes</p>
                    </div>
                </div>
            `;
        }
        
        paymentInstructions.innerHTML = instructions;
        orderIdSpan.textContent = orderId;
        orderSummary.style.display = 'block';
        
        // Scroll to instructions
        paymentInstructions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Confirm Payment Button
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.onclick = () => {
            if (!currentItem || !currentPrice || !currentOrderId) {
                showNotification('Error: Order information missing!', 'error');
                return;
            }
            
            // Save order to localStorage
            const orderData = {
                orderId: currentOrderId,
                item: currentItem,
                amount: currentPrice,
                date: new Date().toISOString(),
                status: 'pending'
            };
            saveOrder(orderData);
            
            // Show confirmation modal
            confirmOrderId.textContent = currentOrderId;
            confirmItem.textContent = currentItem;
            confirmAmount.textContent = currentPrice;
            
            modal.style.display = 'none';
            confirmationModal.style.display = 'flex';
            
            showNotification(`Order #${currentOrderId} created! Please complete payment.`, 'success');
        };
    }

    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = `notification-toast ${type}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Discord button handler (already exists in main site)
    console.log('✅ Store ready! Payment instructions with Order ID system active.');
    console.log('📱 bKash & Nagad manual payment system active.');
});
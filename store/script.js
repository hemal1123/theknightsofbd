// Store Script - Manual Payment System with Discord Link

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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

    // Generate Order ID
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

    // Show notification
    function showNotification(message, type = 'info') {
        if (!notification) return;
        notification.textContent = message;
        notification.className = `notification-toast ${type}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Buy button click
    if (buyBtns.length > 0) {
        buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentItem = btn.getAttribute('data-item');
                currentPrice = btn.getAttribute('data-price');
                
                if (!currentItem || !currentPrice) {
                    console.error('Missing data attributes');
                    return;
                }
                
                modalItemName.textContent = currentItem;
                modalItemPrice.textContent = currentPrice;
                orderSummary.style.display = 'none';
                paymentInstructions.innerHTML = '';
                modal.style.display = 'flex';
                console.log('Modal opened for:', currentItem, currentPrice);
            });
        });
    }

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
                        <p><strong>bKash Number:</strong> <span class="highlight">01765980414</span></p>
                        <p><strong>Reference:</strong> <span class="highlight">${orderId}</span></p>
                        <p><strong>Amount:</strong> <span class="highlight">${currentPrice} TK</span></p>
                    </div>
                    <div class="steps">
                        <p>📌 <strong>Step 1:</strong> Open bKash app → Send Money</p>
                        <p>📌 <strong>Step 2:</strong> Enter: <strong>01765980414</strong></p>
                        <p>📌 <strong>Step 3:</strong> Amount: <strong>${currentPrice} TK</strong></p>
                        <p>📌 <strong>Step 4:</strong> Reference: <strong>${orderId}</strong></p>
                    </div>
                    <div class="discord-section">
                        <div class="discord-link-box">
                            <i class="fab fa-discord"></i>
                            <span>After payment, send Transaction ID to:</span>
                            <a href="#" class="discord-invite-link">https://discord.gg/X5DBbe3r9p</a>
                        </div>
                    </div>
                </div>
            `;
        } else if (method === 'nagad') {
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fas fa-mobile-alt"></i> Nagad Payment Instructions</h4>
                    <div class="merchant-info">
                        <p><strong>Nagad Number:</strong> <span class="highlight">01875214396</span></p>
                        <p><strong>Reference:</strong> <span class="highlight">${orderId}</span></p>
                        <p><strong>Amount:</strong> <span class="highlight">${currentPrice} TK</span></p>
                    </div>
                    <div class="steps">
                        <p>📌 <strong>Step 1:</strong> Open Nagad app → Send Money</p>
                        <p>📌 <strong>Step 2:</strong> Enter: <strong>01875214396</strong></p>
                        <p>📌 <strong>Step 3:</strong> Amount: <strong>${currentPrice} TK</strong></p>
                        <p>📌 <strong>Step 4:</strong> Reference: <strong>${orderId}</strong></p>
                    </div>
                    <div class="discord-section">
                        <div class="discord-link-box">
                            <i class="fab fa-discord"></i>
                            <span>After payment, send Transaction ID to:</span>
                            <a href="#" class="discord-invite-link">https://discord.gg/X5DBbe3r9p</a>
                        </div>
                    </div>
                </div>
            `;
        } else if (method === 'card') {
            instructions = `
                <div class="payment-instruction-card">
                    <div class="warning">💳 Card payment coming soon! Please use bKash or Nagad.</div>
                    <div class="discord-section">
                        <div class="discord-link-box">
                            <i class="fab fa-discord"></i>
                            <span>Join our Discord for support:</span>
                            <a href="#" class="discord-invite-link">https://discord.gg/X5DBbe3r9p</a>
                        </div>
                    </div>
                </div>
            `;
        } else if (method === 'paypal') {
            const usdAmount = (currentPrice / 120).toFixed(2);
            instructions = `
                <div class="payment-instruction-card">
                    <h4><i class="fab fa-paypal"></i> PayPal Payment</h4>
                    <div class="merchant-info">
                        <p><strong>Join Discord to continune Payment</strong><span class="highlight"></span></p>
                    </div>
                    <div class="discord-section">
                        <div class="discord-link-box">
                            <i class="fab fa-discord"></i>
                            <span>DC Link:</span>
                            <a href="#" class="discord-invite-link">https://discord.gg/X5DBbe3r9p</a>
                        </div>
                    </div>
                </div>
            `;
        }
        
        paymentInstructions.innerHTML = instructions;
        orderIdSpan.textContent = orderId;
        orderSummary.style.display = 'block';
        
        // Setup Discord links in the newly added HTML
        setupDiscordLinks();
    }
    
    // Function to setup Discord links
    function setupDiscordLinks() {
        const discordLinks = document.querySelectorAll('.discord-invite-link');
        discordLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://discord.gg/X5DBbe3r9p', '_blank');
                console.log('Discord link clicked!');
            });
        });
    }

    // Confirm Payment Button
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.onclick = () => {
            if (!currentItem || !currentPrice || !currentOrderId) {
                showNotification('Error: Order information missing!', 'error');
                return;
            }
            
            const orderData = {
                orderId: currentOrderId,
                item: currentItem,
                amount: currentPrice,
                date: new Date().toISOString(),
                status: 'pending'
            };
            saveOrder(orderData);
            
            confirmOrderId.textContent = currentOrderId;
            confirmItem.textContent = currentItem;
            confirmAmount.textContent = currentPrice;
            
            modal.style.display = 'none';
            confirmationModal.style.display = 'flex';
            
            showNotification(`Order #${currentOrderId} created! Send payment on Discord.`, 'success');
            
            // Setup Discord link in confirmation modal
            const confirmDiscordLink = document.querySelector('#confirmationModal .discord-invite-link');
            if (confirmDiscordLink) {
                confirmDiscordLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open('https://discord.gg/X5DBbe3r9p', '_blank');
                });
            }
        };
    }

    // Setup initial Discord links
    setupDiscordLinks();

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.onclick = () => {
            navLinks.classList.toggle('show');
        };
    }

    
        // ========== DISCORD FEATURE ADDED ==========
    // This adds functionality to open Discord link when clicking Discord buttons

    function setupDiscordButtons() {
        // Discord button inside purchase modal (order summary section)
        const discordSupportBtn = document.getElementById('discordSupportBtn');
        if (discordSupportBtn) {
            discordSupportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://discord.gg/X5DBbe3r9p', '_blank');
                showNotification('Opening Discord server...', 'info');
            });
        }
        
        // Discord link inside confirmation modal
        const confirmDiscordLinks = document.querySelectorAll('#confirmationModal .discord-invite-link');
        confirmDiscordLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://discord.gg/X5DBbe3r9p', '_blank');
            });
        });
        
        // Any other discord links that might be dynamically added
        const allDiscordLinks = document.querySelectorAll('.discord-invite-link');
        allDiscordLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!link.closest('#confirmationModal')) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open('https://discord.gg/X5DBbe3r9p', '_blank');
                }
            });
        });
    }

    // Call this function when DOM is ready and also after payment instructions load
    // Override or extend the existing showPaymentInstructions function to re-setup Discord buttons

    // Store the original function if it exists
    const originalShowPaymentInstructions = window.showPaymentInstructions || function() {};

    // Create enhanced version that also sets up Discord buttons
    window.enhancedSetup = function() {
        setupDiscordButtons();
    };

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupDiscordButtons, 100);
        });
    } else {
        setTimeout(setupDiscordButtons, 100);
    }

    // Also observe for dynamically added Discord buttons (in case payment instructions add them)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                setupDiscordButtons();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('✅ Store script loaded successfully!');
    console.log('✅ Discord link: https://discord.gg/X5DBbe3r9p');
});
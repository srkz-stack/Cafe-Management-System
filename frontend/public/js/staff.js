document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    const user = Api.getUser();
    document.getElementById('navUser').textContent = `👤 ${user.username}`;
    let menuItems = [];
    let currentOrder = []; 
    const menuGrid = document.getElementById('menuGrid');
    const orderItemsDiv = document.getElementById('orderItems');
    const orderEmpty = document.getElementById('orderEmpty');
    const orderTotalSpan = document.getElementById('orderTotal');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const pricingSelect = document.getElementById('pricingType');
    const ordersGrid = document.getElementById('ordersGrid');
    const ordersEmpty = document.getElementById('ordersEmpty');
    const menuCategoryFilter = document.getElementById('menuCategoryFilter');
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    loadMenu();
    loadOrders();
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Api.clearAuth();
        window.location.href = '/index.html';
    });
    document.getElementById('clearOrderBtn').addEventListener('click', () => {
        currentOrder = [];
        renderCurrentOrder();
    });
    submitOrderBtn.addEventListener('click', submitOrder);
    pricingSelect.addEventListener('change', renderCurrentOrder);
    menuCategoryFilter.addEventListener('change', renderMenuGrid);
    orderStatusFilter.addEventListener('change', loadOrders);
    document.getElementById('refreshOrdersBtn').addEventListener('click', loadOrders);
    async function loadMenu() {
        try {
            const response = await Api.getMenu();
            menuItems = (response.data || []).filter(i => i.available);
            renderMenuGrid();
        } catch (err) {
            showToast('Failed to load menu: ' + err.message, 'error');
        }
    }
    function renderMenuGrid() {
        const filter = menuCategoryFilter.value;
        const filtered = filter
            ? menuItems.filter(i => i.category === filter)
            : menuItems;
        menuGrid.innerHTML = filtered.map(item => `
            <div class="menu-card" data-id="${item.id}">
                <span class="card-emoji">${CATEGORY_EMOJI[item.category] || '🍽️'}</span>
                <div class="card-name">${escapeHtml(item.name)}</div>
                <div class="card-price">$${item.price.toFixed(2)}</div>
            </div>
        `).join('');
        menuGrid.querySelectorAll('.menu-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                addToOrder(id);
            });
        });
    }
    function addToOrder(menuItemId) {
        const item = menuItems.find(i => i.id === menuItemId);
        if (!item) return;
        const existing = currentOrder.find(o => o.menuItem.id === menuItemId);
        if (existing) {
            existing.quantity++;
        } else {
            currentOrder.push({ menuItem: item, quantity: 1 });
        }
        renderCurrentOrder();
        showToast(`Added ${item.name}`, 'success');
    }
    function renderCurrentOrder() {
        if (currentOrder.length === 0) {
            orderItemsDiv.innerHTML = `
                <div class="order-empty">
                    <span>🛒</span>
                    <p>Tap menu items to add</p>
                </div>
            `;
            orderTotalSpan.textContent = '$0.00';
            submitOrderBtn.disabled = true;
            return;
        }
        submitOrderBtn.disabled = false;
        orderItemsDiv.innerHTML = currentOrder.map((line, idx) => {
            const subtotal = line.menuItem.price * line.quantity;
            return `
                <div class="order-line">
                    <div class="order-line-info">
                        <div class="order-line-name">${escapeHtml(line.menuItem.name)}</div>
                        <div class="order-line-detail">$${line.menuItem.price.toFixed(2)} each</div>
                    </div>
                    <div class="order-line-qty">
                        <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
                        <span>${line.quantity}</span>
                        <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
                    </div>
                    <div class="order-line-subtotal">$${subtotal.toFixed(2)}</div>
                </div>
            `;
        }).join('');
        orderItemsDiv.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const action = btn.dataset.action;
                if (action === 'inc') {
                    currentOrder[idx].quantity++;
                } else {
                    currentOrder[idx].quantity--;
                    if (currentOrder[idx].quantity <= 0) {
                        currentOrder.splice(idx, 1);
                    }
                }
                renderCurrentOrder();
            });
        });
        const rawTotal = currentOrder.reduce((sum, line) =>
            sum + (line.menuItem.price * line.quantity), 0);
        const isHappyHour = pricingSelect.value === 'HAPPY_HOUR';
        const total = isHappyHour ? rawTotal * 0.8 : rawTotal;
        orderTotalSpan.textContent = `$${total.toFixed(2)}`;
    }
    async function submitOrder() {
        if (currentOrder.length === 0) return;
        submitOrderBtn.disabled = true;
        submitOrderBtn.textContent = 'Submitting...';
        const orderData = {
            items: currentOrder.map(line => ({
                menuItemId: line.menuItem.id,
                quantity: line.quantity
            })),
            pricingType: pricingSelect.value
        };
        try {
            await Api.createOrder(orderData);
            showToast('Order submitted!', 'success');
            currentOrder = [];
            renderCurrentOrder();
            await loadOrders();
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            submitOrderBtn.disabled = false;
            submitOrderBtn.textContent = 'Submit Order';
        }
    }
    async function loadOrders() {
        const status = orderStatusFilter.value || null;
        try {
            const response = await Api.getOrders(status);
            const orders = response.data || [];
            if (orders.length === 0) {
                ordersGrid.innerHTML = '';
                ordersEmpty.style.display = 'block';
                return;
            }
            ordersEmpty.style.display = 'none';
            orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            ordersGrid.innerHTML = orders.map(order => {
                const statusClass = order.status.toLowerCase();
                const nextStatus = getNextStatus(order.status);
                return `
                    <div class="order-card">
                        <div class="order-card-header">
                            <span class="order-card-id">Order #${order.id}</span>
                            <span class="badge badge-${statusClass}">${formatStatus(order.status)}</span>
                        </div>
                        <div class="order-card-body">
                            ${order.items.map(item => `
                                <div class="order-card-item">
                                    <span>${item.menuItemName} × ${item.quantity}</span>
                                    <span>$${item.subtotal.toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-card-footer">
                            <div>
                                <div class="order-card-total">$${order.totalPrice.toFixed(2)}</div>
                                <div class="order-card-pricing">${order.pricingType === 'HAPPY_HOUR' ? '🎉 Happy Hour' : 'Regular'}</div>
                            </div>
                            <div class="order-card-actions">
                                ${nextStatus ? `<button class="btn btn-success btn-sm" onclick="advanceOrder(${order.id}, '${nextStatus}')">${formatStatus(nextStatus)}</button>` : ''}
                                ${order.status !== 'CANCELLED' && order.status !== 'DELIVERED' ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder(${order.id})">Cancel</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            showToast('Failed to load orders: ' + err.message, 'error');
        }
    }
    function getNextStatus(current) {
        const flow = {
            'PENDING': 'PREPARING',
            'PREPARING': 'READY',
            'READY': 'DELIVERED'
        };
        return flow[current] || null;
    }
    function formatStatus(status) {
        const icons = {
            'PENDING': '⏳ Pending',
            'PREPARING': '🔥 Preparing',
            'READY': '✅ Ready',
            'DELIVERED': '📦 Delivered',
            'CANCELLED': '❌ Cancelled'
        };
        return icons[status] || status;
    }
    window.advanceOrder = async function(id, newStatus) {
        try {
            await Api.updateOrderStatus(id, newStatus);
            showToast(`Order #${id} → ${formatStatus(newStatus)}`, 'success');
            await loadOrders();
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };
    window.cancelOrder = async function(id) {
        if (!confirm('Cancel this order?')) return;
        try {
            await Api.updateOrderStatus(id, 'CANCELLED');
            showToast(`Order #${id} cancelled`, 'info');
            await loadOrders();
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };
});
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

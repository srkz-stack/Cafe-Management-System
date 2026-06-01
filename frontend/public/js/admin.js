document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    const user = Api.getUser();
    if (user.role !== 'ADMIN') {
        window.location.href = '/staff.html';
        return;
    }
    document.getElementById('navUser').textContent = `👤 ${user.username}`;
    const tableBody = document.getElementById('menuTableBody');
    const emptyState = document.getElementById('emptyState');
    const categoryFilter = document.getElementById('categoryFilter');
    const modal = document.getElementById('menuModal');
    const modalTitle = document.getElementById('modalTitle');
    const menuForm = document.getElementById('menuForm');
    const editItemId = document.getElementById('editItemId');
    let menuItems = [];
    loadMenuItems();
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Api.clearAuth();
        window.location.href = '/index.html';
    });
    document.getElementById('addItemBtn').addEventListener('click', () => {
        openModal();
    });
    categoryFilter.addEventListener('change', () => {
        renderTable();
    });
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    menuForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveMenuItem();
    });
    async function loadMenuItems() {
        try {
            const response = await Api.getMenu();
            menuItems = response.data || [];
            updateStats();
            renderTable();
        } catch (err) {
            showToast('Failed to load menu items: ' + err.message, 'error');
        }
    }
    function updateStats() {
        document.getElementById('totalItems').textContent = menuItems.length;
        document.getElementById('availableItems').textContent =
            menuItems.filter(i => i.available).length;
    }
    function renderTable() {
        const filter = categoryFilter.value;
        const filtered = filter
            ? menuItems.filter(i => i.category === filter)
            : menuItems;
        if (filtered.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        tableBody.innerHTML = filtered.map(item => `
            <tr>
                <td>#${item.id}</td>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td class="text-muted">${escapeHtml(item.description || '—')}</td>
                <td><span class="badge badge-${item.category.toLowerCase()}">${CATEGORY_EMOJI[item.category] || ''} ${item.category}</span></td>
                <td><strong>$${item.price.toFixed(2)}</strong></td>
                <td><span class="badge ${item.available ? 'badge-available' : 'badge-unavailable'}">${item.available ? 'Available' : 'Unavailable'}</span></td>
                <td>
                    <div class="cell-actions">
                        <button class="btn btn-outline btn-sm" onclick="editItem(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    function openModal(item = null) {
        menuForm.reset();
        if (item) {
            modalTitle.textContent = 'Edit Menu Item';
            editItemId.value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemDescription').value = item.description || '';
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemAvailable').checked = item.available;
        } else {
            modalTitle.textContent = 'Add Menu Item';
            editItemId.value = '';
            document.getElementById('itemAvailable').checked = true;
        }
        modal.style.display = 'flex';
    }
    function closeModal() {
        modal.style.display = 'none';
    }
    async function saveMenuItem() {
        const data = {
            name: document.getElementById('itemName').value.trim(),
            description: document.getElementById('itemDescription').value.trim(),
            price: parseFloat(document.getElementById('itemPrice').value),
            category: document.getElementById('itemCategory').value,
            available: document.getElementById('itemAvailable').checked
        };
        const id = editItemId.value;
        try {
            if (id) {
                await Api.updateMenuItem(id, data);
                showToast('Menu item updated!', 'success');
            } else {
                await Api.createMenuItem(data);
                showToast('Menu item created!', 'success');
            }
            closeModal();
            await loadMenuItems();
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    }
    window.editItem = function(id) {
        const item = menuItems.find(i => i.id === id);
        if (item) openModal(item);
    };
    window.deleteItem = async function(id) {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await Api.deleteMenuItem(id);
            showToast('Menu item deleted', 'success');
            await loadMenuItems();
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

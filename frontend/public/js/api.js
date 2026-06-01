const API_BASE = 'http://localhost:8080/api';
const Api = {
    getToken() {
        return localStorage.getItem('cafe_token');
    },
    getUser() {
        const user = localStorage.getItem('cafe_user');
        return user ? JSON.parse(user) : null;
    },
    isAuthenticated() {
        return !!this.getToken();
    },
    setAuth(token, username, role) {
        localStorage.setItem('cafe_token', token);
        localStorage.setItem('cafe_user', JSON.stringify({ username, role }));
    },
    clearAuth() {
        localStorage.removeItem('cafe_token');
        localStorage.removeItem('cafe_user');
    },
    async request(method, path, body = null) {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const options = { method, headers };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${API_BASE}${path}`, options);
        if (response.status === 401 || response.status === 403) {
            this.clearAuth();
            window.location.href = '/index.html';
            throw new Error('Unauthorized');
        }
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Request failed');
        }
        return data;
    },
    login(username, password) {
        return this.request('POST', '/auth/login', { username, password });
    },
    getMenu() {
        return this.request('GET', '/menu');
    },
    getMenuItem(id) {
        return this.request('GET', `/menu/${id}`);
    },
    getMenuByCategory(category) {
        return this.request('GET', `/menu/category/${category}`);
    },
    createMenuItem(data) {
        return this.request('POST', '/menu', data);
    },
    updateMenuItem(id, data) {
        return this.request('PUT', `/menu/${id}`, data);
    },
    deleteMenuItem(id) {
        return this.request('DELETE', `/menu/${id}`);
    },
    getOrders(status = null) {
        const query = status ? `?status=${status}` : '';
        return this.request('GET', `/orders${query}`);
    },
    getOrder(id) {
        return this.request('GET', `/orders/${id}`);
    },
    createOrder(data) {
        return this.request('POST', '/orders', data);
    },
    updateOrderStatus(id, status) {
        return this.request('PUT', `/orders/${id}/status`, { status });
    },
    deleteOrder(id) {
        return this.request('DELETE', `/orders/${id}`);
    }
};
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast-${type}`;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
function requireAuth() {
    if (!Api.isAuthenticated()) {
        window.location.href = '/index.html';
        return false;
    }
    return true;
}
const CATEGORY_EMOJI = {
    COFFEE: '☕',
    TEA: '🍵',
    PASTRY: '🥐',
    SANDWICH: '🥪',
    DESSERT: '🍰',
    BEVERAGE: '🥤'
};

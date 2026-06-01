document.addEventListener('DOMContentLoaded', () => {
    if (Api.isAuthenticated()) {
        const user = Api.getUser();
        redirectByRole(user.role);
        return;
    }
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing in...';
        try {
            const response = await Api.login(username, password);
            const { token, username: user, role } = response.data;
            Api.setAuth(token, user, role);
            redirectByRole(role);
        } catch (err) {
            showError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });
    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
    function redirectByRole(role) {
        if (role === 'ADMIN') {
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/staff.html';
        }
    }
});

// Authentication Data
const authData = {
    users: [
        {
            id: 1,
            username: "admin",
            email: "admin@example.com",
            password: "admin123", // In production, use proper password hashing
            role: "admin",
            name: "Administrador",
            organization: "NCPI",
            lastLogin: "2024-03-15T10:00:00Z"
        }
    ],
    sessions: []
};

// Load authentication data
function loadAuthData() {
    const data = JSON.parse(localStorage.getItem('authData')) || authData;
    localStorage.setItem('authData', JSON.stringify(data));
    return data;
}

// Check if user is authenticated
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = './login.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
}

// Login user
function login(username, password) {
    const data = loadAuthData();
    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return {
            success: false,
            message: "Usuário ou senha inválidos"
        };
    }

    const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        organization: user.organization
    };

    // Update user's last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem('authData', JSON.stringify(data));
    localStorage.setItem('user', JSON.stringify(userData));

    return {
        success: true,
        user: userData
    };
}

// Logout user
function logout() {
    localStorage.removeItem('user');
    window.location.href = './login.html';
}
// ... existing code ...

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

// Get current session
function getCurrentSession() {
    const data = loadAuthData();
    const sessionId = localStorage.getItem('sessionId');
    return data.sessions.find(s => s.id === sessionId);
}

// Register new user
function register(userData) {
    const data = loadAuthData();
    
    // Check if username exists
    if (data.users.some(u => u.username === userData.username)) {
        return {
            success: false,
            message: "Nome de usuário já existe"
        };
    }

    // Check if email exists
    if (data.users.some(u => u.email === userData.email)) {
        return {
            success: false,
            message: "Email já cadastrado"
        };
    }

    // Create new user
    const newUser = {
        id: Math.max(...data.users.map(u => u.id), 0) + 1,
        username: userData.username,
        email: userData.email,
        password: userData.password, // In production, use proper password hashing
        role: userData.role || "user",
        name: userData.name,
        organization: userData.organization,
        lastLogin: null
    };

    // Add user to data
    data.users.push(newUser);
    localStorage.setItem('authData', JSON.stringify(data));

    return {
        success: true,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            name: newUser.name,
            organization: newUser.organization
        }
    };
}

// Update user profile
function updateProfile(userData) {
    const user = getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: "Usuário não encontrado"
        };
    }

    const data = loadAuthData();
    const userIndex = data.users.findIndex(u => u.id === user.id);

    // Update user data
    data.users[userIndex] = {
        ...data.users[userIndex],
        email: userData.email,
        name: userData.name,
        organization: userData.organization
    };

    // Save data
    localStorage.setItem('authData', JSON.stringify(data));

    return {
        success: true,
        user: {
            id: data.users[userIndex].id,
            username: data.users[userIndex].username,
            email: data.users[userIndex].email,
            role: data.users[userIndex].role,
            name: data.users[userIndex].name,
            organization: data.users[userIndex].organization
        }
    };
}

// Change password
function changePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: "Usuário não encontrado"
        };
    }

    const data = loadAuthData();
    const userIndex = data.users.findIndex(u => u.id === user.id);

    // Check current password
    if (data.users[userIndex].password !== currentPassword) {
        return {
            success: false,
            message: "Senha atual incorreta"
        };
    }

    // Update password
    data.users[userIndex].password = newPassword; // In production, use proper password hashing
    localStorage.setItem('authData', JSON.stringify(data));

    return {
        success: true,
        message: "Senha alterada com sucesso"
    };
}

// Reset password
function resetPassword(email) {
    const data = loadAuthData();
    const user = data.users.find(u => u.email === email);
    
    if (!user) {
        return {
            success: false,
            message: "Email não encontrado"
        };
    }

    // In production, send reset password email
    // For demo purposes, just return success
    return {
        success: true,
        message: "Instruções de recuperação de senha enviadas para seu email"
    };
}

// Generate session ID
function generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Check session expiration
function checkSessionExpiration() {
    const session = getCurrentSession();
    if (!session) return false;

    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
        logout();
        return false;
    }

    return true;
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    // Check session expiration every minute
    setInterval(checkSessionExpiration, 60000);

    // If on login page, check if already logged in
    if (window.location.pathname === '/login.html') {
        const session = getCurrentSession();
        if (session) {
            window.location.href = '/';
        }
    }
});

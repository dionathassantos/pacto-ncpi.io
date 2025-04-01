// ... existing code ...
// Check if user is authenticated
function checkAuth() {
    const session = getCurrentSession();
    const user = localStorage.getItem('user');
    if (!session && !user) {
        window.location.href = './login.html';
        return false;
    }
    return true;
}

// Get current session
function getCurrentSession() {
    const data = loadAuthData();
    const sessionId = localStorage.getItem('sessionId');
    return data.sessions.find(s => s.id === sessionId);
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

    // Create new session
    const session = {
        id: generateSessionId(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Add session to data
    data.sessions.push(session);
    localStorage.setItem('authData', JSON.stringify(data));
    localStorage.setItem('sessionId', session.id);

    // Update user's last login
    user.lastLogin = new Date().toISOString();
    localStorage.setItem('authData', JSON.stringify(data));

    const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        organization: user.organization
    };

    localStorage.setItem('user', JSON.stringify(userData));

    return {
        success: true,
        user: userData
    };
}

// Logout user
function logout() {
    const session = getCurrentSession();
    if (session) {
        const data = loadAuthData();
        data.sessions = data.sessions.filter(s => s.id !== session.id);
        localStorage.setItem('authData', JSON.stringify(data));
    }
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}
// ... existing code ...

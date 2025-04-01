// Initial notifications data
const notificationsData = {
    notifications: [
        {
            id: 1,
            type: 'info',
            title: 'Nova iniciativa criada',
            message: 'Uma nova iniciativa foi criada no painel da estratégia.',
            timestamp: '2024-03-20T10:30:00',
            read: false,
            link: 'index.html'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Meta próxima do prazo',
            message: 'A meta "Capacitação de profissionais" está próxima do prazo final.',
            timestamp: '2024-03-19T15:45:00',
            read: false,
            link: 'index.html#metas'
        },
        {
            id: 3,
            type: 'success',
            title: 'Relatório atualizado',
            message: 'O relatório de avaliação foi atualizado com sucesso.',
            timestamp: '2024-03-18T09:15:00',
            read: true,
            link: 'relatorios.html'
        }
    ]
};

// Load notifications from localStorage or initialize with default data
function loadNotifications() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
        return JSON.parse(stored);
    }
    localStorage.setItem('notifications', JSON.stringify(notificationsData));
    return notificationsData;
}

// Save notifications to localStorage
function saveNotifications(data) {
    localStorage.setItem('notifications', JSON.stringify(data));
}

// Get unread notifications count
function getUnreadCount() {
    const data = loadNotifications();
    return data.notifications.filter(n => !n.read).length;
}

// Mark notification as read
function markAsRead(id) {
    const data = loadNotifications();
    const notification = data.notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveNotifications(data);
        updateNotificationBadge();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    const data = loadNotifications();
    data.notifications.forEach(n => n.read = true);
    saveNotifications(data);
    updateNotificationBadge();
}

// Delete notification
function deleteNotification(id) {
    const data = loadNotifications();
    data.notifications = data.notifications.filter(n => n.id !== id);
    saveNotifications(data);
    updateNotificationBadge();
}

// Add new notification
function addNotification(notification) {
    const data = loadNotifications();
    notification.id = Math.max(...data.notifications.map(n => n.id), 0) + 1;
    notification.timestamp = new Date().toISOString();
    notification.read = false;
    data.notifications.unshift(notification);
    saveNotifications(data);
    updateNotificationBadge();
}

// Update notification badge in the header
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const count = getUnreadCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// Render notifications dropdown
function renderNotificationsDropdown() {
    const data = loadNotifications();
    const dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    dropdown.innerHTML = `
        <div class="notifications-header">
            <h3>Notificações</h3>
            <button class="btn-mark-all-read">
                <i class="fas fa-check-double"></i>
                Marcar todas como lidas
            </button>
        </div>
        <div class="notifications-list">
            ${data.notifications.map(notification => `
                <div class="notification-item ${notification.read ? 'read' : ''}" data-id="${notification.id}">
                    <div class="notification-icon">
                        <i class="fas ${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="notification-content">
                        <h4>${notification.title}</h4>
                        <p>${notification.message}</p>
                        <span class="notification-time">${formatTimestamp(notification.timestamp)}</span>
                    </div>
                    <button class="btn-delete-notification">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
        </div>
        <div class="notifications-footer">
            <a href="#" class="view-all">Ver todas as notificações</a>
        </div>
    `;

    // Add event listeners
    dropdown.querySelector('.btn-mark-all-read').addEventListener('click', () => {
        markAllAsRead();
        renderNotificationsDropdown();
    });

    dropdown.querySelectorAll('.notification-item').forEach(item => {
        const id = parseInt(item.dataset.id);
        item.addEventListener('click', () => {
            markAsRead(id);
            const notification = data.notifications.find(n => n.id === id);
            if (notification && notification.link) {
                window.location.href = notification.link;
            }
        });
    });

    dropdown.querySelectorAll('.btn-delete-notification').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.closest('.notification-item').dataset.id);
            deleteNotification(id);
            renderNotificationsDropdown();
        });
    });

    return dropdown;
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'info':
            return 'fa-info-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'success':
            return 'fa-check-circle';
        default:
            return 'fa-bell';
    }
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Agora mesmo';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`;
    }
    
    // Less than 1 week
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    }
    
    // Otherwise, show the date
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize notifications system
document.addEventListener('DOMContentLoaded', () => {
    // Update notification badge
    updateNotificationBadge();

    // Add click event to notifications button
    const notificationsBtn = document.querySelector('.btn-notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            const dropdown = renderNotificationsDropdown();
            const existingDropdown = document.querySelector('.notifications-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
            } else {
                notificationsBtn.appendChild(dropdown);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!notificationsBtn.contains(e.target)) {
                const dropdown = document.querySelector('.notifications-dropdown');
                if (dropdown) {
                    dropdown.remove();
                }
            }
        });
    }
});
class Dashboard {
    constructor() {
        this.authService = authService;
        this.init();
    }

    async init() {
        await this.loadUserProfile();
        await this.loadUpcomingEvents();
        await this.loadSuggestedConnections();
        await this.loadStats();
        this.setupEventListeners();
    }

    async loadUserProfile() {
        try {
            const user = this.authService.getUser();
            
            if (user) {
                document.getElementById('userName').textContent = user.profile.firstName;
                document.getElementById('userFullName').textContent = `${user.profile.firstName} ${user.profile.lastName}`;
                document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                document.getElementById('welcomeName').textContent = user.profile.firstName;
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    async loadUpcomingEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events?upcoming=true&limit=3`, {
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load events');
            }

            const events = await response.json();
            this.displayUpcomingEvents(events);
        } catch (error) {
            console.error('Error loading events:', error);
            document.getElementById('upcomingEvents').innerHTML = 
                '<p class="text-muted">Failed to load events</p>';
        }
    }

    displayUpcomingEvents(events) {
        const container = document.getElementById('upcomingEvents');
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-muted">No upcoming events</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="card event-card ${event.eventType} mb-3">
                <div class="card-body">
                    <h6 class="card-title">${event.title}</h6>
                    <p class="card-text small text-muted mb-1">
                        <i class="fas fa-calendar me-1"></i>
                        ${new Date(event.dateTime).toLocaleDateString()} at ${new Date(event.dateTime).toLocaleTimeString()}
                    </p>
                    <p class="card-text small text-muted mb-2">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${event.location}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge ${this.getEventTypeBadgeClass(event.eventType)}">${event.eventType.replace('_', ' ')}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="dashboard.rsvpToEvent('${event._id}')">
                            RSVP
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getEventTypeBadgeClass(eventType) {
        const classes = {
            'career_fair': 'bg-career-fair',
            'workshop': 'bg-workshop',
            'guest_lecture': 'bg-guest-lecture',
            'cultural': 'bg-cultural',
            'networking': 'bg-primary'
        };
        return classes[eventType] || 'bg-secondary';
    }

    async loadSuggestedConnections() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/search?role=alumni&limit=3`, {
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load connections');
            }

            const users = await response.json();
            this.displaySuggestedConnections(users);
        } catch (error) {
            console.error('Error loading connections:', error);
            document.getElementById('suggestedConnections').innerHTML = 
                '<p class="text-muted">Failed to load connections</p>';
        }
    }

    displaySuggestedConnections(users) {
        const container = document.getElementById('suggestedConnections');
        
        if (users.length === 0) {
            container.innerHTML = '<p class="text-muted">No suggested connections</p>';
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="connection-card card mb-3">
                <div class="card-body">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile.firstName + ' ' + user.profile.lastName)}&background=3498db&color=fff" 
                         class="rounded-circle mb-2" width="60" height="60" alt="${user.profile.firstName}">
                    <h6 class="card-title mb-1">${user.profile.firstName} ${user.profile.lastName}</h6>
                    <p class="card-text small text-muted mb-2">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
                    ${user.profile.department ? `<p class="card-text small mb-2">${user.profile.department}</p>` : ''}
                    <button class="btn btn-sm btn-primary" onclick="dashboard.connectWithUser('${user._id}')">
                        Connect
                    </button>
                </div>
            </div>
        `).join('');
    }

    async loadStats() {
        try {
            // Simulate loading stats - in real app, you'd fetch from API
            document.getElementById('connectionsCount').textContent = '12';
            document.getElementById('eventsCount').textContent = '3';
            document.getElementById('messagesCount').textContent = '5';
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    async rsvpToEvent(eventId) {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
                method: 'POST',
                headers: this.authService.getAuthHeaders(),
                body: JSON.stringify({ rsvpStatus: 'going' })
            });

            if (!response.ok) {
                throw new Error('Failed to RSVP');
            }

            showAlert('Successfully RSVPed to event!', 'success');
            this.loadUpcomingEvents(); // Refresh events
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    async connectWithUser(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/connections/${userId}`, {
                method: 'POST',
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to send connection request');
            }

            showAlert('Connection request sent!', 'success');
            this.loadSuggestedConnections(); // Refresh connections
        } catch (error) {
            showAlert('Failed to send connection request', 'error');
        }
    }

    setupEventListeners() {
        // Additional event listeners can be added here
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
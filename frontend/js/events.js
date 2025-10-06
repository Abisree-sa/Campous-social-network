class Events {
    constructor() {
        this.authService = authService;
        this.events = [];
        this.init();
    }

    async init() {
        await this.loadEvents();
        this.setupEventListeners();
        this.checkUserRole();
    }

    async loadEvents() {
        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load events');
            }

            this.events = await response.json();
            this.displayEvents(this.events);
        } catch (error) {
            console.error('Error loading events:', error);
            document.getElementById('eventsList').innerHTML = 
                '<p class="text-muted">Failed to load events</p>';
        }
    }

    displayEvents(events) {
        const container = document.getElementById('eventsList');
        
        if (events.length === 0) {
            container.innerHTML = '<p class="text-muted">No events found</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">${event.description}</p>
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                <span class="badge ${this.getEventTypeBadgeClass(event.eventType)}">
                                    ${event.eventType.replace('_', ' ')}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas fa-calendar me-1"></i>
                                    ${new Date(event.dateTime).toLocaleDateString()}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas fa-clock me-1"></i>
                                    ${new Date(event.dateTime).toLocaleTimeString()}
                                </span>
                                <span class="badge bg-light text-dark">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    ${event.location}
                                </span>
                            </div>
                            <p class="text-muted small">
                                Organized by: ${event.organizer.profile.firstName} ${event.organizer.profile.lastName}
                            </p>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="d-flex flex-column gap-2">
                                <button class="btn btn-primary" onclick="events.rsvpToEvent('${event._id}')">
                                    <i class="fas fa-calendar-check me-2"></i>RSVP
                                </button>
                                <button class="btn btn-outline-secondary">
                                    <i class="fas fa-share-alt me-2"></i>Share
                                </button>
                            </div>
                        </div>
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
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    checkUserRole() {
        const user = this.authService.getUser();
        if (user && (user.role === 'admin' || user.role === 'faculty')) {
            document.getElementById('createEventBtn').style.display = 'block';
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchEvents');
        const typeFilter = document.getElementById('eventTypeFilter');
        const timeFilter = document.getElementById('timeFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEvents());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterEvents());
        }
        if (timeFilter) {
            timeFilter.addEventListener('change', () => this.filterEvents());
        }
    }

    filterEvents() {
        const searchTerm = document.getElementById('searchEvents').value.toLowerCase();
        const typeFilter = document.getElementById('eventTypeFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;

        let filteredEvents = this.events;

        // Search filter
        if (searchTerm) {
            filteredEvents = filteredEvents.filter(event => 
                event.title.toLowerCase().includes(searchTerm) ||
                event.description.toLowerCase().includes(searchTerm)
            );
        }

        // Type filter
        if (typeFilter) {
            filteredEvents = filteredEvents.filter(event => event.eventType === typeFilter);
        }

        // Time filter
        if (timeFilter === 'upcoming') {
            filteredEvents = filteredEvents.filter(event => new Date(event.dateTime) > new Date());
        } else if (timeFilter === 'past') {
            filteredEvents = filteredEvents.filter(event => new Date(event.dateTime) < new Date());
        }

        this.displayEvents(filteredEvents);
    }
}

// Initialize events when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.events = new Events();
});
class Mentors {
    constructor() {
        this.authService = authService;
        this.mentors = [];
        this.init();
    }

    async init() {
        await this.loadMentors();
        this.setupEventListeners();
    }

    async loadMentors() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/search?role=alumni,faculty`, {
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to load mentors');
            }

            this.mentors = await response.json();
            this.displayMentors(this.mentors);
        } catch (error) {
            console.error('Error loading mentors:', error);
            document.getElementById('mentorsGrid').innerHTML = 
                '<p class="text-muted">Failed to load mentors</p>';
        }
    }

    displayMentors(mentors) {
        const container = document.getElementById('mentorsGrid');
        
        if (mentors.length === 0) {
            container.innerHTML = '<p class="text-muted">No mentors found</p>';
            return;
        }

        container.innerHTML = mentors.map(mentor => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card mentor-card h-100">
                    <div class="card-body text-center">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.profile.firstName + ' ' + mentor.profile.lastName)}&background=3498db&color=fff" 
                             class="rounded-circle mb-3" width="80" height="80" alt="${mentor.profile.firstName}">
                        <h5 class="card-title">${mentor.profile.firstName} ${mentor.profile.lastName}</h5>
                        <p class="card-text text-muted">${mentor.role.charAt(0).toUpperCase() + mentor.role.slice(1)}</p>
                        
                        ${mentor.profile.department ? `
                            <p class="card-text">
                                <i class="fas fa-graduation-cap me-2"></i>
                                ${mentor.profile.department}
                            </p>
                        ` : ''}
                        
                        ${mentor.profile.currentPosition ? `
                            <p class="card-text">
                                <i class="fas fa-briefcase me-2"></i>
                                ${mentor.profile.currentPosition}
                                ${mentor.profile.company ? `at ${mentor.profile.company}` : ''}
                            </p>
                        ` : ''}

                        ${mentor.profile.skills && mentor.profile.skills.length > 0 ? `
                            <div class="mb-3">
                                <h6 class="small text-muted mb-2">Skills</h6>
                                <div class="d-flex flex-wrap justify-content-center gap-1">
                                    ${mentor.profile.skills.slice(0, 3).map(skill => `
                                        <span class="skill-badge">${skill}</span>
                                    `).join('')}
                                    ${mentor.profile.skills.length > 3 ? `
                                        <span class="skill-badge">+${mentor.profile.skills.length - 3} more</span>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}

                        <div class="d-flex gap-2 justify-content-center">
                            <button class="btn btn-primary btn-sm" onclick="mentors.connectWithMentor('${mentor._id}')">
                                <i class="fas fa-user-plus me-1"></i>Connect
                            </button>
                            <button class="btn btn-outline-primary btn-sm" onclick="mentors.viewProfile('${mentor._id}')">
                                <i class="fas fa-eye me-1"></i>View
                            </button>
                        </div>

                        ${mentor.profile.linkedIn ? `
                            <div class="mt-3">
                                <a href="${mentor.profile.linkedIn}" target="_blank" class="text-decoration-none">
                                    <i class="fab fa-linkedin fa-lg text-primary"></i>
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    async connectWithMentor(mentorId) {
        try {
            const response = await fetch(`${API_BASE_URL}/connections/${mentorId}`, {
                method: 'POST',
                headers: this.authService.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to send connection request');
            }

            showAlert('Connection request sent to mentor!', 'success');
        } catch (error) {
            showAlert('Failed to send connection request', 'error');
        }
    }

    viewProfile(userId) {
        // In a real app, this would navigate to the user's profile page
        showAlert('Profile view functionality would be implemented here', 'info');
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchMentors');
        const departmentFilter = document.getElementById('departmentFilter');
        const skillFilter = document.getElementById('skillFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterMentors());
        }
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => this.filterMentors());
        }
        if (skillFilter) {
            skillFilter.addEventListener('change', () => this.filterMentors());
        }
    }

    filterMentors() {
        const searchTerm = document.getElementById('searchMentors').value.toLowerCase();
        const departmentFilter = document.getElementById('departmentFilter').value;
        const skillFilter = document.getElementById('skillFilter').value;

        let filteredMentors = this.mentors;

        // Search filter
        if (searchTerm) {
            filteredMentors = filteredMentors.filter(mentor => 
                mentor.profile.firstName.toLowerCase().includes(searchTerm) ||
                mentor.profile.lastName.toLowerCase().includes(searchTerm) ||
                (mentor.profile.skills && mentor.profile.skills.some(skill => 
                    skill.toLowerCase().includes(searchTerm)
                )) ||
                (mentor.profile.department && mentor.profile.department.toLowerCase().includes(searchTerm))
            );
        }

        // Department filter
        if (departmentFilter) {
            filteredMentors = filteredMentors.filter(mentor => 
                mentor.profile.department === departmentFilter
            );
        }

        // Skill filter
        if (skillFilter) {
            filteredMentors = filteredMentors.filter(mentor => 
                mentor.profile.skills && mentor.profile.skills.includes(skillFilter)
            );
        }

        this.displayMentors(filteredMentors);
    }
}

// Initialize mentors when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mentors = new Mentors();
});
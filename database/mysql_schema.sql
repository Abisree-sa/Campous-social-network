-- MySQL Schema for Campus Social Network
-- This can be used for additional relational data if needed

CREATE DATABASE IF NOT EXISTS campus_social;
USE campus_social;

-- Table for user skills (many-to-many relationship)
CREATE TABLE user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    skill VARCHAR(100) NOT NULL,
    proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_skill (user_id, skill)
);

-- Table for event feedback and ratings
CREATE TABLE event_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(24) NOT NULL, -- References MongoDB Event _id
    user_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_user_feedback (event_id, user_id)
);

-- Table for mentorship relationships
CREATE TABLE mentorship_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mentor_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    mentee_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    goals TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for skill endorsements
CREATE TABLE skill_endorsements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endorser_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    recipient_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    skill VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_endorsement (endorser_id, recipient_id, skill)
);

-- Table for notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(24) NOT NULL, -- References MongoDB User _id
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('connection', 'event', 'message', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    related_id VARCHAR(24), -- ID of related entity (event, connection, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO user_skills (user_id, skill, proficiency_level) VALUES
('507f1f77bcf86cd799439012', 'Machine Learning', 'expert'),
('507f1f77bcf86cd799439012', 'Data Structures', 'advanced'),
('507f1f77bcf86cd799439013', 'JavaScript', 'intermediate'),
('507f1f77bcf86cd799439013', 'Python', 'intermediate'),
('507f1f77bcf86cd799439013', 'React', 'intermediate'),
('507f1f77bcf86cd799439014', 'Java', 'advanced'),
('507f1f77bcf86cd799439014', 'System Design', 'expert'),
('507f1f77bcf86cd799439014', 'Cloud Computing', 'advanced');

INSERT INTO event_feedback (event_id, user_id, rating, feedback) VALUES
('607f1f77bcf86cd799439021', '507f1f77bcf86cd799439013', 5, 'Excellent career fair with great companies!');

INSERT INTO skill_endorsements (endorser_id, recipient_id, skill) VALUES
('507f1f77bcf86cd799439014', '507f1f77bcf86cd799439013', 'JavaScript'),
('507f1f77bcf86cd799439014', '507f1f77bcf86cd799439013', 'React');

-- Create indexes for better performance
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX idx_event_feedback_user_id ON event_feedback(user_id);
CREATE INDEX idx_mentorship_mentor_id ON mentorship_relationships(mentor_id);
CREATE INDEX idx_mentorship_mentee_id ON mentorship_relationships(mentee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Views for common queries
CREATE VIEW user_skill_summary AS
SELECT 
    user_id,
    COUNT(*) as total_skills,
    GROUP_CONCAT(skill ORDER BY skill SEPARATOR ', ') as skills_list
FROM user_skills 
GROUP BY user_id;

CREATE VIEW event_ratings_summary AS
SELECT 
    event_id,
    COUNT(*) as total_ratings,
    AVG(rating) as average_rating
FROM event_feedback 
GROUP BY event_id;
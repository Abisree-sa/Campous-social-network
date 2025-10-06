// MongoDB seed data for Campus Social Network

db = db.getSiblingDB('campus_social');

// Clear existing collections
db.users.deleteMany({});
db.events.deleteMany({});
db.connections.deleteMany({});
db.messages.deleteMany({});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.events.createIndex({ dateTime: 1 });
db.connections.createIndex({ user1: 1, user2: 1 }, { unique: true });
db.messages.createIndex({ conversationId: 1, createdAt: 1 });

// Insert sample users
const users = [
    {
        _id: ObjectId("507f1f77bcf86cd799439011"),
        email: "admin@campus.edu",
        password: "$2a$12$LQv3c1yqB.WTj9OzX6eB.OGyQYZlLwZRKlVx7kQv7Q6nO9wY9J5W", // password: admin123
        role: "admin",
        profile: {
            firstName: "Admin",
            lastName: "User",
            bio: "System Administrator",
            department: "Administration"
        },
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439012"),
        email: "professor.johnson@campus.edu",
        password: "$2a$12$LQv3c1yqB.WTj9OzX6eB.OGyQYZlLwZRKlVx7kQv7Q6nO9wY9J5W",
        role: "faculty",
        profile: {
            firstName: "Michael",
            lastName: "Johnson",
            bio: "Professor of Computer Science with 15 years of experience",
            department: "Computer Science",
            skills: ["Machine Learning", "Data Structures", "Algorithms"],
            linkedIn: "https://linkedin.com/in/michaeljohnson",
            currentPosition: "Professor",
            company: "University"
        },
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439013"),
        email: "sarah.connor@campus.edu",
        password: "$2a$12$LQv3c1yqB.WTj9OzX6eB.OGyQYZlLwZRKlVx7kQv7Q6nO9wY9J5W",
        role: "student",
        profile: {
            firstName: "Sarah",
            lastName: "Connor",
            bio: "Final year Computer Science student interested in AI and Web Development",
            department: "Computer Science",
            graduationYear: 2024,
            skills: ["JavaScript", "Python", "React", "Node.js"],
            linkedIn: "https://linkedin.com/in/sarahconnor",
            github: "https://github.com/sarahconnor"
        },
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("507f1f77bcf86cd799439014"),
        email: "david.wilson@alumni.campus.edu",
        password: "$2a$12$LQv3c1yqB.WTj9OzX6eB.OGyQYZlLwZRKlVx7kQv7Q6nO9wY9J5W",
        role: "alumni",
        profile: {
            firstName: "David",
            lastName: "Wilson",
            bio: "Software Engineer at Google, passionate about mentoring students",
            department: "Computer Science",
            graduationYear: 2020,
            skills: ["Java", "System Design", "Cloud Computing"],
            linkedIn: "https://linkedin.com/in/davidwilson",
            github: "https://github.com/davidwilson",
            currentPosition: "Senior Software Engineer",
            company: "Google"
        },
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.users.insertMany(users);

// Insert sample events
const events = [
    {
        _id: ObjectId("607f1f77bcf86cd799439021"),
        title: "Annual Career Fair 2024",
        description: "Connect with top employers and explore internship and job opportunities",
        eventType: "career_fair",
        dateTime: new Date("2024-03-15T10:00:00Z"),
        location: "University Main Hall",
        organizer: ObjectId("507f1f77bcf86cd799439011"),
        maxAttendees: 500,
        tags: ["career", "jobs", "networking"],
        isPublic: true,
        attendees: [
            {
                user: ObjectId("507f1f77bcf86cd799439013"),
                rsvpStatus: "going"
            }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("607f1f77bcf86cd799439022"),
        title: "Web Development Workshop",
        description: "Hands-on workshop on modern web development with React and Node.js",
        eventType: "workshop",
        dateTime: new Date("2024-02-20T14:00:00Z"),
        location: "Computer Lab 3A",
        organizer: ObjectId("507f1f77bcf86cd799439012"),
        maxAttendees: 30,
        tags: ["web development", "react", "node.js"],
        isPublic: true,
        attendees: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: ObjectId("607f1f77bcf86cd799439023"),
        title: "AI in Modern Applications",
        description: "Guest lecture by industry expert on practical applications of AI",
        eventType: "guest_lecture",
        dateTime: new Date("2024-02-25T16:00:00Z"),
        location: "Auditorium B",
        organizer: ObjectId("507f1f77bcf86cd799439012"),
        maxAttendees: 200,
        tags: ["artificial intelligence", "machine learning"],
        isPublic: true,
        attendees: [],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.events.insertMany(events);

// Insert sample connections
const connections = [
    {
        _id: ObjectId("707f1f77bcf86cd799439031"),
        user1: ObjectId("507f1f77bcf86cd799439013"),
        user2: ObjectId("507f1f77bcf86cd799439014"),
        status: "accepted",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

db.connections.insertMany(connections);

print("Database seeded successfully!");
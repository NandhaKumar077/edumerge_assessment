const mongoose = require('mongoose');
require('dotenv').config();

// Load all models
const User = require('./src/models/User');
const Institution = require('./src/models/Institution');
const Campus = require('./src/models/Campus');
const Department = require('./src/models/Department');
const Program = require('./src/models/Program');
const Counter = require('./src/models/Counter');
const Applicant = require('./src/models/Applicant');
const Admission = require('./src/models/Admission');

const seedDatabase = async () => {
    try {
        // Connect to the DB from .env (make sure it's the correct one!)
        const uri = process.env.MONGO_URI_HOST || process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/edumerge_db';
        console.log('🔄 Connecting to MongoDB:', uri);
        await mongoose.connect(uri);
        console.log('✅ Connected.');

        console.log('🗑️  Wiping existing database to ensure a clean slate...');
        await Promise.all([
            User.deleteMany({}),
            Institution.deleteMany({}),
            Campus.deleteMany({}),
            Department.deleteMany({}),
            Program.deleteMany({}),
            Counter.deleteMany({}),
            Applicant.deleteMany({}),
            Admission.deleteMany({})
        ]);
        console.log('✅ Clean slate achieved.');

        console.log('👤 Seeding default Users (Role-Based Access Control)...');
        await User.create([
            {
                name: 'System Admin',
                email: 'admin@gec.edu',
                password: 'admin123', // Mongoose pre-save hook will hash this securely
                role: 'admin'
            },
            {
                name: 'Admission Officer',
                email: 'officer@gec.edu',
                password: 'officer123',
                role: 'officer'
            },
            {
                name: 'Executive Management',
                email: 'mgmt@gec.edu',
                password: 'mgmt123',
                role: 'management'
            }
        ]);
        console.log('✅ Base users created.');

        console.log('🏢 Seeding base Institutional structure...');
        const institution = await Institution.create({
            code: 'GEC',
            name: 'Global Engineering College',
            type: 'University'
        });

        const campus = await Campus.create({
            institution: institution._id,
            name: 'Main Campus',
            city: 'Bangalore'
        });

        const department = await Department.create({
            campus: campus._id,
            name: 'Computer Science and Engineering',
            code: 'CSE'
        });
        
        const department2 = await Department.create({
            campus: campus._id,
            name: 'Artificial Intelligence & Machine Learning',
            code: 'AIML'
        });

        await Program.create([
            {
                department: department._id,
                name: 'B.Tech - Computer Science',
                academicYear: '2026',
                courseType: 'UG',
                intake: 120,
                quotas: [
                    { name: 'KCET', total: 60, filled: 0 },
                    { name: 'COMEDK', total: 30, filled: 0 },
                    { name: 'Management', total: 30, filled: 0 }
                ],
                supernumerary: []
            },
            {
                department: department2._id,
                name: 'B.Tech - AI & ML',
                academicYear: '2026',
                courseType: 'UG',
                intake: 60,
                quotas: [
                    { name: 'KCET', total: 30, filled: 0 },
                    { name: 'COMEDK', total: 15, filled: 0 },
                    { name: 'Management', total: 15, filled: 0 }
                ],
                supernumerary: []
            }
        ]);
        console.log('✅ Institutional structure created (Institution -> Campus -> Department -> Programs).');

        console.log('🔢 Seeding base Admission Counters...');
        await Counter.create({
            _id: 'admissionNumber',
            sequence_value: 1000
        });
        console.log('✅ Counters initialized.');

        console.log('\n🎉 DATABASE SEEDING COMPLETE! 🎉');
        console.log('You are fully ready to start testing the application.');
        process.exit(0);
    } catch (error) {
        console.error('❌ FATAL ERROR DURING SEEDING:', error);
        process.exit(1);
    }
};

seedDatabase();

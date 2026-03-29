const mongoose = require('mongoose');
const Institution = require('../models/Institution');
const Campus = require('../models/Campus');
const Department = require('../models/Department');
const Program = require('../models/Program');
const Applicant = require('../models/Applicant');
const Counter = require('../models/Counter');
const Admission = require('../models/Admission');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edumerge_db';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Promise.all([
            Institution.deleteMany({}),
            Campus.deleteMany({}),
            Department.deleteMany({}),
            Program.deleteMany({}),
            Applicant.deleteMany({}),
            Counter.deleteMany({}),
            Admission.deleteMany({})
        ]);

        console.log('Cleared existing data.');

        // 1. Institution
        const inst = await Institution.create({
            name: 'Global Engineering College',
            code: 'GEC',
            address: 'Electronic City, Bangalore',
            mobile: '9888877777',
            email: 'admissions@gec.edu',
            supernumeraryCaps: [{ name: 'J&K', total: 5, filled: 0 }]
        });

        // 2. Campus
        const campus = await Campus.create({
            institution: inst._id,
            name: 'Main Campus',
            location: 'South Bangalore'
        });

        // 3. Departments
        const deptCSE = await Department.create({
            campus: campus._id,
            name: 'Computer Science & Eng',
            code: 'CSE'
        });

        const deptECE = await Department.create({
            campus: campus._id,
            name: 'Electronics & Comm Eng',
            code: 'ECE'
        });

        // 4. Programs
        const progCSE = await Program.create({
            department: deptCSE._id,
            name: 'B.E Computer Science',
            academicYear: '2026',
            courseType: 'UG',
            intake: 60,
            quotas: [
                { name: 'KCET', total: 30, filled: 0 },
                { name: 'COMEDK', total: 20, filled: 0 },
                { name: 'Management', total: 10, filled: 0 }
            ]
        });

        const progECE = await Program.create({
            department: deptECE._id,
            name: 'B.E Electronics',
            academicYear: '2026',
            courseType: 'UG',
            intake: 40,
            quotas: [
                { name: 'KCET', total: 20, filled: 0 },
                { name: 'COMEDK', total: 15, filled: 0 },
                { name: 'Management', total: 5, filled: 0 }
            ]
        });

        // 5. Applicants
        await Applicant.create([
            {
                firstName: 'Rahul',
                lastName: 'Sharma',
                email: 'rahul@example.com',
                mobile: '9000000001',
                program: progCSE._id,
                category: 'GM',
                entryType: 'Regular',
                quota: 'KCET',
                admissionMode: 'Government',
                allotmentNumber: 'KCET-01',
                marksPercentage: 85,
                status: 'Draft',
                docStatus: 'Pending',
                feeStatus: 'Pending'
            },
            {
                firstName: 'Priya',
                lastName: 'Nair',
                email: 'priya@example.com',
                mobile: '9000000002',
                program: progCSE._id,
                category: 'OBC',
                entryType: 'Regular',
                quota: 'COMEDK',
                admissionMode: 'Government',
                allotmentNumber: 'COM-42',
                marksPercentage: 92,
                status: 'Allocated',
                docStatus: 'Verified',
                feeStatus: 'Paid'
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();

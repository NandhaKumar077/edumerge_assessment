const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edumerge_db';

const userSchema = new mongoose.Schema({
    name: String, email: String, password: String,
    role: { type: String, enum: ['admin', 'officer', 'management'] }
});

const User = mongoose.model('User', userSchema);

async function seedUsers() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    await User.deleteMany({});

    const users = [
        { name: 'Admin User', email: 'admin@gec.edu', password: await bcrypt.hash('admin123', 10), role: 'admin' },
        { name: 'Admission Officer', email: 'officer@gec.edu', password: await bcrypt.hash('officer123', 10), role: 'officer' },
        { name: 'Management User', email: 'mgmt@gec.edu', password: await bcrypt.hash('mgmt123', 10), role: 'management' },
    ];

    await User.insertMany(users);
    console.log('✅ 3 demo users seeded:');
    console.log('   admin@gec.edu / admin123 (Admin)');
    console.log('   officer@gec.edu / officer123 (Admission Officer)');
    console.log('   mgmt@gec.edu / mgmt123 (Management)');
    await mongoose.disconnect();
}

seedUsers().catch(console.error);

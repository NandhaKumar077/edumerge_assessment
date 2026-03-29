const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to EduMerge Admission System API' });
});

module.exports = app;

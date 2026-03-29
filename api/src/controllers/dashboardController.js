const Program = require('../models/Program');
const Applicant = require('../models/Applicant');
const Admission = require('../models/Admission');

exports.getStats = async (req, res) => {
    try {
        // Programs stats
        const programs = await Program.find().populate('department');

        let totalIntake = 0;
        let totalFilled = 0;

        const quotaStats = {
            KCET: { total: 0, filled: 0 },
            COMEDK: { total: 0, filled: 0 },
            Management: { total: 0, filled: 0 }
        };

        const departmentShortNames = {
            "Computer Science Engineering": "CSE",
            "Computer Science & Eng": "CSE",
            "B.E Computer Science": "CSE",
            "Information Technology": "IT",
            "Electronics and Communication Engineering": "ECE",
            "Electronics & Comm Eng": "ECE",
            "B.E Electronics": "ECE",
            "Electrical and Electronics Engineering": "EEE",
            "Mechanical Engineering": "MECH",
            "Civil Engineering": "CIVIL",
            "Artificial Intelligence and Data Science": "AIDS",
            "Artificial Intelligence and Machine Learning": "AIML",
            "Computer Science and Business Systems": "CSBS",
            "Computer and Communication Engineering": "CCE",
            "Electronics and Instrumentation Engineering": "EIE",
            "Biomedical Engineering": "BME",
            "Chemical Engineering": "CHE",
            "Aeronautical Engineering": "AERO",
            "Automobile Engineering": "AUTO",
            "Mechatronics Engineering": "MCT",
            "Agricultural Engineering": "AGRI",
            "Mining Engineering": "MIN",
            "Petroleum Engineering": "PETRO",
            "Biotechnology": "BT",
            "Robotics and Automation": "RA",
            "Cyber Security": "CS",
            "Data Science": "DS",
            "Commerce": "COM",
            "Bachelor of Commerce": "BCom",
            "Master of Commerce": "MCom",
            "Business Administration": "BBA",
            "Master of Business Administration": "MBA",
            "Economics": "ECO",
            "Accounting and Finance": "AF"
        };

        const departments = await require('../models/Department').find();
        const departmentStatsMap = {};
        departments.forEach(d => {
            const shortCode = departmentShortNames[d.name] || d.code || d.name;
            departmentStatsMap[d.name] = { department: shortCode, name: d.name, intake: 0, filled: 0 };
        });

        programs.forEach(p => {
            totalIntake += p.intake;

            const pFilled = p.quotas.reduce((sum, q) => sum + q.filled, 0);

            const deptName = p.department ? p.department.name : 'Unknown';
            if (!departmentStatsMap[deptName]) {
                const shortCode = departmentShortNames[deptName] || (p.department && p.department.code ? p.department.code : deptName);
                departmentStatsMap[deptName] = { department: shortCode, name: deptName, intake: 0, filled: 0 };
            }
            departmentStatsMap[deptName].intake += p.intake;
            departmentStatsMap[deptName].filled += pFilled;

            p.quotas.forEach(q => {
                totalFilled += q.filled;
                if (quotaStats[q.name]) {
                    quotaStats[q.name].total += q.total;
                    quotaStats[q.name].filled += q.filled;
                }
            });
        });

        // Pending lists
        const pendingDocs = await Applicant.countDocuments({ docStatus: { $ne: 'Verified' } });
        const pendingFees = await Applicant.countDocuments({ feeStatus: 'Pending' });
        const paidFees = await Applicant.countDocuments({ feeStatus: 'Paid' });

        const feeStats = [
            { name: 'Pending', value: pendingFees },
            { name: 'Paid', value: paidFees }
        ];

        // Detailed Quota-wise filled seats for dashboard table
        const programQuotaDetails = programs.map(p => ({
            program: p.name,
            academicYear: p.academicYear,
            intake: p.intake,
            quotas: p.quotas.map(q => ({
                name: q.name,
                total: q.total,
                filled: q.filled,
                remaining: q.total - q.filled
            }))
        }));

        res.json({
            summary: {
                totalIntake,
                totalFilled,
                remainingSeats: totalIntake - totalFilled,
                pendingDocs,
                pendingFees
            },
            quotaStats,
            programDetails: programQuotaDetails,
            departmentStats: Object.values(departmentStatsMap),
            feeStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

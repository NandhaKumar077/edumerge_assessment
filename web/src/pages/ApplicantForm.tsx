import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import MasterService from '../services/masterService';
import ApplicantService from '../services/applicantService';
import { toast } from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';
import './ApplicantForm.css';

const ApplicantForm: React.FC = () => {
    const [programs, setPrograms] = useState<any[]>([]);

    const entryTypes = [
        { id: 'Regular', name: 'Regular' },
        { id: 'Lateral', name: 'Lateral Entry' }
    ];
    const quotaTypes = [
        { id: 'KCET', name: 'KCET' },
        { id: 'COMEDK', name: 'COMEDK' },
        { id: 'Management', name: 'Management' }
    ];
    const admissionModes = [
        { id: 'Government', name: 'Government' },
        { id: 'Management', name: 'Management' }
    ];
    const categories = [
        { id: 'GM', name: 'General Merit (GM)' },
        { id: 'SC', name: 'SC' },
        { id: 'ST', name: 'ST' },
        { id: 'OBC', name: 'OBC' }
    ];

    const initialForm = {
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        program: '',
        entryType: 'Regular',
        quota: 'KCET',
        admissionMode: 'Government',
        category: 'GM',
        marksPercentage: 0,
        allotmentNumber: ''
    };

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await MasterService.getPrograms();
                setPrograms(data);
            } catch (err) {
                console.error('API Error:', err);
            }
        };
        fetchPrograms();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await ApplicantService.createApplicant(form);
            toast.success('Applicant registered successfully!');
            setForm(initialForm);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Error creating applicant');
        }
    };

    const handleFormChange = (key: string, value: any) => {
        setForm({ ...form, [key]: value });
    };

    return (
        <div className="applicant-layout">
            <div className="header">
                <h1>Applicant <span>Registration</span></h1>
                <p>Register new applicants for program allocation</p>
            </div>

            <div className="applicant-form-container glass-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                value={form.firstName}
                                onChange={(e) => handleFormChange('firstName', e.target.value)}
                                required
                                placeholder="John"
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                value={form.lastName}
                                onChange={(e) => handleFormChange('lastName', e.target.value)}
                                required
                                placeholder="Doe"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleFormChange('email', e.target.value)}
                                required
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input
                                value={form.mobile}
                                onChange={(e) => handleFormChange('mobile', e.target.value)}
                                required
                                placeholder="+91 98XXX XXXXX"
                            />
                        </div>

                        <div className="form-group">
                            <label>Program</label>
                            <CustomSelect
                                options={programs}
                                placeholder="Select Program"
                                labelKey="name"
                                selectedValue={form.program}
                                selectionChange={(val) => handleFormChange('program', val)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Course Entry Type</label>
                            <CustomSelect
                                options={entryTypes}
                                valueKey="id"
                                placeholder="Select Entry Type"
                                selectedValue={form.entryType}
                                selectionChange={(val) => handleFormChange('entryType', val)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Quota Type</label>
                            <CustomSelect
                                options={quotaTypes}
                                valueKey="id"
                                placeholder="Select Quota"
                                selectedValue={form.quota}
                                selectionChange={(val) => handleFormChange('quota', val)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Admission Mode</label>
                            <CustomSelect
                                options={admissionModes}
                                valueKey="id"
                                placeholder="Select Admission Mode"
                                selectedValue={form.admissionMode}
                                selectionChange={(val) => handleFormChange('admissionMode', val)}
                            />
                        </div>

                        {form.admissionMode === 'Government' && (
                            <div className="form-group">
                                <label>Allotment Number</label>
                                <input
                                    value={form.allotmentNumber}
                                    onChange={(e) => handleFormChange('allotmentNumber', e.target.value)}
                                    placeholder="e.g. KCET-12345"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Qualifying Marks (%)</label>
                            <input
                                type="number"
                                value={form.marksPercentage}
                                onChange={(e) => handleFormChange('marksPercentage', parseFloat(e.target.value))}
                                required
                                placeholder="e.g. 85"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <CustomSelect
                                options={categories}
                                valueKey="id"
                                placeholder="Select Category"
                                selectedValue={form.category}
                                selectionChange={(val) => handleFormChange('category', val)}
                            />
                        </div>
                    </div>

                    <div className="actions">
                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={18} /> Register Applicant
                        </button>
                        <button type="button" onClick={() => setForm(initialForm)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <XCircle size={18} /> Clear Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicantForm;

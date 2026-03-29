import React, { useState, useEffect } from 'react';
import MasterService from '../services/masterService';
import { toast } from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';
import './MasterSetup.css';

const MasterSetup: React.FC = () => {
    const [activeTab, setActiveTab] = useState('institution');
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [campuses, setCampuses] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);

    const [instForm, setInstForm] = useState({ name: '', code: '' });
    const [campusForm, setCampusForm] = useState({ institution: '', name: '' });
    const [deptForm, setDeptForm] = useState({ campus: '', name: '', code: '' });
    const [progForm, setProgForm] = useState({
        department: '',
        name: '',
        academicYear: '2026',
        courseType: 'UG',
        intake: 100,
        quotas: [
            { name: 'KCET', total: 45 },
            { name: 'COMEDK', total: 30 },
            { name: 'Management', total: 25 }
        ]
    });

    const refreshData = async () => {
        try {
            const insts = await MasterService.getInstitutions();
            setInstitutions(insts);
            const camps = await MasterService.getCampuses();
            setCampuses(camps);
            const depts = await MasterService.getDepartments();
            setDepartments(depts);
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const saveInstitution = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await MasterService.createInstitution(instForm);
            refreshData();
            setInstForm({ name: '', code: '' });
            toast.success('Institution created successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save');
        }
    };

    const saveCampus = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await MasterService.createCampus(campusForm);
            refreshData();
            setCampusForm({ institution: '', name: '' });
            toast.success('Campus created successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save');
        }
    };

    const saveDepartment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await MasterService.createDepartment(deptForm);
            refreshData();
            setDeptForm({ campus: '', name: '', code: '' });
            toast.success('Department created successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save');
        }
    };

    const saveProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await MasterService.createProgram(progForm);
            toast.success('Program Seat Matrix created!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save');
        }
    };

    const handleQuotaChange = (index: number, value: number) => {
        const newQuotas = [...progForm.quotas];
        newQuotas[index].total = value;
        setProgForm({ ...progForm, quotas: newQuotas });
    };

    return (
        <div className="setup-layout">
            <div className="header">
                <h1>Master <span>Setup</span></h1>
                <p>Configure institution, campuses, departments and create program quotas</p>
            </div>

            <div className="glass-card">
                <div className="tabs">
                    <button className={activeTab === 'institution' ? 'active' : ''} onClick={() => setActiveTab('institution')}>Institution</button>
                    <button className={activeTab === 'campus' ? 'active' : ''} onClick={() => setActiveTab('campus')}>Campus</button>
                    <button className={activeTab === 'department' ? 'active' : ''} onClick={() => setActiveTab('department')}>Department</button>
                    <button className={activeTab === 'program' ? 'active' : ''} onClick={() => setActiveTab('program')}>Program Matrix</button>
                </div>

                <div className="tab-content">
                    {/* Institution Tab */}
                    {activeTab === 'institution' && (
                        <div className="form-container">
                            <form onSubmit={saveInstitution}>
                                <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div className="form-group">
                                        <label>Institution Name</label>
                                        <input
                                            value={instForm.name}
                                            onChange={(e) => setInstForm({ ...instForm, name: e.target.value })}
                                            placeholder="e.g., Presidency College"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Institution Code</label>
                                        <input
                                            value={instForm.code}
                                            onChange={(e) => setInstForm({ ...instForm, code: e.target.value })}
                                            placeholder="e.g., INST"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Institution</button>
                            </form>
                            <div className="list">
                                {institutions.map(inst => (
                                    <div key={inst._id} className="item">
                                        <span>{inst.name} ({inst.code})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Campus Tab */}
                    {activeTab === 'campus' && (
                        <div className="form-container">
                            <form onSubmit={saveCampus}>
                                <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <div className="form-group">
                                        <label>Select Institution</label>
                                        <CustomSelect
                                            options={institutions}
                                            placeholder="Choose Institution"
                                            selectedValue={campusForm.institution}
                                            selectionChange={(val) => setCampusForm({ ...campusForm, institution: val })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Campus Name</label>
                                        <input
                                            value={campusForm.name}
                                            onChange={(e) => setCampusForm({ ...campusForm, name: e.target.value })}
                                            placeholder="e.g., North Campus"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Campus</button>
                            </form>
                            <div className="list">
                                {campuses.map(c => (
                                    <div key={c._id} className="item">
                                        <span>{c.name} ({c.institution?.name})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Department Tab */}
                    {activeTab === 'department' && (
                        <div className="form-container">
                            <form onSubmit={saveDepartment}>
                                <div className="grid-3">
                                    <div className="form-group">
                                        <label>Select Campus</label>
                                        <CustomSelect
                                            options={campuses}
                                            placeholder="Choose Campus"
                                            selectedValue={deptForm.campus}
                                            selectionChange={(val) => setDeptForm({ ...deptForm, campus: val })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Department Name</label>
                                        <input
                                            value={deptForm.name}
                                            onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                            placeholder="e.g., CSE"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Department Code</label>
                                        <input
                                            value={deptForm.code}
                                            onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                                            placeholder="e.g., CSE"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Department</button>
                            </form>
                            <div className="list">
                                {departments.map(d => (
                                    <div key={d._id} className="item">
                                        <span>{d.name} ({d.campus?.name})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Program Tab */}
                    {activeTab === 'program' && (
                        <div className="form-container">
                            <form onSubmit={saveProgram}>
                                <div className="grid-3">
                                    <div className="form-group">
                                        <label>Select Department</label>
                                        <CustomSelect
                                            options={departments}
                                            placeholder="Choose Department"
                                            selectedValue={progForm.department}
                                            selectionChange={(val) => setProgForm({ ...progForm, department: val })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Program Name</label>
                                        <input
                                            value={progForm.name}
                                            onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                                            placeholder="e.g., B.E CSE"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Academic Year</label>
                                        <input
                                            value={progForm.academicYear}
                                            onChange={(e) => setProgForm({ ...progForm, academicYear: e.target.value })}
                                            placeholder="e.g., 2026"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Course Type</label>
                                        <CustomSelect
                                            options={[{ id: 'UG', name: 'Undergraduate (UG)' }, { id: 'PG', name: 'Postgraduate (PG)' }]}
                                            valueKey="id"
                                            placeholder="Choose Type"
                                            selectedValue={progForm.courseType}
                                            selectionChange={(val) => setProgForm({ ...progForm, courseType: val })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Total Intake</label>
                                        <input
                                            type="number"
                                            value={progForm.intake}
                                            onChange={(e) => setProgForm({ ...progForm, intake: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="quota-setup">
                                    <h4>Seat Matrix (Quotas)</h4>
                                    {progForm.quotas.map((q, idx) => (
                                        <div className="quota-row" key={idx}>
                                            <label>{q.name} Seats</label>
                                            <input
                                                type="number"
                                                value={q.total}
                                                onChange={(e) => handleQuotaChange(idx, parseInt(e.target.value))}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Create Program & Matrix</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterSetup;

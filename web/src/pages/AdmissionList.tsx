import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import ApplicantService from '../services/applicantService';
import AdmissionService from '../services/admissionService';
import AuthService from '../services/authService';
import { toast } from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';
import './AdmissionList.css';

const AdmissionList: React.FC = () => {
    const [applicants, setApplicants] = useState<any[]>([]);
    const errorMessage = '';

    const docOptions = [
        { id: 'Pending', name: 'Pending' },
        { id: 'Submitted', name: 'Submitted' },
        { id: 'Verified', name: 'Verified' }
    ];

    const feeOptions = [
        { id: 'Pending', name: 'Pending' },
        { id: 'Paid', name: 'Paid' }
    ];

    const refresh = async () => {
        try {
            const data = await ApplicantService.getAllApplicants();
            setApplicants(data || []);
        } catch (err) {
            toast.error('Failed to load applicants');
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const updateDocs = async (id: string, val: string) => {
        try {
            await ApplicantService.updateDocStatus(id, val);
            toast.success('Document status updated');
            refresh();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const updateFee = async (id: string, val: string) => {
        try {
            await ApplicantService.updateFeeStatus(id, val);
            toast.success('Fee status updated');
            refresh();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const allocate = async (app: any) => {
        try {
            await AdmissionService.allocateSeat({
                applicantId: app._id,
                programId: app.program?._id || app.program,
                quota: app.quota
            });
            toast.success('Seat allocated successfully');
            refresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Allocation Failed');
        }
    };

    const confirm = async (id: string) => {
        try {
            const res = await AdmissionService.confirmAdmission(id);
            toast.success(`Admission No: ${res.admissionNumber}`);
            refresh();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Confirmation Failed');
        }
    };

    const hasRole = (...roles: string[]) => AuthService.hasRole(...roles);

    return (
        <div className="list-layout">
            <div className="header-row">
                <div className="header">
                    <h1>Admission <span>Management</span></h1>
                    <p>Verify documents, process fees, and confirm admissions</p>
                </div>
                <button onClick={refresh} className="btn-sm btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={14} /> Sync Data
                </button>
            </div>

            {errorMessage && (
                <div className="error-banner">
                    {errorMessage}
                </div>
            )}

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Program</th>
                            <th>Quota</th>
                            <th>Doc Status</th>
                            <th>Fee Status</th>
                            <th>Workflow Status</th>
                            <th>Admission No.</th>
                            {hasRole('admin', 'officer') && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.length === 0 ? (
                            <tr>
                                <td colSpan={hasRole('admin', 'officer') ? 8 : 7} style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontStyle: 'italic' }}>
                                    No applicants found yet. Please wait for registrations.
                                </td>
                            </tr>
                        ) : (
                            applicants.map((a, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div className="name-info">
                                            <strong>{a.firstName} {a.lastName}</strong>
                                            <span>{a.email}</span>
                                        </div>
                                    </td>
                                    <td>{a.program?.name || '---'}</td>
                                    <td>{a.quota}</td>
                                    <td>
                                        {hasRole('admin', 'officer') ? (
                                            <CustomSelect
                                                options={docOptions}
                                                labelKey="name"
                                                valueKey="id"
                                                selectedValue={a.docStatus}
                                                selectionChange={(val) => updateDocs(a._id, val)}
                                            />
                                        ) : (
                                            <span className="badge">{a.docStatus}</span>
                                        )}
                                    </td>
                                    <td>
                                        {hasRole('admin', 'officer') ? (
                                            <CustomSelect
                                                options={feeOptions}
                                                labelKey="name"
                                                valueKey="id"
                                                selectedValue={a.feeStatus}
                                                selectionChange={(val) => updateFee(a._id, val)}
                                            />
                                        ) : (
                                            <span className="badge">{a.feeStatus}</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${a.status === 'Confirmed' ? 'confirm' : (a.status === 'Allocated' ? 'alloc' : '')}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td>{a.admissionNumber || '--'}</td>
                                    {hasRole('admin', 'officer') && (
                                        <td>
                                            <div className="action-btns">
                                                {a.status === 'Draft' && (
                                                    <button className="btn-sm btn-primary" onClick={() => allocate(a)}>Allocate</button>
                                                )}
                                                {a.status === 'Allocated' && a.feeStatus === 'Paid' && a.docStatus === 'Verified' && (
                                                    <button className="btn-sm btn-success" onClick={() => confirm(a._id)}>Confirm</button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdmissionList;

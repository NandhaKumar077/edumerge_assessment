import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RefreshCw, Users, GraduationCap, CheckCircle, FileClock } from 'lucide-react';
import DashboardService from '../services/dashboardService';
import './Dashboard.css';

const FeePieChart: React.FC<{ data: any[] }> = ({ data }) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !ref.current) return;

        const height = 230;
        const width = 230;
        const margin = 10;
        const radius = Math.min(width, height) / 2 - margin;

        d3.select(ref.current).selectAll('*').remove();

        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const color = d3.scaleOrdinal()
            .domain(['Pending', 'Paid'])
            .range(['#ef4444', '#10b981']);

        const pie = d3.pie<any>().value(d => d.value);
        const data_ready = pie(data);

        const arcGenerator = d3.arc<any>()
            .innerRadius(70)
            .outerRadius(radius);

        svg.selectAll('mySlices')
            .data(data_ready)
            .join('path')
            .attr('d', arcGenerator)
            .attr('fill', d => color(d.data.name) as string)
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .style('opacity', 0.9);

    }, [data]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '10px 0' }}>
            <svg ref={ref}></svg>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: d.name === 'Paid' ? '#10b981' : '#ef4444' }}></div>
                        <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600 }}>{d.name} ({d.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DepartmentBarChart: React.FC<{ data: any[] }> = ({ data }) => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !ref.current) return;

        const width = 450;
        const height = 230;
        const margin = { top: 20, right: 20, bottom: 40, left: 50 }; // Reduced bottom margin

        d3.select(ref.current).selectAll('*').remove();

        const svg = d3.select(ref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.department))
            .padding(0.3);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(0,10)") // Centered correctly
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .text((d: any) => d);

        const y = d3.scaleLinear()
            .domain([0, (d3.max(data, d => d.filled) || 10) * 1.2])
            .range([height, 0]);

        svg.append('g')
            .call(d3.axisLeft(y).ticks(5));

        svg.selectAll('mybar')
            .data(data)
            .join('rect')
            .attr('x', d => x(d.department) || 0)
            .attr('y', d => y(d.filled))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.filled))
            .attr('fill', '#4f46e5')
            .attr('rx', 4);

    }, [data]);

    return <div style={{ overflowX: 'auto' }}><svg ref={ref}></svg></div>;
};

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [quotaEntries, setQuotaEntries] = useState<any[]>([]);
    const [programStats, setProgramStats] = useState<any[]>([]);

    const refresh = async () => {
        try {
            console.log('Refreshing Dashboard Stats...');
            const data = await DashboardService.getStats();
            setStats(data);
            if (data && data.quotaStats) {
                setQuotaEntries(Object.entries(data.quotaStats).map(([k, v]: any) => ({
                    key: k,
                    value: v
                })));
            }
            if (data && data.programDetails) {
                const processedPrograms = data.programDetails.map((p: any) => {
                    const filled = p.quotas.reduce((sum: number, q: any) => sum + (q.filled || 0), 0);
                    return { ...p, filledTotal: filled };
                });
                setProgramStats(processedPrograms);
            }
        } catch (err) {
            console.error('API Error:', err);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Education <span>Dashboard</span></h1>
                    <p className="subtitle">Overview of current intake and admissions</p>
                </div>
                <button className="sync-btn" onClick={refresh} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} /> Sync Dashboard
                </button>
            </div>

            {stats && (
                <div className="dashboard-content">
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon intake" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={24} /></div>
                            <div className="stat-info">
                                <h3>Total Intake</h3>
                                <h2>{stats.summary.totalIntake}</h2>
                            </div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-icon admitted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={24} /></div>
                            <div className="stat-info">
                                <h3>Admitted</h3>
                                <h2>{stats.summary.totalFilled}</h2>
                            </div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-icon remaining" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={24} /></div>
                            <div className="stat-info">
                                <h3>Remaining</h3>
                                <h2>{stats.summary.remainingSeats}</h2>
                            </div>
                        </div>
                        <div className="stat-card glass-card">
                            <div className="stat-icon pending" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileClock size={24} /></div>
                            <div className="stat-info">
                                <h3>Pending Fee</h3>
                                <h2>{stats.summary.pendingFees}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-sections" style={{ marginBottom: '24px' }}>
                        <div className="quota-progress section glass-card">
                            <h3>Fee Status Overview</h3>
                            {stats.feeStats ? <FeePieChart data={stats.feeStats} /> : <p>Loading graph...</p>}
                        </div>

                        <div className="program-list section glass-card">
                            <h3>Department Admissions Performance</h3>
                            {stats.departmentStats ? <DepartmentBarChart data={stats.departmentStats} /> : <p>Loading graph...</p>}
                        </div>
                    </div>

                    <div className="dashboard-sections">
                        <div className="quota-progress section glass-card">
                            <h3>Quota Occupancy</h3>
                            <div className="quota-bars">
                                {quotaEntries.map((q, idx) => (
                                    <div className="quota-item" key={idx}>
                                        <div className="quota-label">
                                            <span>{q.key}</span>
                                            <span>{q.value.filled} / {q.value.total}</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress" style={{ width: `${(q.value.filled / q.value.total) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="program-list section glass-card">
                            <h3>Program Distribution</h3>
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Program</th>
                                            <th>Intake</th>
                                            <th>Filled</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {programStats.map((p, idx) => (
                                            <tr key={idx}>
                                                <td>{p.program}</td>
                                                <td>{p.intake}</td>
                                                <td>{p.filledTotal || 0}</td>
                                                <td>
                                                    <span className={`badge ${p.filledTotal >= p.intake ? 'confirm' : ''}`}>
                                                        {p.filledTotal >= p.intake ? 'Full' : 'Open'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';

const TeamLeadTracker = () => {
    const [leads, setLeads] = useState([]);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        // Real-time data synchronization logic here.
        const fetchLeads = async () => {
            // Fetch leads from an API or source
            const response = await fetch('/api/leads');
            const data = await response.json();
            setLeads(data);
            calculateRevenue(data);
        };

        fetchLeads();

        const interval = setInterval(fetchLeads, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const calculateRevenue = (leads) => {
        const totalRevenue = leads.reduce((acc, lead) => acc + lead.value, 0);
        setRevenue(totalRevenue);
    };

    const handleCSVExport = () => {
        const csvData = leads.map(lead => ({
            Name: lead.name,
            Value: lead.value,
            Status: lead.status
        }));
        return csvData;
    };

    const handlePDFExport = () => {
        const pdf = new jsPDF();
        pdf.text('Team Lead Tracker Report', 10, 10);
        leads.forEach((lead, index) => {
            pdf.text(`${index + 1}. ${lead.name}: $${lead.value}`, 10, 20 + (index * 10));
        });
        pdf.save('TeamLeadTrackerReport.pdf');
    };

    const handleCSVDownload = () => {
        const csvData = handleCSVExport();
        const csvString = '\ufeff' + csvData;
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'TeamLeads.csv');
    };

    return (
        <div>
            <h1>Team Lead Tracker</h1>
            <h2>Total Revenue: ${revenue}</h2>
            <button onClick={handleCSVDownload}>Download CSV</button>
            <button onClick={handlePDFExport}>Export PDF</button>
            <ul>
                {leads.map((lead, index) => (
                    <li key={index}>{lead.name} - ${lead.value} ({lead.status})</li>
                ))}
            </ul>
        </div>
    );
};

export default TeamLeadTracker;
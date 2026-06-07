import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const Dashboard = () => {
    // Mock state for GSE Data
    // const [stocks, setStocks] = useState([
    //     { symbol: 'MTNGH', price: 1.75, change: '+0.05', trend: 'up' },
    //     { symbol: 'GCB', price: 5.20, change: '-0.10', trend: 'down' },
    //     { symbol: 'EGH', price: 5.51, change: '+0.02', trend: 'up' },
    // ]);
    useEffect(() => {
        // Fetch real stock data from backend API
        // Example: axios.get('/api/stocks').then(response => setStocks(response.data));
        const fetchprotecteddata = async () => {
            try {
                const response = await axiosInstance.get('/protectedview/', {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`
                        }
                });
                    console.log("Success:", response.data);
            }catch (error) {
                console.error("Error fetching data:", error);
            }
        } 
        fetchprotecteddata();
    } , [])

    return (
        <>
        <div className='text-light'>Dashboard</div>
        </>
    );
};

export default Dashboard;
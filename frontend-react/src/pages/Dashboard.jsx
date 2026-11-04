import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {

    const [ticker, setTicker] = useState('');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [plottedImg, setPlottedImg] = useState();
    const [plotted100DMA, setPlotted100DMA] = useState();
    const [plotted200DMA, setPlotted200DMA] = useState();
    const [prediction, setPrediction] = useState();
    const [mse, setMSE] = useState();
    const [mae, setMAE] = useState();
    const [rmse, setRMSE] = useState();
    const [r2, setR2] = useState();
    // Mock state for GSE Data
    // const [stocks, setStocks] = useState([
    //     { symbol: 'MTNGH', price: 1.75, change: '+0.05', trend: 'up' },
    //     { symbol: 'GCB', price: 5.20, change: '-0.10', trend: 'down' },
    //     { symbol: 'EGH', price: 5.51, change: '+0.02', trend: 'up' },
    // ]);
    useEffect(() => {
        
        const fetchprotecteddata = async () => {
            try {
                const response = await axiosInstance.get('/protectedview/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                console.log("Success:", response.data);
            } catch (error) {
                console.error("Error fetching data:", error);

            }
        }
        fetchprotecteddata();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axiosInstance.post('/predict/', { ticker: ticker },)
            console.log("Prediction response:", response.data);
            //set the plotted image URL to state
            const backendRoot = import.meta.env.VITE_BACKEND_ROOT
            const plottedImageUrl = `${backendRoot}${response.data.plotted_img}`;
            const plotted100DMAUrl = `${backendRoot}${response.data.plotted_100_dma}`;
            const plotted200DMAUrl = `${backendRoot}${response.data.plotted_200_dma}`;
            const predictionUrl = `${backendRoot}${response.data.plotted_final_prediction}`;
            setPlottedImg(plottedImageUrl);
            setPlotted100DMA(plotted100DMAUrl);
            setPlotted200DMA(plotted200DMAUrl);
            setPrediction(predictionUrl);
            setMSE(response.data.mse);
            setMAE(response.data.mae);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);

        } catch (error) {
            console.error("Error submitting form:", error);
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError("An unexpected error occured");
            }
        } finally {
            setLoading(false);
        }

    }

    return (
        <>
            <div className='container'>
                <div className="row align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <div className="col-md-6 mx-auto">
                        <h2 className="text-light">Dashboard</h2>
                        <p className="text-light">Welcome to your dashboard!</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder='Enter Stock Ticker' className='form-control' onChange={(e) => setTicker(e.target.value)} required />
                            <small>{error && <div className='text-danger'>{error}</div>}</small>
                            <button type='submit' className='btn btn-warning mt-2' disabled={loading}>
                                {loading ? <span><FontAwesomeIcon icon={faSpinner} spin />please wait...</span>: "See Prediction"}
                            </button>
                        </form>
                    </div>
                    {/* Display the plotted image if available */}
                    {prediction && (
                        <div className="prediction mt-5">
                       <div className="mt-5">
                        {plottedImg && (
                            <img src={plottedImg} alt="Stock Prediction" className="img-fluid" />
                        )}
                       </div>
                       <div className="mt-5">
                        {plotted100DMA && (
                            <img src={plotted100DMA} alt="100-Day Moving Average" className="img-fluid" />
                        )}
                       </div>
                          <div className="mt-5">
                            {plotted200DMA && (
                                <img src={plotted200DMA} alt="200-Day Moving Average" className="img-fluid" />
                            )}
                          </div>
                        <div className="mt-5">
                            {prediction && (
                                <img src={prediction} alt="Final Prediction" className="img-fluid" />
                            )}
                        </div>
                        <div className='mt-5'>
                            <h4 className='text-light'>Model Evaluation Metrics</h4>
                            <p className='text-light'>MSE: {mse?.toFixed(2)}</p>
                            <p className='text-light'>MAE: {mae?.toFixed(2)}</p>
                            <p className='text-light'>RMSE: {rmse?.toFixed(2)}</p>
                            <p className='text-light'>R²: {r2?.toFixed(2)}</p>
                        </div>
                    </div>
                    )}
                    
                </div>
            </div>
        </>
    );
};

export default Dashboard;
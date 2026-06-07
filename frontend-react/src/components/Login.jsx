import { useState, useContext} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router";
import {AuthContext} from '../AuthProvider';



const Login = () => {

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    // const [successMessage, setSuccessMessage] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        // Integration with Django REST Framework (SimpleJWT) goes here
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', credentials);
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            console.log("Login successful:", response.data)
            setErrors({})
            setIsLoggedIn(true);
            //setSuccessMessage(true);
            navigate('/dashboard');
            setCredentials({ username: '', password: '' });

            //setTimeout(() => setSuccessMessage(false), 3000);
        } catch (error) {
            console.error("Login error:", error.response?.data);
            setErrors(error.response?.data || { error: "Network error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="auth-wrapper">
                <div className="card auth-card">
                    <div className="auth-header">
                        <h2 className="auth-logo">GSE <span className="text-warning">PREDICTOR</span></h2>
                        <p className="text-muted">Welcome back! Please login to your account.</p>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><i className="fas fa-user text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg border-start-0" 
                                        placeholder="Enter your username"
                                        value={credentials.username}
                                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                        required 
                                    />
                                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                </div>
                             </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label small fw-bold">Password</label>
                                    <Link to="/forgot-password" className="small text-ghana-green text-decoration-none">Forgot?</Link>
                                </div>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-end-0"><i className="fas fa-lock text-muted"></i></span>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg border-start-0" 
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                        required 
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>
                            </div>
                            <div className="mb-4 form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label small text-muted" htmlFor="rememberMe">Remember this device</label>
                            </div>
                            {loading ? (
                                <button type="submit" className="btn btn-auth w-100 mb-3 shadow-sm" disabled>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-auth w-100 mb-3 shadow-sm">
                                    Sign In
                                </button>
                            )}
                        </form>
                        <div className="text-center small">
                            New to GSE Predictor? <Link to="/register" className="text-ghana-green fw-bold text-decoration-none">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
};

export default Login;
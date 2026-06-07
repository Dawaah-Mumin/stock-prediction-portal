import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'



const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', formData);
            console.log("Registration successful:", response.data);
            setErrors({})
            setSuccessMessage(true)
            setFormData({
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            });
            setTimeout(() => setSuccessMessage(false), 3000);
        }catch(error) {
            console.error("Registration error:", error.response?.data);
            setErrors(error.response?.data || {error: "Network error"});
        }finally{
            setLoading(false)
        }
    };


    return (
        <>
            <div className="auth-wrapper">
                <div className="card auth-card">
                    <div className="auth-header">
                        <h2 className="auth-logo">GSE <span className="text-warning">PREDICTOR</span></h2>
                        <p className="text-muted">Create an account to start tracking GSE stocks</p>
                    </div>
                    <div className="card-body px-4 pb-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Username</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Kofi Mensah" value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                                <small>{errors.username && <div className="text-danger">{Array.isArray(errors.username) ? errors.username.join(', ') : errors.username}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="name@example.com" value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                                <small>{errors.email && <div className='text-danger'>{Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}</div>}</small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your password" value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <small>{errors.password && <div className="text-danger">{Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}</div>}</small>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg" value={formData.confirm_password}
                                    onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                                    required
                                />
                                <small>{errors.confirm_password && <div className="text-danger">{Array.isArray(errors.confirm_password) ? errors.confirm_password.join(', ') : errors.confirm_password}</div>}</small>
                                {successMessage && <div className="text-success mt-2">Registration successful!</div>}
                            </div>
                            {loading ? (<button type="submit" className="btn btn-auth w-100 mb-3 shadow-sm" disabled>
                                <FontAwesomeIcon icon={faSpinner} spin />
                            </button>):(
                                <button type="submit" className="btn btn-auth w-100 mb-3 shadow-sm">
                                Register
                            </button>
                            )
                            }

                        </form>
                        <div className="text-center small">
                            Already have an account? <Link to="/login" className="text-ghana-green fw-bold text-decoration-none">Login here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
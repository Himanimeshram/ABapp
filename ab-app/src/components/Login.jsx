import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Login = () => {
  const [userType, setUserType] = useState('customer'); // State for user type
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const apiEndpoint = userType === 'customer'
        ? 'http://127.0.0.1:8000/appointment_scheduling_app/login'
        : 'http://127.0.0.1:8000/appointment_scheduling_app/company_login';

      const loginData = userType === 'customer'
        ? `?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        : `?company_email_id=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

      const response = await axios.get(
        `${apiEndpoint}${loginData}`,
        {
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type header
          },
        }
      );

      const data = response.data;
      console.log('User data:', data);

      // Redirect to UserDetails route upon successful login
      navigate('/UserDetails', { state: { userData: data } });
    } catch (error) {
      setError('Error logging in.');
    }
  };

  const handleUserSignupClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  const handleCompanySignupClick = () => {
    navigate('/companysignup');
  };

  return (
    <div className="container login-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Login</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">User Type:</label>
                  <select
                    id="userType"
                    className="form-select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="company">Company</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {userType === 'customer' ? 'Username' : 'Company Email ID'}:
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                {error && <div className="text-danger mt-2">{error}</div>}
              </form>
              <p className="mt-3">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={handleUserSignupClick}
                >
                  User Sign Up
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={handleCompanySignupClick}
                >
                  Company Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

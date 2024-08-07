import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

const CompanySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    email_id: '',
    password: '',
    phone_number: '',
    address: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/appointment_scheduling_app/company_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('Response Data:', data); // Log the response data

      if (response.ok) {
        setMessage('Signup successful');
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        console.error('Error Response:', data); // Log the error response
        setError(data.detail); // Display the error message from the server
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Company Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">Company Name:</label>
          <input
            type="text"
            id="companyName"
            name="company_name"
            className="form-control"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email_id"
            className="form-control"
            value={formData.email_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phone_number"
            className="form-control"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description:</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
      {message && <p className="mt-3 text-success">{message.toString()}</p>}
      {error && <p className="mt-3 text-danger">{error.toString()}</p>}
      <p className="mt-3">
        Already have an account? <Link to="/" className="btn btn-link">Log In</Link>
      </p>
    </div>
  );
};

export default CompanySignup;

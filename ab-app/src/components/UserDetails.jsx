import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewServices from './ViewServices';
import AddServices from './AddServices';

const UserDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const [showViewServices, setShowViewServices] = useState(false);
  const [showAddServices, setShowAddServices] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { data } = userData;
  const user = data[0];

  const handleLogout = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="text-center mb-4">
          {user.companyName ? 'Company Details' : 'User Details'}
        </h1>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            aria-expanded={dropdownOpen}
            onClick={toggleDropdown}
          >
            <i className="fas fa-user-circle"></i>
          </button>
          <ul
            className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            {user.companyName ? (
              <>
                <p><strong>ID:</strong> {user._id}</p>
                <p><strong>Company Name:</strong> {user.companyName}</p>
                <p><strong>Description:</strong> {user.description}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Email:</strong> {user.emailId}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                <div className="text-left">
                  <button
                    onClick={() => { setShowViewServices(true); setShowAddServices(false); }}
                    className="btn btn-primary mx-2"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => { setShowAddServices(true); setShowViewServices(false); }}
                    className="btn btn-primary mx-2"
                  >
                    Add Services
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>ID:</strong> {user._id}</p>
                <p><strong>Username:</strong> {user.userName}</p>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.emailId}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <div className="text-center">
                  <Link to="/bookAppointment" className="btn btn-primary">
                    Book Appointment
                  </Link>
                </div>
              </>
            )}
          </div>
          {showViewServices && <ViewServices companyId={user._id}/>}
          {showAddServices && <AddServices companyId={user._id}/>}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

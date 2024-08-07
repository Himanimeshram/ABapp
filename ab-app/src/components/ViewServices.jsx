import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const ViewServices = ({ companyId }) => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null); // State to hold the selected service for single selection
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/appointment_scheduling_app/get_services`, {
          params: {
            company_id: companyId,
            search_text: searchTerm,
          }
        });
        setServices(response.data.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [companyId, searchTerm]);

  const handleCheckboxChange = (serviceId) => {
    if (selectedService === serviceId) {
      // If the clicked service is already selected, unselect it
      setSelectedService(null);
    } else {
      // Otherwise, select the clicked service
      setSelectedService(serviceId);
    }
  };

  const handleEditClick = () => {
    if (selectedService) {
      const serviceToEdit = services.find(service => service._id === selectedService);
      setEditingService(serviceToEdit);
    } else {
      alert('Please select a service to edit.');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingService(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedService = {
        service_id: editingService._id,
        name: editingService.serviceName,
        company_id: companyId,
        description: editingService.serviceDescription,
        duration: editingService.serviceDuration,
        price: editingService.servicePrice,
        image_path: editingService.image_path ?? ''
      };

      await axios.put(`http://127.0.0.1:8000/appointment_scheduling_app/update_service`, updatedService);
      alert('Service updated successfully!');
      setEditingService(null);
      setSelectedService(null);
      // Fetch updated services
      const response = await axios.get(`http://127.0.0.1:8000/appointment_scheduling_app/get_services`, {
        params: {
          company_id: companyId,
          search_text: searchTerm,
        }
      });
      setServices(response.data.data);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Services</h2>
      <div className="mb-4 d-flex justify-content-between">
        <input
          type="text"
          className="form-control"
          placeholder="Search services by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {selectedService && (
          <button className="btn btn-primary ms-3" onClick={handleEditClick}>
            <FontAwesomeIcon icon={faEdit} /> Edit
          </button>
        )}
      </div>
      <div className="row">
        {services.map(service => (
          <div key={service._id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <input
                  type="checkbox"
                  checked={selectedService === service._id}
                  onChange={() => handleCheckboxChange(service._id)}
                />
                {service.image_path && (
                  <img
                    src={`http://127.0.0.1:8000/${service.image_path.replace('\\', '/')}`}
                    className="card-img-top"
                    alt={service.serviceName}
                  />
                )}
              </div>
              <div className="card-body">
                <h5 className="card-title">{service.serviceName}</h5>
                <p className="card-text">{service.serviceDescription}</p>
                <p className="card-text">Duration: {service.serviceDuration}</p>
                <p className="card-text">Price: ${service.servicePrice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Service</h5>
                <button type="button" className="close" onClick={() => setEditingService(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="serviceName" className="form-label">Service Name:</label>
                    <input
                      type="text"
                      id="serviceName"
                      name="serviceName"
                      className="form-control"
                      value={editingService.serviceName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="serviceDescription" className="form-label">Description:</label>
                    <input
                      type="text"
                      id="serviceDescription"
                      name="serviceDescription"
                      className="form-control"
                      value={editingService.serviceDescription}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="serviceDuration" className="form-label">Duration:</label>
                    <input
                      type="text"
                      id="serviceDuration"
                      name="serviceDuration"
                      className="form-control"
                      value={editingService.serviceDuration}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="servicePrice" className="form-label">Price:</label>
                    <input
                      type="number"
                      id="servicePrice"
                      name="servicePrice"
                      className="form-control"
                      value={editingService.servicePrice}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingService(null)}>Close</button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewServices;

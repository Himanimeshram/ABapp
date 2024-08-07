import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookAppointment = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState('New');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [companySearch, setCompanySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');

  useEffect(() => {
    const fetchCompanies = async (searchText = '') => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/appointment_scheduling_app/company_names', {
          params: { search_text: searchText }
        });
        const formattedCompanies = response.data.data.map(company => ({
          value: company._id,
          label: company.companyName
        }));
        setCompanies(formattedCompanies);
      } catch (error) {
        setError('Error fetching companies');
      }
    };

    fetchCompanies(companySearch);
  }, [companySearch]);

  useEffect(() => {
    const fetchServices = async (searchText = '') => {
      if (selectedCompany) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/appointment_scheduling_app/services_by_company', {
            params: { company_id: selectedCompany.value, search_text: searchText }
          });
          const formattedServices = response.data.data.map(service => ({
            value: service._id,
            label: service.serviceName
          }));
          setServices(formattedServices);
        } catch (error) {
          setError('Error fetching services');
        }
      } else {
        setServices([]);
      }
    };

    fetchServices(serviceSearch);
  }, [selectedCompany, serviceSearch]);

  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    setServiceSearch(''); // Clear services when company changes
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        company_id: selectedCompany?.value,
        service_id: selectedService?.value,
        schedule_time: scheduleTime,
        status: status,
      };
      await axios.post('http://127.0.0.1:8000/api/book_appointment', appointmentData);
      setMessage('Appointment booked successfully!');
      setError('');
    } catch (error) {
      setError('Error booking appointment');
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Book Appointment</h2>
      <form onSubmit={handleBookAppointment}>
        <div className="mb-3">
          <label htmlFor="company" className="form-label">Select Company:</label>
          <Select
            id="company"
            options={companies}
            value={selectedCompany}
            className='form-control'
            classNamePrefix="select"
            onChange={handleCompanyChange}
            onInputChange={(inputValue) => setCompanySearch(inputValue)}
            placeholder="Search for a company"
            isClearable
          />
        </div>
        <div className="mb-3">
          <label htmlFor="service" className="form-label">Select Service:</label>
          <Select
            id="service"
            options={services}
            value={selectedService}
            className='form-control'
            classNamePrefix="select"
            onChange={setSelectedService}
            onInputChange={(inputValue) => setServiceSearch(inputValue)}
            placeholder="Select a service"
            isClearable
          />
        </div>
        <div className="mb-3">
          <label htmlFor="scheduleTime" className="form-label">Select Schedule Time:</label>
          <input
            type="datetime-local"
            id="scheduleTime"
            className="form-control"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status:</label>
          <input
            type="text"
            id="status"
            className="form-control"
            value={status}
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">Book Appointment</button>
      </form>
      {message && <p className="mt-3 text-success">{message}</p>}
      {error && <p className="mt-3 text-danger">{error}</p>}
    </div>
  );
};

export default BookAppointment;

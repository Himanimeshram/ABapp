import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddServices = ({ companyId }) => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [imagePath, setImagePath] = useState('');

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/appointment_scheduling_app/upload_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setImagePath(response.data.image_path); 
            console.log('Image uploaded successfully, path:', response.data.image_path);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const serviceData = {
                name: serviceName,
                description,
                duration,
                price,
                company_id: companyId,
                image_path: imagePath,
            };
            await axios.post('http://127.0.0.1:8000/appointment_scheduling_app/add_services', serviceData);
            alert('Service added successfully!');
            // Clear form fields
            setServiceName('');
            setDescription('');
            setDuration('');
            setPrice('');
            setImagePath('');
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    useEffect(() => {
        if (imagePath) {
            console.log('Image path updated:', imagePath);
        }
    }, [imagePath]);

    return (
        <div>
            <h2>Add Service</h2>
            <form onSubmit={handleAddService}>
                <div className="mb-3">
                    <label htmlFor="serviceName" className="form-label">Service Name:</label>
                    <input
                        type="text"
                        id="serviceName"
                        className="form-control"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <input
                        type="text"
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration:</label>
                    <input
                        type="text"
                        id="duration"
                        className="form-control"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price:</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image:</label>
                    <input
                        type="file"
                        id="image"
                        className="form-control"
                        onChange={handleImageUpload}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Service</button>
            </form>
        </div>
    );
};

export default AddServices;

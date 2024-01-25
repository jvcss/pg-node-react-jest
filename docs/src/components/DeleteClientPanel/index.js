import React, { useState } from 'react';
import axios from 'axios';

const DeleteClientPanel = () => {
    const [clientId, setClientId] = useState('');

    const handleDeleteClient = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/clients/${clientId}`);
            alert(response.data['message'])
            // handle success case here
        } catch (error) {
            alert(error.response.data['error'])
            // handle error case here
        }
    };

    return (
        <div>
            <h2>Delete Client Panel</h2>
            <input
                type="text"
                placeholder="Enter Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
            />
            <button onClick={handleDeleteClient}>Delete Client</button>
        </div>
    );
};

export default DeleteClientPanel;

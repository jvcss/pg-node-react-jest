import React, { useState } from 'react';
import axios from 'axios';

function SeeOneClient() {
  const [clientId, setClientId] = useState('');
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/clients/${clientId}`);
      setClientData(response.data.client);
      setError(null);
    } catch (err) {
      setClientData(null);
      setError(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>See One Client Panel</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Client ID:
          <input type="text" value={clientId} onChange={(event) => setClientId(event.target.value)} />
        </label>
        <button type="submit">Search</button>
      </form>
      {error && <div>{error}</div>}
      {clientData && (
        <div>
          <h3>Client Details:</h3>
          <p>ID: {clientData.id}</p>
          <p>Name: {clientData.full_name}</p>
          <p>Email: {clientData.email}</p>
          <p>Telefone: {clientData.telefone || '-'}</p>
          <p>Coordinates: {clientData.coordinates.x } | {clientData.coordinates.y }</p>
        </div>
      )}
    </div>
  );
}

export default SeeOneClient;

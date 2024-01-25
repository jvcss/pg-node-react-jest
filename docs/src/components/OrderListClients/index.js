import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderListClients = () => {
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                let response;
                response = await axios.get(`http://localhost:3000/clients?page=${page}&limit=${limit}`);
                const specificClientId = 2;


                const selectedClient = response.data.clients.find((c) => c.id === parseInt(selectedClientId || specificClientId));
                if(limit !== clients.length ){// use the state 
                    setClients(response.data.clients);
                }
                
                response = await axios.get(`http://localhost:3000/clients/${selectedClient.coordinates.x}/${selectedClient.coordinates.y}/5`);

                setClients(response.data.nearbyClients.slice(1, limit));
                
                setTotalPages(limit);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [page, limit, selectedClientId,]);

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };

    const handleLimitSubmit = () => {
        setPage(1);
    };

    const handleClientChange = (event) => {
        const clientId = event.target.value === 'all' ? null : event.target.value;
        setSelectedClientId(clientId);
    };

    return (
        <div>
            <div>
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous Page
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                    Next Page
                </button>
                <button onClick={handleLimitSubmit}>Change Limit</button>
                <input type="number" min="1" value={limit} onChange={handleLimitChange} />
                <select onChange={handleClientChange}>
                    <option value="all">Admin view</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.full_name}
                        </option>
                    ))}
                </select>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Coordinates X Y</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.full_name}</td>
                            <td>{client.email}</td>
                            <td>{client.telefone || '-'}</td>
                            <td>{client.coordinates.x || '-'}</td>
                            <td>{client.coordinates.y || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderListClients;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageableListClients = () => {
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3000/clients?page=${page}&limit=${limit}`);
                
                setClients(response.data.clients);
                setTotalPages(Math.ceil(response.data.clients.length / limit));
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [page, limit]);

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
    };

    const handleLimitSubmit = () => {
        // fetch clients with new limit
        setPage(1); // Reset page when changing limit
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

export default PageableListClients;

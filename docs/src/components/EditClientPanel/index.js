import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditClientPanel = () => {
    const [clientId, setClientId] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [coordinatesX, setCoordinatesX] = useState('');
    const [coordinatesY, setCoordinatesY] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setClientId('');
        setFullName('');
        setEmail('');
        setTelefone('');
        setCoordinatesX('');
        setCoordinatesY('');
        setMessage('');
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3000/clients/${clientId}`, {
                fullName,
                email,
                telefone,
                coordinates: [coordinatesX, coordinatesY],
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Edit Client</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="clientId">Client ID:</label>
                    <input
                        type="text"
                        id="clientId"
                        value={clientId}
                        onChange={(event) => setClientId(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                        type="text"
                        id="telefone"
                        value={telefone}
                        onInput={(event) => {
                            event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
                        }}
                        onChange={(event) => setTelefone(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="coordinatesX">Coordinate X:</label>
                    <input
                        type="text"
                        id="coordinatesX"
                        value={coordinatesX}
                        onChange={(event) => setCoordinatesX(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="coordinatesY">Coordinate Y:</label>
                    <input
                        type="text"
                        id="coordinatesY"
                        value={coordinatesY}
                        onChange={(event) => setCoordinatesY(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <button type="submit">Update Client</button>
            </form>
            {message && <div>{message}</div>}
        </div>
    );
};

export default EditClientPanel;

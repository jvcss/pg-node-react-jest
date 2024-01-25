import React, { useState } from 'react';
import axios from 'axios';

const CreateClient = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [coordinates, setCoordinates] = useState({ x: '', y: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/clients', {
                fullName,
                email,
                telefone,
                coordinates: [coordinates.x, coordinates.y],
            });

            alert(response.data['message'])
            setFullName('');
            setEmail('');
            setTelefone('');
            setCoordinates({ x: '', y: '' });
            setError('');
        } catch (err) {
            setError(err.response.data.message);
            alert(error)
        }
    };

    return (
        <div>
            <h2>Create Client</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="telefone">Telefone:</label>
                    <input
                        type="text"
                        id="telefone"
                        value={telefone}
                        onChange={(event) => setTelefone(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="coordinatesX">Coordinate X:</label>
                    <input
                        type="text"
                        id="coordinatesX"
                        value={coordinates.x}
                        onChange={(event) => setCoordinates({ ...coordinates, x: event.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="coordinatesY">Coordinate Y:</label>
                    <input
                        type="text"
                        id="coordinatesY"
                        value={coordinates.y}
                        onChange={(event) => setCoordinates({ ...coordinates, y: event.target.value })}
                    />
                </div>
                <button type="submit">Create Client</button>
            </form>
        </div>
    );
};

export default CreateClient;

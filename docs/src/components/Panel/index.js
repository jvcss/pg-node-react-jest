import React, { useState } from 'react';

import CreateFileForm from '../CreateFileForm';
import ReadFileTable from '../ReadFileTable';
import SeeOneClient from '../SeeOneClient';
import EditClientPanel from '../EditClientPanel';
import PageableListClients from '../PageableListClients';
import UploadFilePanel from '../UploadFilePanel';
import DeleteClientPanel from '../DeleteClientPanel';
import CreateClient from '../CreateClient';
import OrderListClients from '../OrderListClients';

const ButtonGroup = ({ onClick }) => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '30px' }}>
        <button onClick={() => onClick('read-file')}>Read File</button>
        <button onClick={() => onClick('create-file')}>Create File</button>
        <button onClick={() => onClick('upload-file')}>Upload File</button>
        <button onClick={() => onClick('create-client')}>Create Client</button>
        <button onClick={() => onClick('delete-client')}>Delete Client</button>
        <button onClick={() => onClick('edit-client')}>Edit Client</button>
        <button onClick={() => onClick('pageable-list')}>Pageable List Clients</button>
        <button onClick={() => onClick('see-client')}>See One Client</button>
        <button onClick={() => onClick('order-list')}>Order List Clients</button>
    </div>
);

const Content = ({ selectedPanel }) => {
    switch (selectedPanel) {
        case 'read-file':
            return <div><ReadFileTable /></div>;
        case 'create-file':
            return <div><CreateFileForm /></div>;
        case 'upload-file':
            return <div><UploadFilePanel /></div>;
        case 'create-client':
            return <div><CreateClient /></div>;
        case 'delete-client':
            return <div><DeleteClientPanel /></div>;
        case 'edit-client':
            return <div><EditClientPanel /></div>;
        case 'pageable-list':
            return <div><PageableListClients /></div>;
        case 'see-client':
            return <div><SeeOneClient /></div>;
        case 'order-list':
            return <div><OrderListClients /></div>;
        default:
            return null;
    }
};

const ButtonGroupWithPanel = () => {
    const [selectedPanel, setSelectedPanel] = useState(null);

    const handleClick = (panel) => {
        setSelectedPanel(panel);
    };

    return (
        <div>
            <ButtonGroup onClick={handleClick} />
            <Content selectedPanel={selectedPanel} />
        </div>
    );
};

export default ButtonGroupWithPanel;
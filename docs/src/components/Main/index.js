import React from 'react';
import CreateFileForm from '../CreateFileForm';
import ReadFileTable from '../ReadFileTable';

function Main() {
    const [isCreateFormActive, setIsCreateFormActive] = React.useState(true);

    return (
        <div >
            <button onClick={() => setIsCreateFormActive(!isCreateFormActive)}>
                {isCreateFormActive ? 'Switch to Read Form' : 'Switch to Create Form'}
            </button>
            {isCreateFormActive ? <CreateFileForm /> : <ReadFileTable />}
        </div>
    );
}

export default Main;

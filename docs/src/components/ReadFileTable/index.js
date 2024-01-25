import React, { useState } from 'react';
import { readTextFile } from '../../utils/FileUtils';
import useFileInput from '../../hooks/useFileInput';
import { parseFileContent } from '../../utils/ReadFileTableUtils';
import Table from '../Table';

function ReadFileTable() {
    const [file, setFile] = useState(null);
    const [fileContent, setFileContent] = useState([]);

    const handleFileInputChange = useFileInput(setFile);

    function handleReadFile() {
        if (file) {
            readTextFile(file, setFileContent);
        }
    }

    return (
        <div>
            <div>
                <label htmlFor="file">File:</label>
                <input type="file" id="file" onChange={handleFileInputChange} />
            </div>
            <div>
                <button onClick={handleReadFile}>Read File</button>
            </div>
            <div>
                <h2>File Content:</h2>
                <Table
                    headers={['Name', 'Email', 'Telefone', 'Coordinates']}
                    rows={parseFileContent(fileContent).map(({ name, email, telefone, coordinates }) => [
                        name,
                        email,
                        telefone,
                        coordinates[0] || '-',
                        coordinates[1] || '-',
                    ])}
                />
            </div>
        </div>
    );
}

export default ReadFileTable;

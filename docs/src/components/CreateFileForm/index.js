import React from 'react';
import { createTextFile } from '../../utils/FileUtils';
import InputField from '../InputField';
import { createFile, inputFields } from '../../utils/createFileFormUtils';
import useForm from '../../hooks/useForm';

function CreateFileForm() {
    const [formValues, handleInputChange] = useForm({
        name: '',
        email: '',
        telefone: '',
        coordinates: { x: '', y: '' },
        file: null,
    });

    function handleCreateFile() {
        createFile(formValues, createTextFile);
    }

    return (
        <div>
            {inputFields.map((inputField) => (
                <InputField
                    key={inputField.id}
                    label={inputField.label}
                    type={inputField.type}
                    id={inputField.id}
                    value={formValues[inputField.id]}
                    onChange={handleInputChange}
                />
            ))}
            <div>
                <button onClick={handleCreateFile}>Create File</button>
            </div>
        </div>
    );
}

export default CreateFileForm;
import { useState } from 'react';

export default function useForm(initialValues) {
    const [values, setValues] = useState(initialValues);

    function handleChange(event) {
        const { id, value } = event.target;
        let newValue = value;

        // easiest way to perform unique processing for each field
        if (id === 'cpf') {
            newValue = value.replace(/\D/g, '').substr(0, 11);
        } 
         // Splitting the id based on dot notation to handle nested properties
        const idParts = id.split('.');
        const updatedValues = { ...values };

        // Traverse through nested properties
        let currentLevel = updatedValues;
        for (let i = 0; i < idParts.length - 1; i++) {
            currentLevel = currentLevel[idParts[i]] = { ...currentLevel[idParts[i]] };
        }
        // Update the leaf property
        currentLevel[idParts[idParts.length - 1]] = newValue;
        setValues(updatedValues);
    }

    return [values, handleChange];
}

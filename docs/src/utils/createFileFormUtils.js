export function createFile(formValues, createTextFile) {
    const { name, email, telefone, coordinates, file } = formValues;
    const defaultFileName = 'default.txt';
    const fileToSave = file ?? new File([], defaultFileName, { type: 'text/plain' });
    createTextFile(name, email, telefone, coordinates, fileToSave);
}

export const inputFields = [
    { label: 'Name', type: 'text', id: 'name' },
    { label: 'Email', type: 'text', id: 'email' },
    { label: 'Telefone', type: 'text', id: 'telefone' },
    { label: 'coordinate x', type: 'text', id: 'coordinates.x' },
    { label: 'coordinate y', type: 'text', id: 'coordinates.y' },
];

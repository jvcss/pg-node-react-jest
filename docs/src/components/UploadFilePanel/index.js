import { useState } from 'react';

function UploadFilePanel() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/clients/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setFile(null);
    } catch (error) {
      setErrorMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="file-input">Select file to upload:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept=".txt"
          />
        </div>

        <div>
          <button type="submit">Upload</button>
        </div>

        {errorMessage && (
          <div style={{ color: 'red' }}>{errorMessage}</div>
        )}

        {successMessage && (
          <div style={{ color: 'green' }}>{successMessage}</div>
        )}
      </form>
    </div>
  );
}

export default UploadFilePanel;
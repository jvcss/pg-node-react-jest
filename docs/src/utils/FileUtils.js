function createTextFile(name, email, telefone, coordinates, file) {
  console.log(`coordinates: ${coordinates}`);
  const formattedCoordinates = `${coordinates.x},${coordinates.y}`;
  const csvContent = `${name},${email},${telefone},${formattedCoordinates}\n`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
}

function readTextFile(file, setFileContent) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileContent = event.target.result;
    
    const lines = fileContent.split('\n');
    setFileContent(lines);
  };
  reader.readAsText(file);
}

export { createTextFile, readTextFile };

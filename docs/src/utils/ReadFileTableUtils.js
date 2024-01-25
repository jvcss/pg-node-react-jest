export function parseFileContent(fileContent) {
    const parsedContent = [];
    const regex = /([^,]+),*([^,]+),*([^,]+),*([^,]+),*([^,]+)/g;

    let match;
    

    //var lines = .split('\n');
    //console.log(`lines: ${typeof fileContent}`);
    //console.log(`fileContent: ${fileContent}`);

    while ((match = regex.exec(fileContent)) !== null) {
        const [, name, email, telefone, coordinatesx, coordinatesy] = match;
        console.log(`name: [${name.trim()}]  email: [${email.trim()}]  telefone: [${telefone.trim()}] coordinates: [${coordinatesx.trim()},${coordinatesy.trim()}]`);

        parsedContent.push({
            name: name.trim(),
            email: email.trim(),
            telefone: telefone.trim(),
            coordinates: [coordinatesx.trim(), coordinatesy.trim()],
        });
    }

    return parsedContent;
}

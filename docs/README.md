# Client API Test

This is a ReactJS app that tests the API endpoints of a client management system. The app is composed of several panels, each one testing a specific endpoint. The panels are:

- Read File: Read a formatted file with client data.
- Create File: Create a formatted file with one client data.
- Upload File: Upload a file with client data to the server.
- Read Client: Read data from a single client.
- Edit Client: Edit data from a single client.
- Pageable List Clients: List clients with pagination.
- Delete Client: Delete a single client.

### The app is designed to work with a Node.js server running on port 3000. CORS is used to allow communication between the server and the app, which runs on port 3001.

## Note

For the sake of simplicity, I have only applied the best practices of SOLID to the `Read File` and `Create File` components.


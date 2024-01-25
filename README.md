<img alt="Tests Passing" src="https://github.com/jvcss/github-readme-stats/workflows/Test/badge.svg" />

# Node.js CRUDE API with PostgreSQL
This is a simple Node.js CRUD (Create, Read, Update, Delete) API that uses PostgreSQL as the database.

## Requirements
- Node.js
- PostgreSQL

## Getting Started
- Clone this repository to your local machine. 
  - `git clone https://github.com/jvcss/node-client-api.git`

- Install the dependencies using `pnpm install --filter client-api` or `npm`. 
  - `npm install`

- Create a new PostgreSQL database and note the connection details (hostname, port, database name, username, and password).
    - Watch this to know how to install PostgreSQL on Windows 64x: https://youtu.be/VMD_NnpXXSg
    - Notice here we are using the version 15.2 of PostgreSQL

- Create a .env file in the root of the project and fill it with the following values (replace with your own values):


```makefile
PGHOST=<hostname>
PGPORT=<port>
PGDATABASE=<database name>
PGUSER=<username>
PGPASSWORD=<password>
```

- Start the server using `pnpm --filter client-api dev` or `npm dev`.
The server should now be running on http://localhost:3000.
    - notice here we are using the nodemon to run the server in development mode

# API Endpoints

The following API endpoints are available:

## GET /clients

List all clients with pagination.

Query parameters:

- page (optional): the page number (default: 1).
- limit (optional): the number of clients to return per page (default: 10).

## GET /clients/:clientId

Get a specific client by ID.

Path parameters:

- clientId: the ID of the client to get.

## POST /clients
Create a new client.

Body parameters:

- fullName: the full name of the client (required).
- email: the email address of the client (required).
- telefone: the telephone number of the client (optional).
- coordinates: the coordinates of the client (optional).

## PUT /clients/:clientId

Update an existing client by ID.

Path parameters:

- clientId: the ID of the client to update.

Body parameters:

- fullName: the full name of the client (required).
- email: the email address of the client (required).
- telefone: the telephone number of the client (optional).
- coordinates: the coordinates of the client (optional).

## DELETE /clients/:clientId
Delete a client by ID.

Path parameters:

- clientId: the ID of the client to delete.

## UPLOAD /clients/import
Upload a list of clients using a specific txt file format

Body parameters:

- file: the file where each line is a new client.

## SEARCH NEARBY /clients/lat/lon/rad
Return the list of clients order by the specific position informed

Path parameters:

- lat: the latitude value of a user in db.
- lon: the longitude value of a user in db
- rad: the diameter
---

# Using Postman Test
You can use Postman to test the API endpoints.

- Download and install Postman.
- Open Postman 
- Import the ClientAPI.postman_col from postmanCollection folder.
- Click the Send button to make the tests, you can use your own data.
- The response will be displayed in the Response section.

---
# Using Jest Test
You can use Jest to test the API endpoints.

- Install all dependecies
- run `pnpm --filter client-api test` or `npm test`
- You can edit the package.json file to customize the test command: `"test": "jest flow.test.js --verbose"`
- There is a file for each endpoint under the tests folder. To run a specific test, change the name of the file in the test command.

---
# Using Client API Test
This is a ReactJS app that tests the API endpoints of a client management system. The app is composed of several panels, each one testing a specific endpoint. The panels are:

- Read File: Read a formatted file with client data.
- Create File: Create a formatted file with one client data.
- Upload File: Upload a file with client data to the server.
- Read Client: Read data from a single client.
- Edit Client: Edit data from a single client.
- Pageable List Clients: List clients with pagination.
- Delete Client: Delete a single client.
- Search Nearby: Search a list of clients given one specific position.
---
# Using Docker

## Navigate to the directory containing the docker-compose file
- `cd /path/to/docker-compose-file`

## Build and start the containers
- `docker-compose up --build`

## If you want to run the containers in detached mode
- `docker-compose up --build -d`

## Stop the running containers
- `docker-compose down`
---
# License

This project is licensed under the GNU License - see the LICENSE file for details.
require('dotenv').config({path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use express to handle cookies and JWT
// TODO Use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL,
    },
}, details => {
    console.log(`Sever is now running on port http://localhost:${details.port}`)
})
const express = require('express');
const { userAuth } = require('../Middleware/auth');

const requestRouter = express.Router();

// Middleware to authenticate user for all routes in this router
requestRouter.use(userAuth);

// Route to send a connection request
requestRouter.post('/send', async (req,res)=>{
    try {
        const user = req.user;
        req.send(user.firstName + " " + user.lastName + " has sent you a connection request");
    } catch (error) {
        res.status(500).send({ error: 'Failed to send connection request' });
    }
} );

// Route to accept a connection request
// requestRouter.post('/accept', acceptConnectionRequest);

// Route to reject a connection request
// requestRouter.post('/reject', rejectConnectionRequest);

module.exports = requestRouter;
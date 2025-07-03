const express = require('express');
const { userAuth } = require('../Middleware/auth');
const User = require('../models/user');
const UserConnection = require('../models/userConnection');

const requestRouter = express.Router();

// Middleware to authenticate user for all routes in this router
requestRouter.use(userAuth);

// send interested or ignore request

requestRouter.post('/request/connection/:type/:toUserId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { type, toUserId } = req.params;
        console.log(type, toUserId)
        if(type !== 'interested' && type !== 'ignored') {
            return res.status(400).send({ error: 'Invalid request type' });
        }

        const connectedUser = await User.findOne({ _id: toUserId });
        console.log(connectedUser)
        if (!connectedUser) {
            return res.status(404).send({ error: 'User not found' });
        }

        const connectionExista = await UserConnection.findOne({
            $or:[
                { fromUserId: user._id, toUserId: connectedUser._id },
                { fromUserId: connectedUser._id, toUserId: user._id }
            ]}).populate('fromUserId', 'firstName lastName email').populate('toUserId', 'firstName lastName email');

            console.log(connectionExista)
        if(connectionExista) {
            return res.status(400).send({ error: 'Connection request already exists' });
        }

        const newConnection = new UserConnection({
            fromUserId: user._id,   
            toUserId: connectedUser._id,
            status: type    
        });

        newConnection.save();

        res.status(200).send({ message: `Connection request ${type} successfully`, connection: newConnection });

    }catch (error) {
        res.status(400).send({ error:'Failed to send connection request' });
    }
});


requestRouter.post("/request/action/:type/:requestId", userAuth, async (req,res) =>{
    try{
        const user= req.user;
        const { type, requestId } = req.params;
        if(type !== 'accepted' && type !== 'rejected') {
            return res.status(400).send({ error: 'Invalid request type' });
        }

        const request = await UserConnection.find({ _id: requestId});

        if(!request){
            return res.status(404).send({ error: 'Connection request not found' });
        }

        const updateRequest = new UserConnection.findOneAndUpdate(
            { _id: requestId },{ status: type },{ new: true }
        );

        res.status(200).send({ message: `Connection request ${type} successfully`, request: updateRequest });

    }catch(err){
        res.status(400).send({ error: 'Failed to process connection request' });
    }
})

    //how to fetch queryparams from url
    requestRouter.get('/request/connection',userAuth, async (req, res) => {
        try{
            const user = req.user;
            const { pager, limit } = req.query;
            const page = parseInt(pager) || 1;
            const limitCount = parseInt(limit) || 100;
            const skip = (page - 1) * limitCount;
    
            const requestedUser = await UserConnection.find(
                { toUserId: user._id, status: 'interested' }
            ).populate('fromUserId', 'firstName lastName emailId age gender imgUrl skills about').sklip(skip).limit(limitCount)
            ;
    
            res.status(200).send(requestedUser);
        }catch(err){
            res.status(400).send({ error: 'Failed to fetch feed' });
        }
    })


    requestRouter.get('/request/connection/send',userAuth, async (req, res) => {
        try{
            const user = req.user;
    
            const requestedUser = await UserConnection.find(
                { fromUserId: user._id }
            ).populate('toUserId', 'firstName lastName emailId age gender imgUrl skills about')
            ;
    
            res.status(200).send(requestedUser);
        }catch(err){
            res.status(400).send({ error: 'Failed to fetch feed' });
        }
    })


    // Get all request except rejected , interested  and accepted
    // remove send request

    requestRouter.get('/feed',userAuth, async(req,res) =>{
        try{
            const user = req.user

            const userConnect = await UserConnection.find({
                $or:[
                    {fromUserId: user._id},
                    {toUserId: user._id}
                ]
            }).select('fromUserId toUserId')

            // how to get only objectId's but not dublicate
            const userIds = userConnect.map(connection => {
                return connection.fromUserId.toString() === user._id.toString() ? connection.toUserId : connection.fromUserId;
            });

            const uniqueUserIds = [...new Set(userIds)];

            const feed = await User.find({
                $and:[
                    { _id: { $nin: uniqueUserIds } },
                    { _id:{ $ne : user._id  } }
                ]
            })

            res.status(200).send(feed);
        }catch(err){
            res.status(400).send({ error: 'Failed to fetch feed' });
        }
    })


module.exports = requestRouter;
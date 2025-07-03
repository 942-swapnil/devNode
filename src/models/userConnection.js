const mongoose =  require('mongoose');

const UserConnection = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId:{ 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },  
    status: {
        type: String,
        enum: ['ignored','interested', 'accepted', 'rejected'],
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("UserConnection", UserConnection);
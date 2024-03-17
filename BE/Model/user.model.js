const mongoose= require('mongoose');
const userSchema = mongoose.Schema(
    {
        username:String,
        email:String,
        password:String,
        books:[{book:String,ownId:String, status:{type:String,enum:["Bought,Borrowed"]}}],
        incomingRequests:[{book:String,requestId:String}],
        outgoingRequests:[{book:String,requestId:String}]
    },
    {versionKey:false}
)
 
const UserModel = mongoose.model('User',userSchema);

module.exports= UserModel
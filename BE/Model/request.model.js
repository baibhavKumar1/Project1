const {Schema,model} = require('mongoose');
const requestSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status:{type:String,enum:["Accepted","Pending","Rejected"]},
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestDate: { type: Date, default:Date.now },
  });

  const RequestModel = model('Request',requestSchema)

  module.exports = RequestModel;
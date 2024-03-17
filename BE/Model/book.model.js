const {Schema,model} = require('mongoose');

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    ISBN: { type: String, required: true },
    available: { type: Boolean, default: true },
    status:{type:String,enum:["Borrowed","Available"],default:"Available"},
    ownedBy:{type:String,default:"Library"}
  },{versionKey:false}
  );

const BookModel = model('Book',bookSchema);

module.exports = BookModel
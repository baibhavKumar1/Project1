const {Schema,model} = require('mongoose');
const buySchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyDate: { type: Date, default:Date.now },
  });

  const BuyModel = model('Buy',buySchema)

  module.exports = BuyModel;
const {Schema,model} = require('mongoose');
const borrowSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date },
    returned: { type: Boolean, default: false }
  });

  const BorrowModel = model('Borrow',borrowSchema)

  module.exports = BorrowModel;
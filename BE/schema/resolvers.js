const BookModel = require("../Model/book.model");
const BorrowModel = require("../Model/borrow.model");
const UserModel = require("../Model/user.model");
const bcrypt = require('bcrypt')
const { signToken } = require('../Middleware/auth.middleware')
const RequestModel = require("../Model/request.model");
const BuyModel = require("../Model/buy.model");
const resolvers = {
  Query: {
    getBook: async (_, { id }) => {
      return await BookModel.findById(id);
    },
    getAllBooks: async () => {
      return await BookModel.find();
    },
    getUser: async (_, __, req) => {
      return await UserModel.findById(req.user._id);
    },
    getAllUsers: async () => {
      return await UserModel.find();
    },
    getBorrow: async (_, { id }) => {
      return await BorrowModel.findById(id);
    },
    getAllBorrows: async () => {
      return await BorrowModel.find();
    },
    getBuy: async (_, { id }) => {
      return await BuyModel.findById(id)
    },
    getAllBuy: async () => {
      return await BuyModel.find()
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const token = signToken(user);

      return { token, user };
    },
    registerUser: async (_, { username, email, password }) => {
      try {
        console.log('hi');
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
          throw new Error('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();
        const token = signToken(newUser);
        return { token, user: newUser };
      } catch (err) {
        throw new Error(err.message)
      }

    },
    updateUser: async (_, { username }, req) => {
      try {
        const updateUser = await UserModel.findByIdAndUpdate(req.user._id, { username }, { new: true });
        await updateUser.save();
        return { user: updateUser };
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }
    },
    deleteUser: async (_, __, req) => {
      try {
        const deleteUser = await UserModel.findByIdAndDelete(req.user._id);
        return { user: deleteUser };
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }
    },
    addBook: async (_, { title, author, genre, ISBN }, req) => {
      try {
        console.log(req.user, title);
        const exists = await BookModel.findOne({ title });
        if (!exists && req.user.email == "admin@admin.com") {
          const book = new BookModel({ title, author, genre, ISBN });
          await book.save();
          return book;
        }
        else {
          throw new Error('Not Authorised')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    updateBook: async (_, { ...args }, req) => {
      try {
        const exists = await BookModel.findById(args.id);
        if (exists && req.user.email == "admin@admin.com") {
          const book = await BookModel.findByIdAndUpdate(args.id, { ...args }, { new: true });
          await book.save();
          return book;
        }
        else {
          throw new Error('Not Authorised')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    deleteBook: async (_, { id }, req) => {
      try {
        const exists = await BookModel.findById(id);
        if (exists && req.user.email == "admin@admin.com") {
          const book = await BookModel.findByIdAndDelete(id);
          return book;
        }
        else {
          throw new Error('Not Authorised')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    borrowBook: async (_, { bookId }, req) => {
      try {
        console.log("hi9");
        const book = await BookModel.findById(bookId);
        if (book && book.available == true) {
          const borrow = new BorrowModel({ book: bookId, user: req.user._id, issueDate: Date.now() });
          await borrow.save();
          await BookModel.findByIdAndUpdate(bookId, { available: false, ownedBy: req.user._id, status: "Borrowed" });
          await UserModel.findByIdAndUpdate(req.user._id, { $push: { books: { book: bookId, status: "Borrowed", ownId: borrow._id } } })
          return borrow;
        } else {
          throw new Error('Book not available')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    returnBook: async (_, { borrowId }, req) => {
      try {
        const borrow = await BorrowModel.findByIdAndUpdate(borrowId, { returnDate: Date.now(), returned: true });
        await borrow.save();
        await BookModel.findByIdAndUpdate(borrow.book, { available: true, status: "Available", ownedBy: "Library" });
        await UserModel.findByIdAndUpdate(req.user._id, { $pull: { books: { book: borrow.book } } })
        return borrow;
      } catch (error) {
        throw new Error(error.message)
      }
    },
    buyBook: async (_, { bookId }, req) => {
      try {
        const book = await BookModel.findById(bookId);
        if (book && book.available == true) {
          const buy = new BuyModel({ book: bookId, user: req.user._id, buyDate: Date.now() });
          await buy.save();
          await BookModel.findByIdAndDelete(bookId);
          await UserModel.findByIdAndUpdate(req.user._id, { $push: { books: { book: bookId, status: "Bought", ownId: buy._id } } })
          return buy;
        } else {
          throw new Error('Book not available')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    requestBorrow: async (_, { bookId }, req) => {
      try {
        const book = await BookModel.findById(bookId);
        if (book && book.status == "Borrowed") {
          const user = await UserModel.findById(book.ownedBy);
          const request = new RequestModel(
            { book: bookId, owner: user._id, status: "Pending", requester: req.user._id, requestDate: Date.now() }
          )
          await request.save()
          await UserModel.findByIdAndUpdate(req.user._id, { $push: { outgoingRequests: { book: bookId, requestId: request._id } } })
          await UserModel.findByIdAndUpdate(book.ownedBy, { $push: { incomingRequests: { book: bookId, requestId: request._id } } })
          return request;
        } else {
          throw new Error('Book not available')
        }
      } catch (error) {
        throw new Error(error.message)
      }
    },
    respondBorrow: async (_, { requestId, action }, req) => {
      try {
        const status = action === 'accept' ? 'Accepted' : 'Rejected';
        const updatedRequest = await RequestModel.findByIdAndUpdate(requestId, { status }, { new: true });

        if (action === 'accept') {
          const { book, requester, owner } = updatedRequest;
          await BookModel.findByIdAndUpdate(book, { ownedBy: requester }, { new: true });
          const user = await UserModel.findOne(
            { _id: owner, 'books.book': book },
            { 'books.$': 1 }
          )
          const borrowId = user.books[0].ownId;
          const oldBorrow = await BorrowModel.findByIdAndUpdate(borrowId, { returnDate: Date.now(), returned: true }, { new: true });
          await UserModel.findByIdAndUpdate(req.user._id, { $pull: { books: { book: oldBorrow.book } } }, { new: true })

          const newBorrow = new BorrowModel({ book: book, user: requester, issueDate: Date.now() });
          await newBorrow.save();
          await UserModel.findByIdAndUpdate(requester, { $push: { books: { book: book, status: "Borrowed", ownId: newBorrow._id } } }, { new: true })
        }
        return updatedRequest;
      } catch (error) {
        throw new Error('Failed to respond to borrow request');
      }
    }
  }
}

module.exports = resolvers
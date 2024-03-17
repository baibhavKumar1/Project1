const { gql } = require("apollo-server-express");

const typeDefs = gql`
type Book {
    id: ID!
    title: String!
    author: String!
    genre: String!
    ISBN: String!
    available: Boolean!
    status:String!
    ownedBy:ID!
  }
   
  type User {
    id: ID!
    username: String!
    password:String!
    email: String!
    books:[UserBooks!]!
    incomingRequests: [UserRequest!]!
    outgoingRequests: [UserRequest!]!
  }
  type UserBooks{
    book:ID!
    status:String!,
    ownId:ID!
  }
  type UserRequest{
    book:ID!,
    requestId:ID!
    id:ID!
  }
  type Borrow {
    id: ID!
    book: Book
    user: User!
    issueDate: String!
    returnDate: String
    returned: Boolean!
  }
  type Buy {
    id: ID!
    book: Book!
    user: User!
    buyDate: String!
  }
  type Request {
    _id: ID!
    book: Book!
    requester: User!
    owner: User!
    status: String!
    requestDate: String!
  }
  
  type Query {
    getBook(id: ID!): Book
    getAllBooks: [Book!]!
    getUser: User
    getAllUsers: [User!]!
    getBorrow(id: ID!): Borrow
    getAllBorrows: [Borrow!]!
    getBuy(id:ID!):Buy!
    getAllBuy:[Buy!]!
    getRequests(id:ID!):Request
    getAllRequests:[Request!]!
  }
  type AuthResponse {
    token: String
    user: User
  }
  type Mutation {
    loginUser(email: String!, password: String!): AuthResponse
    registerUser(username: String!, email: String!,password: String!): AuthResponse
    updateUser(username:String!):User!
    deleteUser:User!
    addBook(title: String!, author: String!, genre: String!, ISBN: String!): Book
    updateBook(id:ID!,title:String, author: String, genre: String, ISBN: String):Book
    deleteBook(id:ID!):Book
    borrowBook(bookId: ID!): Borrow
    returnBook(borrowId: ID!): Borrow
    buyBook(bookId:ID):Buy
    requestBorrow(bookId: ID!): Request!
    respondBorrow(requestId: ID!, action: String!): Request
  } 
`
module.exports = typeDefs 
# Library Management System Documentation

## Introduction

The Library Management System is a Node.js application designed to manage the operations of a library efficiently. It utilizes Redis for caching, MongoDB for data storage, and GraphQL for API interactions. This documentation provides a comprehensive guide on how to use and understand the functionalities of the application.
### Deployed Link : https://project1-xnzh.onrender.com
## Installation

Before installing the Library Management System, ensure that you have Node.js, Redis, and MongoDB installed on your system. Then, follow these steps:

1. Clone the repository from GitHub:

    ```
    git clone <repository_url>
    ```

2. Navigate to the project directory:

    ```
    cd BE
    ```

3. Install dependencies:

    ```
    npm install
    ```

4. Create a `.env` file in the root directory and configure the environment variables as follows:

    ```
    PORT=3000
    REDIS_HOST=localhost
    REDIS_PORT=6379
    MONGODB_URI=mongodb://localhost/library
    SECRET=abcd...
    ```

5. Start the application:

    ```
    npm run server
    ```

## Usage

Once the application is running, you can interact with it via GraphQL Playground or any GraphQL client.

### GraphQL API

The GraphQL API provides endpoints for various operations such as adding books, managing authors, borrowing books, and more. Here are some of the main operations:

#### User Credentials 

You can login for user authentication through this:

```code
"email":"john@gmail.com",
"password":"john"
```
#### Admin Credentials

You can login for admin authorization through this:

```code
"email":"admin@admin.com",
"password":"admin"
```
#### User Registration

You can register user by username, email and password.

```graphql
mutation RegisterUser( $username, $email: String!, $password: String!) {
        RegisterUser(username:$username, email: $email, password: $password) {
          token
          user {
            id
          }
        }
    }
```
## Queries

### `getBook(id: ID!)`

Retrieve a single book by its unique ID.

#### Parameters

- `id` (required): The unique identifier of the book.

#### Return

- `Book`: The book matching the provided ID.

### `getAllBooks`

Retrieve all books available in the library.

#### Return

- `[Book!]!`: An array of all books in the library.

### `getUser`

Retrieve information about the currently authenticated user.

#### Return

- `User`: Information about the authenticated user.

### `getAllUsers`

Retrieve information about all users registered in the system.

#### Return

- `[User!]!`: An array of all users registered in the system.

### `getBorrow(id: ID!)`

Retrieve information about a borrowed book by its unique ID.

#### Parameters

- `id` (required): The unique identifier of the borrow transaction.

#### Return

- `Borrow`: Information about the borrowed book.

### `getAllBorrows`

Retrieve information about all borrow transactions in the system.

#### Return

- `[Borrow!]!`: An array of all borrow transactions.

### `getBuy(id:ID!)`

Retrieve information about a book purchase by its unique ID.

#### Parameters

- `id` (required): The unique identifier of the buy transaction.

#### Return

- `Buy`: Information about the purchased book.

### `getAllBuy`

Retrieve information about all buy transactions in the system.

#### Return

- `[Buy!]!`: An array of all buy transactions.

### `getRequests(id:ID!)`

Retrieve information about a request made for borrowing a book by its unique ID.

#### Parameters

- `id` (required): The unique identifier of the request.

#### Return

- `Request`: Information about the request.

### `getAllRequests`

Retrieve information about all borrowing requests in the system.

#### Return

- `[Request!]!`: An array of all borrowing requests.

## Query Usage

Queries can be executed using any GraphQL client or GraphQL Playground. You can use the provided queries to retrieve information about books, users, borrow transactions, buy transactions, and borrowing requests.

For example, to retrieve all books, you can execute the following query:

```graphql
query {
  getAllBooks {
    id
    title
    author
    genre
    ISBN
    available
    status
    ownedBy
  }
}
```
## Mutations

### `loginUser(email: String!, password: String!)`

Authenticate a user by their email and password.

#### Parameters

- `email` (required): The email of the user.
- `password` (required): The password of the user.

#### Return

- `AuthResponse`: A response containing a token for authentication and information about the authenticated user.

### `registerUser(username: String!, email: String!, password: String!)`

Register a new user with a username, email, and password.

#### Parameters

- `username` (required): The username of the new user.
- `email` (required): The email of the new user.
- `password` (required): The password of the new user.

#### Return

- `AuthResponse`: A response containing a token for authentication and information about the registered user.

### `updateUser(username: String!)`

Update the username of the authenticated user.

#### Parameters

- `username` (required): The new username of the user.

#### Return

- `User`: Information about the updated user.

### `deleteUser`

Delete the authenticated user account.

#### Return

- `User`: Information about the deleted user.

### `addBook(title: String!, author: String!, genre: String!, ISBN: String!)`

Add a new book to the library.

#### Parameters

- `title` (required): The title of the new book.
- `author` (required): The author of the new book.
- `genre` (required): The genre of the new book.
- `ISBN` (required): The ISBN of the new book.

#### Return

- `Book`: Information about the added book.

### `updateBook(id:ID!, title:String, author: String, genre: String, ISBN: String)`

Update the details of a book in the library.

#### Parameters

- `id` (required): The unique identifier of the book to update.
- `title` (optional): The new title of the book.
- `author` (optional): The new author of the book.
- `genre` (optional): The new genre of the book.
- `ISBN` (optional): The new ISBN of the book.

#### Return

- `Book`: Information about the updated book.

### `deleteBook(id:ID!)`

Delete a book from the library.

#### Parameters

- `id` (required): The unique identifier of the book to delete.

#### Return

- `Book`: Information about the deleted book.

### `borrowBook(bookId: ID!)`

Borrow a book from the library.

#### Parameters

- `bookId` (required): The unique identifier of the book to borrow.

#### Return

- `Borrow`: Information about the borrowed book.

### `returnBook(borrowId: ID!)`

Return a borrowed book to the library.

#### Parameters

- `borrowId` (required): The unique identifier of the borrow transaction.

#### Return

- `Borrow`: Information about the returned book.

### `buyBook(bookId:ID)`

Purchase a book from the library.

#### Parameters

- `bookId` (optional): The unique identifier of the book to purchase.

#### Return

- `Buy`: Information about the purchased book.

### `requestBorrow(bookId: ID!)`

Request to borrow a book from the library.

#### Parameters

- `bookId` (required): The unique identifier of the book to request.

#### Return

- `Request`: Information about the borrowing request.

### `respondBorrow(requestId: ID!, action: String!)`

Respond to a borrowing request.

#### Parameters

- `requestId` (required): The unique identifier of the borrowing request.
- `action` (required): The action to take on the request (`accept` or `reject`).

#### Return

- `Request`: Information about the updated borrowing request.

## Mutation Usage

Mutations can be executed using any GraphQL client or GraphQL Playground. You can use the provided mutations to perform various operations such as user authentication, registration, updating user information, adding, updating, or deleting books, borrowing, returning, or purchasing books, and requesting to borrow books.

For example, to register a new user, you can execute the following mutation:

```graphql
mutation {
  registerUser(username: "exampleuser", email: "example@example.com", password: "password") {
    token
    user {
      id
      username
      email
    }
  }
}

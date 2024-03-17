require('dotenv').config()
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const connection = require('./db.js');
const {auth} = require('./Middleware/auth.middleware.js');
const typeDefs = require('./schema/typeDef.js');
const resolvers = require('./schema/resolvers.js');

const PORT = process.env.PORT || 3000;
 
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
    app.listen(PORT, async() => {
      try{
        await connection;
        console.log('connected');
      }catch(err){
        console.log(err);
      }
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  
};
  
startApolloServer();
  

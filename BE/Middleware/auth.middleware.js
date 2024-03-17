const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = 'secret';
const expiration = '2h';

const auth = ({ req })=> {
    let token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
        return req;
    }
    try {
        const { data } = jwt.verify(token, secret, { maxAge: expiration });
        req.user = data;
    } catch(err) {
        console.log(err);
    }
    return req; 
}
const signToken= ({ email, password, _id}) =>{
    const payload = {  email, password, _id};

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
module.exports = {auth,signToken};
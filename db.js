const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook?tls=false&readPreference=primary&directConnection=true";

const connectToMongo = async () => {
    console.log("1connected to Mongo Sucessfully");
    await mongoose.connect(mongoURI);
    console.log("connected to Mongo Sucessfully");
}

module.exports = connectToMongo;
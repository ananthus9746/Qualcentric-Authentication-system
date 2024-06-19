const mongoose = require('mongoose');
require('dotenv').config();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URl, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error(err.message);
//         process.exit(1);
//     }
// };
// module.exports = connectDB;

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
}
module.exports = connectDB;
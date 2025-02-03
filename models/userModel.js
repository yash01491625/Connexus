const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Enter your username"],
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: [true, "Email address already exists"],
    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
    },
},
    {
        timestamps: true,
    }
);

const user = mongoose.model("User", userSchema);
module.exports = user;